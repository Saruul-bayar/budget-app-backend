import jwt from "jsonwebtoken";

export const generateAccessToken = (user: any) => {
  return jwt.sign(
    { email: user.email, id: user._id },
    process.env.ACCESS_TOKEN_SECRET as string,
    {
      expiresIn: "15m",
    }
  );
};
export const generateRefreshToken = (user: any) => {
  return jwt.sign(
    { email: user.email },
    process.env.REFRESH_TOKEN_SECRET as string,
    {
      expiresIn: "1y",
    }
  );
};
