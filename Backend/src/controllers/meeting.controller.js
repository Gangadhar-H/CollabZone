import { Meeting } from "../models/meeting.model.js";
import { v4 as uuidv4 } from 'uuid';
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const createMeeting = asyncHandler(async (req, res) => {
    const { title, description, scheduledTime, meetingType, meetingCode } = req.body;

    console.log("Creating meeting");

    if (!['one-to-one', 'group'].includes(meetingType)) {
        throw new ApiError(400, "Invalid meeting type");
    }

    const meeting = await Meeting.create({
        host: req.user._id,
        title,
        description,
        scheduledTime,
        meetingCode,
        meetingType,
        meetingLink: `${process.env.FRONTEND_URL}/meet/${uuidv4()}`,
    });

    if (!meeting) {
        throw new ApiError(500, "Something went wrong while creating the meeting");
    }

    return res
        .status(201)
        .json(
            new ApiResponse(201, meeting, "Meeting created successfully")
        );

});

const getAllMeetings = asyncHandler(async (req, res) => {
    const meetings = await Meeting.find({ $or: [{ host: req.user._id }, { participants: req.user._id }] });
    if (!meetings) {
        return res.status(200).json(new ApiResponse(200, [], "Meeting not found"));
    }
    return res
        .status(201)
        .json(
            new ApiResponse(201, meetings, "Meetings listed successfully")
        );
});

const deleteMeeting = asyncHandler(async (req, res) => {
    const { meetingId } = req.params;

    const meeting = await Meeting.findById(meetingId);
    if (!meeting) {
        throw new ApiError(404, "Meeting not found");
    }

    if (meeting.host.toString() !== (req.user._id).toString()) {
        throw new ApiError(403, "You can only delete meetings you have created");
    }

    const deletedMeeting = await Meeting.deleteOne({ _id: meetingId });

    return res
        .status(200)
        .json(new ApiResponse(200, deletedMeeting, "Meeting deleted Successfully"));

});

const joinMeeting = asyncHandler(async (req, res) => {
    const { meetingLink, meetingCode } = req.body;
    const participantId = req.user._id;

    const meeting = await Meeting.findOne({ meetingLink });
    if (!meeting) {
        console.log("Not found");
        return res.status(404).json(new ApiResponse(404, [], "Meeting not found"));
    }

    if (meeting.meetingCode !== meetingCode) {
        return res.status(400).json(new ApiResponse(400, [], "Invalid meeting code"));
    }

    // Check if the user is already a participant
    if (meeting.participants.some(participant => participant.user.toString() === participantId.toString())) {
        return res.status(200).json(new ApiResponse(200, meeting, "You are already part of this meeting."));
    }

    // add participant
    meeting.participants.push({
        user: participantId,
        micAllowed: false,
        cameraAllowed: true,
    });

    await meeting.save();

    return res.status(200).json(new ApiResponse(200, meeting, "Successfully joined the meeting."));

});



export {
    createMeeting,
    getAllMeetings,
    deleteMeeting,
    joinMeeting,
}
