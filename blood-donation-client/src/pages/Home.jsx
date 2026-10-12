import { Link } from "react-router-dom";

const Home = () => {
    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            {/* Hero Banner Section */}
            <div className="hero bg-red-600 text-white py-24 px-4 shadow-lg">
                <div className="hero-content text-center max-w-2xl">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">
                            Donate Blood, Save Human Life
                        </h1>
                        <p className="text-lg text-red-100 mb-8 leading-relaxed">
                            Every drop of blood is a precious gift. Join our mission to connect compassionate donors with patients in urgent need.
                        </p>
                        <div className="flex justify-center">
                            <Link to="/register" className="btn bg-white text-red-600 hover:bg-gray-100 font-bold border-none px-8 py-3 shadow-md">
                                Join as a Donor
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Info Cards Section */}
            <div className="max-w-7xl mx-auto px-4 py-16">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-800">Why Give Blood?</h2>
                    <p className="text-gray-600 mt-2">Your small contribution makes a massive difference in someone's life.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center hover:shadow-md transition-shadow">
                        <div className="w-14 h-14 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                            ❤️
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">Save Lives</h3>
                        <p className="text-gray-600 text-sm leading-relaxed">
                            A single blood donation can help save up to three lives during critical medical emergencies.
                        </p>
                    </div>

                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center hover:shadow-md transition-shadow">
                        <div className="w-14 h-14 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                            🛡️
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">Health Benefits</h3>
                        <p className="text-gray-600 text-sm leading-relaxed">
                            Regular donation helps reduce iron overload and maintains a healthy cardiovascular system.
                        </p>
                    </div>

                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center hover:shadow-md transition-shadow">
                        <div className="w-14 h-14 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                            🤝
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">Community Support</h3>
                        <p className="text-gray-600 text-sm leading-relaxed">
                            Be a trusted pillar in your community by standing beside people in their most vulnerable times.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;