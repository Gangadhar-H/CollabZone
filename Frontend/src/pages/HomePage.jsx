import React from 'react'
import { Link } from 'react-router-dom'
import { useUser } from '../context/UserContext'

function HomePage() {
    const { user, logout } = useUser();
    return (
        <div>

            <h1>Welcome to CollabHub</h1>

            {user ? (
                <>
                    <p>Logged in as: {user.data.email}</p>
                    <button onClick={() => {
                        console.log('Logout button clicked');
                        logout();
                    }}>Logout</button>
                </>
            ) : (
                <Link to="/login">Login</Link>
            )}

            <nav>
                <Link to="/create-meeting">Create Meeting</Link>
                <Link to="/join-meeting">Join Meeting</Link>
            </nav>

        </div>
    )
}

export default HomePage