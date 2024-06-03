import path from "path";
import { readFile, writeFile } from "fs/promises";
import axios from "axios";

const __dirname = import.meta.dirname;

const getRoommates = async (req, res) => {
  try {
    const data = await readFile(
      path.join(__dirname, "../database/roommates.json"),
      "utf-8"
    );
    const roommates = JSON.parse(data);
    res.json(roommates);
  } catch (error) {
    console.error("Se ha producido un error al obtener el listado", error);
    res.status(503).json({
      error: "Servicio inubicable para cargar los datos del servidor",
      message: error.message,
    });
  }
};

const createRoommate = async (req, res) => {
  try {
    const { data } = await axios("https://randomuser.me/api");
    const newUser = {
      nombre: data.results[0].name.first,
      debe: 0,
      recibe: 0,
    };
    const getroommates = await readFile(
      path.join(__dirname, "../database/roommates.json"),
      "utf-8"
    );
    const roommates = JSON.parse(getroommates);
    roommates.roommates.push(newUser);
    await writeFile(
      path.join(__dirname, "../database/roommates.json"),
      JSON.stringify(roommates)
    );
    res.json(roommates);
  } catch (error) {
    console.error("Error al agregar un nuevo roommate:", error);
    res.status(500).json({
      error: "Hubo un error al procesar la solicitud",
      message: error.message,
    });
  }
};

//exportamos constantes
export const controllerRoomUsers = {
  getRoommates,
  createRoommate,
};
