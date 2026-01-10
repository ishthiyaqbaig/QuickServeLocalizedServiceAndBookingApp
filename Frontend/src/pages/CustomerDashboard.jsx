import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { searchProviders } from "../services/customerService";
import { getCategories } from "../services/categoryService";
import {
  getBookingsByCustomer,
  customerCancelBooking,
} from "../services/bookingService";
import { submitReview, getReviewsByBooking } from "../services/reviewService";
import BookingModal from "../components/BookingModal";
import ReviewModal from "../components/ReviewModal";
import {
  Calendar,
  Search,
  MapPin,
  Clock,
  Star,
  CheckCircle,
  Bell,
  History,
  AlertCircle,
} from "lucide-react";
import NotificationsTab from "../components/NotificationsTab";
import { toast } from "sonner";
import { Navbar } from "../components/layout/Navbar";

const CustomerDashboard = () => {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [location, setLocation] = useState(null);
  const [locationStatus, setLocationStatus] = useState("Enable Location");
  const [address, setAddress] = useState("");

  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [selectedServiceForBooking, setSelectedServiceForBooking] =
    useState(null);

  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedBookingForReview, setSelectedBookingForReview] =
    useState(null);

  const [activeTab, setActiveTab] = useState("search");
  const [activeBookingsTab, setActiveBookingsTab] = useState("active");

  const [myBookings, setMyBookings] = useState([]);
  const [reviewsMap, setReviewsMap] = useState({});
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const hasAutoPrompted = useRef(false);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const getLocation = async () => {
    if (!navigator.geolocation) {
      setLocationStatus("Not supported");
      toast.error("Your browser does not support geolocation.");
      return;
    }

    setLocationStatus("Requesting...");

    // Check existing permissions to see if we are already blocked
    if (navigator.permissions) {
      try {
        const result = await navigator.permissions.query({
          name: "geolocation",
        });
        if (result.state === "denied") {
          setLocationStatus("Access Blocked");
          toast.error(
            "Location is blocked. Please enable it in browser settings (click the lock icon in URL bar).",
            {
              duration: 5000,
            }
          );
          return;
        }
      } catch (err) {
        console.warn("Permissions API not supported for geolocation here.");
      }
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        setLocation({ lat, lng });

        // Call the Reverse Geocoding API
        fetch(
          `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`
        )
          .then((res) => res.json())
          .then((data) => {
            // Extract specific parts like suburb or city
            const suburb =
              data.address.suburb || data.address.neighbourhood || "";
            const city = data.address.city || data.address.town || "Indore";
            const displayString = suburb ? `${suburb}, ${city}` : city;

            setAddress(displayString);
            setLocationStatus(displayString);
          })
          .catch(() => {
            setLocationStatus("Located 📍"); // Still located even if name fails
          });
      },
      (err) => {
        if (err.code === 1) {
          // PERMISSION_DENIED
          setLocationStatus("Access denied");
          toast.error("Please allow location access to find nearby experts.");
        } else {
          setLocationStatus("Error finding you");
          toast.error("Could not determine your location.");
        }
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleSearch = async () => {
    if (!location) {
      toast.error("Click the Location icon to enable GPS search.");
      return;
    }
    if (!selectedCategory) {
      toast.error("Please select a service category.");
      return;
    }
    setLoading(true);
    try {
      const data = await searchProviders(
        location.lat,
        location.lng,
        selectedCategory
      );
      setServices(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch services.");
    } finally {
      setLoading(false);
    }
  };

  // Initial Load
  useEffect(() => {
    getCategories().then(setCategories).catch(console.error);
    // Optional: Auto-prompt on load
    getLocation();
  }, []);

  const userId = localStorage.getItem("userId");
  const userName = localStorage.getItem("userName") || "Customer";

  const fetchReviewsAndCheckPrompt = async (bookings) => {
    if (!bookings || bookings.length === 0) return;
    const completedBookings = bookings.filter((b) => b.status === "COMPLETED");
    const newReviewsMap = { ...reviewsMap };
    let foundUnreviewed = null;

    await Promise.all(
      completedBookings.map(async (b) => {
        try {
          const reviews = await getReviewsByBooking(b.bookingId);
          if (reviews && reviews.length > 0) {
            newReviewsMap[b.bookingId] = reviews[0];
          } else if (!foundUnreviewed) {
            foundUnreviewed = b;
          }
        } catch (error) {
          console.error("Failed to fetch review for " + b.bookingId);
        }
      })
    );

    setReviewsMap((prev) => ({ ...prev, ...newReviewsMap }));

    if (foundUnreviewed && !hasAutoPrompted.current) {
      hasAutoPrompted.current = true;
      setSelectedBookingForReview(foundUnreviewed.bookingId);
      setReviewModalOpen(true);
    }
  };

  const fetchReviewForBooking = async (bookingId) => {
    try {
      const reviews = await getReviewsByBooking(bookingId);
      if (reviews && reviews.length > 0) {
        setReviewsMap((prev) => ({ ...prev, [bookingId]: reviews[0] }));
      }
    } catch (err) {
      console.error("Error fetching review for booking " + bookingId, err);
    }
  };

  useEffect(() => {
    if (userId) {
      getBookingsByCustomer(userId)
        .then((bookings) => {
          const sorted = (bookings || []).sort(
            (a, b) => b.bookingId - a.bookingId
          );
          setMyBookings(sorted);
          fetchReviewsAndCheckPrompt(sorted);
        })
        .catch(console.error);
    }
  }, [userId]);

  useEffect(() => {
    if (activeTab === "bookings" && userId) {
      setLoadingBookings(true);
      getBookingsByCustomer(userId)
        .then((bookings) => {
          const sorted = (bookings || []).sort(
            (a, b) => b.bookingId - a.bookingId
          );
          setMyBookings(sorted);
          fetchReviewsAndCheckPrompt(sorted);
        })
        .catch(console.error)
        .finally(() => setLoadingBookings(false));
    }
  }, [activeTab, userId]);

  const handleCancelBooking = async (bookingId) => {
    if (window.confirm("Cancel this booking?")) {
      try {
        await customerCancelBooking(bookingId);
        setMyBookings((prev) =>
          prev.map((b) =>
            b.bookingId === bookingId ? { ...b, status: "CANCELLED" } : b
          )
        );
        toast.success("Booking cancelled.");
      } catch (err) {
        toast.error("Only PENDING bookings can be cancelled.");
      }
    }
  };

  const handleReviewSubmit = async (bookingId, rating, comment) => {
    try {
      await submitReview(bookingId, rating, comment);
      await fetchReviewForBooking(bookingId);
      toast.success("Review submitted successfully!");
    } catch (err) {
      toast.error("Failed to submit review.");
    }
  };

  const handleNotificationClick = (targetTab) => {
    setActiveTab("bookings");
    if (targetTab === "history") {
      setActiveBookingsTab("history");
    }
  };

  const getCategoryName = (id) =>
    categories.find((c) => c.id === id)?.name || `Category ${id}`;

  const activeBookingsList = myBookings.filter((b) =>
    ["PENDING", "CONFIRMED"].includes(b.status)
  );
  const historyBookingsList = myBookings.filter((b) =>
    ["COMPLETED", "CANCELLED", "REJECTED"].includes(b.status)
  );

  const displayedBookings =
    activeBookingsTab === "active" ? activeBookingsList : historyBookingsList;

  return (
    <div className="min-h-screen">
      <Navbar showAuthButtons={false} onLogout={handleLogout} />

      <main className="max-w-7xl mx-auto px-4 py-32">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
            Hello, <span className="text-gradient">{userName}</span>
          </h1>
          <p className="text-gray-500 text-lg">
            Find the best local experts or manage your bookings.
          </p>
        </div>

        {/* TABS CONTROLLER */}
        <div className="sm:flex gap-2 p-1.5 glass rounded-2xl sm:w-fit mb-12 shadow-inner">
          <button
            onClick={() => setActiveTab("search")}
            className={`flex items-center w-full md:w-auto gap-2 px-8 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${
              activeTab === "search"
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200"
                : "text-gray-500 hover:text-indigo-600 hover:bg-white/50"
            }`}
          >
            <Search size={18} /> Find Services
          </button>
          <button
            onClick={() => setActiveTab("bookings")}
            className={`flex items-center w-full md:w-auto gap-2 px-8 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${
              activeTab === "bookings"
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200"
                : "text-gray-500 hover:text-indigo-600 hover:bg-white/50"
            }`}
          >
            <Calendar size={18} /> My Bookings
          </button>
          <button
            onClick={() => setActiveTab("notifications")}
            className={`flex items-center w-full md:w-auto gap-2 px-8 py-3 rounded-xl text-sm font-bold transition-all duration-300 relative ${
              activeTab === "notifications"
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200"
                : "text-gray-500 hover:text-indigo-600 hover:bg-white/50"
            }`}
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white font-bold">
                {unreadCount}
              </span>
            )}
            Notifications
          </button>
        </div>

        {activeTab === "search" && (
          <div className="space-y-12">
            {/* SEARCH PANEL */}
            <div className="glass p-4 rounded-3xl shadow-2xl flex flex-col lg:flex-row gap-4">
              <div className="flex-[2] relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
                <select
                  className="w-full pl-12 pr-4 h-16 bg-white/40 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all appearance-none text-gray-700 font-bold text-lg cursor-pointer"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option value="" disabled>
                    What service are you looking for?
                  </option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* LOCATION PICKER SECTION */}
              <div
                className="flex-1 flex items-center gap-3 px-6 h-16 bg-white/40 rounded-2xl border-none cursor-pointer hover:bg-white/60 transition-all group"
                onClick={getLocation}
              >
                <MapPin
                  size={22}
                  className={`${
                    location
                      ? "text-indigo-600"
                      : "text-gray-400 group-hover:text-indigo-500"
                  }`}
                />
                <div className="flex flex-col">
                  <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest">
                    Your Location
                  </span>
                  <span className="text-gray-700 font-bold leading-tight">
                    {locationStatus}
                  </span>
                </div>
              </div>

              <Button
                size="lg"
                onClick={handleSearch}
                disabled={loading}
                className="h-16 px-12 rounded-2xl text-xl"
              >
                {loading ? "Searching..." : "Search"}
              </Button>
            </div>

            {/* SEARCH RESULTS */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.length === 0 && !loading && (
                <div className="col-span-full py-20 glass rounded-[2.5rem] text-center border-dashed border-2 border-gray-200">
                  <Search size={48} className="mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-400 font-bold text-xl">
                    Search results will appear here
                  </p>
                </div>
              )}
              {services.map((service) => (
                <div
                  key={service.id}
                  className="glass group overflow-hidden rounded-[2rem] transition-all duration-500 hover:scale-[1.02]"
                >
                  <div className="h-56 overflow-hidden relative">
                    <img
                      src={
                        service.images ||
                        "https://via.placeholder.com/400x300?text=Service"
                      }
                      alt={service.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="px-4 py-1.5 bg-white/90 backdrop-blur-sm text-indigo-600 text-[10px] font-black rounded-full uppercase tracking-widest shadow-lg">
                        {getCategoryName(service.categoryId)}
                      </span>
                    </div>
                  </div>
                  <div className="p-8">
                    <h3 className="text-2xl font-black text-gray-900 mb-3">
                      {service.title}
                    </h3>
                    <p className="text-gray-500 text-sm line-clamp-2 mb-6 font-medium leading-relaxed">
                      {service.description}
                    </p>
                    <div className="flex items-center gap-2 text-indigo-600/70 text-xs font-black uppercase tracking-tighter mb-6 bg-indigo-50/50 w-fit px-3 py-1.5 rounded-lg border border-indigo-100">
                      <MapPin size={14} />
                      {service.distance
                        ? `${service.distance.toFixed(1)} km away`
                        : "Nearby"}
                    </div>
                    <div className="flex justify-between items-center bg-gray-50/50 p-5 rounded-2xl border border-white/40 shadow-inner">
                      <div>
                        <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">
                          Starting Price
                        </p>
                        <p className="text-2xl font-black text-indigo-600 tracking-tight">
                          ₹{service.price}
                        </p>
                      </div>
                      <Button
                        onClick={() => {
                          setSelectedServiceForBooking(service);
                          setBookingModalOpen(true);
                        }}
                        className="shadow-indigo-200"
                      >
                        Book Now
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "bookings" && (
          <div className="space-y-8">
            <div className="flex gap-4 border-b border-gray-200/60 pb-1 mb-8">
              <button
                onClick={() => setActiveBookingsTab("active")}
                className={`pb-3 text-sm font-bold transition-colors ${
                  activeBookingsTab === "active"
                    ? "text-indigo-600 border-b-2 border-indigo-600"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                Active Bookings
              </button>
              <button
                onClick={() => setActiveBookingsTab("history")}
                className={`pb-3 text-sm font-bold transition-colors ${
                  activeBookingsTab === "history"
                    ? "text-indigo-600 border-b-2 border-indigo-600"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                Service History
              </button>
            </div>

            {loadingBookings ? (
              <div className="flex flex-col items-center justify-center py-32 glass rounded-[2.5rem]">
                <div className="w-12 h-12 border-4 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin mb-6" />
                <p className="font-bold text-gray-400">Loading bookings...</p>
              </div>
            ) : displayedBookings.length === 0 ? (
              <div className="text-center py-32 glass rounded-[3rem] border-dashed border-2 border-gray-200">
                {activeBookingsTab === "active" ? (
                  <Calendar size={64} className="mx-auto text-gray-200 mb-6" />
                ) : (
                  <History size={64} className="mx-auto text-gray-200 mb-6" />
                )}
                <h3 className="text-2xl font-black text-gray-900">
                  No {activeBookingsTab} bookings
                </h3>
                <p className="text-gray-500 mt-2 font-medium">
                  {activeBookingsTab === "active"
                    ? "Your upcoming appointments will appear here."
                    : "Your past services will appear here."}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {displayedBookings.map((booking) => {
                  const review = reviewsMap[booking.bookingId];
                  return (
                    <div
                      key={booking.bookingId}
                      className="glass p-8 rounded-[2.5rem] flex flex-col justify-between gap-6 hover:shadow-2xl transition-all duration-500 border-white/60"
                    >
                      <div className="flex gap-6 items-start">
                        <div
                          className={`p-5 rounded-2xl shadow-lg ${
                            booking.status === "CONFIRMED"
                              ? "bg-emerald-50 text-emerald-600 shadow-emerald-100"
                              : booking.status === "PENDING"
                              ? "bg-amber-50 text-amber-600 shadow-amber-100"
                              : booking.status === "COMPLETED"
                              ? "bg-indigo-50 text-indigo-600 shadow-indigo-100"
                              : "bg-gray-100 text-gray-400 shadow-gray-200"
                          }`}
                        >
                          {booking.status === "CONFIRMED" ? (
                            <CheckCircle size={32} />
                          ) : booking.status === "PENDING" ? (
                            <Clock size={32} />
                          ) : (
                            <History size={32} />
                          )}
                        </div>
                        <div>
                          <h3 className="font-black text-gray-900 text-xl mb-1">
                            {booking.serviceName}
                          </h3>
                          <p className="text-indigo-600 font-bold text-sm mb-3">
                            with {booking.providerName}
                          </p>
                          <div className="flex flex-wrap gap-4">
                            <div className="flex items-center gap-2 text-xs font-bold text-gray-500">
                              <Calendar size={14} className="text-indigo-400" />
                              {booking.bookingDate}
                            </div>
                            <div className="flex items-center gap-2 text-xs font-bold text-gray-500">
                              <Clock size={14} className="text-indigo-400" />
                              {booking.timeSlot}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col gap-4 border-t border-white/40 pt-6">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-[10px] text-gray-400 font-black tracking-widest mb-1">
                              AMOUNT
                            </p>
                            <p className="font-black text-indigo-600 text-2xl tracking-tighter">
                              ₹{booking.price || 0}
                            </p>
                          </div>
                          <span
                            className={`px-4 py-1.5 text-[10px] rounded-full font-black uppercase tracking-widest border ${
                              booking.status === "CONFIRMED"
                                ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                                : booking.status === "PENDING"
                                ? "bg-amber-100 text-amber-700 border-amber-200"
                                : "bg-gray-100 text-gray-600 border-gray-200"
                            }`}
                          >
                            {booking.status}
                          </span>
                        </div>

                        <div className="flex justify-end pt-2">
                          {booking.status === "PENDING" && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                handleCancelBooking(booking.bookingId)
                              }
                              className="text-rose-600 border-rose-100 bg-rose-50/30 hover:bg-rose-50 text-xs font-black px-4 h-9"
                            >
                              Cancel Booking
                            </Button>
                          )}

                          {booking.status === "COMPLETED" && (
                            <div className="w-full">
                              {review ? (
                                <div className="bg-amber-50/50 p-4 rounded-xl border border-amber-100/50">
                                  <div className="flex items-center gap-1 mb-2">
                                    {[...Array(5)].map((_, i) => (
                                      <Star
                                        key={i}
                                        size={14}
                                        className={
                                          i < review.rating
                                            ? "fill-amber-400 text-amber-400"
                                            : "text-gray-300"
                                        }
                                      />
                                    ))}
                                    <span className="text-xs font-bold text-amber-600 ml-2">
                                      You rated this
                                    </span>
                                  </div>
                                  {review.comment && (
                                    <p className="text-sm text-gray-600 italic">
                                      "{review.comment}"
                                    </p>
                                  )}
                                </div>
                              ) : (
                                <Button
                                  onClick={() => {
                                    setSelectedBookingForReview(
                                      booking.bookingId
                                    );
                                    setReviewModalOpen(true);
                                  }}
                                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg"
                                >
                                  <Star
                                    size={16}
                                    className="mr-2 fill-white/20"
                                  />
                                  Write a Review
                                </Button>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        <div className={activeTab === "notifications" ? "block" : "hidden"}>
          <NotificationsTab
            userId={userId}
            setUnreadCount={setUnreadCount}
            onNotificationClick={handleNotificationClick}
          />
        </div>

        <BookingModal
          isOpen={bookingModalOpen}
          onClose={() => setBookingModalOpen(false)}
          service={selectedServiceForBooking}
          userId={userId}
        />

        <ReviewModal
          isOpen={reviewModalOpen}
          onClose={() => setReviewModalOpen(false)}
          bookingId={selectedBookingForReview}
          onSubmit={handleReviewSubmit}
        />
      </main>
    </div>
  );
};

export default CustomerDashboard;
