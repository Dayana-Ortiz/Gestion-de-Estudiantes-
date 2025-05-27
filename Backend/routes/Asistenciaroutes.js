const express = require ("express");
const router = express.Router();
const asistenciamodelo = require("../modelo/Asistenciamodelo.js");

router.get("/",asistenciamodel.consultarDetalle);
router.post("/",asistenciamodel.ingresar);

router.route("/:iden")
.get(asistenciamodel.consultarDetalle);

module.exports = router;