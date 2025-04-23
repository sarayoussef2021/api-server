// api-server/routes/tasks.js
const express = require('express');
const Task = require('../models/Task');
const authMiddleware = require('../middleware/auth'); // Middleware pour vérifier l'authentification
const router = express.Router();

// Route pour obtenir toutes les tâches
router.get('/', authMiddleware, async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.userId });
    res.status(200).json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors de la récupération des tâches" });
  }
});

// Route pour créer une nouvelle tâche
router.post('/', authMiddleware, async (req, res) => {
  const { title } = req.body;

  try {
    const newTask = new Task({
      title,
      userId: req.userId,
    });

    await newTask.save();
    res.status(201).json(newTask);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors de la création de la tâche" });
  }
});

// Route pour mettre à jour une tâche existante
router.put('/:id', authMiddleware, async (req, res) => {
  const { title } = req.body;
  const { id } = req.params;

  try {
    const task = await Task.findOne({ _id: id, userId: req.userId });
    if (!task) {
      return res.status(404).json({ message: "Tâche non trouvée" });
    }

    task.title = title || task.title;
    await task.save();

    res.status(200).json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors de la mise à jour de la tâche" });
  }
});

// Route pour supprimer une tâche
router.delete('/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;

  try {
    const task = await Task.findOneAndDelete({ _id: id, userId: req.userId });
    if (!task) {
      return res.status(404).json({ message: "Tâche non trouvée" });
    }

    res.status(200).json({ message: "Tâche supprimée avec succès" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors de la suppression de la tâche" });
  }
});

module.exports = router;