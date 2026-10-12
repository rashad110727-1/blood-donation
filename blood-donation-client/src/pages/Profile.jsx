import { useContext } from "react";
import { AuthContext } from "../providers/AuthProvider";

const Profile = () => {
    const { user } = useContext(AuthContext);

    return (
        <div>
            <h2 className="text-3xl font-bold mb-4">My Profile</h2>
            <div className="bg-white p-6 rounded-lg shadow-md max-w-md">
                <img src={user?.photoURL} alt="Profile" className="w-24 h-24 rounded-full border-4 border-red-500 mb-4" />
                <h3 className="text-xl font-bold">Name: {user?.displayName}</h3>
                <p className="text-gray-600 font-semibold mt-2">Email: {user?.email}</p>
            </div>
        </div>
    );
};

export default Profile;