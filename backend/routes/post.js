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

function getPostUserColumn(callback) {
    db.query("SHOW COLUMNS FROM posts LIKE 'userId'", (err, results) => {
        if (err) {
            return callback(err);
        }

        if (results && results.length > 0) {
            return callback(null, "userId");
        }

        db.query("SHOW COLUMNS FROM posts LIKE 'user_id'", (fallbackErr, fallbackResults) => {
            if (fallbackErr) {
                return callback(fallbackErr);
            }

            if (fallbackResults && fallbackResults.length > 0) {
                return callback(null, "user_id");
            }

            return callback(new Error("No user column found on posts table"));
        });
    });
}

router.post("/create", (req, res) => {
    const { userId, content } = req.body;

    if (!userId || !content) {
        return res.status(400).json({
            message: "User ID and content required"
        });
    }

    getPostUserColumn((columnErr, userColumn) => {
        if (columnErr) {
            return res.status(500).json({ message: "Server error" });
        }

        const sql = `INSERT INTO posts (${userColumn}, content) VALUES (?, ?)`;

        db.query(sql, [userId, content], (err) => {
            if (err) {
                return res.status(500).json({ message: "Server error" });
            }

            res.json({
                success: true,
                message: "Post created successfully"
            });
        });
    });
});


router.get('/', (req, res) => {
    getPostUserColumn((columnErr, userColumn) => {
        if (columnErr) {
            console.log(columnErr);
            return res.status(500).json({
                message: "Server error"
            });
        }

        const sql = `
        SELECT posts.*, users.username
        FROM posts
        JOIN users ON posts.${userColumn} = users.id
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

//add comment
router.post("/comment", (req, res) => {

    const { postId, userId, comment } = req.body;

    if (!postId || !userId || !comment) {

        return res.status(400).json({
            message: "All fields required"
        });
    }

    const sql = `
        INSERT INTO comments
        (post_id, user_id, comment)
        VALUES (?, ?, ?)
    `;

    db.query(
        sql,
        [postId, userId, comment],

        (err) => {

            if (err) {

                console.log(err);

                return res.status(500).json({
                    message: "Server error"
                });
            }

            res.json({
                success: true,
                message: "Comment added"
            });
        }
    );
});

router.get("/comments/:postId", (req, res) => {

    const postId = req.params.postId;

    const sql = `
        SELECT comments.*, users.username

        FROM comments

        JOIN users
        ON comments.user_id = users.id

        WHERE comments.post_id = ?

        ORDER BY comments.id DESC
    `;

    db.query(sql, [postId], (err, results) => {

        if (err) {

            console.log(err);

            return res.status(500).json({
                message: "Server error"
            });
        }

        res.json({
            success: true,
            comments: results
        });
    });
});
module.exports = router;