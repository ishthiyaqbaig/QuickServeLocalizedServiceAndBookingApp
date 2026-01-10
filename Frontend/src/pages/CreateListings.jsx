import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Upload, ChevronLeft } from "lucide-react";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Navbar } from "../components/layout/Navbar";
import { Select } from "../components/ui/Select";
import { createListing } from "../services/providerService";
import { getCategories } from "../services/categoryService";
import { toast } from "sonner";

export default function CreateListing() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [file, setFile] = useState(null);
  const [categories, setCategories] = useState([]);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    categoryId: "",
  });

  // Fetch categories on load
  useEffect(() => {
    getCategories()
      .then((data) => {
        const normalized = Array.isArray(data) ? data : [];
        setCategories(normalized);

        // set first category by default
        if (normalized.length > 0) {
          setFormData((prev) => ({
            ...prev,
            categoryId: normalized[0].id,
          }));
        } else {
          setFormData((prev) => ({
            ...prev,
            categoryId: "",
          }));
        }
      })
      .catch((err) => console.error("Failed to load categories", err));
  }, []);

  const handleImageChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setImagePreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const providerId = localStorage.getItem("userId");

      if (!providerId) {
        navigate("/login");
        return;
      }

      const form = new FormData();
      form.append("title", formData.title);
      form.append("description", formData.description);
      form.append("price", formData.price);

      if (categories.length > 0 && formData.categoryId) {
        form.append("categoryId", formData.categoryId);
      }

      // Only append location if fetched; prevent sending empty strings for doubles

      if (file) form.append("image", file);

      await createListing(providerId, form);
      toast.success("Listing created successfully!");
      navigate("/provider/dashboard");
    } catch (error) {
      console.error("Failed to create listing:", error);
      const msg = error.response?.data?.message || "Failed to create listing";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar showAuthButtons={false} />

      <main className="max-w-3xl mx-auto px-4 py-32">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-500 font-black text-sm uppercase mb-8 hover:text-indigo-600 transition-colors"
        >
          <ChevronLeft size={18} /> Back to Dashboard
        </button>

        <div className="glass p-12 rounded-[3.5rem] border-white/60 relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-indigo-500/5 rounded-full pointer-events-none" />

          <div className="mb-12">
            <h1 className="text-4xl font-black text-gray-900 mb-2 tracking-tight">
              Create <span className="text-gradient">Service</span>
            </h1>
            <p className="text-gray-500 font-medium">
              Add a new listing to your professional profile.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-10">
            {/* Image Upload Area */}
            <div className="space-y-3">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">
                Service Banner
              </label>
              <div className="relative group overflow-hidden rounded-[2.5rem] h-64 glass border-2 border-dashed border-white/60 hover:border-indigo-400/50 transition-all duration-500">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
                    <div className="w-16 h-16 bg-white/60 rounded-2xl flex items-center justify-center shadow-lg mb-4 group-hover:scale-110 transition-transform">
                      <Upload className="text-indigo-500" />
                    </div>
                    <p className="font-black text-xs uppercase tracking-tighter">
                      Click or drag image to upload
                    </p>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="absolute inset-0 opacity-0 cursor-pointer z-10"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Input
                label="Title"
                placeholder="Expert AC Service"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
              />

              <Select
                label="Category"
                options={categories.map((c) => ({
                  value: c.id,
                  label: c.name,
                }))}
                value={formData.categoryId}
                onChange={(e) =>
                  setFormData({ ...formData, categoryId: e.target.value })
                }
              />
            </div>

            <div className="space-y-3">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">
                Description
              </label>
              <textarea
                rows={4}
                className="w-full glass p-6 rounded-[2rem] border-white/60 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-gray-700 font-medium placeholder:text-gray-300 resize-none"
                placeholder="Describe what you offer in detail..."
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                required
              />
            </div>

            <Input
              label="Price (₹)"
              type="number"
              placeholder="500"
              value={formData.price}
              onChange={(e) =>
                setFormData({ ...formData, price: e.target.value })
              }
              required
            />

            <Button
              type="submit"
              size="lg"
              className="w-full rounded-[2rem] h-18 text-lg font-black shadow-xl shadow-indigo-100 mt-4"
              disabled={loading}
            >
              {loading ? "POSTING..." : "PUBLISH SERVICE"}
            </Button>
          </form>
        </div>
      </main>
    </div>
  );
}
