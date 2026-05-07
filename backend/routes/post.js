const express= require('express')
const router = express.Router()
const app = express()
const db = require("../config/db")
/*
let posts=[
    {
        id:1,
        username:"rachit",
        content:"Hello this is my 1st post",
        likes:0,
        dislikes:0
    }
];
*/
router.post("/create", (req, res) => {
    const { userId, content } = req.body;

    if (!userId || !content) {
        return res.status(400).json({
            message: "User ID and content required"
        });
    }

    const sql = "INSERT INTO posts (user_id, content) VALUES (?, ?)";

    db.query(sql, [userId, content], (err, result) => {
        if (err) {
            return res.status(500).json({ message: "Server error" });
        }

        res.json({
            success: true,
            message: "Post created successfully"
        });
    });
});


router.get('/', (req, res) => {

    const sql = `
    SELECT posts.*, users.username
    FROM posts
    JOIN users ON posts.user_id = users.id
    ORDER BY posts.id DESC
    `;

    db.query(sql, (err, results) => {

        if (err) {
            console.log(err);
            return res.status(500).json({
                message: "Server error"
            });
        }

        res.json({
            success: true,
            posts: results
        });
    });
});

// Like or Dislike a post
// LIKE post
router.post("/like", (req, res) => {
    const { postId } = req.body||{};

    if (!postId) {
        return res.status(400).json({ message: "Post ID required" });
    }

    const sql = "UPDATE posts SET likes = likes + 1 WHERE id = ?";

    db.query(sql, [postId], (err, result) => {
        if (err) {
            return res.status(500).json({ message: "Server error" });
        }

        res.json({
            success: true,
            message: "Post liked"
        });
    });
});
// DISLIKE post
router.post("/dislike", (req, res) => {
    const { postId } = req.body;

    if (!postId) {
        return res.status(400).json({ message: "Post ID required" });
    }

    const sql = "UPDATE posts SET dislikes = dislikes + 1 WHERE id = ?";

    db.query(sql, [postId], (err, result) => {
        if (err) {
            return res.status(500).json({ message: "Server error" });
        }

        res.json({
            success: true,
            message: "Post disliked"
        });
    });
});


module.exports = router;