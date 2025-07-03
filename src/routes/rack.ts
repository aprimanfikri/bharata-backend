import express from "express";
import {
  createRack,
  deleteRack,
  getAllRacks,
  getRackById,
  updateRack,
} from "../controllers/rack";
import authenticate from "../middlewares/authenticate";

const user = express.Router();

user.route("/").get(getAllRacks).post(authenticate, createRack);
user
  .route("/:id")
  .get(getRackById)
  .patch(authenticate, updateRack)
  .delete(authenticate, deleteRack);

export default user;
