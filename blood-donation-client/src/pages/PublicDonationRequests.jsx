import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const PublicDonationRequests = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // ব্যাকএন্ড থেকে শুধুমাত্র pending স্ট্যাটাসের রিকোয়েস্ট ফেচ করা
        axios.get("${import.meta.env.VITE_API_URL}/donation-requests?status=pending")
            .then(res => {
                setRequests(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error fetching public requests:", err);
                setLoading(false);
            });
    }, []);

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
                <h2 className="text-3xl font-bold text-gray-800">Pending Blood Donation Requests</h2>
                <p className="text-gray-600 mt-2">Here are the patients who urgently need blood. Please step forward to save a life.</p>
            </div>

            {requests.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-lg shadow">
                    <p className="text-xl text-gray-500">No pending blood donation requests found right now.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {requests.map(req => (
                        <div key={req._id} className="bg-white border border-gray-200 rounded-xl shadow-md p-6 flex flex-col justify-between hover:shadow-lg transition">
                            <div>
                                <div className="flex justify-between items-center mb-4">
                                    <span className="px-3 py-1 bg-red-100 text-red-600 font-bold rounded-full text-sm">
                                        {req.bloodGroup}
                                    </span>
                                    <span className="text-sm text-gray-500 font-medium">Status: Pending</span>
                                </div>
                                <h3 className="text-xl font-semibold text-gray-800 mb-2">{req.recipientName}</h3>
                                <p className="text-gray-600 text-sm mb-1"><span className="font-semibold">Hospital:</span> {req.hospitalName}</p>
                                <p className="text-gray-600 text-sm mb-1"><span className="font-semibold">Location:</span> {req.recipientUpazila}, {req.recipientDistrict}</p>
                                <p className="text-gray-600 text-sm mb-4"><span className="font-semibold">Date:</span> {req.donationDate} | <span className="font-semibold">Time:</span> {req.donationTime}</p>
                            </div>
                            <Link 
                                to={`/donation-request/${req._id}`} 
                                className="btn bg-red-600 hover:bg-red-700 text-white w-full border-none"
                            >
                                View Details
                            </Link>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default PublicDonationRequests;