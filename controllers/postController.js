const db = require('../database_connect');

/* POST ----  { "title": "Example Post", "content": "This is the content of the post." } */

// Crée un post
exports.createPost = async (req, res) => {
    const { title, content } = req.body;
    
    const result = await db.query('INSERT INTO posts (title, content) VALUES (?, ?)', [title, content], (err, results) => {
        try {
            // Return the created post
            const createdPost = {
                id: result.insertId,
                title,
                content
            };
            
            res.status(201).json(createdPost);
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'An error occurred while creating the post.' });
        }
    });
};

// Récuperation de toutes posts
exports.getAllPosts = async (req, res) => {

    const results = await db.query('SELECT * FROM posts', (error, results) => {
        try {
            if (!Array.isArray(results)) {
                return res.status(500).json({ error: 'An error occurred while retrieving the posts.' });
            }
    
            const posts = results.map((post) => ({
                id: post.id,
                title: post.title,
                content: post.content
            }));
    
            res.status(200).json(posts);
            } catch (error) {
                console.log(error);
                res.status(500).json({ error: 'An error occurred while retrieving the posts.' });
            }
    });
    
};

// Récuperation de posts par postId
exports.getPostById = async (req, res) => {
    const { id } = req.params;

    db.query('SELECT id, title, content FROM posts WHERE id = ?', [id], (error, results) => {
        try {
            console.log(results);
            if (results.length === 0) {
                return res.status(404).json({ error: 'Post not found.' });
            }
        
            const post = {
                id: results[0]?.id,
                title: results[0]?.title,
                content: results[0]?.content,
            };
            res.status(200).json(post);
            } catch (error) {
                console.log(error);
                res.status(500).json({ error: 'An error occurred while retrieving the post.' });
            }
    })
};

// Maj d'un post
exports.updatePost = async (req, res) => {

    const { id } = req.params;
    const { title, content } = req.body;
    
    const result = await db.query('UPDATE posts SET title = ?, content = ? WHERE id = ?', [title, content, id], (error, results) => {
        try {
            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Post not found.' });
            }
            
            res.status(200).json({ message: 'Post updated successfully.' });
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'An error occurred while updating the post.' });
        }
    });

};

// Suppression d'un post
exports.deletePost = async (req, res) => {
    const { id } = req.params;
    
    const result = await db.query('DELETE FROM posts WHERE id = ?', [id], (error, results) => {
        try {
            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Post not found.' });
            }
            
            res.status(200).json({ message: 'Post deleted successfully.' });
        } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'An error occurred while deleting the post.' });
        }
    });
    
};


/* 
░█████╗░░█████╗░███╗░░██╗████████╗██████╗░░█████╗░██╗░░░░░██╗░░░░░███████╗██████╗░
██╔══██╗██╔══██╗████╗░██║╚══██╔══╝██╔══██╗██╔══██╗██║░░░░░██║░░░░░██╔════╝██╔══██╗
██║░░╚═╝██║░░██║██╔██╗██║░░░██║░░░██████╔╝██║░░██║██║░░░░░██║░░░░░█████╗░░██████╔╝
██║░░██╗██║░░██║██║╚████║░░░██║░░░██╔══██╗██║░░██║██║░░░░░██║░░░░░██╔══╝░░██╔══██╗
╚█████╔╝╚█████╔╝██║░╚███║░░░██║░░░██║░░██║╚█████╔╝███████╗███████╗███████╗██║░░██║
░╚════╝░░╚════╝░╚═╝░░╚══╝░░░╚═╝░░░╚═╝░░╚═╝░╚════╝░╚══════╝╚══════╝╚══════╝╚═╝░░╚═╝ */