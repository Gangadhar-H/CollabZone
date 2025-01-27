import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { useUser } from "../context/UserContext";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import { Mic, MicOff, Camera, CameraOff } from "lucide-react";

const MeetingPage = () => {
    const { user } = useUser(); // User details from context
    const [meetingLink, setMeetingLink] = useState("");
    const [meetingCode, setMeetingCode] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [isInMeeting, setIsInMeeting] = useState(false);
    const [participants, setParticipants] = useState([]);
    const [localStream, setLocalStream] = useState(null);
    const [isMuted, setIsMuted] = useState(false);
    const [isCameraOff, setIsCameraOff] = useState(false);
    const localVideoRef = useRef(null);
    const remoteVideoRefs = useRef({});
    const socketRef = useRef();
    const navigate = useNavigate();

    const handleJoinMeeting = async (e) => {
        e.preventDefault();
        if (!meetingLink || !meetingCode) {
            setError("Meeting Link and Code are required.");
            return;
        }

        setError(""); // Clear any previous errors
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
                console.log(response.data.data._id);
                navigate(`/meeting/${response.data.data._id}`);
            } else if (response.data.message === "Successfully joined the meeting.") {
                setSuccess(response.data.message);
                // Uncomment below if you want to redirect to the meeting page
                navigate(`/meeting/${response.data.data._id}`);
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

        // Initialize socket connection
        socketRef.current = io(import.meta.env.VITE_SOCKET_SERVER_URL, {
            query: { meetingId: meetingLink },
            withCredentials: true,
        });

        // Emit join-room event with link and code
        socketRef.current.emit(
            "join-room",
            { meetingLink, meetingCode, userId: user?.data?._id },
            (response) => {
                if (response.error) {
                    setError(response.error);
                } else {
                    setIsInMeeting(true); // Enter the meeting room
                }
            }
        );

        // Handle participant updates
        socketRef.current.on("participants-update", (updatedParticipants) => {
            setParticipants(updatedParticipants);
        });

        // Initialize local video
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        setLocalStream(stream);
        if (localVideoRef.current) {
            localVideoRef.current.srcObject = stream;
        }
    };

    const toggleMic = () => {
        if (localStream) {
            const audioTrack = localStream.getAudioTracks()[0];
            audioTrack.enabled = !audioTrack.enabled;
            setIsMuted(!audioTrack.enabled);
        }
    };

    const toggleCamera = () => {
        if (localStream) {
            const videoTrack = localStream.getVideoTracks()[0];
            videoTrack.enabled = !videoTrack.enabled;
            setIsCameraOff(!videoTrack.enabled);
        }
    };

    useEffect(() => {
        return () => {
            // Cleanup on component unmount
            socketRef.current?.disconnect();
            localStream?.getTracks().forEach((track) => track.stop());
        };
    }, [localStream]);

    return (
        <div className="min-h-screen bg-gray-900 text-white flex flex-col">
            {!isInMeeting ? (
                <div className="flex flex-col items-center justify-center h-full">
                    <h1 className="text-2xl font-bold mb-4">Join a Meeting</h1>
                    <input
                        type="text"
                        placeholder="Meeting Link"
                        value={meetingLink}
                        onChange={(e) => setMeetingLink(e.target.value)}
                        className="w-2/3 p-2 mb-4 border rounded-md bg-gray-800 text-white"
                    />
                    <input
                        type="text"
                        placeholder="Meeting Code"
                        value={meetingCode}
                        onChange={(e) => setMeetingCode(e.target.value)}
                        className="w-2/3 p-2 mb-4 border rounded-md bg-gray-800 text-white"
                    />
                    {error && <p className="text-red-500">{error}</p>}
                    <button
                        onClick={handleJoinMeeting}
                        className="py-2 px-6 bg-blue-600 hover:bg-blue-700 rounded-md"
                    >
                        Join Meeting
                    </button>
                </div>
            ) : (
                <div className="flex-grow p-4">
                    {/* Video Section */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                        {/* Local Video */}
                        <div className="relative">
                            <video
                                ref={localVideoRef}
                                autoPlay
                                muted
                                playsInline
                                className="w-full h-full object-cover rounded-lg"
                            />
                            <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 px-2 py-1 rounded text-sm">
                                You
                            </div>
                        </div>

                        {/* Remote Videos */}
                        {participants.map((participant) => {
                            // Check if participant.user exists
                            if (!participant.user) {
                                console.warn("Participant data is missing user field:", participant);
                                return null; // Skip rendering this participant
                            }

                            return (
                                <div key={participant.user._id} className="relative">
                                    <video
                                        ref={(el) => (remoteVideoRefs.current[participant.user._id] = el)}
                                        autoPlay
                                        playsInline
                                        className="w-full h-full object-cover rounded-lg"
                                    />
                                    <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 px-2 py-1 rounded text-sm">
                                        {participant.user.fullname || "Participant"}
                                    </div>
                                </div>
                            );
                        })}

                    </div>

                    {/* Controls */}
                    <div className="absolute bottom-4 left-4 flex gap-4">
                        <button
                            onClick={toggleMic}
                            className={`p-3 rounded-full ${isMuted ? "bg-red-600" : "bg-gray-800"}`}
                        >
                            {isMuted ? <MicOff /> : <Mic />}
                        </button>
                        <button
                            onClick={toggleCamera}
                            className={`p-3 rounded-full ${isCameraOff ? "bg-red-600" : "bg-gray-800"}`}
                        >
                            {isCameraOff ? <CameraOff /> : <Camera />}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MeetingPage;
