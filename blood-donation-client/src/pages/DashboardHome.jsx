import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../providers/AuthProvider";

const DashboardHome = () => {
    const { user } = useContext(AuthContext);
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalRequests: 0,
        totalFunding: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const usersRes = await axios.get("${import.meta.env.VITE_API_URL}/users", {
                    headers: { authorization: `Bearer ${localStorage.getItem('access-token')}` }
                });
                const requestsRes = await axios.get("${import.meta.env.VITE_API_URL}/donation-requests");
                const fundingRes = await axios.get("${import.meta.env.VITE_API_URL}/fundings");

                const totalFundAmount = fundingRes.data.reduce((sum, item) => sum + item.amount, 0);

                setStats({
                    totalUsers: usersRes.data.length,
                    totalRequests: requestsRes.data.length,
                    totalFunding: totalFundAmount
                });
                setLoading(false);
            } catch (err) {
                console.error("Error fetching stats:", err);
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <span className="loading loading-spinner loading-lg text-red-600"></span>
            </div>
        );
    }

    return (
        <div>
            {/* Welcome Banner */}
            <div className="bg-gradient-to-r from-red-600 to-red-500 rounded-2xl p-8 text-white shadow-lg mb-8">
                <h1 className="text-3xl font-bold mb-2">Welcome Back, {user?.displayName || "User"}! 👋</h1>
                <p className="text-red-100">Here is a quick overview of your Blood Care platform statistics and activities.</p>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 flex items-center justify-between">
                    <div>
                        <p className="text-gray-500 font-medium">Total Users</p>
                        <h3 className="text-3xl font-bold text-gray-800 mt-1">{stats.totalUsers}</h3>
                    </div>
                    <div className="bg-red-100 p-4 rounded-full text-red-600 text-xl">
                        👥
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 flex items-center justify-between">
                    <div>
                        <p className="text-gray-500 font-medium">Donation Requests</p>
                        <h3 className="text-3xl font-bold text-gray-800 mt-1">{stats.totalRequests}</h3>
                    </div>
                    <div className="bg-red-100 p-4 rounded-full text-red-600 text-xl">
                        🩸
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 flex items-center justify-between">
                    <div>
                        <p className="text-gray-500 font-medium">Total Funding</p>
                        <h3 className="text-3xl font-bold text-green-600 mt-1">${stats.totalFunding}</h3>
                    </div>
                    <div className="bg-green-100 p-4 rounded-full text-green-600 text-xl">
                        💰
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardHome;