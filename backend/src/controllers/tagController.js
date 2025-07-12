import prisma from "../config/database.js";

export const createTag = async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name) {
      return res.status(400).json({ message: "Tag name is required" });
    }
    const newTag = await prisma.tag.create({
      data: { name, description }
    });
    res.status(201).json(newTag);
  } catch (error) {
    console.error("Error creating tag:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getAllTags = async (req, res) => {
  try {
    const tags = await prisma.tag.findMany({
      orderBy: { name: "asc" }
    });
    res.status(200).json(tags);
  } catch (error) {
    console.error("Error fetching tags:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const searchTags = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({ message: "Search query (q) is required" });
    }
    const tags = await prisma.tag.findMany({
      where: {
        name: {
          contains: q,
          mode: "insensitive"
        }
      }
    });
    res.status(200).json(tags);
  } catch (error) {
    console.error("Error searching tags:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateTag = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    if (!name && !description) {
      return res
        .status(400)
        .json({ message: "Either name or description must be provided" });
    }
    const updatedTag = await prisma.tag.update({
      where: { id },
      data: { name, description }
    });
    res.status(200).json(updatedTag);
  } catch (error) {
    console.error("Error updating tag:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
