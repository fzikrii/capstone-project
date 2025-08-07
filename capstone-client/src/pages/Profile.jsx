import React, { useState, useEffect, useMemo, useCallback } from "react";
import Cropper from "react-easy-crop";
import Sidebar from "../components/Sidebar";
import Icon from "../components/Icon";
import { getCroppedImg } from "../utils/cropImage";

// Helper function to calculate work duration
const calculateWorkDuration = (startDate) => {
    if (!startDate) return "Not specified";
    const start = new Date(startDate);
    const now = new Date();
    let years = now.getFullYear() - start.getFullYear();
    let months = now.getMonth() - start.getMonth();
    if (months < 0 || (months === 0 && now.getDate() < start.getDate())) {
        years--;
        months = (months + 12) % 12;
    }
    let duration = "";
    if (years > 0) duration += `${years} year${years > 1 ? "s" : ""} `;
    if (months > 0) duration += `${months} month${months > 1 ? "s" : ""}`;
    return duration.trim() || "Less than a month";
};

// Helper function to convert blob to File
const blobToFile = (blob, fileName) => {
    return new File([blob], fileName, { type: blob.type });
};

const Profile = () => {
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [profileData, setProfileData] = useState({
        name: "",
        username: "",
        email: "",
        title: "",
        avatarUrl: "https://placehold.co/128x128/a7f3d0/14532d?text=User",
        bannerUrl: "https://placehold.co/1200x300/e0e7ff/4338ca",
        workStartDate: new Date().toISOString().split("T")[0],
    });
    const [editData, setEditData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [saving, setSaving] = useState(false);

    // Image cropping states
    const [imageToCrop, setImageToCrop] = useState(null);
    const [cropperFor, setCropperFor] = useState(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

    const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

    useEffect(() => {
        fetchProfileData();
    }, []);

    const fetchProfileData = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await fetch("http://localhost:5000/api/profile", {
                method: "GET",
                credentials: "include",
            });

            if (!response.ok) {
                if (response.status === 401) {
                    throw new Error("Please log in to view your profile.");
                }
                throw new Error("Failed to fetch profile");
            }

            const userData = await response.json();
            const profileInfo = {
                name: userData.name || "User",
                username: userData.username || "user",
                email: userData.email || "",
                title: userData.title || "Employee",
                avatarUrl: userData.avatarUrl,
                bannerUrl: userData.bannerUrl,
                workStartDate: userData.workStartDate
                    ? userData.workStartDate.split("T")[0]
                    : new Date().toISOString().split("T")[0],
            };
            setProfileData(profileInfo);
        } catch (err) {
            console.error("Error fetching profile:", err);
            setError(err.message || "Failed to load profile");
        } finally {
            setLoading(false);
        }
    };

    const handleToggleEdit = () => {
        if (isEditing) {
            // Cancel editing - reset everything
            setEditData(null);
            setPendingFiles({ avatar: null, banner: null });
        } else {
            // Start editing
            setEditData({ ...profileData });
        }
        setIsEditing(!isEditing);
    };

    const handleSave = async () => {
        setSaving(true);
        setError(null);

        try {
            // The editData state already contains the new name, title, and image URLs
            const response = await fetch("http://localhost:5000/api/profile", {
                method: "PUT",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json", // We are sending JSON now, not FormData
                },
                body: JSON.stringify(editData), // Send the entire editData object
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || "Failed to save profile");
            }

            const result = await response.json();
            console.log("Profile updated successfully:", result);

            // Update local state with new data from the response
            setProfileData({
                ...profileData,
                ...result.user, // The response contains the updated user object
                workStartDate: result.user.workStartDate.split("T")[0],
            });

            // Exit edit mode and clean up
            setIsEditing(false);
            setEditData(null);

        } catch (err) {
            console.error("Error saving profile:", err);
            setError(err.message || "Failed to save profile changes");
        } finally {
            setSaving(false);
        }
    };
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageSelect = (e, type) => {
        const file = e.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setImageToCrop(imageUrl);
            setCropperFor(type);
            e.target.value = ""; // Reset input
        }
    };

    const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

   const applyCrop = async () => {
    if (!croppedAreaPixels || !imageToCrop) return;

    try {
        // 1. Get the cropped image as a data URL (string)
        const croppedImageDataUrl = await getCroppedImg(imageToCrop, croppedAreaPixels);
        if (!croppedImageDataUrl) {
            throw new Error("Failed to create cropped image data.");
        }

        // 2. Convert the data URL to a Blob object
        const fetchResponse = await fetch(croppedImageDataUrl);
        const croppedImageBlob = await fetchResponse.blob();

        // 3. Create FormData and append the Blob
        const formData = new FormData();
        const fileName = cropperFor === "avatarUrl" ? "avatar.jpg" : "banner.jpg";
        // The field name 'image' must match what your server (multer) expects
        formData.append("image", croppedImageBlob, fileName);

        // 4. Upload the image to the server
        const uploadResponse = await fetch("http://localhost:5000/api/profile/upload-image", {
            method: "POST",
            credentials: "include",
            body: formData, // Body is now FormData
        });

        if (!uploadResponse.ok) {
            const errorText = await uploadResponse.text();
            throw new Error(`Failed to upload image: ${errorText}`);
        }

        const data = await uploadResponse.json();
        const newImageUrl = data.url;

        // 5. Update the preview in editData and clean up
        setEditData(prev => ({ ...prev, [cropperFor]: newImageUrl }));
        closeCropper();

    } catch (error) {
        console.error("Error processing and uploading image:", error);
        setError(error.message); // Show error to the user
        closeCropper();
    }
};

    const closeCropper = () => {
        if (imageToCrop) {
            URL.revokeObjectURL(imageToCrop);
        }
        setImageToCrop(null);
        setCropperFor(null);
        setCroppedAreaPixels(null);
        setZoom(1);
        setCrop({ x: 0, y: 0 });
    };

    const currentData = isEditing ? editData : profileData;
    const workDuration = useMemo(
        () => calculateWorkDuration(currentData?.workStartDate),
        [currentData?.workStartDate]
    );

    if (loading) {
        return (
            <div className="flex h-screen bg-slate-50 font-sans">
                <Sidebar isOpen={isSidebarOpen} />
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600 mx-auto mb-4"></div>
                        <p className="text-slate-600">Loading profile...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error && !isEditing) {
        return (
            <div className="flex h-screen bg-slate-50 font-sans">
                <Sidebar isOpen={isSidebarOpen} />
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <Icon name="alert-circle" className="w-12 h-12 text-red-500 mx-auto mb-4" />
                        <p className="text-red-600 mb-4">{error}</p>
                        <button
                            onClick={fetchProfileData}
                            className="bg-sky-600 text-white px-4 py-2 rounded-lg hover:bg-sky-700 transition-colors"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-slate-50 font-sans">
            <Sidebar isOpen={isSidebarOpen} />

            {/* Image Cropper Modal */}
            {imageToCrop && (
                <div className="fixed inset-0 z-50 bg-black/80 flex flex-col items-center justify-center p-4">
                    <div className="relative w-full max-w-lg h-96 bg-slate-800 rounded-lg overflow-hidden">
                        <Cropper
                            image={imageToCrop}
                            crop={crop}
                            zoom={zoom}
                            aspect={cropperFor === "avatarUrl" ? 1 / 1 : 1200 / 300}
                            cropShape={cropperFor === "avatarUrl" ? "round" : "rect"}
                            onCropChange={setCrop}
                            onZoomChange={setZoom}
                            onCropComplete={onCropComplete}
                        />
                    </div>
                    <div className="w-full max-w-lg mt-4">
                        <label className="text-white mb-2 block">Zoom</label>
                        <input
                            type="range"
                            value={zoom}
                            min={1}
                            max={3}
                            step={0.1}
                            onChange={(e) => setZoom(e.target.value)}
                            className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                        />
                    </div>
                    <div className="flex gap-4 mt-6">
                        <button
                            onClick={closeCropper}
                            className="bg-slate-200 text-slate-800 px-6 py-2 rounded-lg hover:bg-slate-300"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={applyCrop}
                            className="bg-sky-600 text-white px-6 py-2 rounded-lg hover:bg-sky-700"
                        >
                            Apply Crop
                        </button>
                    </div>
                </div>
            )}

            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <header className="bg-white/80 backdrop-blur-sm sticky top-0 z-10 p-4 border-b border-slate-200 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={toggleSidebar}
                            className="lg:hidden p-2 rounded-md hover:bg-slate-200"
                        >
                            <Icon name="menu" className="w-6 h-6" />
                        </button>
                        <h1 className="text-2xl font-bold text-slate-800">My Profile</h1>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2">
                        {error && isEditing && (
                            <p className="text-red-500 text-sm mr-2">{error}</p>
                        )}
                        {isEditing && (
                            <button
                                onClick={handleToggleEdit}
                                className="bg-slate-200 text-slate-800 px-4 py-2 rounded-lg hover:bg-slate-300 transition-colors"
                                disabled={saving}
                            >
                                Cancel
                            </button>
                        )}
                        <button
                            onClick={isEditing ? handleSave : handleToggleEdit}
                            className="bg-sky-600 text-white px-4 py-2 rounded-lg hover:bg-sky-700 transition-colors flex items-center gap-2 disabled:opacity-50"
                            disabled={saving}
                        >
                            {saving ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                    <span>Saving...</span>
                                </>
                            ) : (
                                <>
                                    <Icon name={isEditing ? "save" : "edit-3"} className="w-4 h-4" />
                                    <span>{isEditing ? "Save Changes" : "Edit Profile"}</span>
                                </>
                            )}
                        </button>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-0">
                    {/* Banner Section */}
                    <div className="relative h-48 md:h-64 bg-slate-200 group">
                        <img
                            src={currentData.bannerUrl}
                            alt="Banner"
                            className="w-full h-full object-cover"
                        />
                        {isEditing && (
                            <label className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
                                <Icon name="camera" className="w-8 h-8" />
                                <span className="ml-2 text-lg font-semibold">Change Banner</span>
                                <input
                                    type="file"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={(e) => handleImageSelect(e, "bannerUrl")}
                                />
                            </label>
                        )}
                    </div>

                    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
                        {/* Profile Header */}
                        <div className="-mt-16 md:-mt-20 flex flex-col md:flex-row items-center md:items-end gap-6">
                            <div className="relative group">
                                <img
                                    src={currentData.avatarUrl}
                                    alt="User Avatar"
                                    className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-white shadow-lg"
                                />
                                {isEditing && (
                                    <label className="absolute inset-0 rounded-full bg-black bg-opacity-50 flex items-center justify-center text-white cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Icon name="camera" className="w-6 h-6" />
                                        <input
                                            type="file"
                                            className="hidden"
                                            accept="image/*"
                                            onChange={(e) => handleImageSelect(e, "avatarUrl")}
                                        />
                                    </label>
                                )}
                            </div>

                            <div className="text-center md:text-left md:pb-4">
                                {isEditing ? (
                                    <input
                                        type="text"
                                        name="name"
                                        value={editData.name}
                                        onChange={handleInputChange}
                                        className="text-3xl font-bold text-slate-800 bg-slate-100 border border-slate-300 rounded-md px-2 py-1 w-full"
                                        placeholder="Display Name"
                                    />
                                ) : (
                                    <h2 className="text-3xl font-bold text-slate-800">{currentData.name}</h2>
                                )}
                                {isEditing ? (
                                    <input
                                        type="text"
                                        name="title"
                                        value={editData.title}
                                        onChange={handleInputChange}
                                        className="text-lg text-slate-500 bg-slate-100 border border-slate-300 rounded-md px-2 py-1 w-full mt-1"
                                        placeholder="Job Title"
                                    />
                                ) : (
                                    <p className="text-lg text-slate-500">{currentData.title}</p>
                                )}
                            </div>
                        </div>

                        {/* Profile Details Grid */}
                        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Work Information */}
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                                <h3 className="text-xl font-bold text-slate-800 mb-4">Work Information</h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-sm font-semibold text-slate-500">Work Duration</label>
                                        <p className="text-slate-800 text-lg font-medium flex items-center gap-2">
                                            <Icon name="clock" className="w-5 h-5 text-sky-600" />
                                            {workDuration}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-semibold text-slate-500">Work Start Date</label>
                                        {isEditing ? (
                                            <input
                                                type="date"
                                                name="workStartDate"
                                                value={editData.workStartDate}
                                                onChange={handleInputChange}
                                                className="w-full bg-slate-100 border border-slate-300 rounded-md p-2 mt-1"
                                            />
                                        ) : (
                                            <p className="text-slate-800 flex items-center gap-2">
                                                <Icon name="calendar" className="w-5 h-5 text-sky-600" />
                                                {new Date(currentData.workStartDate).toLocaleDateString("en-US", {
                                                    day: "numeric",
                                                    month: "long",
                                                    year: "numeric",
                                                })}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Account Information */}
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                                <h3 className="text-xl font-bold text-slate-800 mb-4">Account Information</h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-sm font-semibold text-slate-500">Username</label>
                                        <p className="text-slate-800 flex items-center gap-2">
                                            <Icon name="user" className="w-5 h-5 text-sky-600" />
                                            {currentData.username}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-semibold text-slate-500">Email</label>
                                        <p className="text-slate-800 flex items-center gap-2">
                                            <Icon name="mail" className="w-5 h-5 text-sky-600" />
                                            {currentData.email}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>

            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    onClick={toggleSidebar}
                    className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
                />
            )}
        </div>
    );
};

export default Profile;