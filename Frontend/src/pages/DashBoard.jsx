import React from "react";
import { useUser } from "../context/UserContext";
import { Link, useNavigate } from "react-router-dom";

const Dashboard = () => {
    const { user, logout } = useUser();
    const navigate = useNavigate();

    React.useEffect(() => {
        if (!user) {
            navigate("/login");
        }
    }, [user, navigate]);

    return user ? (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
            <div className="bg-white p-8 shadow-md rounded-lg w-full max-w-lg">
                <h1 className="text-2xl font-bold text-center mb-4">
                    Welcome to Your Dashboard
                </h1>
                <p className="text-center text-gray-700 mb-6">
                    Logged in as: <span className="font-semibold">{user?.data?.username}</span>
                </p>
                <button
                    onClick={logout}
                    className="w-full py-2 px-4 mb-6 bg-red-500 text-white font-semibold rounded-md hover:bg-red-600"
                >
                    Logout
                </button>
                <div className="flex flex-col gap-4">
                    <Link
                        to="/create-meeting"
                        className="py-2 px-4 text-center bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600"
                    >
                        Create Meeting
                    </Link>
                    <Link
                        to="/meeting/:meetingId"
                        className="py-2 px-4 text-center bg-green-500 text-white font-semibold rounded-md hover:bg-green-600"
                    >
                        Join Meeting
                    </Link>
                    <Link
                        to="/your-meetings"
                        className="py-2 px-4 text-center bg-purple-500 text-white font-semibold rounded-md hover:bg-purple-600"
                    >
                        Your Meetings
                    </Link>
                </div>
            </div>
        </div>
    ) : null;
};

export default Dashboard;
