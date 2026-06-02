const express = require('express');
const app = express();
app.use(express.json());

// Store tasks in memory
let tasks = [
  { id: 1, task: "Learn Docker" },
  { id: 2, task: "Learn Kubernetes" },
  { id: 3, task: "Build CI/CD Pipeline" }
];

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    app: 'Task Manager',
    version: '1.0.0'
  });
});

// Get all tasks
app.get('/tasks', (req, res) => {
  res.json(tasks);
});

// Add new task
app.post('/tasks', (req, res) => {
  const newTask = {
    id: tasks.length + 1,
    task: req.body.task
  };
  tasks.push(newTask);
  res.json(newTask);
});

// Start server
app.listen(3000, () => {
  console.log('Task Manager running on port 3000');
});