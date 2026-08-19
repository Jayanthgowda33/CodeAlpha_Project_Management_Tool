const mongoose = require('mongoose');
const taskSchema = new mongoose.Schema({
  project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
  title: String,
  description: { type: String, default: '' },
  column: { type: String, default: 'To Do' },
  assignee: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  comments: [{
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    text: String,
    createdAt: { type: Date, default: Date.now }
  }],
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Task', taskSchema);