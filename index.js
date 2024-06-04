import express from "express";
import rutaUser from "./router/user.route.js";
import rutaGastos from "./router/gastos.route.js";

const __dirname = import.meta.dirname;

const app = express();

//Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));

//rutas
app.use("/", rutaUser);
app.use("/", rutaGastos);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Srv_Conectado exitosamente al puerto ${PORT}`);
});
