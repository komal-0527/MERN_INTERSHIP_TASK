import express from "express";
import {
  createTodo,
  deleteTodo,
  getAllTodo,
  updateTodo,
} from "../controllers/todoControllers.js";

const router = express.Router();

//  http://localhost:8080/api/todo/
router.post("/", createTodo);

router.get("/", getAllTodo);

router.delete("/:id", deleteTodo);

router.put("/:id", updateTodo);
export default router;
