const express = require ("express");
const router = express.Router();
const asistenciacontrol = require("../controllers/Asistenciacontrol.js");

router.get("/",asistenciacontrol.consultarDetalle);
router.post("/",asistenciacontrol.ingresar);

router.route("/:iden")
.get(asistenciacontrol.consultarDetalle);

module.exports = router;