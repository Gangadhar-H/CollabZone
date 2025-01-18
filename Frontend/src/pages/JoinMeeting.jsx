import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import axios from 'axios';

function JoinMeeting() {

    const [meetingLink, setMeetingLink] = useState("");
    const [meetingCode, setMeetingCode] = useState("");
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");
    const { user } = useUser();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        try {
            const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/meeting/joinMeeting`,
                {
                    meetingLink, meetingCode
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`, // Pass the token
                    },
                    withCredentials: true, // Include cookies
                }
            );

            // Check the backend response
            if (response.data.message === "You are already part of this meeting.") {
                setSuccess(response.data.message);
            } else if (response.data.message === "Successfully joined the meeting.") {
                setSuccess(response.data.message);
                // Uncomment below if you want to redirect to the meeting page
                // navigate(`/meeting/${response.data.meeting._id}`);
            } else if (response.data.message === "Meeting not found") {
                setError(response.data.message);
            } else if (response.data.message === "Invalid meeting code") {
                setError(response.data.message);
            }
            else {
                setError("Unexpected response from the server.");
            }
        } catch (err) {
            // Handle errors properly
            console.error("Error joining meeting:", err);

            if (err.response?.data?.message) {
                setError(err.response.data.message); // Show backend error message
            } else {
                setError("An unexpected error occurred. Please try again.");
            }
        }

    }

    return user ? (

        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 shadow-md rounded-lg w-full max-w-md">
                <h1 className="text-2xl font-bold text-center mb-6">Join a Meeting</h1>
                {error && <p className="text-red-500 text-center mb-4">{error}</p>}
                {success && <p className="text-green-500 text-center mb-4">{success}</p>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block font-semibold mb-1">Meeting Code</label>
                        <input
                            type="text"
                            value={meetingLink}
                            onChange={(e) => setMeetingLink(e.target.value)}
                            className="w-full px-3 py-2 border rounded-md"
                            placeholder="Enter meeting link"
                            required
                        />
                    </div>
                    <div>
                        <label className="block font-semibold mb-1">Meeting Code</label>
                        <input
                            type="text"
                            value={meetingCode}
                            onChange={(e) => setMeetingCode(e.target.value)}
                            className="w-full px-3 py-2 border rounded-md"
                            placeholder="Enter meeting code"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600"
                    >
                        Join Meeting
                    </button>
                </form>
            </div>
        </div>

    ) : null;
}

export default JoinMeeting