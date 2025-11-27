import React, { useState, useEffect } from "react";
import { useUser } from "../context/UserContext";

export default function Profile() {
  const { user, updateUser } = useUser();

  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [profilePic, setProfilePic] = useState("");

  // Load user when fetched
  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setBio(user.bio || "");
      setProfilePic(user.profilePic || "");
    }
  }, [user]);

  // Convert photo to Base64
const handleImageUpload = (e) => {
  const file = e.target.files[0];
  if (!file) return;

  // Only allow images
  if (!file.type.startsWith("image/")) {
    alert("Please upload an image file");
    return;
  }

  // Optional: resize using canvas
  const reader = new FileReader();
  reader.onload = (event) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const maxSize = 500; // max width/height
      let width = img.width;
      let height = img.height;

      if (width > height) {
        if (width > maxSize) {
          height *= maxSize / width;
          width = maxSize;
        }
      } else {
        if (height > maxSize) {
          width *= maxSize / height;
          height = maxSize;
        }
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, width, height);
      const dataUrl = canvas.toDataURL("image/jpeg", 0.7); // compress
      setProfilePic(dataUrl);
    };
    img.src = event.target.result;
  };
  reader.readAsDataURL(file);
};



 const handleSave = async () => {
    try {
      console.log( bio, profilePic);
      const updated = await updateUser({ name, bio, profilePic });
      if (updated) alert("Profile updated!");
    } catch (err) {
      console.error("Error updating profile:", err);
      alert("Failed to update profile");
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6 text-center">My Profile</h2>

      {/* Image */}
      <div className="flex flex-col items-center mb-6">
        <img
          src={
            profilePic ||
            `https://ui-avatars.com/api/?name=${name}&background=0D8ABC&color=fff`
          }
          alt="Profile"
          className="w-32 h-32 rounded-full border mb-3"
        />
        <label className="cursor-pointer text-blue-500 underline">
          Change Photo
          <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
        </label>
      </div>

      {/* Name */}
      <div className="mb-4">
        <label className="block text-sm mb-1">Name</label>
        <input
          type="text"
          className="w-full p-2 rounded bg-white/10 border border-white/20"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      {/* Email */}
      <div className="mb-4">
        <label className="block text-sm mb-1">Email</label>
        <input
          type="text"
          className="w-full p-2 rounded bg-white/10 border border-white/20 opacity-50 cursor-not-allowed"
          value={user?.email}
          readOnly
        />
      </div>

      {/* Bio */}
      <div className="mb-4">
        <label className="block text-sm mb-1">Bio</label>
        <textarea
          rows="4"
          className="w-full p-2 rounded bg-white/10 border border-white/20"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
        ></textarea>
      </div>

      <button
        onClick={handleSave}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md mt-4"
      >
        Save Changes
      </button>
    </div>
  );
}
