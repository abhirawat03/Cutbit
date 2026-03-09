import Api from "../api/axios";

const getCurrentUser = async () => {
  const res = await Api.get("/users/current-user");
  return res.data.data;
};

const logoutUser = async () => {
  const res = await Api.post("/users/logout");
  return res.data.data;
};

export {getCurrentUser, logoutUser}