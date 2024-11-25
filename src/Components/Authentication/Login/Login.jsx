import axios from 'axios';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate(); // React Router navigation function

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (email && password) {
            try {
                // Send login request to the backend
                const response = await axios.post('http://localhost:5000/api/auth/login', {
                    email,
                    password,
                });

                // Extract data from the response
                const { accessToken, refreshToken } = response.data.data.tokens;
                const { full_name: fullName, role } = response.data.data.user;
                console.log(response)

                // Save tokens and user info in localStorage
                localStorage.setItem('accessToken', accessToken);
                localStorage.setItem('refreshToken', refreshToken);
                localStorage.setItem('fullName', fullName);
                localStorage.setItem('role', role); // Save role for future reference

                // Redirect based on the user role
                if (role === 'admin') {
                    navigate('/adminDashboard'); // Redirect to the admin dashboard
                } else if (role === 'user') {
                    navigate('/'); // Redirect to the user dashboard
                }
            } catch (error) {
                console.error(error);
                // Display error message
                setErrorMessage('Login failed! Please check your credentials.');
            }
        } else {
            setErrorMessage('Please fill in all fields!');
        }
    };

    return (
        <div className="bg-white text-gray-800 overflow-hidden">
            <div className="flex min-h-screen">
                <div className="hidden lg:flex lg:w-1/2 bg-primary flex-col justify-between p-12 relative">
                    <div className="text-white">
                        <img src="public/assets/Saly-1.png" alt="Illustration" className="mx-auto" />
                        <h2 className="text-3xl font-bold mb-4">Sign in Now</h2>
                        <p className="text-xl mb-4">Boost Your Learning Capabilities</p>
                        <p className="mb-8">
                            Logging in unlocks your personal progress tracker, letting you evaluate your performance and see how you
                            stack up against others.
                        </p>
                    </div>
                </div>

                <div className="w-full lg:w-1/2 flex items-center justify-center p-12">
                    <div className="w-full max-w-md">
                        <h2 className="text-3xl font-bold mb-8 flex gap-2 items-center">
                            <span>Welcome to</span>
                            <img src="public/assets/logo.svg" className="h-7" />
                        </h2>
                        <h1 className="text-5xl font-bold mb-8">Sign in</h1>

                        <form onSubmit={handleSubmit}>
                            {errorMessage && (
                                <div className="mb-4 text-red-500">{errorMessage}</div>
                            )}
                            <div className="mb-4">
                                <label htmlFor="email" className="block mb-2">Enter your username or email address</label>
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300"
                                    placeholder="Username or email address"
                                    required
                                />
                            </div>
                            <div className="mb-6">
                                <label htmlFor="password" className="block mb-2">Enter your Password</label>
                                <input
                                    type="password"
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300"
                                    placeholder="Password"
                                    required
                                />
                            </div>
                            <button type="submit" className="w-full bg-primary text-white py-3 rounded-lg mb-4">
                                Sign in
                            </button>
                        </form>

                        <div className="text-center">
                            <a href="#" className="text-primary">Forgot Password</a>
                        </div>

                        <div className="mt-8">
                            <p className="text-center">No Account? <Link to={"/register"} className="text-primary">Sign up</Link></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
