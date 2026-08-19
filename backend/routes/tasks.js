const router = require('express').Router();
const Task = require('../models/Task');

router.get('/project/:projectId', async (req, res) => {
  const tasks = await Task.find({ project: req.params.projectId }).populate('assignee', 'name');
  res.json(tasks);
});

router.post('/', async (req, res) => {
  const task = new Task(req.body);
  await task.save();
  const io = req.app.get('io');
  io.emit('task-updated', task);
  res.json(task);
});

router.put('/:id/move', async (req, res) => {
  const { column } = req.body;
  const task = await Task.findByIdAndUpdate(req.params.id, { column }, { new: true });
  const io = req.app.get('io');
  io.emit('task-updated', task);
  res.json(task);
});

router.post('/:id/comment', async (req, res) => {
  const { userId, text } = req.body;
  const task = await Task.findById(req.params.id);
  task.comments.push({ author: userId, text });
  await task.save();
  const io = req.app.get('io');
  io.emit('task-updated', task);
  res.json(task);
});

module.exports = router;