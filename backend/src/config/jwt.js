import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import dotenv from "dotenv";
dotenv.config();

const createAccessToken = (payload) => {
  return jwt.sign({ payload }, process.env.SECRET_KEY, {
    algorithm: "HS256",
    expiresIn: "3h", // h: hour, m: minutes, s: seconds, d: days
  });
};

const verifyAccessToken = (accessToken) => {
  try {
    return jwt.verify(accessToken, process.env.SECRET_KEY);
  } catch (error) {
    return false;
  }
};
const middlewareToken = async (req, res, next) => {
  let { authorization } = req.headers; // lấy authorization từ headers của request FE gửi lên
  console.log("token: ", authorization);
  // TH1: token không có trong header của request
  if (!authorization) {
    // mã lỗi 4xx: lỗi của user
    return res.status(401).json({ message: "Unauthorized" });
  }

  let checkToken = verifyAccessToken(authorization);
  // TH2: token không hợp lệ
  if (!checkToken) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  console.log("checkToken: ", checkToken);

  // query user từ database
  let userId = checkToken.payload.userId;

  let user = await prisma.users.findFirst({
    where: {
      user_id: userId,
    },
  });

  if (!user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  // gán userId vào req
  req.userId = userId; // lấy user_id từ token hay user_id từ database đều được

  // TH3: token hợp lệ
  next();
};
export { createAccessToken, verifyAccessToken, middlewareToken };
