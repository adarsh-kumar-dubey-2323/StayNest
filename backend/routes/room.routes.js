
import express from "express";

import { isAuthenticated } from "../middleware/isAuthenticated.js";
import { isOwner } from "../middleware/isOwner.js";


import { upload } from "../config/multer.js";
import { addRoom, getOwnerRooms, getAllRooms, deleteRoom } from "../controller/room.controller.js";

const roomRouter = express.Router();

// Register a new room
roomRouter.post(
  "/add",
  isAuthenticated,
  isOwner,
  upload.array("image"),
  addRoom
);

// Get rooms belonging to the logged-in owner
roomRouter.get(
  "/get",
  isAuthenticated,
  isOwner,
  getOwnerRooms
);

// Get all rooms (public route)
roomRouter.get("/get-all", getAllRooms);

// Delete a room
roomRouter.delete(
  "/delete/:roomId",
  isAuthenticated,
  isOwner,
  deleteRoom
);

export default roomRouter;
