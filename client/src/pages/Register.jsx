import { useState } from "react";
import { Eye, EyeOff, Facebook, Instagram } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post("http://localhost:5000/api/auth/register", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      alert("Registration successful!");
      navigate("/login");
    } catch (error) {
      alert(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Welcome Section */}
      <div className="flex-1 bg-gradient-to-br from-purple-900 via-purple-800 to-pink-600 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-32 h-32 bg-white bg-opacity-5 rounded-full" />
          <div className="absolute top-40 right-20 w-24 h-24 bg-white bg-opacity-10 rounded-full" />
          <div className="absolute bottom-32 left-32 w-20 h-20 bg-white bg-opacity-5 rounded-full" />
          <div className="absolute bottom-20 right-40 w-16 h-16 bg-white bg-opacity-10 rounded-full" />
        </div>
        <div className="relative z-10 flex flex-col justify-center h-full px-16">
          <div className="mb-12">
            <div className="w-12 h-8 bg-white bg-opacity-20 rounded flex items-center justify-center">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-white rounded-full" />
                <div className="w-2 h-2 bg-white rounded-full" />
              </div>
            </div>
          </div>
          <h1 className="text-5xl font-bold text-white mb-8">Welcome!</h1>
          <p className="text-white text-opacity-80 text-lg leading-relaxed mb-12 max-w-md">
            Register today and start your journey with us!
          </p>
          <button className="bg-gradient-to-r from-orange-400 to-pink-500 text-white px-8 py-3 rounded-full font-medium hover:from-orange-500 hover:to-pink-600 transition-all duration-200 shadow-lg w-fit">
            Learn More
          </button>
        </div>
      </div>

      {/* Right Side - Registration Form */}
      <div className="flex-1 max-w-md bg-white bg-opacity-10 backdrop-blur-sm flex items-center justify-center">
        <div className="w-full max-w-sm px-8 py-8">
          <h2 className="text-2xl font-semibold text-black mb-6 text-center">Sign up</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-sm mb-2 text-black">Full Name</label>
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full bg-white bg-opacity-20 text-black placeholder-black border border-opacity-30 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-white"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm mb-2 text-black">Email</label>
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full bg-white bg-opacity-20 text-black placeholder-black border border-opacity-30 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-white"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm mb-2 text-black">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full bg-white bg-opacity-20 text-black placeholder-black border border-opacity-30 rounded-lg px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-black"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm mb-2 text-black">Confirm Password</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="w-full bg-white bg-opacity-20 text-black placeholder-black border border-opacity-30 rounded-lg px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-white"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-black"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-orange-400 to-pink-500 text-white py-3 rounded-lg font-medium hover:from-orange-500 hover:to-pink-600 transition duration-200 shadow-lg disabled:opacity-50"
            >
              {loading ? "Creating..." : "Register"}
            </button>
          </form>

          {/* Social Media Icons */}
          <div className="flex justify-center space-x-4 mt-6">
            <Facebook size={18} className="text-black" />
            <Instagram size={18} className="text-black" />
            <div className="w-4 h-4 bg-black rounded-full" />
          </div>

          <div className="text-center mt-6">
            <p className="text-black text-sm">
              Already have an account?{" "}
              <a href="/login" className="text-blue-600 hover:underline">
                Sign in
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
