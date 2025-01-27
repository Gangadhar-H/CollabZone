import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";


function CreateMeeting() {

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [meetingCode, setMeetingCode] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/meeting/`,
                {
                    title,
                    description,
                    meetingCode,
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`, // Retrieve the token from localStorage
                    },
                    withCredentials: true, // Ensure cookies are included if needed
                }
            );
            console.log("Meeting Created:", response.data);
            navigate("/dashboard");
        } catch (err) {
            console.error("Error creating meeting:", err);
            setError(err.response?.data?.message || "An error occurred. Please try again.");
        }

    }

    return (

        <div className="min-h-screen flex items-center justify-center bg-gray-100">

            <div className="bg-white p-8 shadow-md rounded-lg w-full max-w-md">
                <h1 className="text-2xl font-bold text-center mb-6">Create a New Meeting</h1>
                {error && <p className="text-red-500 text-center mb-4">{error}</p>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block font-semibold mb-1">Meeting Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full px-3 py-2 border rounded-md"
                            required
                        />
                    </div>
                    <div>
                        <label className="block font-semibold mb-1">Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full px-3 py-2 border rounded-md"
                            required
                        ></textarea>
                    </div>
                    <div>
                        <label className="block font-semibold mb-1">Meeting Code</label>
                        <input
                            type="text"
                            value={meetingCode}
                            onChange={(e) => setMeetingCode(e.target.value)}
                            className="w-full px-3 py-2 border rounded-md"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600"
                    >
                        Create Meeting
                    </button>
                </form>
            </div>

        </div>

    )
}

export default CreateMeeting
