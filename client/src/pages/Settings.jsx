import React, { useEffect, useState } from "react"
import { useCurrentUser } from "../hooks/queries/useCurrentUser";
import { useUpdateProfile } from "../hooks/mutations/useUpdateProfile";
import { useUpdateAvatar } from "../hooks/mutations/useUpdateAvatar";
import { useDeleteAvatar } from "../hooks/mutations/useDeleteAvatar";
import { useChangePassword } from "../hooks/mutations/useChangePassword";

export default function Settings() {
  const { data: user, isLoading } = useCurrentUser();
  const updateProfileMutation = useUpdateProfile();
  const updateAvatarMutation = useUpdateAvatar();
  const deleteAvatarMutation = useDeleteAvatar();
  const changePasswordMutation = useChangePassword();
  const [avatarImg, setAvatarImg] = useState(null);
  const [showAvatar, setShowAvatar] = useState(false)
  const [form, setForm] = useState({
    avatar: null,
    email: "",
    fullName: ""
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const DEFAULT_AVATAR =
    "https://cdn-icons-png.flaticon.com/512/149/149071.png";

  useEffect(() => {

    if (!user) return;

    setForm({
      avatar: user.avatar,
      email: user.email,
      fullName: user.fullName
    });

  }, [user]);

  useEffect(() => {
    const avatar = form.avatar;
    return () => {
      if (avatar?.startsWith("blob:")) {
        URL.revokeObjectURL(avatar)
      }
    }
  }, [form.avatar])

  const uploadAvatar = () => {
    if (!avatarImg) return;

    const formData = new FormData();
    formData.append("avatar", avatarImg);

    updateAvatarMutation.mutate(formData, {
      onSuccess: (data) => {
        setForm(prev => ({
          ...prev,
          avatar: data.avatar
        }));
        setAvatarImg(null);
      }
    });
  };

  const removeAvatar = () => {
    deleteAvatarMutation.mutate(undefined, {
      onSuccess: () => {
        setForm(prev => ({
          ...prev,
          avatar: null
        }));
        setAvatarImg(null);
      }
    });
  };

  const hasChanges =
    form.fullName !== user?.fullName ||
    form.email !== user?.email;

  const updateProfile = () => {
    updateProfileMutation.mutate(
      {
        fullName: form.fullName,
        email: form.email
      },
      {
        onSuccess: (user) => {
          setForm({
            avatar: user.avatar,
            email: user.email,
            fullName: user.fullName
          });
        }
      }
    );
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setAvatarImg(file);
    const previewUrl = URL.createObjectURL(file);
    setForm(prev => ({
      ...prev,
      avatar: previewUrl
    }));
  };

  const updatePassword = () => {
    if (!canUpdatePassword) return;

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    if (passwordForm.currentPassword === passwordForm.newPassword) {
      alert("New password must be different from current password");
      return;
    }

    if (passwordForm.newPassword.length < 8) {
      alert("Password must be at least 8 characters");
      return;
    }

    changePasswordMutation.mutate(
      {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      },
      {
        onSuccess: () => {

          setPasswordForm({
            currentPassword: "",
            newPassword: "",
            confirmPassword: ""
          });

          alert("Password updated successfully");
        }
      }
    );
  };

  const canUpdatePassword =
    Boolean(passwordForm.currentPassword) &&
    Boolean(passwordForm.newPassword) &&
    Boolean(passwordForm.confirmPassword);


  if (isLoading) {
    return <p className="text-white p-6">Loading user...</p>;
  }
  return (
    <div className="min-h-screen text-white p-6">
      <div className="max-w-4xl mx-auto space-y-8">

        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold">Account Settings</h1>
          <p className="text-gray-400 mt-2">
            Manage your profile information and security preferences.
          </p>
        </div>

        {/* Profile Information */}
        <div className="bg-[#111827] border border-[#1f2937] rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-[#1f2937]">
            <h2 className="text-lg font-semibold">Profile Information</h2>
            <p className="text-gray-400 text-sm mt-1">
              Update your public profile name and avatar.
            </p>
          </div>

          <div className="p-6 space-y-6">

            {/* Avatar Section */}
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-700 cursor-pointer"
                onClick={() => setShowAvatar(true)}
              >
                <img
                  src={form?.avatar || DEFAULT_AVATAR}
                  alt="avatar"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex gap-4 text-sm">
                {!avatarImg ? (
                  <label className="text-blue-500 hover:text-blue-400 cursor-pointer">
                    Choose Photo
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      className="hidden"
                    />
                  </label>
                ) : (
                  <button
                    onClick={uploadAvatar}
                    className="text-green-400 hover:text-green-300 cursor-pointer"
                  >
                    Upload
                  </button>
                )}
                {form.avatar && (
                  <button
                    onClick={removeAvatar}
                    disabled={deleteAvatarMutation.isPending}
                    className="text-gray-400 hover:text-gray-300 cursor-pointer"
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>

            {/* Inputs */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm text-gray-400">
                  Display Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  id="fullName"
                  value={form.fullName || ""}
                  onChange={(e) =>
                    setForm(prev => ({ ...prev, fullName: e.target.value }))
                  }
                  className="mt-2 w-full bg-[#0b1220] border border-[#1f2937] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label htmlFor="email" className="text-sm text-gray-400">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={form.email || ""}
                  onChange={(e) =>
                    setForm(prev => ({ ...prev, email: e.target.value }))
                  }
                  className="mt-2 w-full bg-[#0b1220] border border-[#1f2937] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </div>
          </div>

          <div className="bg-[#0f172a] px-6 py-4 flex justify-end">
            <button
              onClick={updateProfile}
              disabled={!hasChanges || updateProfileMutation.isPending}
              className={`px-6 py-2 rounded-lg text-sm font-medium
                ${hasChanges
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-gray-600 cursor-not-allowed"}
              `}>
              {updateProfileMutation.isPending ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>

        {/* Security Section */}
        <div className="bg-[#111827] border border-[#1f2937] rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-[#1f2937]">
            <h2 className="text-lg font-semibold">Security</h2>
            <p className="text-gray-400 text-sm mt-1">
              Change your password to keep your account secure.
            </p>
          </div>

          <div className="p-6 space-y-6">
            <div>
              <label className="text-sm text-gray-400">
                Current Password
              </label>
              <input
                type="password"
                value={passwordForm.currentPassword}
                onChange={(e) =>
                  setPasswordForm(prev => ({
                    ...prev,
                    currentPassword: e.target.value
                  }))
                }
                className="mt-2 w-full bg-[#0b1220] border border-[#1f2937] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm text-gray-400">
                  New Password
                </label>
                <input
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(e) =>
                    setPasswordForm(prev => ({
                      ...prev,
                      newPassword: e.target.value,
                    }))
                  }
                  placeholder="Minimum 8 characters"
                  className="mt-2 w-full bg-[#0b1220] border border-[#1f2937] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="text-sm text-gray-400">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) =>
                    setPasswordForm(prev => ({
                      ...prev,
                      confirmPassword: e.target.value
                    }))
                  }
                  className="mt-2 w-full bg-[#0b1220] border border-[#1f2937] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </div>
          </div>

          <div className="bg-[#0f172a] px-6 py-4 flex justify-end">
            <button
              onClick={updatePassword}
              disabled={!canUpdatePassword || changePasswordMutation.isPending}
              className={`px-6 py-2 rounded-lg text-sm font-medium
    ${canUpdatePassword
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-gray-600 cursor-not-allowed"
                }`}>
              {changePasswordMutation.isPending ? "Updating..." : "Update Password"}
            </button>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-[#1f172a] border border-red-500/30 rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-red-500/20">
            <h2 className="text-lg font-semibold text-red-400">
              Danger Zone
            </h2>
            <p className="text-gray-400 text-sm mt-1">
              Permanently delete your account and all associated data.
            </p>
          </div>

          <div className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h3 className="font-medium">Delete Account</h3>
              <p className="text-gray-400 text-sm">
                This action is irreversible. Once deleted, you cannot recover your data.
              </p>
            </div>

            <button className="bg-red-600 hover:bg-red-700 px-6 py-2 rounded-lg text-sm font-medium">
              Delete Permanently
            </button>
          </div>
        </div>

      </div>
      {showAvatar && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
          onClick={() => setShowAvatar(false)}
        >
          <img
            src={form?.avatar || DEFAULT_AVATAR}
            alt="avatar large"
            className="max-w-[90%] max-h-[90%] rounded-lg shadow-xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  )
}