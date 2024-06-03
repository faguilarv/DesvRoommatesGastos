import { readFile, writeFile } from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuidv4";

const __dirname = import.meta.dirname;

const getAllGastos = async (req, res) => {
  try {
    const data = await readFile(
      path.join(__dirname, "..database/gastos.json"),
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

    const getRoommates = await readFile(
      path.join(__dirname, "../database/roommates.json"),
      "utf-8"
    );
    const roommates = JSON.parse(getRoommates);

    const getAllGastos = await readFile(
      path.join(__dirname, "..database/gastos.json"),
      "utf-8"
    );
    const gastos = JSON.parse(getAllGastos);

    const amountOfPeople = monto / roommates.roommates.length;

    roommates.roommates.forEach((r) => {
      if (r.nombre === roommate) {
        r.recibe += monto - amountOfPeople;
      } else {
        r.debe += amountOfPeople;
      }
    });
  } catch (error) {}
};
