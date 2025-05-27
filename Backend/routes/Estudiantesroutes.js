const express = require ("express");
const router = express.Router();
const estudiantecontrol = require("../controllers/Estudiantecontrol.js");

router.get("/",estudiantecontrol.consultarDetalle);
router.post("/",estudiantecontrol.ingresar);

router.route("/:iden")
.get(estudiantecontrol.consultarDetalle);

module.exports = router;