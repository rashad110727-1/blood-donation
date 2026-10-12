import { useContext } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { AuthContext } from "../providers/AuthProvider";

const Dashboard = () => {
    const { logOut } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogOut = () => {
        logOut().then(() => {
            navigate("/");
        });
    };

    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Left Sidebar */}
            <div className="w-64 bg-red-600 text-white flex flex-col">
                <div className="p-6 text-2xl font-bold border-b border-red-500 text-center">
                    Blood Care
                </div>
                
                <ul className="menu p-4 w-full flex-1 space-y-2 font-semibold text-white">
                    <li><Link to="/dashboard" className="hover:bg-red-700">Dashboard Home</Link></li>
                    <li><Link to="/dashboard/profile" className="hover:bg-red-700">My Profile</Link></li>
                    <li><Link to="/dashboard/create-donation-request" className="hover:bg-red-700">Create Request</Link></li>
                    <li><Link to="/dashboard/my-donation-requests" className="hover:bg-red-700">My Requests</Link></li>
                    <li><Link to="/dashboard/all-donation-requests" className="hover:bg-red-700">All Requests (Admin)</Link></li>
                    <li><Link to="/dashboard/all-users" className="hover:bg-red-700">All Users (Admin)</Link></li>
                    <li><Link to="/dashboard/funding" className="hover:bg-red-700">Funding & Payments</Link></li>
                </ul>
                
                <div className="p-4 border-t border-red-500">
                    <Link to="/" className="btn btn-sm btn-outline border-white text-white hover:bg-white hover:text-red-600 w-full mb-3">
                        Back to Home
                    </Link>
                    <button onClick={handleLogOut} className="btn btn-sm w-full bg-white text-red-600 hover:bg-gray-200 border-none">
                        Logout
                    </button>
                </div>
            </div>

            {/* Right Content Area */}
            <div className="flex-1 p-8">
                <Outlet />
            </div>
        </div>
    );
};

export default Dashboard;