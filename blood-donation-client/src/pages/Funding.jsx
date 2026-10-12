import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../providers/AuthProvider";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import Swal from "sweetalert2";

// আপনার রিয়েল স্ট্রাইপ টেস্ট পাবলিশেবল কি এখানে বসানো হলো
const stripePromise = loadStripe("pk_test_51UPHS9RW42cjT2mFjtFgq6TBnU5K1ipEHYBRwWW9MYCeK3lG891vFjgnNLEJfKcUiZgIdPPeUJ06WvoKdpuXyjUp005eSpabXo"); 

const CheckoutForm = ({ closeModal, refetchFunds }) => {
    const stripe = useStripe();
    const elements = useElements();
    const { user } = useContext(AuthContext);
    const [amount, setAmount] = useState("");
    const [processing, setProcessing] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!stripe || !elements || !amount) return;

        const token = localStorage.getItem('access-token');
        if (!token) {
            Swal.fire("Error", "Please login again to make a payment.", "error");
            return;
        }

        setProcessing(true);
        try {
            // ব্যাকএন্ড থেকে পেমেন্ট ইন্টেন্ট ক্লায়েন্ট সিক্রেট আনা
            const res = await axios.post("http://localhost:5000/create-payment-intent", { amount: parseFloat(amount) }, {
                headers: { authorization: `Bearer ${token}` }
            });
            const clientSecret = res.data.clientSecret;

            const card = elements.getElement(CardElement);
            if (!card) return;

            const paymentResult = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: card,
                    billing_details: {
                        name: user?.displayName || 'Anonymous',
                        email: user?.email || 'unknown'
                    },
                }
            });

            if (paymentResult.error) {
                Swal.fire("Error", paymentResult.error.message, "error");
                setProcessing(false);
            } else if (paymentResult.paymentIntent.status === 'succeeded') {
                // পেমেন্ট সফল হলে ডাটাবেসে ফান্ড রেকর্ড সেভ করা
                const fundingInfo = {
                    name: user?.displayName || "Anonymous",
                    email: user?.email || "unknown",
                    amount: parseFloat(amount),
                    date: new Date().toISOString()
                };

                await axios.post("http://localhost:5000/fundings", fundingInfo, {
                    headers: { authorization: `Bearer ${token}` }
                });

                Swal.fire("Success!", "Thank you for your generous funding!", "success");
                setProcessing(false);
                refetchFunds();
                closeModal();
            }
        } catch (err) {
            console.error(err);
            Swal.fire("Error", "Payment processing failed. Please try again.", "error");
            setProcessing(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fund Amount ($)</label>
                <input 
                    type="number" 
                    value={amount} 
                    onChange={(e) => setAmount(e.target.value)} 
                    placeholder="Enter amount" 
                    className="input input-bordered w-full"
                    required 
                />
            </div>
            <div className="p-3 border rounded-lg bg-gray-50">
                <CardElement />
            </div>
            <div className="flex justify-end gap-2 mt-4">
                <button type="button" onClick={closeModal} className="btn btn-sm btn-ghost">Cancel</button>
                <button type="submit" disabled={!stripe || processing} className="btn btn-sm bg-red-600 hover:bg-red-700 text-white">
                    {processing ? "Processing..." : "Pay & Donate"}
                </button>
            </div>
        </form>
    );
};

const Funding = () => {
    const [fundings, setFundings] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchFunds = () => {
        axios.get("http://localhost:5000/fundings")
            .then(res => setFundings(res.data))
            .catch(err => console.log(err));
    };

    useEffect(() => {
        fetchFunds();
    }, []);

    return (
        <div className="max-w-7xl mx-auto px-4 py-12">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-3xl font-bold text-gray-800">Organization Fundings</h2>
                    <p className="text-gray-600 mt-1">See all contributions made by our donors to support our mission.</p>
                </div>
                <button 
                    onClick={() => setIsModalOpen(true)} 
                    className="btn bg-red-600 hover:bg-red-700 text-white border-none"
                >
                    Give Fund
                </button>
            </div>

            {/* Funding Table */}
            <div className="overflow-x-auto bg-white rounded-xl shadow-md border border-gray-100">
                <table className="table w-full">
                    <thead>
                        <tr className="bg-gray-100 text-gray-700">
                            <th>#</th>
                            <th>Donor Name</th>
                            <th>Email</th>
                            <th>Amount</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {fundings.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="text-center py-6 text-gray-500">No fundings recorded yet.</td>
                            </tr>
                        ) : (
                            fundings.map((fund, index) => (
                                <tr key={fund._id} className="hover">
                                    <th>{index + 1}</th>
                                    <td>{fund.name}</td>
                                    <td>{fund.email}</td>
                                    <td className="font-bold text-green-600">${fund.amount}</td>
                                    <td>{new Date(fund.date).toLocaleDateString()}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Stripe Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
                        <h3 className="text-xl font-bold mb-4 text-gray-800">Give Fund to Organization</h3>
                        <Elements stripe={stripePromise}>
                            <CheckoutForm closeModal={() => setIsModalOpen(false)} refetchFunds={fetchFunds} />
                        </Elements>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Funding;