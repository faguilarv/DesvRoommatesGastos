import { Router } from "express";

import { ControllerGastosRoommates } from "../controllers/controllerGastos.js";

const router = Router();

router.get("/gastos", ControllerGastosRoommates.getAllGastos);

router.post("/gasto", ControllerGastosRoommates.createGasto);

router.delete("/gasto", ControllerGastosRoommates.removeGasto);

router.put("/gasto", ControllerGastosRoommates.updateGasto);

export default router;
