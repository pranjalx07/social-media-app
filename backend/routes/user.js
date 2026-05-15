const express = require("express")
const router = express.Router()
const db = require("../config/db");
const multer = require("multer");
const path = require("path");
// Multer setup for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    }
});

const upload = multer({ storage });
router.get("/profile/:id", (req, res) => {
    const userId = req.params.id;

    const sql = `
        SELECT id, username, email, address, gender, profile_pic
        FROM users
        WHERE id = ?
    `;

    db.query(sql, [userId], (err, results) => {
        if (err) {
            return res.status(500).json({ message: "Server error" });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({
            success: true,
            profile: results[0]
        });
    });
});
router.post("/update-profile", upload.single("profilePic"), (req, res) => {
    const { userId, address,bio, oldPassword,newPassword } = req.body;
    let profilePic = null;
    if (req.file) {
        profilePic = req.file.filename;
    }
    const sql1 = `
        UPDATE users
        SET address = ?,bio=?, profile_pic = COALESCE(?, profile_pic)
        WHERE id = ?
    `;

    db.query(sql1, [address, bio, profilePic, userId], (err) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ message: "Server error" });
        }
        if (!oldPassword || !newPassword) {
            return res.json({
                success: true,
                message: "Profile updated successfully"
            });
        }
         db.query("SELECT password FROM users WHERE id = ?", [userId], (err2, results) => {

            if (err2) return res.status(500).json({ message: "Server error" });

            if (results[0].password !== oldPassword) {
                return res.status(401).json({ message: "Old password incorrect" });
            }
                   db.query(
                "UPDATE users SET password = ? WHERE id = ?",
                [newPassword, userId],
                (err3) => {

                    if (err3) return res.status(500).json({ message: "Server error" });



       return res.json({
            success: true,
            message: "Profile updated successfully"
        });
    }
);
    });
});
router.post("/change-password", (req, res) => {
    const { userId, oldPassword, newPassword } = req.body;

    if (!userId || !oldPassword || !newPassword) {
        return res.status(400).json({
            message: "All fields required"
        });
    }

    const checkSql = "SELECT password FROM users WHERE id = ?";

    db.query(checkSql, [userId], (err, results) => {
        if (err) {
            return res.status(500).json({ message: "Server error" });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        if (results[0].password !== oldPassword) {
            return res.status(401).json({
                message: "Old password incorrect"
            });
        }

        const updateSql = "UPDATE users SET password = ? WHERE id = ?";

        db.query(updateSql, [newPassword, userId], err => {
            if (err) {
                return res.status(500).json({ message: "Server error" });
            }

            res.json({
                success: true,
                message: "Password updated successfully"
            });
        }
    );
        });
    });
});

module.exports = router;
