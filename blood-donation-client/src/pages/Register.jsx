import { useContext } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { AuthContext } from "../providers/AuthProvider";

// ImageBB API Setup
const image_hosting_key = import.meta.env.VITE_IMAGE_HOSTING_KEY;
const image_hosting_api = `https://api.imgbb.com/1/upload?key=${image_hosting_key}`;

const Register = () => {
    const { register, handleSubmit, reset } = useForm();
    const { createUser, updateUserProfile } = useContext(AuthContext);
    const navigate = useNavigate();

    const onSubmit = async (data) => {
        // পাসওয়ার্ড দুটি মিলছে কি না চেক করা
        if (data.password !== data.confirmPassword) {
            return Swal.fire("Error", "Passwords do not match!", "error");
        }

        try {
            // ১. ছবি আপলোড করার জন্য FormData তৈরি
            const formData = new FormData();
            formData.append("image", data.avatar[0]);

            // ২. ImageBB তে ছবি পাঠানো
            const res = await axios.post(image_hosting_api, formData, {
                headers: {
                    "content-type": "multipart/form-data",
                },
            });

            if (res.data.success) {
                const photoURL = res.data.data.display_url;

                // ৩. ফায়ারবেসে ইউজার তৈরি করা
                const result = await createUser(data.email, data.password);
                
                // ৪. ফায়ারবেস প্রোফাইল আপডেট করা (নাম এবং ছবির লিংক)
                await updateUserProfile(data.name, photoURL);

                // ৫. ডাটাবেসে সেভ করার জন্য ইউজারের তথ্য সাজানো
                const userInfo = {
                    name: data.name,
                    email: data.email,
                    bloodGroup: data.bloodGroup,
                    district: data.district,
                    upazila: data.upazila,
                    avatar: photoURL,
                    role: "donor",
                    status: "active"
                };

                // ৬. ব্যাকএন্ডে ডেটা পাঠানো (ধরে নিচ্ছি আপনার ব্যাকএন্ড লোকালহোস্ট ৫০০০ পোর্টে চলছে)
                const dbResponse = await axios.post("http://localhost:5000/users", userInfo);

                if (dbResponse.data.insertedId) {
                    reset();
                    Swal.fire({
                        position: "center",
                        icon: "success",
                        title: "Registration Successful!",
                        showConfirmButton: false,
                        timer: 1500
                    });
                    navigate("/");
                }
            }
        } catch (error) {
            console.error("Registration Error:", error);
            Swal.fire("Error", error.message, "error");
        }
    };

    return (
        <div className="max-w-2xl mx-auto mt-10 p-8 bg-gray-50 rounded-xl shadow-lg border border-gray-200 mb-10">
            <h2 className="text-3xl font-bold text-center text-red-600 mb-6">Register as a Donor</h2>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Name */}
                    <div className="form-control">
                        <label className="label font-semibold"><span className="label-text">Name</span></label>
                        <input type="text" {...register("name", { required: true })} className="input input-bordered w-full" placeholder="Your Name" />
                    </div>

                    {/* Email */}
                    <div className="form-control">
                        <label className="label font-semibold"><span className="label-text">Email</span></label>
                        <input type="email" {...register("email", { required: true })} className="input input-bordered w-full" placeholder="Your Email" />
                    </div>

                    {/* Blood Group */}
                    <div className="form-control">
                        <label className="label font-semibold"><span className="label-text">Blood Group</span></label>
                        <select {...register("bloodGroup", { required: true })} className="select select-bordered w-full">
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

                    {/* Avatar */}
                    <div className="form-control">
                        <label className="label font-semibold"><span className="label-text">Avatar</span></label>
                        <input type="file" {...register("avatar", { required: true })} className="file-input file-input-bordered w-full" />
                    </div>

                    {/* District */}
                    <div className="form-control">
                        <label className="label font-semibold"><span className="label-text">District</span></label>
                        <select {...register("district", { required: true })} className="select select-bordered w-full">
                            <option value="">Select District</option>
                            <option value="Dhaka">Dhaka</option>
                            <option value="Chattogram">Chattogram</option>
                        </select>
                    </div>

                    {/* Upazila */}
                    <div className="form-control">
                        <label className="label font-semibold"><span className="label-text">Upazila</span></label>
                        <select {...register("upazila", { required: true })} className="select select-bordered w-full">
                            <option value="">Select Upazila</option>
                            <option value="Mirpur">Mirpur</option>
                            <option value="Pahartali">Pahartali</option>
                        </select>
                    </div>

                    {/* Password */}
                    <div className="form-control">
                        <label className="label font-semibold"><span className="label-text">Password</span></label>
                        <input type="password" {...register("password", { required: true })} className="input input-bordered w-full" placeholder="Password" />
                    </div>

                    {/* Confirm Password */}
                    <div className="form-control">
                        <label className="label font-semibold"><span className="label-text">Confirm Password</span></label>
                        <input type="password" {...register("confirmPassword", { required: true })} className="input input-bordered w-full" placeholder="Confirm Password" />
                    </div>
                </div>

                <button type="submit" className="btn btn-error w-full text-white mt-6 text-lg">Register</button>
            </form>
            
            <p className="text-center mt-4">
                Already have an account? <Link to="/login" className="text-red-600 font-bold hover:underline">Login here</Link>
            </p>
        </div>
    );
};

export default Register;