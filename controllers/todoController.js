const Todo = require('../models/todo');

exports.getTodos = async (req, res) => {
  const todos = await Todo.findAll();
  res.render('index', { todos, user: req.user });
};

exports.getMyTodos = async (req, res) => {
  const todos = await Todo.findAll({ where: { userId: req.user.id } });
  res.render('myTodos', { todos });
};

exports.addTodo = async (req, res) => {
  const { title } = req.body;
  await Todo.create({ title, userId: req.user.id });
  res.redirect('/');
};
exports.renderEditPage = async (req, res) => {
  const todo = await Todo.findOne({ where: { id: req.params.id, userId: req.user.id } });
  if (!todo) return res.redirect('/');
  res.render('editTodo', { todo });
  //return res.redirect('/');
};

exports.editTodo = async (req, res) => {
  const { id, title } = req.body;
  try {
    await Todo.update({ title }, { where: { id, userId: req.user.id } });
    res.redirect('/');
  } catch (error) {
    res.status(500).send('Error updating todo');
  }
};

exports.deleteTodo = async (req, res) => {
  const { id } = req.body;
  try {
    await Todo.destroy({ where: { id, userId: req.user.id } });
    res.redirect(req.get('referer'));
  } catch (error) {
    res.status(500).send('Error deleting todo');
  }
};
exports.findTodoById = async (req, res) => {
  const todo = await Todo.findOne({ where: { id: req.params.id, userId: req.user.id } });
  res.json(todo);
};