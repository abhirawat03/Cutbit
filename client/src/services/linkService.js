import Api from "../api/axios";

const getLinks = async (currentPage) => {
  const res = await Api.get(`/links?page=${currentPage}`);
  return res.data.data.links;
};

const createLink = async (data) => {
  const res = await Api.post("/link", data);
  return res.data.data;
};

const getStats = async () => {
  const res = await Api.get("/stats");
  console.log(res.data.data)
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

export {getLinks, createLink, getStats, updateLink, deleteLink};