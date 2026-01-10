import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { jwtDecode } from "jwt-decode";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Select } from "../components/ui/Select";
import { login } from "../services/authService";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

export default function Login() {
  const navigate = useNavigate();
  const [role, setRole] = useState("CUSTOMER");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const { login: authLogin } = useAuth(); // Get login function from context

  const handleSubmit = (e) => {
    e.preventDefault();
    setApiError("");
    setLoading(true);
    if (!validateForm()) return;

    const loginData = { ...formData, role };

    login(loginData)
      .then((data) => {
        if (data.token) {
          // Use context login to update global state
          authLogin(data.token);

          // Extra items used by other parts of the app (legacy support if needed, but Context is better)
          localStorage.setItem("userId", jwtDecode(data.token).userId);
          localStorage.setItem("userRole", jwtDecode(data.token).role || role);

          toast.success("Login successful!");

          const userRole = jwtDecode(data.token).role || role;
          if (userRole === "SERVICE_PROVIDER") {
            navigate("/provider/dashboard");
          } else if (userRole === "ADMIN") {
            navigate("/admin/dashboard");
          } else {
            navigate("/customer/search");
          }
        }
      })
      .catch((error) => {
        setApiError(
          error.response?.data?.message ||
          "Login failed. Please check your credentials."
        );

      });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 flex items-center justify-center p-6 mt-1">
        <div className="max-w-xl w-full glass p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-40 h-40 bg-indigo-500/10 rounded-full blur-2xl" />
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 text-gray-600 hover:text-blue-600 rounded-full bg-gray-200 mb-1 shadow shadow-blue-400 cursor-pointer"
          >
            <ArrowLeft size={18} />
          </button>
          <div className="relative text-center mb-10">
            <div className="  flex items-center justify-center mx-auto mb-6 shadow-xl shadow-indigo-200 bg-linear-to-r from-indigo-800 to-purple-600 p-1 rounded-b-full">
              <img
                src="/quickserve-logo-transparent.png"
                alt="Quick Serve Logo"
                className="h-10 w-36 "
              />
            </div>
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              Welcome Back
            </h2>
            <p className="mt-2 text-gray-500">
              Sign in to continue your journey
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit} noValidate>
            {apiError && (
              <div className="bg-red-50/50 backdrop-blur-sm border border-red-100 text-red-500 p-4 rounded-xl text-sm text-center font-medium animate-shake">
                {apiError}
              </div>
            )}

            <div className="space-y-5">
              <Select
                label="I am a"
                options={[
                  { value: "CUSTOMER", label: "Customer" },
                  { value: "SERVICE_PROVIDER", label: "Service Provider" },
                ]}
                value={role}
                onChange={(e) => setRole(e.target.value)}
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
            </div>
            <Button 
            disabled={loading}
            type="submit" size="lg" className="w-full">
              {loading ? "Sign In..." : "Sign In"}
            </Button>

            <div className="text-center text-sm text-gray-500 font-medium">
              Don&apos;t have an account?{" "}
              <Link
                to="/signup"
                className="text-indigo-600 hover:text-indigo-700 font-bold hover:underline decoration-2 underline-offset-4 transition-all"
              >
                Sign up now
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
