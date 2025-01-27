import { Meeting } from "../models/meeting.model.js"

const connectToSocket = (io) => {
    const rooms = new Map()

    io.on("connection", (socket) => {
        console.log(`User connected: ${socket.id}`)

        socket.on("join-room", async ({ meetingLink, meetingCode, userId }, callback) => {
            try {
                const meeting = await Meeting.findOne({ meetingLink })

                if (!meeting) {
                    if (callback) callback({ error: "Meeting not found." })
                    return
                }

                if (meeting.meetingCode !== meetingCode) {
                    if (callback) callback({ error: "Invalid meeting code." })
                    return
                }

                socket.join(meeting._id.toString())
                if (!rooms.has(meeting._id.toString())) {
                    rooms.set(meeting._id.toString(), new Set())
                }
                rooms.get(meeting._id.toString()).add(socket.id)

                socket.to(meeting._id.toString()).emit("user-connected", socket.id)

                io.to(meeting._id.toString()).emit(
                    "participants-update",
                    Array.from(rooms.get(meeting._id.toString())).map((id) => ({ user: { _id: id } })),
                )

                if (callback) callback({ success: true, roomId: meeting._id.toString() })
            } catch (error) {
                console.error("Error in join-room:", error)
                if (callback) callback({ error: "An error occurred. Please try again." })
            }
        })

        socket.on("offer", ({ to, offer }) => {
            socket.to(to).emit("offer", { from: socket.id, offer })
        })

        socket.on("answer", ({ to, answer }) => {
            socket.to(to).emit("answer", { from: socket.id, answer })
        })

        socket.on("ice-candidate", ({ to, candidate }) => {
            socket.to(to).emit("ice-candidate", { from: socket.id, candidate })
        })

        socket.on("disconnect", () => {
            console.log(`User disconnected: ${socket.id}`)
            rooms.forEach((participants, roomId) => {
                if (participants.has(socket.id)) {
                    participants.delete(socket.id)
                    socket.to(roomId).emit("user-disconnected", socket.id)
                    io.to(roomId).emit(
                        "participants-update",
                        Array.from(participants).map((id) => ({ user: { _id: id } })),
                    )
                }
            })
        })
    })
}

export default connectToSocket

