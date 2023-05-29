const db = require('../database_connect');


/* POST ----- { "postId": 5, "content": "This is a comment on the post." } */

// Crée commentaire
exports.createComment = async (req, res) => {
    try {
    const { postId, content } = req.body;
    
    const result = await db.query('INSERT INTO comments (postId, content) VALUES (?, ?)', [postId, content]);

            console.log(result);
            const createdComment = {
                id: result.insertId,
                postId,
                content
            };
        res.status(201).json(createdComment);
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'An error occurred while creating the comment.' });
        }
}; 

// Récupération de commentaire par postId
exports.getCommentsByPostId = async (req, res) => {

    //const { id, content } = req.body;
    const { postId } = req.params;

    db.query('SELECT id, postId, content FROM comments WHERE postId = ?',[postId], (error, results) => {
        try {

            if (results.length === 0) {
                return res.status(404).json({ error: 'Comment not found.' });
            }
            const comment = {
                id: results[0]?.id,
                postId: results[0]?.postId,
                content: results[0]?.content,
            };
            console.log(comment);
            res.status(200).json(comment);
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'An error occurred while retrieving the comments.' });
        }
    });
};

// Maj d'un commentaire
exports.updateComment = async (req, res) => {
try {
    const { id } = req.params;
    const { content } = req.body;
    
    const result = await db.query('UPDATE comments SET content = ? WHERE id = ?', [content, id]);
    
    if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Comment not found.' });
    }

    res.status(200).json({ message: 'Comment updated successfully.' });
    } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'An error occurred while updating the comment.' });
}
};

// Suppression d'un commentaire
exports.deleteComment = async (req, res) => {
try {
    const { id } = req.params;
    
    const result = await db.query('DELETE FROM comments WHERE id = ?', [id]);
    
    if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Comment not found.' });
    }

    res.status(200).json({ message: 'Comment deleted successfully.' });
    } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'An error occurred while deleting the comment.' });
    }
};

/* 
░█████╗░░█████╗░███╗░░██╗████████╗██████╗░░█████╗░██╗░░░░░██╗░░░░░███████╗██████╗░
██╔══██╗██╔══██╗████╗░██║╚══██╔══╝██╔══██╗██╔══██╗██║░░░░░██║░░░░░██╔════╝██╔══██╗
██║░░╚═╝██║░░██║██╔██╗██║░░░██║░░░██████╔╝██║░░██║██║░░░░░██║░░░░░█████╗░░██████╔╝
██║░░██╗██║░░██║██║╚████║░░░██║░░░██╔══██╗██║░░██║██║░░░░░██║░░░░░██╔══╝░░██╔══██╗
╚█████╔╝╚█████╔╝██║░╚███║░░░██║░░░██║░░██║╚█████╔╝███████╗███████╗███████╗██║░░██║
░╚════╝░░╚════╝░╚═╝░░╚══╝░░░╚═╝░░░╚═╝░░╚═╝░╚════╝░╚══════╝╚══════╝╚══════╝╚═╝░░╚═╝ */