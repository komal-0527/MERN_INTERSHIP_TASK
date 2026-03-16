import express from 'express';
import { createTodo } from '../controllers/todoControllers.js';

const router = express.Router();

router.post('/',createTodo)

export default router;