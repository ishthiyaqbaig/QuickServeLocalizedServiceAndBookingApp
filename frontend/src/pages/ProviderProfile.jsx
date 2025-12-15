import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Phone,
  Camera,
  Navigation,
  ArrowLeft,
} from "lucide-react";

import { Button } from "../components/ui/Button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { Navbar } from "../components/layout/Navbar";

import {
  getUser,
  updateProfile,
  updateLocation,
} from "../services/userService";

const ProviderProfile = () => {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [locationStatus, setLocationStatus] = useState("");

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    mobile: "",
    image: null,      // File
    preview: null,    // Preview URL
  });

  const [location, setLocation] = useState({
    lat: "",
    lng: "",
    address: "",
  });

  /* ---------------- FETCH USER ---------------- */
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await getUser(userId);
        setProfile({
          name: data.userName || "",
          email: data.email || "",
          mobile: data.number || "",
          image: null,
          preview: data.image || null, // image URL from backend
        });

        setLocation({
          lat: data.permanentLatitude || "",
          lng: data.permanentLongitude || "",
          address: data.permanentAddress || "",
        });
      } catch {
        navigate("/login");
      }
    };

    fetchUser();
  }, [navigate, userId]);

  /* ---------------- IMAGE HANDLER ---------------- */
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setProfile((prev) => ({
      ...prev,
      image: file,
      preview: URL.createObjectURL(file),
    }));
  };

  /* ---------------- GEO LOCATION ---------------- */
  const getGeoLocation = () => {
    setLocationStatus("Fetching location...");

    if (!navigator.geolocation) {
      setLocationStatus("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation((prev) => ({
          ...prev,
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        }));
        setLocationStatus("Location detected ✔");
      },
      () => setLocationStatus("Location access denied")
    );
  };

  /* ---------------- UPDATE PROFILE ---------------- */
  const handleProfileUpdate = async () => {
    setLoadingProfile(true);
    try {
      const formData = new FormData();
      formData.append("userName", profile.name);
      formData.append("email", profile.email);
      formData.append(
        "number",
        profile.mobile
      );

      if (profile.image) {
        formData.append("image", profile.image); // IMPORTANT
      }

      await updateProfile(userId, formData);
      alert("Profile updated successfully");
    } finally {
      setLoadingProfile(false);
    }
  };

  /* ---------------- UPDATE LOCATION ---------------- */
  const handleLocationUpdate = async () => {
    setLoadingLocation(true);
    try {
      await updateLocation(userId, {
        permanentLatitude: location.lat || null,
        permanentLongitude: location.lng || null,
        permanentAddress: location.address,
      });
      alert("Location updated successfully");
    } finally {
      setLoadingLocation(false);
    }
  };

  const navbarUser = { name: profile.name, role: "PROVIDER" };

  /* ---------------- UI ---------------- */
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navbar user={navbarUser} />

      <div className="max-w-6xl mx-auto px-4 py-10 space-y-8">
        {/* BACK */}
        <button
          onClick={() => navigate("/provider/dashboard")}
          className="flex items-center gap-2 text-gray-600 hover:text-blue-600"
        >
          <ArrowLeft size={18} />
          <span className="text-sm font-medium">Back</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* PROFILE CARD */}
          <Card className="rounded-2xl shadow-lg">
            <CardContent className="pt-8 text-center">
              <div className="relative inline-block">
                <div className="w-36 h-36 rounded-full overflow-hidden ring-4 ring-blue-100 bg-gray-100">
                  {profile.preview ? (
                    <img
                      src={profile.preview}
                      alt="profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="h-full flex items-center justify-center text-gray-400">
                      <User size={48} />
                    </div>
                  )}
                </div>

                <label className="absolute bottom-2 right-2 bg-blue-600 p-2 rounded-full cursor-pointer hover:bg-blue-700">
                  <Camera size={16} className="text-white" />
                  <input type="file" hidden onChange={handleImageUpload} />
                </label>
              </div>

              <h2 className="mt-4 text-xl font-semibold">{profile.name}</h2>
              <span className="text-xs text-blue-600 bg-blue-100 px-3 py-1 rounded-full">
                Customer
              </span>
            </CardContent>
          </Card>

          {/* RIGHT SECTION */}
          <div className="lg:col-span-2 space-y-8">
            {/* PROFILE FORM */}
            <Card className="rounded-2xl shadow-lg">
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  placeholder="Full Name"
                  value={profile.name}
                  onChange={(e) =>
                    setProfile({ ...profile, name: e.target.value })
                  }
                />

                <Input
                  placeholder="Email"
                  value={profile.email}
                  disabled
                />

                <Input
                  type="tel"
                  placeholder="Mobile Number"
                  maxLength={10}
                  value={profile.mobile}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      mobile: e.target.value.replace(/\D/g, ""),
                    })
                  }
                />

                <Button
                  className="w-full rounded-xl"
                  onClick={handleProfileUpdate}
                  disabled={loadingProfile}
                >
                  {loadingProfile ? "Updating..." : "Update Profile"}
                </Button>
              </CardContent>
            </Card>

            {/* LOCATION */}
            <Card className="rounded-2xl shadow-lg">
              <CardHeader>
                <CardTitle>Location Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  placeholder="Permanent Address"
                  value={location.address}
                  onChange={(e) =>
                    setLocation({ ...location, address: e.target.value })
                  }
                />

                <div className="grid grid-cols-2 gap-4">
                  <Input placeholder="Latitude" value={location.lat} disabled />
                  <Input placeholder="Longitude" value={location.lng} disabled />
                </div>

                <Button
                  variant="outline"
                  className="w-full flex gap-2"
                  onClick={getGeoLocation}
                >
                  <Navigation size={16} />
                  Use Current Location
                </Button>

                {locationStatus && (
                  <p className="text-sm text-gray-500">{locationStatus}</p>
                )}

                <Button
                  className="w-full rounded-xl"
                  onClick={handleLocationUpdate}
                  disabled={loadingLocation}
                >
                  {loadingLocation ? "Updating..." : "Update Location"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProviderProfile;
