import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../providers/AuthProvider";

const Navbar = () => {
    const { user, logOut } = useContext(AuthContext);

    const handleLogOut = () => {
        logOut()
            .then(() => {})
            .catch(error => console.log(error));
    };

    return (
        <div className="navbar bg-base-100 shadow-md px-4 md:px-10">
            <div className="flex-1">
                <Link to="/" className="text-2xl font-bold text-red-600">Blood Care</Link>
            </div>
            
            <div className="flex-none gap-4">
                <ul className="menu menu-horizontal px-1 font-semibold hidden md:flex items-center gap-2">
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/donation-requests">Donation Requests</Link></li>
                    <li><Link to="/search">Search Donors</Link></li>
                </ul>

                {/* মোবাইল ও ডেস্কটপ উভয়ের জন্য ইউজার সেকশন */}
                <div className="flex items-center gap-2">
                    {user ? (
                        <div className="dropdown dropdown-end">
                            <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                                <div className="w-10 rounded-full border-2 border-red-500 p-[2px]">
                                    <img src={user?.photoURL || "https://i.ibb.co/M91s3d1/user.png"} alt="User Avatar" />
                                </div>
                            </label>
                            <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
                                <li className="text-center font-bold text-gray-600 mb-2">{user?.displayName}</li>
                                <li><Link to="/dashboard" className="font-semibold">Dashboard</Link></li>
                                <li><Link to="/dashboard/create-donation-request" className="font-semibold">Create Request</Link></li>
                                <li><button onClick={handleLogOut} className="text-red-500 font-bold mt-1">Logout</button></li>
                            </ul>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Link to="/search" className="btn btn-sm btn-outline border-red-600 text-red-600 hover:bg-red-600 hover:text-white md:hidden">Search</Link>
                            <Link to="/login" className="btn bg-red-600 hover:bg-red-700 text-white">Login</Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Navbar;