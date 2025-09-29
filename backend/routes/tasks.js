const express = require('express');
const Task = require('../models/Task');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

/**
 * @swagger
 * /api/v1/tasks:
 *   get:
 *     summary: Get tasks
 *     description: Get tasks based on user role (admin sees all, users see assigned/created tasks)
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of tasks
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Task'
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/', auth, async (req, res) => {
  try {
    let tasks;
    if (req.user.role === 'admin') {
      // Admin can see all tasks
      tasks = await Task.find({})
        .populate('createdBy', 'name email')
        .populate('assignedTo', 'name email')
        .sort({ createdAt: -1 });
    } else {
      // Regular users see tasks assigned to them or created by them
      tasks = await Task.find({
        $or: [
          { assignedTo: req.user._id },
          { createdBy: req.user._id }
        ]
      })
        .populate('createdBy', 'name email')
        .populate('assignedTo', 'name email')
        .sort({ createdAt: -1 });
    }
    res.json(tasks);
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ message: 'Server error while fetching tasks' });
  }
});

/**
 * @swagger
 * /api/v1/tasks:
 *   post:
 *     summary: Create a new task
 *     description: Create a new task with optional assignment (admin can assign to others)
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *             properties:
 *               title:
 *                 type: string
 *                 description: Task title
 *                 example: Complete project documentation
 *               description:
 *                 type: string
 *                 description: Task description
 *                 example: Write comprehensive documentation for the API
 *               priority:
 *                 type: string
 *                 enum: [low, medium, high]
 *                 description: Task priority level
 *                 example: high
 *               dueDate:
 *                 type: string
 *                 format: date-time
 *                 description: Task due date
 *                 example: 2024-12-31T23:59:59Z
 *               assignedTo:
 *                 type: string
 *                 description: User ID to assign task to (admin only, optional)
 *                 example: 507f1f77bcf86cd799439011
 *               status:
 *                 type: string
 *                 enum: [pending, in-progress, completed]
 *                 description: Initial task status
 *                 example: pending
 *     responses:
 *       201:
 *         description: Task created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Task created successfully
 *                 task:
 *                   $ref: '#/components/schemas/Task'
 *       400:
 *         description: Bad request - Missing required fields or invalid data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, assignedTo, priority, dueDate, status } = req.body;

    if (!title || !description) {
      return res.status(400).json({ message: 'Title and description are required' });
    }

    // If no assignedTo is provided, assign to self
    const assignedUser = assignedTo || req.user._id;

    // Verify assigned user exists
    const userExists = await User.findById(assignedUser);
    if (!userExists) {
      return res.status(400).json({ message: 'Assigned user not found' });
    }

    const task = new Task({
      title,
      description,
      status: status || 'pending',
      priority: priority || 'medium',
      dueDate: dueDate ? new Date(dueDate) : undefined,
      createdBy: req.user._id,
      assignedTo: assignedUser
    });

    await task.save();
    
    // Populate the task before sending response
    await task.populate('createdBy', 'name email');
    await task.populate('assignedTo', 'name email');

    res.status(201).json({
      message: 'Task created successfully',
      task
    });
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({ message: 'Server error while creating task' });
  }
});

/**
 * @swagger
 * /api/v1/tasks/{id}:
 *   put:
 *     summary: Update a task
 *     description: Update task details (admin can update any task, users can update assigned/created tasks)
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Task ID
 *         schema:
 *           type: string
 *           example: 507f1f77bcf86cd799439011
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Updated task title
 *                 example: Updated project documentation
 *               description:
 *                 type: string
 *                 description: Updated task description
 *                 example: Write and review comprehensive API documentation
 *               status:
 *                 type: string
 *                 enum: [pending, in-progress, completed]
 *                 description: Updated task status
 *                 example: in-progress
 *               priority:
 *                 type: string
 *                 enum: [low, medium, high]
 *                 description: Updated task priority
 *                 example: high
 *               dueDate:
 *                 type: string
 *                 format: date-time
 *                 description: Updated due date
 *                 example: 2024-12-31T23:59:59Z
 *               assignedTo:
 *                 type: string
 *                 description: User ID to reassign task to (admin only)
 *                 example: 507f1f77bcf86cd799439011
 *     responses:
 *       200:
 *         description: Task updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Task updated successfully
 *                 task:
 *                   $ref: '#/components/schemas/Task'
 *       400:
 *         description: Bad request - Invalid data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Task not found or access denied
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.put('/:id', auth, async (req, res) => {
  try {
    const { title, description, status, priority, dueDate, assignedTo } = req.body;
    const taskId = req.params.id;

    // Find task - admin can update any task, users can update tasks assigned to them or created by them
    let query;
    if (req.user.role === 'admin') {
      query = { _id: taskId };
    } else {
      query = {
        _id: taskId,
        $or: [
          { assignedTo: req.user._id },
          { createdBy: req.user._id }
        ]
      };
    }

    const task = await Task.findOne(query);
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found or access denied' });
    }

    // Update fields
    if (title) task.title = title;
    if (description) task.description = description;
    if (status) task.status = status;
    if (priority) task.priority = priority;
    if (dueDate) task.dueDate = new Date(dueDate);
    if (assignedTo && req.user.role === 'admin') {
      // Only admin can reassign tasks
      const userExists = await User.findById(assignedTo);
      if (!userExists) {
        return res.status(400).json({ message: 'Assigned user not found' });
      }
      task.assignedTo = assignedTo;
    }
    
    await task.save();
    await task.populate('createdBy', 'name email');
    await task.populate('assignedTo', 'name email');

    res.json({
      message: 'Task updated successfully',
      task
    });
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({ message: 'Server error while updating task' });
  }
});

/**
 * @swagger
 * /api/v1/tasks/{id}:
 *   delete:
 *     summary: Delete a task
 *     description: Delete a task (admin can delete any task, users can delete tasks they created)
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Task ID to delete
 *         schema:
 *           type: string
 *           example: 507f1f77bcf86cd799439011
 *     responses:
 *       200:
 *         description: Task deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Task deleted successfully
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Task not found or access denied
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete('/:id', auth, async (req, res) => {
  try {
    const taskId = req.params.id;

    // Admin can delete any task, users can only delete tasks they created
    let query;
    if (req.user.role === 'admin') {
      query = { _id: taskId };
    } else {
      query = { _id: taskId, createdBy: req.user._id };
    }

    const task = await Task.findOneAndDelete(query);
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found or access denied' });
    }

    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({ message: 'Server error while deleting task' });
  }
});

/**
 * @swagger
 * /api/v1/tasks/users:
 *   get:
 *     summary: Get all users (Admin only)
 *     description: Retrieve list of all registered users (admin access required)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Forbidden - Admin access required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/users', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }

    const users = await User.find({}, 'name email role').sort({ name: 1 });
    res.json(users);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Server error while fetching users' });
  }
});

module.exports = router;