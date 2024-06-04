import { readFile, writeFile } from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";

const __dirname = import.meta.dirname;

//obtener todos los gastos.
const getAllGastos = async (req, res) => {
  try {
    const data = await readFile(
      path.join(__dirname, "../database/gastos.json"),
      "utf-8"
    );
    const gastos = JSON.parse(data);
    res.json(gastos);
  } catch (error) {
    console.log(error);
  }
};

const createGasto = async (req, res) => {
  try {
    const { roommate, descripcion, monto } = req.body;

    if (!roommate || !descripcion || !monto) {
      return res.status(400).json({ ok: false, msg: "campos obligatorios" });
    }

    const id = uuidv4().slice(0, 3);
    const newGasto = {
      id: id,
      roommate: roommate,
      descripcion: descripcion,
      monto: monto,
    };

    const getAllRoommates = await readFile(
      path.join(__dirname, "../database/roommates.json"),
      "utf-8"
    );
    const roommates = JSON.parse(getAllRoommates);

    const getAllGastos = await readFile(
      path.join(__dirname, "../database/gastos.json"),
      "utf-8"
    );
    const gastos = JSON.parse(getAllGastos);

    const amountPerUser = monto / roommates.roommates.length;

    roommates.roommates.forEach((r) => {
      if (r.nombre === roommate) {
        r.recibe += monto - amountPerUser;
      } else {
        r.debe += amountPerUser;
      }
    });

    await writeFile(
      path.join(__dirname, "../database/roommates.json"),
      JSON.stringify(roommates)
    );
    gastos.gastos.push(newGasto);
    await writeFile(
      path.join(__dirname, "../database/gastos.json"),
      JSON.stringify(gastos)
    );
    res.json(gastos);
  } catch (error) {
    console.error(
      "Se ha encontrado un error al intentar agregar gastos",
      error
    );
    res.status(500).json({
      error: "error interno al procesar su requerimiento ",
      msg: error.msg,
    });
  }
};

//borrar gastos
const removeGasto = async (req, res) => {
  try {
    const { id } = req.query;

    const getAllRoommates = await readFile(
      path.join(__dirname, "../database/roommates.json"),
      "utf-8"
    );
    const roommates = JSON.parse(getAllRoommates);

    const getAllGastos = await readFile(
      path.join(__dirname, "../database/gastos.json"),
      "utf-8"
    );
    const gastos = JSON.parse(getAllGastos);

    const gastosIndex = gastos.gastos.findIndex((g) => g.id === id);
    const monto = gastos.gastos[gastosIndex].monto;
    const roommate = gastos.gastos[gastosIndex].roommate;

    const amountPerUser = monto / roommates.roommates.length;

    roommates.roommates.forEach((r) => {
      if (r.nombre === roommate) {
        r.recibe -= monto - amountPerUser;
      } else {
        r.debe -= amountPerUser;
      }
    });

    gastos.gastos.splice(gastosIndex, 1);

    await writeFile(
      path.join(__dirname, "../database/roommates.json"),
      JSON.stringify(roommates)
    );
    await writeFile(
      path.join(__dirname, "../database/gastos.json"),
      JSON.stringify(gastos)
    );

    res.json({ roommates, gastos });
  } catch (error) {
    console.error("Error al eliminar gasto", error);
    res.status(500).json({
      error: "error de servidor ",
      msg: error.msg,
    });
  }
};

//Actualizar los gastos

const updateGasto = async (req, res) => {
  try {
    const { id } = req.query;

    const { roommate, descripcion, monto } = req.body;

    if (!roommate || !descripcion || !monto) {
      return res.status(400).json({ ok: false, msg: "campos obligatorios" });
    }
    const getAllRoommates = await readFile(
      path.join(__dirname, "../database/roommates.json"),
      "utf-8"
    );
    const roommates = JSON.parse(getAllRoommates);

    const getAllGastos = await readFile(
      path.join(__dirname, "../database/gastos.json"),
      "utf-8"
    );
    const gastos = JSON.parse(getAllGastos);

    const gastosIndex = gastos.gastos.findIndex((g) => g.id === id);
    const oldAmount = gastos.gastos[gastosIndex].monto;
    const oldRoommate = gastos.gastos[gastosIndex].roommate;

    const oldAccountPerRoommate = oldAmount / roommates.roommates.length;
    const newAccountPerRoommate = monto / roommates.roommates.length;

    roommates.roommates.forEach((r) => {
      if (r.nombre === oldRoommate) {
        r.recibe -= oldAmount - oldAccountPerRoommate;
      } else {
        r.debe -= oldAccountPerRoommate;
      }

      if (r.nombre === roommate.trim()) {
        r.recibe += monto - newAccountPerRoommate;
      } else {
        r.debe += newAccountPerRoommate;
      }
    });

    gastos.gastos[gastosIndex].roommate = roommate.trim();
    gastos.gastos[gastosIndex].descripcion = descripcion.trim();
    gastos.gastos[gastosIndex].monto = monto;

    await writeFile(
      path.join(__dirname, "../database/roommates.json"),
      JSON.stringify(roommates)
    );
    await writeFile(
      path.join(__dirname, "../database/gastos.json"),
      JSON.stringify(gastos)
    );

    res.json({ roommates, gastos });
  } catch (error) {
    console.error("Error al editar un gasto:", error);
    res.status(500).json({
      error: "Hubo un error al procesar la solicitud",
      message: error.message,
    });
  }
};

//aqui exportamos las constantes siempre al final del archivo
export const ControllerGastosRoommates = {
  getAllGastos,
  createGasto,
  removeGasto,
  updateGasto,
};
