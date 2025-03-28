import { PrismaClient } from "@prisma/client";
import { createAccessToken } from "../config/jwt.js";
const prisma = new PrismaClient();
const signup = async (req, res) => {
  try {
    const { username, password, confirmPassword, email, phone } = req.body;

    if (!username || !password || !confirmPassword || !email || !phone) {
      return res.status(400).json({ error: "All fields are required." });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Passwords do not match." });
    }

    const user = await prisma.users.findFirst({
      where: {
        OR: [
          {
            Username: username,
          },
          {
            Email: email,
          },
        ],
      },
    });

    if (existingUser && existingUser.length > 0) {
      return res
        .status(400)
        .json({ error: "Username or Email already exists." });
    }
    const result = await prisma.users.create({
      data: {
        Username: username,
        Password: password,
        Email: email,
        PhoneNumber: phone,
        AvartarURL: "https://example.com/default-avatar.png",
      },
    });

    const userId = result.insertId;

    return res
      .status(201)
      .json({ message: "User registered successfully!", userId });
  } catch (error) {
    console.error("Signup error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
const login = async (req, res) => {
  try {
    const { Username, Password } = req.body;
    const user = await prisma.users.findFirst({
      where: {
        Username: Username,
      },
    });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    if (user.Password !== Password) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    const payload = {
      UserID: user.UserID,
      Username: user.Username,
    };
    const accessToken = createAccessToken(payload);
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      sameSite: "Lax",
      secure: true,
    });
    console.log(user);
    res.status(200).json({
      message: "Đăng nhập thành công",
      token: accessToken,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "server error" });
  }
};
export { login, signup };
