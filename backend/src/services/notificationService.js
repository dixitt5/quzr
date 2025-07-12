import prisma from "../config/database.js";

/**
 * Creates a notification.
 * @param {string} userId - The ID of the user to notify.
 * @param {string} actorId - The ID of the user who triggered the notification.
 * @param {string} type - The type of notification (e.g., 'NEW_ANSWER').
 * @param {string} [questionId] - The ID of the related question.
 * @param {string} [answerId] - The ID of the related answer.
 */
export const createNotification = async ({
  userId,
  actorId,
  type,
  questionId,
  answerId
}) => {
  if (userId === actorId) {
    return;
  }

  try {
    await prisma.notification.create({
      data: {
        userId,
        actorId,
        type,
        questionId,
        answerId
      }
    });
  } catch (error) {
    console.error("Failed to create notification:", error);
  }
};
