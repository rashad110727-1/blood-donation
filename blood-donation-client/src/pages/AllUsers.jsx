import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const AllUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchUsers = () => {
        axios.get("http://localhost:5000/users", {
            headers: { authorization: `Bearer ${localStorage.getItem('access-token')}` }
        })
        .then(res => {
            setUsers(res.data);
            setLoading(false);
        })
        .catch(err => {
            console.error("Error fetching users:", err);
            setLoading(false);
        });
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    // রোল পরিবর্তন করার ফাংশন
    const handleRoleChange = (id, newRole) => {
        axios.patch(`http://localhost:5000/users/admin/${id}`, { role: newRole }, {
            headers: { authorization: `Bearer ${localStorage.getItem('access-token')}` }
        })
        .then(res => {
            if (res.data.modifiedCount > 0) {
                Swal.fire("Success!", `User role updated to ${newRole}`, "success");
                fetchUsers();
            }
        })
        .catch(err => console.error(err));
    };

    // স্ট্যাটাস ব্লক বা অ্যাক্টিভ করার ফাংশন
    const handleStatusChange = (id, currentStatus) => {
        const newStatus = currentStatus === 'active' ? 'blocked' : 'active';
        axios.patch(`http://localhost:5000/users/status/${id}`, { status: newStatus }, {
            headers: { authorization: `Bearer ${localStorage.getItem('access-token')}` }
        })
        .then(res => {
            if (res.data.modifiedCount > 0) {
                Swal.fire("Success!", `User status changed to ${newStatus}`, "success");
                fetchUsers();
            }
        })
        .catch(err => console.error(err));
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <span className="loading loading-spinner loading-lg text-red-600"></span>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-12">
            <div className="text-center mb-10">
                <h2 className="text-3xl font-bold text-gray-800">All Registered Users</h2>
                <p className="text-gray-600 mt-2">Manage user roles, statuses, and permissions across the platform.</p>
            </div>

            <div className="overflow-x-auto bg-white rounded-xl shadow-md border border-gray-100">
                <table className="table w-full">
                    <thead>
                        <tr className="bg-gray-100 text-gray-700">
                            <th>#</th>
                            <th>Avatar</th>
                            <th>Name & Email</th>
                            <th>Role</th>
                            <th>Status</th>
                            <th>Actions (Role)</th>
                            <th>Actions (Status)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((u, index) => (
                            <tr key={u._id} className="hover">
                                <th>{index + 1}</th>
                                <td>
                                    <img 
                                        src={u.avatar || "https://i.ibb.co/M91s3d1/user.png"} 
                                        alt="Avatar" 
                                        className="w-12 h-12 rounded-full object-cover border"
                                    />
                                </td>
                                <div>
                                    <td className="font-bold text-gray-800">{u.name}</td>
                                    <td className="text-sm text-gray-500">{u.email}</td>
                                </div>
                                <td className="uppercase font-semibold text-red-600">{u.role}</td>
                                <td>
                                    <span className={`px-2 py-1 rounded text-xs font-bold ${u.status === 'blocked' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                                        {u.status || 'active'}
                                    </span>
                                </td>
                                <td>
                                    <div className="flex gap-1">
                                        {u.role !== 'admin' && (
                                            <button onClick={() => handleRoleChange(u._id, 'admin')} className="btn btn-xs bg-purple-600 text-white">Make Admin</button>
                                        )}
                                        {u.role !== 'volunteer' && (
                                            <button onClick={() => handleRoleChange(u._id, 'volunteer')} className="btn btn-xs bg-blue-600 text-white">Make Volunteer</button>
                                        )}
                                        {u.role !== 'donor' && (
                                            <button onClick={() => handleRoleChange(u._id, 'donor')} className="btn btn-xs bg-gray-600 text-white">Make Donor</button>
                                        )}
                                    </div>
                                </td>
                                <td>
                                    <button 
                                        onClick={() => handleStatusChange(u._id, u.status || 'active')} 
                                        className={`btn btn-xs ${u.status === 'blocked' ? 'btn-success text-white' : 'btn-error text-white'}`}
                                    >
                                        {u.status === 'blocked' ? 'Unblock' : 'Block'}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AllUsers;