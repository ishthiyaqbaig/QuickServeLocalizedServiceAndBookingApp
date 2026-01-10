import { useState, useEffect } from "react";
import { Navbar } from "../components/layout/NavBar";
import {
  approveListing,
  rejectListing,
  getUsers,
  createCategory,
  getTopCategories,
  getTopServices,
  getPendingListings,
  getAprovedListings,
  getCategories,
  deleteCategory,
} from "../services/adminService";
import { Button } from "../components/ui/Button";
import {
  CheckCircle,
  XCircle,
  BarChart3,
  ListPlus,
  User as UserIcon,
  Mail,
  Trash2,
} from "lucide-react";
import { Input } from "../components/ui/Input";
import { jwtDecode } from "jwt-decode";
import { toast } from "sonner";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("analytics");
  const [pendingListings, setPendingListings] = useState([]);
  const [aprovedListings, setAprovedListings] = useState([]);
  const [users, setUsers] = useState([]);
  const [topCategories, setTopCategories] = useState([]);
  const [topServices, setTopServices] = useState([]);
  const [categories, setCategories] = useState([]);

  // Category Form State
  const [categoryForm, setCategoryForm] = useState({
    name: "",
    description: "",
  });

  const getAdminId = () => {
    const token = localStorage.getItem("authToken");
    if (token) {
      const decoded = jwtDecode(token);
      return decoded.userId || 1; // Fallback to 1 if not present
    }
    return 1;
  };

  useEffect(() => {
    if (activeTab === "analytics") {
      fetchAnalytics();
      fetchPendingListings();
    } else if (activeTab === "listings") {
      fetchListings();
    } else if (activeTab === "users") {
      fetchUsers();
    } else if (activeTab === "categories") {
      fetchCategories();
    }
  }, [activeTab]);

  const fetchCategories = async () => {
    const categorie = await getCategories();
    setCategories(categorie);
  };

  const handleDeleteCategory = async (categoryId) => {
    try {
      // Assuming there's a deleteCategory service function
      await deleteCategory(categoryId);
      toast.success("Category deleted successfully");
      fetchCategories();
    } catch (error) {
      toast.error("Failed to delete category");
    }
  }

  const fetchAnalytics = async () => {
    try {
      const [categoriesData, servicesData] = await Promise.all([
        getTopCategories(),
        getTopServices(),
      ]);
      setTopCategories(categoriesData);
      setTopServices(servicesData);
    } catch (error) {
      console.error(error);
      // toast.error('Failed to fetch analytics'); // Squelch initial error if endpoints not ready
    }
  };

  const fetchListings = async () => {
    try {
      const aprovedListing = await getAprovedListings();
      setAprovedListings(aprovedListing);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch listings");
    }
  };
  const fetchPendingListings = async () => {
    try {
      const pListings = await getPendingListings();
      setPendingListings(pListings);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch listings");
    }
  };
  const fetchUsers = async () => {
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch users");
    }
  };

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    try {
      const id = getAdminId();
      await createCategory(categoryForm, id);
      fetchCategories();
      toast.success("Category created successfully");
      setCategoryForm({ name: "", description: "" });
    } catch (error) {
      toast.error("Failed to create category");
    }
  };

  const handleApprove = async (id) => {
    try {
      await approveListing(id, getAdminId());
      toast.success("Listing approved");
      fetchListings();
      fetchPendingListings();
    } catch (error) {
      toast.error("Failed to approve listing");
    }
  };

  const handleReject = async (id) => {
    try {
      await rejectListing(id, getAdminId());
      toast.success("Listing rejected");
      fetchListings();
      fetchPendingListings();
    } catch (error) {
      toast.error("Failed to reject listing");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <div className="flex-1 max-w-7xl mx-auto w-full p-6 mt-16">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <div className="flex space-x-2 bg-white p-1 rounded-xl shadow-sm border border-gray-100 overflow-x-auto">
            <button
              onClick={() => setActiveTab("analytics")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                activeTab === "analytics"
                  ? "bg-indigo-600 text-white shadow-md"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              Analytics
            </button>
            <button
              onClick={() => setActiveTab("listings")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                activeTab === "listings"
                  ? "bg-indigo-600 text-white shadow-md"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              Listings
            </button>
            <button
              onClick={() => setActiveTab("categories")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                activeTab === "categories"
                  ? "bg-indigo-600 text-white shadow-md"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              Categories
            </button>
            <button
              onClick={() => setActiveTab("users")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                activeTab === "users"
                  ? "bg-indigo-600 text-white shadow-md"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              Users
            </button>
          </div>
        </div>

        {activeTab === "analytics" && (
          <div className="flex flex-col gap-8">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-6">
                Listing Approvals
              </h2>
              <div className="grid gap-6">
                {pendingListings.length === 0 ? (
                  <p className="text-center text-gray-500 py-10">
                    No listings found.
                  </p>
                ) : (
                  pendingListings.map((listing) => (
                    <div
                      key={listing.id}
                      className="border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-all flex flex-col md:flex-row gap-6"
                    >
                      <img
                        src={listing.images}
                        alt={listing.title}
                        className="w-full md:w-48 h-32 object-cover rounded-xl"
                      />
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-lg font-bold text-gray-900">
                              {listing.title}
                            </h3>
                            <p className="text-gray-500 mt-1">
                              {listing.description}
                            </p>
                            <p className="text-sm font-medium text-indigo-600 mt-2">
                              ${listing.price}
                            </p>
                          </div>
                        </div>
                      </div>
                      {!listing.isApproved && ( // Show buttons if not approved
                        <div className="flex flex-col gap-2 justify-center">
                          <Button
                            onClick={() => handleApprove(listing.id)}
                            variant="primary"
                            className="bg-green-600 hover:bg-green-700 shadow-sm"
                          >
                            <CheckCircle className="w-4 h-4 mr-2" /> Approve
                          </Button>
                          <Button
                            onClick={() => handleReject(listing.id)}
                            variant="danger"
                            className="bg-red-600 hover:bg-red-700 text-white shadow-sm"
                          >
                            <XCircle className="w-4 h-4 mr-2" /> Reject
                          </Button>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <BarChart3 className="text-indigo-600" /> Top Categories
              </h2>
              <div className="space-y-4">
                {topCategories.length === 0 ? (
                  <p className="text-gray-500">No data available</p>
                ) : (
                  topCategories.map((cat) => (
                    <div
                      key={cat.id}
                      className="flex justify-between items-center p-4 bg-gray-50 rounded-xl"
                    >
                      <span className="font-medium text-gray-700">
                        {cat.name}
                      </span>
                      <span className="font-bold text-indigo-600">
                        {cat.bookings} Bookings
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <BarChart3 className="text-purple-600" /> Top Services
              </h2>
              <div className="space-y-4">
                {topServices.length === 0 ? (
                  <p className="text-gray-500">No data available</p>
                ) : (
                  topServices.map((service) => (
                    <div
                      key={service.id}
                      className="flex justify-between items-center p-4 bg-gray-50 rounded-xl"
                    >
                      <span className="font-medium text-gray-700">
                        {service.name}
                      </span>
                      <span className="font-bold text-purple-600">
                        {service.bookings} Bookings
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === "categories" && (
          <div className="md:flex gap-20 justify-between">
            <div className=" md:w-1/2 h-100 mb-2 bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <ListPlus className="text-indigo-600" /> Create Category
              </h2>
              <form onSubmit={handleCreateCategory} className="space-y-6">
                <Input
                  label="Category Name"
                  value={categoryForm.name}
                  onChange={(e) =>
                    setCategoryForm({ ...categoryForm, name: e.target.value })
                  }
                  placeholder="e.g., Plumbing"
                />
                <Input
                  label="Description"
                  value={categoryForm.description}
                  onChange={(e) =>
                    setCategoryForm({
                      ...categoryForm,
                      description: e.target.value,
                    })
                  }
                  placeholder="Service description..."
                />
                <Button type="submit" className="w-full">
                  Create Category
                </Button>
              </form>
            </div>
            <div className="md:w-1/2 bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <ListPlus className="text-indigo-600" /> ALL Category
              </h2>
              <div>
                {categories.length === 0 ? (
                  <p className="text-center text-gray-500 py-10">
                    No categories found.
                  </p>
                ) : (
                  categories.map((category) => (
                    <div
                      key={category.id}
                      className="border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-all flex flex-col md:flex-row gap-6 mb-4"
                    >
                      <div className="flex space-x-4 justify-between w-full">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">
                          {category.name}
                        </h3>
                        <p className="text-gray-500 mt-1">
                          {category.description}
                        </p>
                      </div>
                        
                        <button
                        onClick={() => handleDeleteCategory(category.id)}
                        className="p-3 bg-white/90 backdrop-blur-sm text-rose-600 rounded-xl shadow-lg hover:bg-white transition-colors cursor-pointer"
                      >
                        <Trash2 size={18} />
                      </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === "listings" && (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6">
              All Listings
            </h2>
            <div className="grid gap-6">
              {aprovedListings.length === 0 ? (
                <p className="text-center text-gray-500 py-10">
                  No listings found.
                </p>
              ) : (
                aprovedListings.map((listing) => (
                  <div
                    key={listing.id}
                    className="border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-all flex flex-col md:flex-row gap-6"
                  >
                    <img
                      src={listing.images}
                      alt={listing.title}
                      className="w-full md:w-48 h-32 object-cover rounded-xl"
                    />
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">
                            {listing.title}
                          </h3>
                          <p className="text-gray-500 mt-1">
                            {listing.description}
                          </p>
                          <p className="text-sm font-medium text-indigo-600 mt-2">
                            ${listing.price}
                          </p>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold ${
                            listing.isApproved === true
                              ? "bg-green-100 text-green-700"
                              : listing.isApproved === false
                              ? "bg-red-100 text-red-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {listing.isApproved === true
                            ? "APPROVED"
                            : listing.isApproved === false
                            ? "REJECTED"
                            : "PENDING"}
                          {/* Assuming backend returns boolean isApproved based on provided JSON example which has isApproved: true */}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === "users" && (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6">
              Users Directory
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="pb-4 font-semibold text-gray-500 pl-4">
                      User
                    </th>
                    <th className="pb-4 font-semibold text-gray-500">Role</th>
                    <th className="pb-4 font-semibold text-gray-500">Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr
                      key={user.id}
                      className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
                    >
                      <td className="py-4 pl-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
                            <UserIcon className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="font-bold text-gray-900">
                              {user.userName}
                            </p>
                            <div className="flex items-center text-gray-500 text-sm">
                              <Mail className="w-3 h-3 mr-1" />
                              {user.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4">
                        <span className="px-3 py-1 bg-gray-100 rounded-full text-xs font-medium text-gray-600">
                          {user.role}
                        </span>
                      </td>
                      <td className="py-4 text-gray-500 text-sm">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

