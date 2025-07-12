import prisma from "../config/database.js";

export const createQuestion = async (req, res) => {
  try {
    const { title, content, authorId } = req.body;

    if (!title || !content || !authorId) {
      return res
        .status(400)
        .json({ message: "Title, content, and authorId are required" });
    }

    const author = await prisma.user.findUnique({ where: { id: authorId } });
    if (!author) {
      return res.status(404).json({ message: "Author not found" });
    }

    const newQuestion = await prisma.question.create({
      data: {
        title,
        content,
        authorId
      }
    });

    res.status(201).json(newQuestion);
  } catch (error) {
    console.error("Error creating question:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getAllQuestions = async (req, res) => {
  try {
    const questions = await prisma.question.findMany({
      include: {
        author: {
          select: {
            id: true,
            username: true,
            imageUrl: true
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    });
    res.status(200).json(questions);
  } catch (error) {
    console.error("Error fetching questions:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getQuestionById = async (req, res) => {
  try {
    const { id } = req.params;
    const question = await prisma.question.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            imageUrl: true
          }
        }
      }
    });

    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    res.status(200).json(question);
  } catch (error) {
    console.error("Error fetching question:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;

    const question = await prisma.question.findUnique({
      where: { id }
    });

    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    if (req.user.id !== question.authorId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    if (!title && !content) {
      return res
        .status(400)
        .json({ message: "Title or content must be provided to update" });
    }

    const updatedQuestion = await prisma.question.update({
      where: { id },
      data: {
        title,
        content
      }
    });

    res.status(200).json(updatedQuestion);
  } catch (error) {
    console.error("Error updating question:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteQuestion = async (req, res) => {
  try {
    const { id } = req.params;

    const question = await prisma.question.findUnique({
      where: { id }
    });

    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    if (req.user.id !== question.authorId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await prisma.question.delete({
      where: { id }
    });

    res.status(204).send();
  } catch (error) {
    console.error("Error deleting question:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
