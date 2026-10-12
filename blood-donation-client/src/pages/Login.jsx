import { useContext } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { AuthContext } from "../providers/AuthProvider";

const Login = () => {
    const { register, handleSubmit } = useForm();
    const { signIn } = useContext(AuthContext);
    const navigate = useNavigate();

    const onSubmit = async (data) => {
        try {
            // ফায়ারবেসে লগইন রিকোয়েস্ট পাঠানো
            const result = await signIn(data.email, data.password);
            
            if (result.user) {
                Swal.fire({
                    position: "center",
                    icon: "success",
                    title: "Login Successful!",
                    showConfirmButton: false,
                    timer: 1500
                });
                navigate("/"); // লগইন সফল হলে হোমে চলে যাবে
            }
        } catch (error) {
            console.error("Login Error:", error);
            Swal.fire("Error", "Invalid Email or Password!", "error");
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-8 bg-gray-50 rounded-xl shadow-lg border border-gray-200 mb-10">
            <h2 className="text-3xl font-bold text-center text-red-600 mb-6">Login</h2>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Email */}
                <div className="form-control">
                    <label className="label font-semibold"><span className="label-text">Email</span></label>
                    <input 
                        type="email" 
                        {...register("email", { required: true })} 
                        className="input input-bordered w-full" 
                        placeholder="Your Email" 
                    />
                </div>

                {/* Password */}
                <div className="form-control">
                    <label className="label font-semibold"><span className="label-text">Password</span></label>
                    <input 
                        type="password" 
                        {...register("password", { required: true })} 
                        className="input input-bordered w-full" 
                        placeholder="Password" 
                    />
                </div>

                <button type="submit" className="btn btn-error w-full text-white mt-6 text-lg">Login</button>
            </form>
            
            <p className="text-center mt-4">
                Don't have an account? <Link to="/register" className="text-red-600 font-bold hover:underline">Register here</Link>
            </p>
        </div>
    );
};

export default Login;