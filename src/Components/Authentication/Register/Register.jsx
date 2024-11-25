import axios from 'axios'; // Add axios for HTTP requests
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Register() {
    const navigate = useNavigate(); // React Router navigation function

    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isAdmin, setIsAdmin] = useState(false); // Default to false

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (fullName && email && password && confirmPassword) {
            if (password !== confirmPassword) {
                alert('Passwords do not match!');
            } else {
                try {
                    // Prepare payload based on isAdmin state
                    const payload = {
                        full_name: fullName,
                        email,
                        password,
                    };

                    // Add "role" field if registering as admin
                    if (isAdmin) {
                        payload.role = 'admin';
                    }

                    // Make a POST request to the backend API
                    const response = await axios.post('http://localhost:5000/api/auth/register', payload);

                    if (response.data) {
                        alert('Account created successfully!');
                        navigate('/'); // Redirect to login
                    }
                } catch (error) {
                    console.error('Error during registration:', error);
                    alert(error.response?.data?.message || 'Something went wrong. Please try again.');
                }
            }
        } else {
            alert('Please fill in all fields!');
        }
    };

    return (
        <div className="bg-white text-gray-800 overflow-hidden">
            <div className="flex min-h-screen">
                <div className="hidden lg:flex lg:w-1/2 bg-primary flex-col justify-between p-12 relative">
                    <div className="text-white">
                        <img src="public/assets/logo.svg" className="h-8 mb-6" alt="Logo" />
                        <img
                            src="public/assets/Saly-1.png"
                            alt="Illustration"
                            className="mx-auto max-h-64 max-w-lg"
                        />
                        <h2 className="text-3xl font-bold mb-4">Sign Up Now</h2>
                        <p className="text-xl mb-4">Boost Your Learning Capabilities</p>
                        <p>
                            Create an account to unlock your personal progress tracker, evaluate your
                            performance, and gain access to premium content for enhancing your learning journey.
                        </p>
                    </div>
                </div>

                <div className="w-full lg:w-1/2 flex items-center justify-center p-12">
                    <div className="w-full max-w-md">
                        <h2 className="text-3xl font-bold mb-4 flex gap-2 items-center">
                            <span>Welcome to</span>
                            <img src="public/assets/logo.svg" className="h-7" alt="Logo" />
                        </h2>
                        <h1 className="text-4xl font-bold mb-6">Sign Up</h1>

                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label htmlFor="name" className="block mb-2">Full Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300"
                                    placeholder="John Doe"
                                />
                            </div>

                            <div className="mb-4">
                                <label htmlFor="email" className="block mb-2">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300"
                                    placeholder="Email address"
                                />
                            </div>

                            <div className="flex gap-4">
                                <div className="mb-6 w-full">
                                    <label htmlFor="password" className="block mb-2">Password</label>
                                    <input
                                        type="password"
                                        id="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300"
                                        placeholder="Password"
                                    />
                                </div>

                                <div className="mb-6 w-full">
                                    <label htmlFor="confirmPassword" className="block mb-2">Confirm Password</label>
                                    <input
                                        type="password"
                                        id="confirmPassword"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300"
                                        placeholder="Confirm Password"
                                    />
                                </div>
                            </div>

                            {/* Admin checkbox */}
                            <div className="mb-6 flex gap-2 items-center">
                                <input
                                    type="checkbox"
                                    id="admin"
                                    checked={isAdmin} // Bind to state
                                    onChange={(e) => setIsAdmin(e.target.checked)} // Update state
                                    className="px-4 py-3 rounded-lg border border-gray-300"
                                />
                                <label htmlFor="admin" className="block">Register as Admin</label>
                            </div>

                            <button type="submit" className="w-full bg-primary text-white py-3 rounded-lg mb-4">
                                Sign Up
                            </button>
                        </form>

                        <div className="text-center">
                            <p>Already have an account? <Link to={"/login"} className="text-primary">Login here</Link></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
