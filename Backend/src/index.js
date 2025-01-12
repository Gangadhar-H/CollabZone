import dotenv from "dotenv";
import connectDB from "./db/index.db.js";
import app from "./app.js";
import http from "http";
import { Server } from "socket.io";
import connectToSocket from "./controllers/socketManager.js";


dotenv.config(
    {
        path: './.env',
    }
);

// socket.io ->
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: process.env.CORS_ORIGIN, // Replace with frontend URL
        credentials: true,
    },
});

connectToSocket(io);

connectDB()
    .then(() => {
        server.listen(process.env.PORT || 8000, () => {
            console.log(`Server is running at port ${process.env.PORT}`);
        });
    })
    .catch((err) => {
        console.log("MongoDB connection Failed", err);
    })
