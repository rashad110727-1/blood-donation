import { useContext, useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { AuthContext } from "../providers/AuthProvider";

const MyDonationRequests = () => {
    const { user } = useContext(AuthContext);
    const [myRequests, setMyRequests] = useState([]);

    const fetchMyRequests = () => {
        if (user?.email) {
            axios.get(`${import.meta.env.VITE_API_URL}/donation-requests?email=${user.email}`)
                .then(res => {
                    setMyRequests(res.data);
                })
                .catch(error => console.error("Error fetching my requests:", error));
        }
    };

    useEffect(() => {
        fetchMyRequests();
    }, [user]);

    const handleDelete = (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it!"
        }).then((result) => {
            if (result.isConfirmed) {
                // টোকেনসহ ডিলিট রিকোয়েস্ট পাঠানোর জন্য নিচের মতো হেডার যুক্ত করা যেতে পারে
                const token = localStorage.getItem('access-token');
                axios.delete(`${import.meta.env.VITE_API_URL}/donation-requests/${id}`, {
                    headers: {
                        authorization: `Bearer ${token}`
                    }
                })
                    .then(res => {
                        if (res.data.deletedCount > 0) {
                            Swal.fire({
                                title: "Deleted!",
                                text: "Your request has been deleted.",
                                icon: "success"
                            });
                            fetchMyRequests();
                        }
                    })
                    .catch(err => {
                        console.error("Error deleting request:", err);
                        Swal.fire({
                            title: "Error!",
                            text: "You may not have admin privileges or unauthorized action.",
                            icon: "error"
                        });
                    });
            }
        });
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 min-h-screen">
            <h2 className="text-3xl font-bold mb-6 text-gray-800">My Donation Requests ({myRequests.length})</h2>
            
            <div className="overflow-x-auto">
                <table className="table table-zebra w-full">
                    <thead className="bg-red-100 text-red-600 text-base">
                        <tr>
                            <th>#</th>
                            <th>Recipient Name</th>
                            <th>Blood Group</th>
                            <th>Hospital</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {myRequests.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="text-center text-lg py-4 text-gray-500">You have not created any donation requests yet.</td>
                            </tr>
                        ) : (
                            myRequests.map((req, index) => (
                                <tr key={req._id}>
                                    <th>{index + 1}</th>
                                    <td className="font-semibold">{req.recipientName}</td>
                                    <td className="text-red-600 font-bold">{req.bloodGroup}</td>
                                    <td>{req.hospitalName}</td>
                                    <td>
                                        <span className={`badge ${req.status === 'pending' ? 'badge-warning' : req.status === 'inprogress' ? 'badge-info' : 'badge-success'} gap-2`}>
                                            {req.status || 'pending'}
                                        </span>
                                    </td>
                                    <td>
                                        <button onClick={() => handleDelete(req._id)} className="btn btn-sm btn-error text-white">
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default MyDonationRequests;