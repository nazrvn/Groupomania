const db = require('../database_connect');

/* POST ----  { "title": "Example Post", "content": "This is the content of the post." } */

// Crée un post
exports.createPost = async (req, res) => {
    const { title, content } = req.body;

    try {

        const result = await db.query('INSERT INTO posts (title, content) VALUES (?, ?)', [title, content]);

        const createdPost = {
            id: result.insertId,
            title,
            content
        };

        res.render('post', { post: createdPost });
    } catch (error) {
        console.log(error);
        res.status(500).send('An error occurred while creating the post.');
    }
};

// Récuperation de toutes posts
exports.getAllPosts = async (req, res) => {

    db.query('SELECT * FROM posts', (error, results) => {
        try {

            /* console.log('Results:', results);
            console.log('Type of Results:', typeof results); */

            if (!Array.isArray(results)) {
                return res.status(500).send('An error occurred while retrieving the posts.');
            }

            res.render('post', { posts: results });
        } catch (error) {
            console.log(error);
            res.status(500).send('An error occurred while retrieving the posts.');
        }
    });

};

// Récuperation de posts par postId
exports.getPostById = async (req, res) => {
    const { id } = req.params;

    try {

        const results = await db.query('SELECT id, title, content FROM posts WHERE id = ?', [id]);

        if (results.length === 0) {
            return res.status(404).send('Post not found.');
        }


        const post = {
            id: results[0].id,
            title: results[0].title,
            content: results[0].content,
        };


        res.render('post', { post });
    } catch (error) {
        console.log(error);
        res.status(500).send('An error occurred while retrieving the post.');
    }
};

// Maj d'un post
exports.updatePost = async (req, res) => {
    const { id } = req.params;
    const { title, content } = req.body;

    try {

        const result = await db.query('UPDATE posts SET title = ?, content = ? WHERE id = ?', [title, content, id]);

        if (result.affectedRows === 0) {
            return res.status(404).send('Post not found.');
        }

        res.send('Post updated successfully.');
    } catch (error) {
        console.log(error);
        res.status(500).send('An error occurred while updating the post.');
    }
};

// Suppression d'un post
exports.deletePost = async (req, res) => {
    const { id } = req.params;

    try {
        // Delete the post from the database
        const result = await db.query('DELETE FROM posts WHERE id = ?', [id]);

        if (result.affectedRows === 0) {
            return res.status(404).send('Post not found.');
        }

        res.send('Post deleted successfully.');
    } catch (error) {
        console.log(error);
        res.status(500).send('An error occurred while deleting the post.');
    }
};


/* 
░█████╗░░█████╗░███╗░░██╗████████╗██████╗░░█████╗░██╗░░░░░██╗░░░░░███████╗██████╗░
██╔══██╗██╔══██╗████╗░██║╚══██╔══╝██╔══██╗██╔══██╗██║░░░░░██║░░░░░██╔════╝██╔══██╗
██║░░╚═╝██║░░██║██╔██╗██║░░░██║░░░██████╔╝██║░░██║██║░░░░░██║░░░░░█████╗░░██████╔╝
██║░░██╗██║░░██║██║╚████║░░░██║░░░██╔══██╗██║░░██║██║░░░░░██║░░░░░██╔══╝░░██╔══██╗
╚█████╔╝╚█████╔╝██║░╚███║░░░██║░░░██║░░██║╚█████╔╝███████╗███████╗███████╗██║░░██║
░╚════╝░░╚════╝░╚═╝░░╚══╝░░░╚═╝░░░╚═╝░░╚═╝░╚════╝░╚══════╝╚══════╝╚══════╝╚═╝░░╚═╝ */