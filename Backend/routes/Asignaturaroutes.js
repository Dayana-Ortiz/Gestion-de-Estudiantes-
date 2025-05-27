const express = require ("express");
const router = express.Router();
const asignaturacontrol = require("../controllers/Asignaturacontrol.js");

router.get("/",asignaturacontrol.consultarDetalle);
router.post("/",asignaturacontrol.ingresar);

router.route("/:iden")
.get(asignaturacontrol.consultarDetalle);

module.exports = router;