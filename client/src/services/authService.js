import Api from "../api/axios";

const forgotPassword = (email) => {
  return Api.post("/auth/forgot-password", { email });
};

const resetPassword = ({ token, password }) => {
  return Api.post(`/auth/reset-password/${token}`, { password });
};

export {
    forgotPassword, 
    resetPassword
}