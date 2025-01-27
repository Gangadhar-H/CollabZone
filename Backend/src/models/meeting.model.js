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
                    unique: true,
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

    },
    { timestamps: true }
);

export const Meeting = mongoose.model("Meeting", meetingSchema);
