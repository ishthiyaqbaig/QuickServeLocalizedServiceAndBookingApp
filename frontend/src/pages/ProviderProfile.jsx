import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Camera,
  Save,
  ArrowLeft
} from 'lucide-react';

import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Navbar } from '../components/layout/Navbar';

import {
  getUser,
  updateProfile,
  updateLocation
} from '../services/userService';

const ProviderProfile = () => {
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const [profile, setProfile] = useState({
    name: '',
    email: '',
    mobile: '',
    bio: '',
    location: '',
    profileImage: null
  });

  /* ---------------- FETCH USER ON LOAD ---------------- */
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userId = localStorage.getItem('userId');
        const data = await getUser(userId);

        setProfile({
          name: data.userName || '',
          email: data.email || '',
          mobile: data.mobile || 'xxxxxxxxxx',
          bio: data.bio || '',
          location: data.permanentAddress || '',
          profileImage: data.profileImage || null
        });
      } catch (error) {
        console.error('Unauthorized or session expired');
        navigate('/login');
      }
    };

    fetchUser();
  }, [navigate]);

  /* ---------------- HANDLERS ---------------- */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setProfile((prev) => ({
        ...prev,
        profileImage: reader.result
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await updateProfile({
        userName: profile.name,
        mobile: profile.mobile,
        bio: profile.bio
      });

      await updateLocation({
        permanentAddress: profile.location
      });

      alert('Profile updated successfully');
      setIsEditing(false);
    } catch (error) {
      console.error(error);
      alert('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const navbarUser = {
    name: profile.name,
    role: 'SERVICE_PROVIDER'
  };

  /* ---------------- UI ---------------- */
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={navbarUser} />

      <div className="max-w-4xl mx-auto px-4 py-12">
        <Button
          variant="ghost"
          className="mb-6 flex items-center gap-2"
          onClick={() => navigate('/provider/dashboard')}
        >
          <ArrowLeft size={18} /> Back to Dashboard
        </Button>

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">My Profile</h1>
          <Button onClick={isEditing ? handleSave : () => setIsEditing(true)} disabled={loading}>
            {loading ? 'Saving...' : isEditing ? (
              <>
                <Save size={18} className="mr-2" /> Save Changes
              </>
            ) : (
              'Edit Profile'
            )}
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT COLUMN */}
          <div className="space-y-6">
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="relative inline-block">
                  <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 mx-auto border">
                    {profile.profileImage ? (
                      <img
                        src={profile.profileImage}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-gray-400">
                        <User size={48} />
                      </div>
                    )}
                  </div>

                  {isEditing && (
                    <label className="absolute bottom-0 right-0 bg-blue-600 p-2 rounded-full cursor-pointer">
                      <Camera size={16} className="text-white" />
                      <input type="file" className="hidden" onChange={handleImageUpload} />
                    </label>
                  )}
                </div>

                <h2 className="mt-4 text-xl font-bold">{profile.name}</h2>
                <span className="text-sm text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                  Service Provider
                </span>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>About Me</CardTitle>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <textarea
                    name="bio"
                    value={profile.bio}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full border rounded-lg p-3"
                  />
                ) : (
                  <p className="text-gray-600">
                    {profile.bio || 'No bio added yet.'}
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* RIGHT COLUMN */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Personal Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Name */}
                <div>
                  <label className="text-sm text-gray-500">Full Name</label>
                  {isEditing ? (
                    <Input name="name" value={profile.name} onChange={handleInputChange} />
                  ) : (
                    <div className="flex gap-2 items-center bg-gray-50 p-3 rounded">
                      <User size={16} /> {profile.name}
                    </div>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="text-sm text-gray-500">Email</label>
                  <div className="flex gap-2 items-center bg-gray-50 p-3 rounded">
                    <Mail size={16} /> {profile.email}
                  </div>
                </div>

                {/* Mobile */}
                <div>
                  <label className="text-sm text-gray-500">Mobile</label>
                  {isEditing ? (
                    <Input name="mobile" value={profile.mobile} onChange={handleInputChange} />
                  ) : (
                    <div className="flex gap-2 items-center bg-gray-50 p-3 rounded">
                      <Phone size={16} /> {profile.mobile || 'Not set'}
                    </div>
                  )}
                </div>

                {/* Location */}
                <div>
                  <label className="text-sm text-gray-500">Location</label>
                  {isEditing ? (
                    <Input name="location" value={profile.location} onChange={handleInputChange} />
                  ) : (
                    <div className="flex gap-2 items-center bg-gray-50 p-3 rounded">
                      <MapPin size={16} /> {profile.location || 'Not set'}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProviderProfile;
