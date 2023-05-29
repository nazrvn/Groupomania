const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');

// Crée commentaire
router.post('/', commentController.createComment);

// Récupération de commentaire par postId
router.get('/:postId', commentController.getCommentsByPostId);

// Maj d'un commentaire
router.put('/:id', commentController.updateComment);

// Suppression d'un commentaire
router.delete('/:id', commentController.deleteComment);

module.exports = router;

/* 
██████╗░░█████╗░██╗░░░██╗████████╗███████╗░██████╗
██╔══██╗██╔══██╗██║░░░██║╚══██╔══╝██╔════╝██╔════╝
██████╔╝██║░░██║██║░░░██║░░░██║░░░█████╗░░╚█████╗░
██╔══██╗██║░░██║██║░░░██║░░░██║░░░██╔══╝░░░╚═══██╗
██║░░██║╚█████╔╝╚██████╔╝░░░██║░░░███████╗██████╔╝
╚═╝░░╚═╝░╚════╝░░╚═════╝░░░░╚═╝░░░╚══════╝╚═════╝░ */