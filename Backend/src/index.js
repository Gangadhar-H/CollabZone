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
        origin: "http://localhost:5173", // Replace with your frontend's URL
        credentials: true, // Allow credentials (cookies, headers, etc.)
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
