import { Meeting } from "../models/meeting.model.js";

const rooms = {};

const connectToSocket = (io) => {
    io.on("connection", (socket) => {
        console.log(`User connected: ${socket.id}`);

        // Handle user joining a room
        socket.on("join-room", async ({ meetingLink, meetingCode, userId }, callback) => {
            try {
                // Fetch the meeting from the database
                console.log(meetingLink);
                const meeting = await Meeting.findOne({ meetingLink });

                console.log("meeting is", meeting);
                if (!meeting) {
                    if (callback) callback({ error: "Meeting not found." });
                    return;
                }

                // Validate the meeting code
                if (meeting.meetingCode !== meetingCode) {
                    if (callback) callback({ error: "Invalid meeting code." });
                    return;
                }

                // Add user to the room
                socket.join(meeting._id);

                console.log(`User ${socket.id} joined room: ${meetingLink}`);

                // Optionally emit updated participant list
                // const participants = Array.from(io.sockets.adapter.rooms.get(meeting._id) || []);
                // console.log(participants);
                io.to(meeting._id).emit("participants-update", meeting.participants);

                // Send success response via callback
                if (callback) callback({ success: true, roomId: meetingLink });
            } catch (error) {
                console.error("Error in join-room:", error);
                if (callback) callback({ error: "An error occurred. Please try again." });
            }
        });


        // Handle user disconnecting
        socket.on("disconnect", () => {
            console.log(`User disconnected: ${socket.id}`);

            // Remove the user from all rooms
            for (const room in rooms) {
                rooms[room] = rooms[room].filter((id) => id !== socket.id);

                // Notify the room of the updated participant list
                io.to(room).emit("participant-list", rooms[room]);

                // If the room is empty, delete it
                if (rooms[room].length === 0) {
                    delete rooms[room];
                }
            }
        });
    });
};

export default connectToSocket;
