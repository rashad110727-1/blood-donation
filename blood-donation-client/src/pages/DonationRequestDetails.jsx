import { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../providers/AuthProvider";
import Swal from "sweetalert2";

const DonationRequestDetails = () => {
    const { id } = useParams();
    const { user } = useContext(AuthContext);
    const [request, setRequest] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`http://localhost:5000/donation-requests`)
            .then(res => {
                const found = res.data.find(item => item._id === id);
                setRequest(found);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, [id]);

    const handleDonateConfirm = (e) => {
        e.preventDefault();
        
        // স্ট্যাটাস pending থেকে inprogress করা এবং ডোনারের তথ্য যুক্ত করা
        const donationData = {
            status: "inprogress",
            donorName: user?.displayName,
            donorEmail: user?.email
        };

        axios.patch(`http://localhost:5000/donation-requests/${id}`, donationData)
            .then(res => {
                if (res.data.modifiedCount > 0) {
                    Swal.fire({
                        title: "Success!",
                        text: "You have successfully accepted to donate blood.",
                        icon: "success",
                        confirmButtonColor: "#dc2626"
                    });
                    setIsModalOpen(false);
                    // লোকাল স্টেট আপডেট করা
                    setRequest(prev => ({ ...prev, status: "inprogress", donorName: user?.displayName, donorEmail: user?.email }));
                }
            })
            .catch(err => {
                console.error(err);
                Swal.fire("Error!", "Something went wrong.", "error");
            });
    };

    if (loading) return <div className="text-center py-20"><span className="loading loading-spinner text-red-600"></span></div>;
    if (!request) return <div className="text-center py-20 text-xl text-red-500">Donation request not found!</div>;

    return (
        <div className="max-w-3xl mx-auto px-4 py-12">
            <div className="bg-white shadow-lg rounded-2xl p-8 border border-gray-100">
                <div className="flex justify-between items-center border-b pb-4 mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Donation Request Details</h2>
                    <span className={`px-4 py-1 rounded-full text-sm font-bold uppercase ${request.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-blue-100 text-blue-700'}`}>
                        {request.status}
                    </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-700 mb-8">
                    <div>
                        <p className="mb-2"><span className="font-semibold">Recipient Name:</span> {request.recipientName}</p>
                        <p className="mb-2"><span className="font-semibold">Blood Group:</span> <span className="text-red-600 font-bold">{request.bloodGroup}</span></p>
                        <p className="mb-2"><span className="font-semibold">Hospital Name:</span> {request.hospitalName}</p>
                        <p className="mb-2"><span className="font-semibold">Full Address:</span> {request.fullAddressLine}</p>
                    </div>
                    <div>
                        <p className="mb-2"><span className="font-semibold">District:</span> {request.recipientDistrict}</p>
                        <p className="mb-2"><span className="font-semibold">Upazila:</span> {request.recipientUpazila}</p>
                        <p className="mb-2"><span className="font-semibold">Donation Date:</span> {request.donationDate}</p>
                        <p className="mb-2"><span className="font-semibold">Donation Time:</span> {request.donationTime}</p>
                    </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg mb-8">
                    <h4 className="font-semibold text-gray-800 mb-1">Why blood is needed:</h4>
                    <p className="text-gray-600 text-sm">{request.requestMessage}</p>
                </div>

                <div className="flex justify-end gap-4">
                    <button onClick={() => navigate(-1)} className="btn btn-outline">Back</button>
                    {request.status === 'pending' && (
                        <button 
                            onClick={() => setIsModalOpen(true)} 
                            className="btn bg-red-600 hover:bg-red-700 text-white border-none"
                        >
                            Donate Blood
                        </button>
                    )}
                </div>
            </div>

            {/* Donate Confirmation Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white rounded-xl p-6 w-96 shadow-xl">
                        <h3 className="text-xl font-bold mb-4 text-gray-800">Confirm Donation</h3>
                        <form onSubmit={handleDonateConfirm}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Donor Name</label>
                                <input type="text" value={user?.displayName || ""} readOnly className="input input-bordered w-full bg-gray-100" />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Donor Email</label>
                                <input type="email" value={user?.email || ""} readOnly className="input input-bordered w-full bg-gray-100" />
                            </div>
                            <div className="flex justify-end gap-2 mt-6">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-sm btn-ghost">Cancel</button>
                                <button type="submit" className="btn btn-sm bg-red-600 hover:bg-red-700 text-white">Confirm Donate</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DonationRequestDetails;