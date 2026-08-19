const router = require('express').Router();
const Project = require('../models/Project');

// CEO: get all projects they created
router.get('/owner/:userId', async (req, res) => {
  const projects = await Project.find({ owner: req.params.userId }).sort({ createdAt: -1 });
  res.json(projects);
});

// Team Lead: get projects assigned to their role
router.get('/team/:role', async (req, res) => {
  const projects = await Project.find({ assignedTeam: req.params.role }).sort({ createdAt: -1 });
  res.json(projects);
});

// CEO creates + assigns a project
router.post('/', async (req, res) => {
  const { name, description, owner, assignedTeam, dueDate } = req.body;
  const project = new Project({ name, description, owner, assignedTeam, dueDate, members: [owner] });
  await project.save();
  res.json(project);
});

router.get('/:id', async (req, res) => {
  const project = await Project.findById(req.params.id).populate('members', 'name');
  res.json(project);
});

router.put('/:id/status', async (req, res) => {
  const { status } = req.body;
  const project = await Project.findByIdAndUpdate(req.params.id, { status }, { new: true });
  res.json(project);
});

module.exports = router;