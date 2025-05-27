const express = require("express");
const cors = require("cors");
const serverless = require("serverless-http");

const app = express();
const router = express.Router();
const estudiantesroutes = require("../../Backend/routes/Estudiantesroutes.js");

// Middlewares
app.use(express.json());
app.use(cors());

// Rutas
router.use("/usuarios", estudiantesroutes);

// Ruta base para Netlify Functions
app.use("/.netlify/functions", router);

// Exportar como función serverless
module.exports.handler = serverless(app);
