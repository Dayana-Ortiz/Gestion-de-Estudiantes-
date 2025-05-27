const express = require ("express");
const router = express.Router();
const asistenciamodelo = require("../modelo/asistenciamodelo.js");

router.get("/",asistenciamodelo.consultarDetalle);
router.post("/",asistenciamodelo.ingresar);

router.route("/:iden")
.get(asistenciamodelo.consultarDetalle);

module.exports = router;