import api from "./api";

const API_URL = "/answers";

const createAnswer = (content, questionId) => {
  return api.post(API_URL, { content, questionId });
};

const acceptAnswer = (answerId) => {
  return api.post(`${API_URL}/${answerId}/accept`);
};

const AnswerService = {
  createAnswer,
  acceptAnswer
};

export default AnswerService;
