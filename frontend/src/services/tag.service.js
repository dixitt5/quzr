import api from "./api";

const getAllTags = () => {
  return api.get("/tags");
};

const tagService = {
  getAllTags
};

export default tagService;
