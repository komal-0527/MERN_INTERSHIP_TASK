import Todo from "../models/Todo.js";

export const createTodo = async (req, res) => {
  try {
    const { name } = req.body;

    // validation
    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Todo task name is required",
      });
    }

    // normalize name
    const normalizedName = name.toLowerCase();

    // check if already exists
    const exist = await Todo.findOne({ name: normalizedName });

    if (exist) {
      return res.status(400).json({
        success: false,
        message: "Todo already exists",
      });
    }

    // create todo
    const todo = await Todo.create({
      name: normalizedName,
    });

    res.status(201).json({
      success: true,
      message: "Todo created successfully",
      todo,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Server Error: ${error.message}`,
    });
  }
};

export const getAllTodo = async (req, res) => {
  try {
    const todos = await Todo.find();
    if (!todos) {
      return res.status(404).json({
        success: false,
        message: "Todos not fetch because of Empty array",
      });
    }

    res.status(200).json({
      success: true,
      message: "Todos fetched successfully",
      todos
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Server Error: ${error.message}`,
    });
  }
};
