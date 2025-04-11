import { PrismaClient } from "@prisma/client";
import { createAccessToken } from "../config/jwt.js";
import crypto from "crypto";
import { sendMail } from "../utils/sendMail.js";
import transporter from "../config/transporter.js";
const prisma = new PrismaClient();
const signup = async (req, res) => {
  try {
    const { Username, Password, Email, PhoneNumber, confirmPassword } =
      req.body;

    if (!Username || !Password || !Email || !PhoneNumber) {
      return res.status(400).json({ message: "All fields are required." });
    }

    if (Password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match." });
    }

    const user = await prisma.users.findFirst({
      where: {
        OR: [
          {
            Username: Username,
          },
          {
            Email: Email,
          },
        ],
      },
    });

    if (user) {
      return res.status(400).json({ message: "user exist" });
    }
    const result = await prisma.users.create({
      data: {
        Username: Username,
        Password: Password,
        Email: Email,
        PhoneNumber: PhoneNumber,
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

const forgotPass = async (req, res) => {
  let { Email } = req.body;
  const user = await prisma.users.findFirst({
    where: {
      Email: Email,
    },
  });

  if (!user) {
    return res.status(400).json({ message: "user don't exist" });
  }
  let code = crypto.randomBytes(6).toString("hex");
  const ressetPassMail = {
    from: process.env.EMAIL_USER,
    to: Email,
    subject: "code xác thực",
    html: `<h1>${code}</h1>`,
  };
  const codeExist = await prisma.forgotPass.findFirst({
    where: {
      UserID: user.UserID,
    },
  });

  if (codeExist) {
    let expiry = new Date(new Date().getTime() + 30 * 1000);
    await prisma.forgotPass.update({
      data: {
        ForgotCode: code,
        UserID: user.UserID,
        Expiry: expiry,
      },
      where: {
        UserID: user.UserID,
      },
    });
    return sendMail(res, transporter, ressetPassMail);
  } else {
    let expiry = new Date(new Date().getTime() + 30 * 1000);
    await prisma.forgotPass.create({
      data: {
        ForgotCode: code,
        UserID: user.UserID,
        Expiry: expiry,
      },
    });
    return sendMail(res, transporter, ressetPassMail);
  }
};

const changePass = async (req, res) => {
  try {
    const { Email, ForgotCode, NewPassword, ConfirmPassword } = req.body; 
    const user = await prisma.users.findFirst({
      where: {
        Email: Email,
      },
    });
    const codeExist = await prisma.forgotPass.findFirst({
      where: {
        UserID: user.UserID,
        ForgotCode: ForgotCode,
      },
    });

    if (!codeExist) {
      return res.status(400).json({ message: "Invalid code" });
    }
    if (NewPassword !== ConfirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }
    if (codeExist.Expiry < new Date()) {
      return res.status(400).json({ message: "Code expired" });
    }
    await prisma.users.update({
      data: {
        Password: NewPassword,
      },
      where: {
        UserID: user.UserID,
      },
    });
    await prisma.forgotPass.delete({
      where: {
        UserID: user.UserID,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "server error" });
    
  }
};
export { login, signup, forgotPass };
