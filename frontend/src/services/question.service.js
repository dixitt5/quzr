import api from "./api";

const QuestionService = {
  // Get all questions
  getAllQuestions: async (params) => {
    const response = await api.get("/questions", { params });
    return response.data;
  },

  // Get question by ID
  getQuestionById: async (id) => {
    const response = await api.get(`/questions/${id}`);
    return response.data;
  },

  // Create a new question
  createQuestion: async (questionData) => {
    const response = await api.post("/questions", questionData);
    return response.data;
  },

  // Update a question
  updateQuestion: async (id, questionData) => {
    const response = await api.put(`/questions/${id}`, questionData);
    return response.data;
  },

  // Delete a question
  deleteQuestion: async (id) => {
    const response = await api.delete(`/questions/${id}`);
    return response.data;
  }
};

export default QuestionService;
