const express = require ("express");
const router = express.Router();
const departamentocontrol = require("../controllers/Departamentocontrol.js");

router.get("/",departamentocontrol.consultarDetalle);
router.post("/",departamentocontrol.ingresar);

router.route("/:iden")
.get(departamentocontrol.consultarDetalle);

module.exports = router;