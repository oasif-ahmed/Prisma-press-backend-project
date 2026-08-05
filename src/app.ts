import cookieParser from "cookie-parser";
import express, { Application, Request, Response } from "express";
import config from "./config";
import cors from "cors";
import { userRoutes } from "./modules/user/user.route";
import { authRoutes } from "./modules/Auth/auth.route";
import { postRoutes } from "./modules/Posts/post.route";

const app: Application = express();

// middlewares
app.use(
  cors({
    origin: config.app_url,
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// default app urls:
app.get("/", async (req: Request, res: Response) => {
  res.send("App is working");
});

app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);

export default app;
