const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: {
    type: String,
    enum: ['CEO', 'Frontend Lead', 'Backend Lead', 'DevOps Lead', 'AI Engineer Lead', 'QA Lead'],
    default: 'Frontend Lead'
  }
});
module.exports = mongoose.model('User', userSchema);