const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const postController = require('../controllers/postController');
const commentController = require('../controllers/commentController');


// USER
router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/logout', authController.logout);

// ADMIN
router.post('/add', authController.addUser);
router.post('/update/:id', authController.editUser);
router.delete('/delete/:id', authController.deleteUser);

// POSTS ROUTES
router.post('/posts', postController.createPost);
router.get('/posts', postController.getAllPosts);
router.get('/posts/:id', postController.getPostById);
router.put('/posts/:id', postController.updatePost);
router.delete('/posts/:id', postController.deletePost);

// COMMENTS ROUTES
router.post('/comments', commentController.createComment);
router.get('/comments/:postId', commentController.getCommentsByPostId);
router.put('/comments/:id', commentController.updateComment);
router.delete('/comments/:id', commentController.deleteComment);

module.exports = router;