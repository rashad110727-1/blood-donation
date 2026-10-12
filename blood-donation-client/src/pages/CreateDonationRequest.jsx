import { useContext } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { AuthContext } from "../providers/AuthProvider";
import axios from "axios"; // axios import kore nilam

const CreateDonationRequest = () => {
    const { user } = useContext(AuthContext);
    const { register, handleSubmit, reset } = useForm();

    const onSubmit = async (data) => {
        const requestData = {
            ...data,
            requesterName: user?.displayName,
            requesterEmail: user?.email,
            status: "pending"
        };

        try {
            // Backend-e axios diye POST request pathano hocche
            const res = await axios.post('http://localhost:5000/donation-requests', requestData);
            
            if (res.data.insertedId) {
                Swal.fire({
                    position: "center",
                    icon: "success",
                    title: "Donation Request Created Successfully!",
                    showConfirmButton: false,
                    timer: 1500
                });
                reset();
            }
        } catch (error) {
            console.error("Error creating donation request:", error);
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Something went wrong while creating the request!"
            });
        }
    };

    return (
        <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-md border border-gray-100">
            <h2 className="text-3xl font-bold text-center text-red-600 mb-6">Create Donation Request</h2>
            
            <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Recipient Name */}
                <div className="form-control">
                    <label className="label font-semibold"><span className="label-text">Recipient Name</span></label>
                    <input type="text" {...register("recipientName", { required: true })} className="input input-bordered w-full" placeholder="Who needs blood?" />
                </div>

                {/* Blood Group */}
                <div className="form-control">
                    <label className="label font-semibold"><span className="label-text">Blood Group</span></label>
                    <select {...register("bloodGroup", { required: true })} className="select select-bordered w-full">
                        <option value="">Select Group</option>
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

                {/* Hospital Name */}
                <div className="form-control">
                    <label className="label font-semibold"><span className="label-text">Hospital Name</span></label>
                    <input type="text" {...register("hospitalName", { required: true })} className="input input-bordered w-full" placeholder="Where to donate?" />
                </div>

                {/* Full Address */}
                <div className="form-control">
                    <label className="label font-semibold"><span className="label-text">Full Address</span></label>
                    <input type="text" {...register("fullAddress", { required: true })} className="input input-bordered w-full" placeholder="Hospital full address" />
                </div>

                {/* Donation Date */}
                <div className="form-control">
                    <label className="label font-semibold"><span className="label-text">Donation Date</span></label>
                    <input type="date" {...register("donationDate", { required: true })} className="input input-bordered w-full" />
                </div>

                {/* Donation Time */}
                <div className="form-control">
                    <label className="label font-semibold"><span className="label-text">Donation Time</span></label>
                    <input type="time" {...register("donationTime", { required: true })} className="input input-bordered w-full" />
                </div>

                {/* Request Message (Full width) */}
                <div className="form-control col-span-1 md:col-span-2">
                    <label className="label font-semibold"><span className="label-text">Why is blood needed? (Message)</span></label>
                    <textarea {...register("requestMessage", { required: true })} className="textarea textarea-bordered h-24" placeholder="Briefly describe the situation..."></textarea>
                </div>

                {/* Submit Button */}
                <div className="col-span-1 md:col-span-2 mt-4">
                    <button type="submit" className="btn btn-error w-full text-white text-lg">Request Blood</button>
                </div>
            </form>
        </div>
    );
};

export default CreateDonationRequest;