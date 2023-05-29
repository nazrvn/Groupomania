const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');


// Crée un post
router.post('/', postController.createPost);

// Récuperation de toutes posts
router.get('/', postController.getAllPosts);

// Récuperation de posts par postId
router.get('/:id', postController.getPostById);

// Maj d'un post
router.put('/:id', postController.updatePost);

// Suppression d'un post
router.delete('/:id', postController.deletePost);

module.exports = router;

/* 
██████╗░░█████╗░██╗░░░██╗████████╗███████╗░██████╗
██╔══██╗██╔══██╗██║░░░██║╚══██╔══╝██╔════╝██╔════╝
██████╔╝██║░░██║██║░░░██║░░░██║░░░█████╗░░╚█████╗░
██╔══██╗██║░░██║██║░░░██║░░░██║░░░██╔══╝░░░╚═══██╗
██║░░██║╚█████╔╝╚██████╔╝░░░██║░░░███████╗██████╔╝
╚═╝░░╚═╝░╚════╝░░╚═════╝░░░░╚═╝░░░╚══════╝╚═════╝░ */