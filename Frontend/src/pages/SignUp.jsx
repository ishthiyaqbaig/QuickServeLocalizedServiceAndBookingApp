import  { useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate, Link } from "react-router-dom";
import {
  User,
  Briefcase,
  CheckCircle2,
  ArrowLeft,
} from "lucide-react";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { register } from "../services/authService";
import { toast } from "sonner";

export default function SignUp() {
  const navigate = useNavigate();
  const [role, setRole] = useState("CUSTOMER");
  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.userName.trim()) {
      newErrors.userName = "Username is required";
    } else if (formData.userName.length < 2) {
      newErrors.userName = "Username must be at least 2 characters";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    const passwordRegex =
      /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (!passwordRegex.test(formData.password)) {
      newErrors.password = "Must be 8+ chars, 1 upper, 1 number, 1 special";
    }

    if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setApiError("");
    setLoading(true);
    if (!validateForm()){
      setLoading(false);
      return
    }

    const userData = {
      ...formData,
      role: role === "CUSTOMER" ? "CUSTOMER" : "SERVICE_PROVIDER",
    };

    register(userData)
      .then((data) => {
        if (data.token) {
          localStorage.setItem("authToken", data.token);
          const decoded = jwtDecode(data.token);
          localStorage.setItem("userId", decoded.userId);
          localStorage.setItem("userRole", decoded.role);
        }
        localStorage.setItem("userName", formData.userName);
        role === "SERVICE_PROVIDER"
          ? navigate("/provider/profile")
          : navigate("/customer/search");
      })
      .catch((error) => {
        setLoading(false);
        setApiError(
          error.response?.data?.message ||
            "Registration failed. Please try again."
        );
      });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 flex items-center justify-center p-3 mt-1 pb-10">
        <div className="max-w-xl w-150 glass p-6 md:p-14 rounded-[3rem] shadow-2xl relative overflow-hidden">
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 text-gray-600 hover:text-blue-600 rounded-full bg-gray-200 mb-1 shadow shadow-blue-400 cursor-pointer"
          >
            <ArrowLeft size={18} />
          </button>
          <div className="relative text-center mb-6">
            <div className="  flex items-center justify-center mx-auto mb-6 shadow-xl shadow-indigo-200 bg-linear-to-r from-indigo-800 to-purple-600 p-1 rounded-b-full">
              <img
                src="/quickserve-logo-transparent.png"
                alt="Quick Serve Logo"
                className="h-10 w-36 "
              />
            </div>
            <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">
              Create Account
            </h2>
            <p className="mt-2 text-gray-500">Join the Quick Serve community</p>
          </div>

          <form className="space-y-2" onSubmit={handleSubmit} noValidate>
            {apiError && (
              <div className="bg-red-50/50 backdrop-blur-sm border border-red-100 text-red-500 p-4 rounded-xl text-sm text-center font-medium">
                {apiError}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div
                onClick={() => setRole("CUSTOMER")}
                className={`group cursor-pointer p-2 rounded-2xl border-2 flex flex-col items-center gap-1 transition-all duration-300 ${
                  role === "CUSTOMER"
                    ? "border-indigo-600 bg-indigo-50/50 shadow-lg shadow-indigo-100"
                    : "border-white/40 bg-white/30 hover:bg-white/50 hover:border-indigo-200"
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-xl flex items-center justify-center transition-colors ${
                    role === "CUSTOMER"
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-100 text-gray-400 group-hover:bg-indigo-100 group-hover:text-indigo-600 font-bold"
                  }`}
                >
                  <User size={30} />
                </div>
                <span
                  className={`font-bold tracking-wide ${
                    role === "CUSTOMER" ? "text-indigo-900" : "text-gray-500"
                  }`}
                >
                  CUSTOMER
                </span>
                
              </div>

              <div
                onClick={() => setRole("SERVICE_PROVIDER")}
                className={`group cursor-pointer p-2 rounded-2xl border-2 flex flex-col items-center gap- transition-all duration-300 ${
                  role === "SERVICE_PROVIDER"
                    ? "border-indigo-600 bg-indigo-50/50 shadow-lg shadow-indigo-100"
                    : "border-white/40 bg-white/30 hover:bg-white/50 hover:border-indigo-200"
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-xl flex items-center justify-center transition-colors ${
                    role === "SERVICE_PROVIDER"
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-100 text-gray-400 group-hover:bg-indigo-100 group-hover:text-indigo-600 font-bold"
                  }`}
                >
                  <Briefcase size={30} />
                </div>
                <span
                  className={`font-bold tracking-wide ${
                    role === "SERVICE_PROVIDER"
                      ? "text-indigo-900"
                      : "text-gray-500"
                  }`}
                >
                  PROVIDER
                </span>
                {role === "SERVICE_PROVIDER" && (
                  <CheckCircle2
                    size={20}
                    className="text-indigo-600 absolute top-2 right-2"
                  />
                )}
              </div>
            </div>

            <div className="space-y-1">
              <Input
                label="Username"
                type="text"
                placeholder="Your full name"
                value={formData.userName}
                onChange={(e) =>
                  setFormData({ ...formData, userName: e.target.value })
                }
                error={errors.userName}
              />
              <Input
                label="Email Address"
                type="email"
                placeholder="john@example.com"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                error={errors.email}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  error={errors.password}
                />
                <Input
                  label="Confirm Password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      confirmPassword: e.target.value,
                    })
                  }
                  error={errors.confirmPassword}
                />
              </div>
              <p className="text-xs text-gray-400 mt-1 font-medium bg-indigo-50/50 p-3 rounded-lg border border-indigo-100/50">
                <span className="text-indigo-600 font-bold mr-1">Tip:</span> Use
                8+ chars with a mix of uppercase, numbers, and symbols for a
                strong password.
              </p>
            </div>
            <Button
            disabled={loading}
              type="submit"
              size="md"
              className="w-full h-10 text-xl shadow-xl shadow-indigo-100"
            >
              Create {role === "CUSTOMER" ? "Customer" : "Provider"} Account
            </Button>

            <div className="text-center text-sm text-gray-500 font-medium">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-indigo-600 hover:text-indigo-700 font-bold hover:underline decoration-2 underline-offset-4 transition-all"
              >
                Log in instead
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
