import Api from "../api/axios";

const getLinks = async (currentPage) => {
  const res = await Api.get(`/links?page=${currentPage}&limit=10`);
  return res.data.data;
};

const getLink = async (id) => {
  const res = await Api.get(`/link/${id}`);
  console.log(res.data.data)
  return res.data.data;
};

const createLink = async (data) => {
  const res = await Api.post("/link", data);
  return res.data.data;
};

const getStats = async () => {
  const res = await Api.get("/stats");
  return res.data.data; 
};

const updateLink = async ({ id, data }) => {
  const res = await Api.patch(`/links/${id}`, data);
  return res.data.data;
};

const deleteLink = async (id) => {
  const res = await Api.delete(`/links/${id}`);
  return res.data.data;
};

export {getLinks, getLink, createLink, getStats, updateLink, deleteLink};