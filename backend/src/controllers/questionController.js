import prisma from "../config/database.js";

export const createQuestion = async (req, res) => {
  try {
    const { title, content, tags } = req.body;
    const authorId = req.user.id;

    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required' });
    }

    const tagOperations = tags?.map((name) =>
      prisma.tag.upsert({
        where: { name },
        update: {},
        create: { name },
      })
    );

    const newQuestion = await prisma.question.create({
      data: {
        title,
        content,
        authorId,
        tags: {
          connect: tags ? (await Promise.all(tagOperations)).map((tag) => ({ id: tag.id })) : undefined,
        },
      },
      include: {
        tags: true,
      },
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
          },
        },
        tags: true,
        _count: {
          select: { votes: true, answers: true },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
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
            username: true
          }
        },
        answers: {
          include: {
            author: {
              select: {
                id: true,
                username: true
              }
            },
            votes: true
          },
          orderBy: {
            createdAt: "asc"
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
