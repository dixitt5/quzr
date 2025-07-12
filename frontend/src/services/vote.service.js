import api from "./api";
const API_URL = "/votes";

const upvoteAnswer = (answerId) => {
  return api.post(`${API_URL}/upvote`, { answerId });
};

const VoteService = {
  upvoteAnswer
};

export default VoteService;
