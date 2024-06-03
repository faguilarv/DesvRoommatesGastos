import { Router } from "express";

import { ControllerDeGastos } from "../controllers/controllerGastos.js";

const router = Router();

router.get("/gastos", ControllerDeGastos.getAllGastos);

router.post("/gasto", ControllerDeGastos.createGasto);

router.delete("/gasto", ControllerDeGastos.removeGasto);

router.put("/gasto", ControllerDeGastos.updateGasto);

export default router;
