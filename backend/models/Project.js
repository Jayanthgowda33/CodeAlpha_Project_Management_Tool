const mongoose = require('mongoose');
const projectSchema = new mongoose.Schema({
  name: String,
  description: String,
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  assignedTeam: {
    type: String,
    enum: ['Frontend Lead', 'Backend Lead', 'DevOps Lead', 'AI Engineer Lead', 'QA Lead'],
    default: null
  },
  status: { type: String, enum: ['Pending', 'In Progress', 'Completed'], default: 'Pending' },
  dueDate: { type: Date, default: null },
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Project', projectSchema);