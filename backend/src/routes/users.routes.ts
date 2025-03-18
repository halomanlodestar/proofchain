import { Router } from "express";
import { findUserByEmail } from "../controllers/users.controller";

const usersRoutes = Router();

usersRoutes.use("/:email", findUserByEmail);

export default usersRoutes;
