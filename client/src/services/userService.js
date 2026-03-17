import Api from "../api/axios";

const signupUser = async (data) => {
  const res = await Api.post("/users/register", data);
  return res.data.data;
};

const loginUser = async (data) => {
  const res = await Api.post("/users/login", data);
  return res.data.data;
};

const getCurrentUser = async () => {
  const res = await Api.get("/users/current-user");
  return res.data.data;
};

const deleteAccount = async (confirmText) => {
  const res = await Api.delete("/users/delete-account", {
    data: { confirm: confirmText },
  });
  return res.data;
};

const updateProfile = async (data) => {
  const res = await Api.patch("/users/update-account", data);
  return res.data.data;
};

const changePassword = async (data) => {
  const res = await Api.patch("/users/change-password", data);
  return res.data.data;
};

const logoutUser = async () => {
  const res = await Api.post("/users/logout");
  return res.data.data;
};

const updateAvatar = async (formData) => {
  const res = await Api.patch("/users/avatar", formData);
  return res.data.data;
};

const deleteAvatar = async () => {
  await Api.delete("/users/avatar");
};

export {signupUser, loginUser,getCurrentUser, updateProfile, changePassword, logoutUser, updateAvatar, deleteAvatar, deleteAccount}