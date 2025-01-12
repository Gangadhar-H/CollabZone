import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { createMeeting, deleteMeeting, getAllMeetings, joinMeeting } from "../controllers/meeting.controller.js";

const router = Router();

router.route("/").post(verifyJWT, createMeeting);
router.route("/").get(verifyJWT, getAllMeetings);
router.route("/:meetingId").delete(verifyJWT, deleteMeeting);

// 
router.route("/joinMeeting").post(verifyJWT, joinMeeting);

export default router;
