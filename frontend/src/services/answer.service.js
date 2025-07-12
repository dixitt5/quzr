import api from "./api";

const API_URL = "/answers";

const createAnswer = (content, questionId) => {
  return api.post(API_URL, { content, questionId });
};

const AnswerService = {
  createAnswer
};

export default AnswerService;
