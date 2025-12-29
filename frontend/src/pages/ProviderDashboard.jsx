import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  MapPin,
  Calendar,
  Clock,
  DollarSign,
  Plus,
  Trash2,
  Edit,
  Search,
  Filter,
  AlertCircle,
  CheckCircle,
  X,
  ChevronRight,
  TrendingUp,
  Users,
  Bell,
} from "lucide-react";
import NotificationsTab from "../components/NotificationsTab";
import { Button } from "../components/ui/Button";
import { Navbar } from "../components/layout/NavBar";
import {
  getProviderListings,
  deleteListing,
} from "../services/providerService";
import { getCategories } from "../services/categoryService";
import {
  getBookingsByProvider,
  confirmBooking,
  completeBooking,
  providerCancelBooking,
  getProviderAvailability,
  updateProviderAvailability,
} from "../services/bookingService";

const ProviderDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("services");
  const [listings, setListings] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const userId = localStorage.getItem("userId");
  const userName = localStorage.getItem("userName") || "Provider";

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const [availability, setAvailability] = useState([]);
  const [selectedDay, setSelectedDay] = useState(
    new Date().toLocaleDateString("en-US", { weekday: "long" }).toUpperCase()
  );
  const [selectedDateUI, setSelectedDateUI] = useState(new Date());
  const [savingAvailability, setSavingAvailability] = useState(false);
  const [selectedListingId, setSelectedListingId] = useState(null);

  const daysOfWeek = [
    "MONDAY",
    "TUESDAY",
    "WEDNESDAY",
    "THURSDAY",
    "FRIDAY",
    "SATURDAY",
    "SUNDAY",
  ];

  useEffect(() => {
    if (userId) {
      setLoading(true);
      getProviderListings(userId)
        .then((data) => {
          const list = Array.isArray(data) ? data : [];
          setListings(list);
          if (list.length > 0) setSelectedListingId(list[0].id);
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [userId]);

  useEffect(() => {
    if (activeTab === "appointments" && userId) {
      setLoading(true);
      getBookingsByProvider(userId)
        .then((data) => {
          const list = Array.isArray(data) ? data : [];
          // Sort by bookingId DESC (newest created first)
          list.sort((a, b) => b.bookingId - a.bookingId);
          setBookings(list);
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [activeTab, userId]);

  useEffect(() => {
    getCategories().then(setCategories).catch(console.error);
  }, []);

  useEffect(() => {
    if (activeTab === "availability" && userId) {
      setLoading(true);
      getProviderAvailability(userId, selectedDay)
        .then((data) => setAvailability(Array.isArray(data) ? data : []))
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [activeTab, userId, selectedDay]);

  const handleDeleteListing = async (listingId) => {
    deleteListing(listingId);
    const updated = listings.filter(l => l.id !== listingId);
    setListings(updated);
  };

  const handleConfirmBooking = async (bookingId) => {
    try {
      await confirmBooking(bookingId);
      setBookings(
        bookings.map((b) =>
          b.bookingId === bookingId ? { ...b, status: "CONFIRMED" } : b
        )
      );
      alert("Booking accepted!");
    } catch (error) {
      console.error(error);
      alert("Failed to accept booking.");
    }
  };

  const handleCompleteBooking = async (bookingId) => {
    try {
      await completeBooking(bookingId);
      setBookings(
        bookings.map((b) =>
          b.bookingId === bookingId ? { ...b, status: "COMPLETED" } : b
        )
      );
      alert("Booking marked as completed!");
    } catch (error) {
      console.error(error);
      alert("Failed to complete booking.");
    }
  };

  const handleProviderCancelBooking = async (bookingId) => {
    if (
      !window.confirm("Are you sure you want to decline/cancel this booking?")
    )
      return;
    try {
      await providerCancelBooking(bookingId);
      setBookings(
        bookings.map((b) =>
          b.bookingId === bookingId ? { ...b, status: "CANCELLED" } : b
        )
      );
      alert("Booking cancelled.");
    } catch (error) {
      console.error(error);
      alert("Failed to cancel booking.");
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar showAuthButtons={false} onLogout={handleLogout} />

      <main className="max-w-7xl mx-auto px-4 py-32">
        <div className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 tracking-tight">
              Provider <span className="text-gradient">Dashboard</span>
            </h1>
            <p className="text-gray-500 text-lg font-medium">
              Grow your business and manage your schedule.
            </p>
          </div>
          {activeTab === "services" && (
            <Button
              onClick={() => navigate("/provider/create-listing")}
              size="lg"
              className="rounded-2xl h-16 px-8 shadow-xl shadow-indigo-100 flex items-center gap-3"
            >
              <Plus size={24} strokeWidth={3} /> Create Listing
            </Button>
          )}
        </div>

        {/* TABS CONTROLLER */}
        <div className="flex gap-2 p-1.5 glass rounded-[2rem] w-fit mb-12 shadow-inner overflow-x-auto max-w-full">
          {[
            { id: "services", label: "Services", icon: MapPin },
            { id: "appointments", label: "Bookings", icon: Calendar },
            { id: "availability", label: "Availability", icon: Clock },
            { id: "earnings", label: "Earning", icon: DollarSign },
            { id: "notifications", label: "Notifications", icon: Bell },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 px-8 py-3.5 rounded-2xl text-sm font-black transition-all duration-300 whitespace-nowrap ${
                activeTab === tab.id
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100"
                  : "text-gray-400 hover:text-indigo-600 hover:bg-white/50"
              }`}
            >
              <div className="relative inline-flex items-center">
                <tab.icon size={20} />
                {tab.id === "notifications" && unreadCount > 0 && (
                  <span className="absolute -top-2 -right-2 text-xs font-bold bg-red-500 px-1 py-0.2 rounded-full">
                    {unreadCount}
                  </span>
                )}
              </div>
              {tab.label.toUpperCase()}
            </button>
          ))}
        </div>

        {/* CONTENT AREA */}
        {activeTab === "services" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading && listings.length === 0 ? (
              <div className="col-span-full py-32 glass rounded-[3rem] text-center border-dashed">
                <div className="w-12 h-12 border-4 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin mx-auto mb-6" />
                <p className="font-bold text-gray-400">
                  Fetching your services...
                </p>
              </div>
            ) : listings.length > 0 ? (
              listings.map((listing) => (
                <div
                  key={listing.id}
                  className="glass group overflow-hidden rounded-[2.5rem] transition-all duration-500 hover:scale-[1.02] border-white/60"
                >
                  <div
                    className={`h-56 relative overflow-hidden ${
                      listing.disabled ? "grayscale" : ""
                    }`}
                  >
                    <img
                      src={listing.images}
                      alt={listing.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute top-4 right-4 flex gap-2">
                      <button
                        onClick={() =>
                          navigate(`/provider/update-listing/${listing.id}`)
                        }
                        className="p-3 bg-white/90 backdrop-blur-sm text-indigo-600 rounded-xl shadow-lg hover:bg-white transition-colors"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDeleteListing(listing.id)}
                        className="p-3 bg-white/90 backdrop-blur-sm text-rose-600 rounded-xl shadow-lg hover:bg-white transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                  <div className="p-8">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-2xl font-black text-gray-900 tracking-tight leading-tight">
                        {listing.title}
                      </h3>
                      <span className="text-2xl font-black text-indigo-600 tracking-tighter">
                        ₹{listing.price}
                      </span>
                    </div>
                    <p className="text-gray-500 text-sm line-clamp-2 mb-8 font-medium leading-relaxed">
                      {listing.description}
                    </p>
                    <div className="flex items-center gap-3 pt-6 border-t border-white/40">
                      <Button
                        variant={listing.disabled ? "primary" : "outline"}
                        size="sm"
                        className="w-full text-xs font-black uppercase tracking-widest h-11"
                        onClick={() => {
                          const updated = listings.map((l) =>
                            l.id === listing.id
                              ? { ...l, disabled: !l.disabled }
                              : l
                          );
                          setListings(updated);
                        }}
                      >
                        {listing.disabled ? "Turn Online" : "Go Offline"}
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full py-32 glass rounded-[3rem] text-center border-dashed">
                <AlertCircle size={64} className="mx-auto text-gray-200 mb-6" />
                <h3 className="text-2xl font-black text-gray-900">
                  No Services Yet
                </h3>
                <p className="text-gray-400 mt-2 font-medium">
                  Create your first listing to start accepting bookings.
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === "appointments" && (
          <div className="space-y-8">
            {loading ? (
              <div className="py-32 glass rounded-[3rem] text-center">
                <div className="w-12 h-12 border-4 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin mx-auto mb-6" />
                <p className="font-bold text-gray-400">
                  Loading appointments...
                </p>
              </div>
            ) : bookings.length === 0 ? (
              <div className="py-32 glass rounded-[3rem] text-center border-dashed">
                <Calendar size={64} className="mx-auto text-gray-200 mb-6" />
                <h3 className="text-2xl font-black text-gray-900">
                  Queue is empty
                </h3>
                <p className="text-gray-400 mt-2 font-medium">
                  Upcoming bookings will be listed here.
                </p>
              </div>
            ) : (
              bookings.map((booking) => (
                <div
                  key={booking.bookingId}
                  className="glass p-8 rounded-[2.5rem] flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 border-white/60 hover:shadow-2xl transition-all duration-500"
                >
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-4 mb-4">
                      <h3 className="text-2xl font-black text-gray-900 leading-tight">
                        {booking.serviceName}
                      </h3>
                      <span
                        className={`px-4 py-1.5 text-[10px] rounded-full font-black uppercase tracking-widest border border-white/40 shadow-inner ${
                          booking.status === "CONFIRMED"
                            ? "bg-emerald-100 text-emerald-700"
                            : booking.status === "PENDING"
                            ? "bg-amber-100 text-amber-700"
                            : "bg-indigo-100 text-indigo-700"
                        }`}
                      >
                        {booking.status}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 mb-8">
                      <div className="flex items-center gap-2 text-xs font-black text-gray-500 uppercase tracking-tighter bg-white/40 px-3 py-1.5 rounded-xl w-fit">
                        <Calendar size={14} className="text-indigo-400" />{" "}
                        {booking.bookingDate}
                      </div>
                      <div className="flex items-center gap-2 text-xs font-black text-gray-500 uppercase tracking-tighter bg-white/40 px-3 py-1.5 rounded-xl w-fit">
                        <Clock size={14} className="text-indigo-400" />{" "}
                        {booking.timeSlot}
                      </div>
                      <div className="flex items-center gap-2 text-sm font-black text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-xl w-fit">
                        ₹ {booking.price}
                      </div>
                    </div>
                    <div className="flex items-center gap-4 p-5 bg-white/40 rounded-2xl border border-white/40">
                      <div className="w-12 h-12 bg-indigo-600 text-white rounded-xl flex items-center justify-center font-black text-xl shadow-lg shadow-indigo-100">
                        {booking.customerName?.charAt(0)}
                      </div>
                      <div>
                        <p className="font-black text-gray-900">
                          {booking.customerName}
                        </p>
                        <p className="text-xs text-indigo-500 font-bold">
                          {booking.customerPhone}
                        </p>
                      </div>
                      <div className="ml-auto flex flex-col items-end gap-1">
                        <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 bg-white/60 px-3 py-2 rounded-xl border border-white/40">
                          <MapPin size={12} /> {booking.customerAddress}
                        </div>
                        {booking.customerLatitude &&
                          booking.customerLongitude && (
                            <div className="text-[9px] font-bold text-indigo-400 font-mono bg-indigo-50 px-2 py-1 rounded-lg">
                              {booking.customerLatitude.toFixed(4)},{" "}
                              {booking.customerLongitude.toFixed(4)}
                            </div>
                          )}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 w-full lg:w-auto mt-6 lg:mt-0 pt-8 lg:pt-0 border-t lg:border-t-0 border-white/40">
                    {booking.status === "PENDING" && (
                      <>
                        <Button
                          size="lg"
                          className="flex-1 lg:flex-none rounded-2xl h-14 px-8"
                          onClick={() =>
                            handleConfirmBooking(booking.bookingId)
                          }
                        >
                          Accept
                        </Button>
                        <Button
                          variant="outline"
                          size="lg"
                          className="flex-1 lg:flex-none rounded-2xl h-14 px-8 text-rose-600 border-rose-100"
                          onClick={() =>
                            handleProviderCancelBooking(booking.bookingId)
                          }
                        >
                          Decline
                        </Button>
                      </>
                    )}
                    {booking.status === "CONFIRMED" && (
                      <>
                        <Button
                          size="lg"
                          className="flex-1 lg:flex-none rounded-2xl h-14 px-8"
                          onClick={() =>
                            handleCompleteBooking(booking.bookingId)
                          }
                        >
                          Complete Job
                        </Button>
                        <Button
                          variant="outline"
                          size="lg"
                          className="flex-1 lg:flex-none rounded-2xl h-14 px-8"
                          onClick={() =>
                            handleProviderCancelBooking(booking.bookingId)
                          }
                        >
                          Cancel
                        </Button>
                      </>
                    )}
                    {booking.status === "COMPLETED" && (
                      <div className="flex items-center gap-3 text-emerald-600 font-black bg-emerald-50 px-8 h-14 rounded-2xl border border-emerald-100 shadow-inner">
                        <CheckCircle size={20} /> MISSION COMPLETE
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === "availability" && (
          <div className="space-y-8">
            {loading && listings.length === 0 ? (
              <div className="py-32 glass rounded-[3rem] text-center">
                <div className="w-12 h-12 border-4 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin mx-auto mb-6" />
                <p className="font-bold text-gray-400">Loading services...</p>
              </div>
            ) : listings.length === 0 ? (
              <div className="py-32 glass rounded-[3rem] text-center border-dashed border-white/60">
                <AlertCircle size={64} className="mx-auto text-gray-200 mb-6" />
                <h3 className="text-2xl font-black text-gray-900">
                  No Services Found
                </h3>
                <p className="text-gray-400 mt-2 mb-8 font-medium max-w-md mx-auto">
                  You need to create a service listing before you can set your
                  availability.
                </p>
                <Button
                  onClick={() => navigate("/provider/create-listing")}
                  size="lg"
                  className="rounded-2xl h-14 px-8 shadow-xl shadow-indigo-100"
                >
                  <Plus size={20} className="mr-2" /> Create First Listing
                </Button>
              </div>
            ) : (
              <div className="glass p-8 rounded-[2.5rem] border-white/60">
                {/* LISTING SELECTOR */}
                <div className="mb-8 p-6 bg-indigo-50/50 rounded-3xl border border-indigo-100">
                  <label className="text-xs font-black text-indigo-400 uppercase tracking-widest mb-3 block">
                    Select Service to Manage
                  </label>
                  <select
                    value={selectedListingId || ""}
                    onChange={(e) =>
                      setSelectedListingId(Number(e.target.value))
                    }
                    className="w-full bg-white text-lg font-black text-gray-900 p-4 rounded-2xl border-none shadow-sm focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                  >
                    {listings.map((l) => (
                      <option key={l.id} value={l.id}>
                        {l.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                  {/* CALENDAR SECTION */}
                  <CalendarWidget
                    selectedDateUI={selectedDateUI}
                    setSelectedDateUI={setSelectedDateUI}
                    selectedDay={selectedDay}
                    setSelectedDay={setSelectedDay}
                  />

                  {/* SLOTS SECTION */}
                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-2xl font-black text-gray-900">
                        Time Slots ({selectedDay})
                      </h3>
                      <Button
                        onClick={async () => {
                          setSavingAvailability(true);
                          try {
                            await updateProviderAvailability(
                              userId,
                              selectedDay,
                              availability
                            );
                            alert("Availability updated successfully!");
                          } catch (err) {
                            alert("Failed to update availability");
                            console.error(err);
                          } finally {
                            setSavingAvailability(false);
                          }
                        }}
                        disabled={savingAvailability}
                        className="rounded-xl px-6 shadow-lg shadow-indigo-100"
                      >
                        {savingAvailability
                          ? "Saving..."
                          : "Update Availability"}
                      </Button>
                    </div>
                    <div className="space-y-4">
                      {loading ? (
                        <p className="text-gray-400 text-sm">
                          Loading slots...
                        </p>
                      ) : (
                        <div className="grid grid-cols-2 gap-4">
                          {[
                            "09:00",
                            "10:00",
                            "11:00",
                            "12:00",
                            "13:00",
                            "14:00",
                          ].map((slot) => {
                            const isActive = availability.includes(slot);
                            return (
                              <button
                                key={slot}
                                onClick={() => {
                                  const exists = availability.includes(slot);
                                  if (exists) {
                                    setAvailability(
                                      availability.filter((s) => s !== slot)
                                    );
                                  } else {
                                    setAvailability([...availability, slot]);
                                  }
                                }}
                                disabled={savingAvailability}
                                className={`p-4 rounded-2xl font-bold flex items-center justify-between border transition-all ${
                                  isActive
                                    ? "bg-indigo-600 text-white border-indigo-600 shadow-xl shadow-indigo-200"
                                    : "bg-white/40 text-gray-500 border-white/40 hover:bg-white"
                                }`}
                              >
                                <div className="flex items-center gap-2">
                                  <Clock
                                    size={18}
                                    className={
                                      isActive
                                        ? "text-indigo-200"
                                        : "text-indigo-400"
                                    }
                                  />
                                  {slot}
                                </div>
                                {isActive && (
                                  <CheckCircle
                                    size={18}
                                    className="text-white"
                                  />
                                )}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "earnings" && (
          <div className="space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  label: "TOTAL EARNED",
                  value: "₹0.00",
                  icon: TrendingUp,
                  color: "text-indigo-600",
                },
                {
                  label: "PENDING PAYOUT",
                  value: "₹0.00",
                  icon: DollarSign,
                  color: "text-amber-600",
                },
                {
                  label: "HAPPY CLIENTS",
                  value: "0",
                  icon: Users,
                  color: "text-emerald-600",
                },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="glass p-8 rounded-[2.5rem] shadow-xl border-white/60 relative overflow-hidden group"
                >
                  <div className="absolute top-0 right-0 -mr-8 -mt-8 w-24 h-24 bg-indigo-500/5 rounded-full group-hover:scale-150 transition-transform duration-700" />
                  <div className="mb-6 w-14 h-14 rounded-2xl bg-white/60 flex items-center justify-center shadow-lg border border-white">
                    <stat.icon size={28} className={stat.color} />
                  </div>
                  <p className="text-[10px] font-black text-gray-400 tracking-widest uppercase mb-1">
                    {stat.label}
                  </p>
                  <p
                    className={`text-4xl font-black tracking-tighter ${stat.color}`}
                  >
                    {stat.value}
                  </p>
                </div>
              ))}
            </div>
            <div className="py-32 glass rounded-[3rem] text-center border-dashed">
              <TrendingUp size={64} className="mx-auto text-gray-200 mb-6" />
              <p className="text-gray-400 font-black text-xl">
                Financial analytics coming soon
              </p>
            </div>
          </div>
        )}

        <div className={activeTab === "notifications" ? "block" : "hidden"}>
   <NotificationsTab userId={userId} setUnreadCount={setUnreadCount}/>
</div>
      </main>
    </div>
  );
};

const CalendarWidget = ({
  selectedDateUI,
  setSelectedDateUI,
  selectedDay,
  setSelectedDay,
}) => {
  const [currDate, setCurrDate] = useState(new Date());
  const year = currDate.getFullYear();
  const month = currDate.getMonth();

  const firstDay = new Date(year, month, 1).getDay(); // 0 = Sun
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Adjust for Monday start if desired, but standard JS is Sun=0
  const blanks = Array(firstDay).fill(null);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <div>
      <h3 className="text-2xl font-black text-gray-900 mb-6">Select Date</h3>
      <div className="bg-white/40 rounded-3xl p-6 border border-white/40">
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => setCurrDate(new Date(year, month - 1))}
            className="p-2 hover:bg-white rounded-xl"
          >
            <ChevronRight className="rotate-180" />
          </button>
          <span className="font-black text-lg text-gray-700">
            {monthNames[month]} {year}
          </span>
          <button
            onClick={() => setCurrDate(new Date(year, month + 1))}
            className="p-2 hover:bg-white rounded-xl"
          >
            <ChevronRight />
          </button>
        </div>
        <div className="grid grid-cols-7 gap-2 text-center mb-2">
          {["S", "M", "T", "W", "T", "F", "S"].map((d) => (
            <span key={d} className="text-xs font-bold text-gray-400">
              {d}
            </span>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-2">
          {blanks.map((_, i) => (
            <div key={`blank-${i}`} />
          ))}
          {days.map((d) => {
            const dateObj = new Date(year, month, d);
            const dayOfWeek = dateObj
              .toLocaleDateString("en-US", { weekday: "long" })
              .toUpperCase();

            const isToday =
              new Date().toDateString() === dateObj.toDateString();
            const isUISelected =
              selectedDateUI &&
              selectedDateUI.toDateString() === dateObj.toDateString();
            const isPast = dateObj < today;

            return (
              <button
                key={d}
                onClick={() => {
                  if (isPast) return;
                  setSelectedDateUI(dateObj);
                  setSelectedDay(dayOfWeek);
                }}
                disabled={isPast}
                className={`h-10 w-10 flex items-center justify-center rounded-xl text-sm font-bold transition-all ${
                  isUISelected
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200"
                    : isToday
                    ? "bg-indigo-100 text-indigo-600"
                    : isPast
                    ? "text-gray-300 cursor-not-allowed"
                    : "hover:bg-white text-gray-600"
                }`}
              >
                {d}
              </button>
            );
          })}
        </div>
      </div>
      <div className="mt-6 p-4 bg-amber-50 rounded-2xl border border-amber-100 flex gap-3 text-amber-800 text-sm font-medium">
        <AlertCircle className="shrink-0" size={20} />
        <p>
          Setting availability for{" "}
          <span className="font-black underline">{selectedDay}</span>. This
          schedule repeats weekly.
        </p>
      </div>
    </div>
  );
};

export default ProviderDashboard;
