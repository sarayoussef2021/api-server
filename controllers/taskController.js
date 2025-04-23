// api-server/controllers/taskController.js
const Task = require('../models/Task');

// Créer une nouvelle tâche
const createTask = async (req, res) => {
  const { title, description, dueDate } = req.body;
  const userId = req.userId;  // Utilisateur connecté

  try {
    const newTask = new Task({
      title,
      description,
      dueDate,
      userId
    });

    await newTask.save();
    res.status(201).json(newTask);
  } catch (error) {
    console.error('Erreur lors de la création de la tâche', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
};

// Récupérer toutes les tâches de l'utilisateur connecté
const getTasks = async (req, res) => {
  const userId = req.userId;

  try {
    const tasks = await Task.find({ userId });
    res.status(200).json(tasks);
  } catch (error) {
    console.error('Erreur lors de la récupération des tâches', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
};

// Mettre à jour une tâche
const updateTask = async (req, res) => {
  const { id } = req.params;
  const { title, description, dueDate, status } = req.body;

  try {
    const updatedTask = await Task.findOneAndUpdate(
      { _id: id, userId: req.userId },  // Assurer que la tâche appartient à l'utilisateur connecté
      { title, description, dueDate, status },
      { new: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ error: 'Tâche non trouvée' });
    }

    res.status(200).json(updatedTask);
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la tâche', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
};

// Supprimer une tâche
const deleteTask = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedTask = await Task.findOneAndDelete({ _id: id, userId: req.userId });

    if (!deletedTask) {
      return res.status(404).json({ error: 'Tâche non trouvée' });
    }

    res.status(200).json({ message: 'Tâche supprimée avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression de la tâche', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
};

module.exports = { createTask, getTasks, updateTask, deleteTask };