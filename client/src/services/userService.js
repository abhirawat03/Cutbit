import Api from "../api/axios";

const getCurrentUser = async () => {
  const res = await Api.get("/users/current-user");
  return res.data.data;
};

const updateProfile = async (data) => {
  const res = await Api.patch("/users/update-account", data);
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

export {getCurrentUser, updateProfile, logoutUser, updateAvatar, deleteAvatar}