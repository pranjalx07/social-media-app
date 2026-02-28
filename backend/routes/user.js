const express = require("express")
const router = express.Router()
const db = require("../config/db");
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
router.post("/update-profile", (req, res) => {
    const { userId, address, profilePic } = req.body;

    if (!userId || !address) {
        return res.status(400).json({
            message: "User ID and address required"
        });
    }

    const sql = `
        UPDATE users
        SET address = ?, profile_pic = ?
        WHERE id = ?
    `;

    db.query(sql, [address, profilePic, userId], (err, result) => {
        if (err) {
            return res.status(500).json({ message: "Server error" });
        }

        res.json({
            success: true,
            message: "Profile updated successfully"
        });
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
        });
    });
});

module.exports = router;
