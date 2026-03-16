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

    // response
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
// get all todos
export const getAllTodo = async (req, res) => {
  try {
    // find todos array
    const todos = await Todo.find();
    // response
    res.status(200).json({
      success: true,
      message: "Todos fetched successfully",
      todos,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Server Error: ${error.message}`,
    });
  }
};

// delete todos bu id
export const deleteTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const todo = await Todo.findById(id);
    if (!todo) {
      return res.status(404).json({
        success: false,
        message: "Todo not found",
      });
    }
    await todo.deleteOne();
    res.status(200).json({
      success: true,
      message: "todo delete successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Server Error: ${error.message}`,
    });
  }
};

export const updateTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, isCompleted } = req.body;

    // Build update object dynamically
    const updateData = {};
    if (name) updateData.name = name.toLowerCase();
    if (typeof isCompleted === "boolean") updateData.isCompleted = isCompleted;

    // Find todo by id and update
    const updatedTodo = await Todo.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true } // return the updated document
    );

    if (!updatedTodo) {
      return res.status(404).json({
        success: false,
        message: "Todo not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Todo updated successfully",
      todo: updatedTodo,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Server Error: ${error.message}`,
    });
  }
};
