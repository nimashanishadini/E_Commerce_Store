import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!formData.email || !formData.password) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);

    const result = await login(formData.email, formData.password);

    if (result.success) {
      toast.success("Login successful!");
      navigate(from, { replace: true });
    } else {
      toast.error(result.message || "Login failed");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side */}
      <div className="flex-1 bg-gradient-to-br from-purple-900 via-purple-800 to-purple-900 relative overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-32 h-32 border-2 border-white rounded-lg rotate-12"></div>
          <div className="absolute bottom-32 right-20 w-24 h-24 border border-white rounded-full"></div>
          <div className="absolute top-1/2 right-1/3 w-16 h-16 bg-white/10 rounded-lg rotate-45"></div>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-pink-500/20 to-transparent rounded-full -translate-y-32 translate-x-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-blue-500/20 to-transparent rounded-full translate-y-24 -translate-x-24"></div>
        <div className="relative z-10 text-center text-white px-12 max-w-md">
          <div className="mb-8">
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mb-4 mx-auto">
              <div className="w-6 h-6 bg-white rounded-sm"></div>
            </div>
          </div>
          <h1 className="text-5xl font-bold mb-6">Welcome!</h1>
          <p className="text-purple-200 text-lg leading-relaxed mb-8">
            Please login to access your dashboard.
          </p>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 bg-white flex items-center justify-center px-8 lg:px-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Sign in</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-600 mb-2">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-100 border-0 rounded-lg focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all duration-200 text-gray-900 placeholder-gray-500"
                placeholder="Email address"
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-600 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 pr-12 bg-gray-100 border-0 rounded-lg focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all duration-200 text-gray-900 placeholder-gray-500"
                  placeholder="••••••••••"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-4 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-semibold py-4 rounded-lg transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Signing in..." : "Submit"}
            </button>

            {/* Register Link */}
            <div className="text-center mt-6">
              <p className="text-gray-600">
                Don&apos;t have an account?{" "}
                <Link
                  to="/register"
                  className="font-medium text-purple-600 hover:text-purple-700 transition-colors duration-200"
                >
                  Create a new account
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
