import mongoose, { Schema } from "mongoose";

const meetingSchema = new Schema(
    {
        host: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        participants: [
            {
                user: {
                    type: Schema.Types.ObjectId,
                    ref: 'User',
                },
                micAllowed: { type: Boolean, default: false },
                cameraAllowed: { type: Boolean, default: false },
            },
        ],
        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
        },
        scheduledTime: {
            type: Date,
            default: Date.now(),
            required: true
        },
        meetingLink: {
            type: String,
            required: true,
        },
        meetingCode: {
            type: String,
        },
        chatAllowed: {
            type: Boolean,
            default: true
        },
        meetingType: { type: String, enum: ['one-to-one', 'group'], required: true },

    },
    { timestamps: true }
);

export const Meeting = mongoose.model("Meeting", meetingSchema);
