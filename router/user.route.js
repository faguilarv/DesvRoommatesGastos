import { Router } from "express";
import { controllerRoomUsers } from "../controllers/controllerUser.js";

const router = Router();

router.get("/roommates", controllerRoomUsers.getRoommates);

router.post("/roommate", controllerRoomUsers.createRoommate);

export default router;
