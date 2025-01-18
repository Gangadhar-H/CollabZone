import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import axios from "axios";

const LoginPage = () => {
    const { login } = useUser();
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        try {
            const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/users/login`, {
                email,
                password,
            });
            const { data } = response.data;
            const { user, accessToken } = data;
            console.log(response.data);
            login(user, accessToken);
            navigate("/dashboard");
        } catch (error) {
            console.error(error);
            setError(error.response?.data?.message || "An error occurred. Please try again.");
        }
    };



    return (
        <div>
            <h1>Login</h1>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Email:</label>
                    <input
                        type="email"
                        value={email} // Bind email state to input value
                        onChange={(e) => setEmail(e.target.value)} // Update email state on input change
                        required
                    />
                </div>
                <div>
                    <label>Password:</label>
                    <input
                        type="password"
                        value={password} // Bind password state to input value
                        onChange={(e) => setPassword(e.target.value)} // Update password state on input change
                        required
                    />
                </div>
                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default LoginPage;
