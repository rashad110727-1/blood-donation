import { useState, useEffect } from "react";
import axios from "axios";

const SearchDonors = () => {
    const [bloodGroup, setBloodGroup] = useState("");
    const [district, setDistrict] = useState("");
    const [upazila, setUpazila] = useState("");
    
    // ডাটা ও লোকেশনের জন্য স্টেট
    const [districts, setDistricts] = useState([]);
    const [upazilas, setUpazilas] = useState([]);
    const [donors, setDonors] = useState([]);
    const [searched, setSearched] = useState(false);

    // জিয়ো কোড বা জেলা-উপজেলা লোড করার জন্য (রিসোর্স গিটহাব লিংক থেকে ডেটা বা লোকাল ডাটা)
    useEffect(() => {
        // জেলা ডেটা লোড করা (অথবা আপনার প্রজেক্টে যদি লোকাল JSON থাকে তা ব্যবহার করতে পারেন)
        axios.get("https://raw.githubusercontent.com/nuhil/bangladesh-geocode/master/districts/districts.json")
            .then(res => {
                // nuhil/bangladesh-geocode স্ট্রাকচার অনুযায়ী ডেটা সেট করা
                setDistricts(res.data[2]?.data || res.data); 
            })
            .catch(err => console.log(err));
    }, []);

    // জেলা পরিবর্তনের সাথে উপজেলা লোড করা
    const handleDistrictChange = (e) => {
        const selectedDistrictId = e.target.value;
        setDistrict(selectedDistrictId);
        
        axios.get("https://raw.githubusercontent.com/nuhil/bangladesh-geocode/master/upazilas/upazilas.json")
            .then(res => {
                const allUpazilas = res.data[2]?.data || res.data;
                const filtered = allUpazilas.filter(up => up.district_id === selectedDistrictId);
                setUpazilas(filtered);
            })
            .catch(err => console.log(err));
    };

    // সার্চ ফর্ম সাবমিট হ্যান্ডলার
    const handleSearch = (e) => {
        e.preventDefault();
        setSearched(true);

        // ব্যাকএন্ডে ডোনর ফিল্টার করার জন্য কুয়েরি পাঠানো (অথবা ইউজার কালেকশন থেকে রোল ও লোকেশন ম্যাচ করা)
        axios.get(`http://localhost:5000/users?bloodGroup=${bloodGroup}&district=${district}&upazila=${upazila}`)
            .then(res => {
                // শুধু ডোনর রোল বা সক্রিয় ইউজারদের ফিল্টার করা
                const filteredDonors = res.data.filter(u => u.role === 'donor' && u.status === 'active');
                setDonors(filteredDonors);
            })
            .catch(err => {
                console.error("Error searching donors:", err);
            });
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-12">
            <div className="text-center mb-10">
                <h2 className="text-3xl font-bold text-gray-800">Search Blood Donors</h2>
                <p className="text-gray-600 mt-2">Find available donors by blood group, district, and upazila.</p>
            </div>

            {/* Search Form */}
            <div className="bg-white shadow-md rounded-xl p-6 max-w-3xl mx-auto mb-10 border border-gray-100">
                <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Blood Group</label>
                        <select 
                            value={bloodGroup} 
                            onChange={(e) => setBloodGroup(e.target.value)} 
                            className="select select-bordered w-full"
                            required
                        >
                            <option value="">Select Blood Group</option>
                            <option value="A+">A+</option>
                            <option value="A-">A-</option>
                            <option value="B+">B+</option>
                            <option value="B-">B-</option>
                            <option value="AB+">AB+</option>
                            <option value="AB-">AB-</option>
                            <option value="O+">O+</option>
                            <option value="O-">O-</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">District</label>
                        <select 
                            value={district} 
                            onChange={handleDistrictChange} 
                            className="select select-bordered w-full"
                            required
                        >
                            <option value="">Select District</option>
                            {districts.map(d => (
                                <option key={d.id} value={d.id}>{d.name}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Upazila</label>
                        <select 
                            value={upazila} 
                            onChange={(e) => setUpazila(e.target.value)} 
                            className="select select-bordered w-full"
                            required
                        >
                            <option value="">Select Upazila</option>
                            {upazilas.map(u => (
                                <option key={u.id} value={u.name}>{u.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="md:col-span-3 text-center mt-4">
                        <button type="submit" className="btn bg-red-600 hover:bg-red-700 text-white w-full md:w-1/3">
                            Search Donors
                        </button>
                    </div>
                </form>
            </div>

            {/* Search Results */}
            {searched && (
                <div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">Search Results</h3>
                    {donors.length === 0 ? (
                        <div className="text-center py-12 bg-white rounded-lg shadow">
                            <p className="text-lg text-gray-500">No donors found matching your criteria.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {donors.map(donor => (
                                <div key={donor._id} className="bg-white border border-gray-200 rounded-xl shadow-md p-6 flex items-center gap-4">
                                    <img 
                                        src={donor.avatar || "https://i.ibb.co/M91s3d1/user.png"} 
                                        alt="Donor Avatar" 
                                        className="w-16 h-16 rounded-full object-cover border-2 border-red-500"
                                    />
                                    <div>
                                        <h4 className="text-lg font-bold text-gray-800">{donor.name}</h4>
                                        <p className="text-sm text-gray-600">Email: {donor.email}</p>
                                        <p className="text-sm text-gray-600 font-semibold">Blood Group: <span className="text-red-600">{donor.bloodGroup}</span></p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default SearchDonors;