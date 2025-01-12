

export const connectToSocket = (io) => {
    io.on("connection", (socket) => {
        console.log(`A user connected: ${socket.id}`);

        // Join room
        socket.on("join-meeting", (meetingId) => {
            socket.join(meetingId);
            console.log(`User ${socket.id} joined meeting room ${meetingId}`);

            // Notify others
            socket.to(meetingId).emit("user-joined", { userId: socket.id })
        });

        // send message
        socket.on('sendMessage', ({ meetingId, userId, message }) => {
            const chatMessage = {
                sender: userId,
                message,
                timestamp: new Date(),
            };

            // Emit the message to all users in the room
            io.to(meetingId).emit('receiveMessage', chatMessage);
        });

        socket.on("disconnect", () => {
            console.log(`A user disconnected ${socket.id}`);
        });

    });
}

export default connectToSocket;

