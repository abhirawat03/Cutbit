import Api from "../api/axios";

export const getDashboardStats = async (range) => {
  const res = await Api.get(`/dashboard/stats?range=${range}}`);
  return res.data.data;
};
