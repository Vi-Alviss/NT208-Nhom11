import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const getUser = async (req, res) => {
  try {
    const users = await prisma.users.findMany();
    return res.status(200).json(users);
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getUserById = async (req, res) => {
  try {
   const { id } = req.params;
    const user = await prisma.users.findUnique({
      where: {
        UserID: parseInt(id),
      },
    });
    return res.status(200).json(user);
  } catch (error) {
    console.error("Get user by id error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getUserByIdQuery = async (req, res) => {
  try {
   const { id } = req.query;
    const user = await prisma.users.findUnique({
      where: {
        UserID: parseInt(id),
      },
    });
    return res.status(200).json(user);
  } catch (error) {
    console.error("Get user by id error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export { getUser, getUserById, getUserByIdQuery };
