import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const AllDonationRequests = () => {
    const [allRequests, setAllRequests] = useState([]);

    // ডেটা লোড করার ফাংশন
    const fetchRequests = () => {
        axios.get("http://localhost:5000/donation-requests")
            .then(res => {
                setAllRequests(res.data);
            })
            .catch(error => console.error("Error fetching all requests:", error));
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    // স্ট্যাটাস আপডেট করার ফাংশন
    const handleStatusUpdate = (id, newStatus) => {
        axios.patch(`http://localhost:5000/donation-requests/${id}`, { status: newStatus })
            .then(res => {
                if (res.data.modifiedCount > 0) {
                    Swal.fire({
                        icon: "success",
                        title: `Status updated to ${newStatus}`,
                        showConfirmButton: false,
                        timer: 1500
                    });
                    fetchRequests(); // আপডেট হওয়ার পর টেবিল রিফ্রেশ করা
                }
            })
            .catch(err => console.error(err));
    };

    // ডিলিট করার ফাংশন
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
                axios.delete(`http://localhost:5000/donation-requests/${id}`)
                    .then(res => {
                        if (res.data.deletedCount > 0) {
                            Swal.fire({
                                title: "Deleted!",
                                text: "The request has been deleted.",
                                icon: "success"
                            });
                            fetchRequests(); // পেজ রিলোড ছাড়াই টেবিল আপডেট করার জন্য
                        }
                    })
                    .catch(err => console.error("Error deleting request:", err));
            }
        });
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 min-h-screen">
            <h2 className="text-3xl font-bold mb-6 text-gray-800">All Donation Requests</h2>
            
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
                        {allRequests.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="text-center text-lg py-4">No requests found.</td>
                            </tr>
                        ) : (
                            allRequests.map((req, index) => (
                                <tr key={req._id}>
                                    <th>{index + 1}</th>
                                    <td className="font-semibold">{req.recipientName}</td>
                                    <td className="text-red-600 font-bold">{req.bloodGroup}</td>
                                    <td>{req.hospitalName}</td>
                                    <td>
                                        <span className={`badge ${req.status === 'pending' ? 'badge-warning' : req.status === 'inprogress' ? 'badge-info' : 'badge-success'} gap-2`}>
                                            {req.status}
                                        </span>
                                    </td>
                                    <td className="space-x-2">
                                        {/* Pending থাকলে এই বাটনগুলো দেখাবে */}
                                        {req.status === 'pending' && (
                                            <>
                                                <button onClick={() => handleStatusUpdate(req._id, 'inprogress')} className="btn btn-sm btn-info text-white">In Progress</button>
                                                <button onClick={() => handleStatusUpdate(req._id, 'done')} className="btn btn-sm btn-success text-white ml-2">Done</button>
                                            </>
                                        )}
                                        {/* In Progress থাকলে শুধু Done বাটন দেখাবে */}
                                        {req.status === 'inprogress' && (
                                            <button onClick={() => handleStatusUpdate(req._id, 'done')} className="btn btn-sm btn-success text-white">Done</button>
                                        )}
                                        {/* ডিলিট বাটন (সব অবস্থায় দেখাবে) */}
                                        <button onClick={() => handleDelete(req._id)} className="btn btn-sm btn-error text-white ml-2">
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

export default AllDonationRequests;