import prisma from "../config/database.js";
import { createNotification } from "../services/notificationService.js";

export const createAnswer = async (req, res) => {
  try {
    const { content, questionId } = req.body;
    const authorId = req.user.id;

    if (!content || !questionId) {
      return res
        .status(400)
        .json({ message: "Content and questionId are required" });
    }

    const question = await prisma.question.findUnique({
      where: { id: questionId }
    });
    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    const newAnswer = await prisma.answer.create({
      data: { content, questionId, authorId }
    });

    await createNotification({
      userId: question.authorId,
      actorId: authorId,
      type: "NEW_ANSWER",
      questionId: question.id,
      answerId: newAnswer.id
    });

    res.status(201).json(newAnswer);
  } catch (error) {
    console.error("Error creating answer:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateAnswer = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const userId = req.user.id;

    if (!content) {
      return res.status(400).json({ message: "Content is required" });
    }

    const answer = await prisma.answer.findUnique({ where: { id } });
    if (!answer) {
      return res.status(404).json({ message: "Answer not found" });
    }

    if (answer.authorId !== userId) {
      return res
        .status(403)
        .json({ message: "You are not authorized to update this answer" });
    }

    const updatedAnswer = await prisma.answer.update({
      where: { id },
      data: { content }
    });

    res.status(200).json(updatedAnswer);
  } catch (error) {
    console.error("Error updating answer:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteAnswer = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const answer = await prisma.answer.findUnique({ where: { id } });
    if (!answer) {
      return res.status(404).json({ message: "Answer not found" });
    }

    if (answer.authorId !== userId) {
      return res
        .status(403)
        .json({ message: "You are not authorized to delete this answer" });
    }

    await prisma.answer.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting answer:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const acceptAnswer = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const answerToAccept = await prisma.answer.findUnique({
      where: { id },
      include: { question: true }
    });

    if (!answerToAccept) {
      return res.status(404).json({ message: "Answer not found" });
    }

    if (answerToAccept.question.authorId !== userId) {
      return res
        .status(403)
        .json({ message: "Only the question author can accept an answer" });
    }

    const updatedAnswer = await prisma.$transaction(async (tx) => {
      await tx.answer.updateMany({
        where: {
          questionId: answerToAccept.questionId,
          isAccepted: true
        },
        data: { isAccepted: false }
      });

      const newlyAcceptedAnswer = await tx.answer.update({
        where: { id },
        data: { isAccepted: true }
      });

      return newlyAcceptedAnswer;
    });

    await createNotification({
      userId: answerToAccept.authorId,
      actorId: userId,
      type: "ACCEPTED_ANSWER",
      questionId: answerToAccept.questionId,
      answerId: answerToAccept.id
    });

    res.status(200).json(updatedAnswer);
  } catch (error) {
    console.error("Error accepting answer:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
