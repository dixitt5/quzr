import prisma from "../config/database.js";

const handleVote = async (req, res, type) => {
  const { questionId, answerId } = req.body;
  const userId = req.user.id;

  if ((!questionId && !answerId) || (questionId && answerId)) {
    return res
      .status(400)
      .json({
        message: "Provide either a questionId or an answerId, but not both."
      });
  }

  const whereClause = questionId
    ? { userId_questionId: { userId, questionId } }
    : { userId_answerId: { userId, answerId } };

  try {
    const existingVote = await prisma.vote.findUnique({ where: whereClause });

    if (existingVote) {
      if (existingVote.type === type) {
        await prisma.vote.delete({ where: whereClause });
        return res.status(200).json({ message: "Vote removed." });
      } else {
        const updatedVote = await prisma.vote.update({
          where: whereClause,
          data: { type }
        });
        return res.status(200).json(updatedVote);
      }
    } else {
      const newVote = await prisma.vote.create({
        data: {
          type,
          userId,
          questionId,
          answerId
        }
      });
      return res.status(201).json(newVote);
    }
  } catch (error) {
    console.error(`Error handling vote:`, error);
    res.status(500).json({ message: "Internal server error." });
  }
};

export const upvote = (req, res) => handleVote(req, res, "UPVOTE");

export const downvote = (req, res) => handleVote(req, res, "DOWNVOTE");
