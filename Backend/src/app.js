import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));

// Setting Form data size limit
app.use(express.json({ limit: "20kb" }));
// Setting url data
app.use(express.urlencoded({ extended: true, limit: "20kb" }));
// For public folder
app.use(express.static("public"));
// For cookies
app.use(cookieParser());



import userRouter from "../src/routes/user.route.js";
import meetingRouter from "../src/routes/meeting.route.js";

// routes declaration
app.use("/api/v1/users", userRouter);

app.use("/api/v1/meeting", meetingRouter);


export default app;