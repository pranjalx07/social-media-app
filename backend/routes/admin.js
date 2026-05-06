const express = require('express')
const router = express.Router()
const db = require("../config/db");
const app = express()
const admin ={
    username: "admin",
    password:"Admin@1234"
};

/*let users = [
    {
        id:1,
        username:"hari",
        email:"hari@gmail.com",
        gender:"Male",
        address:"Kathmandu",
        status:"pending"
    },
    {
        id:2,
        username:"shyami",
        email:"shyami@gmail.com",
        gender:"Female",
        address:"Pokhara",
        status:"pending"
    }
];
*/
router.get("/pending-users", (req, res) => {
    const sql = "SELECT id, username, email, gender, address FROM users WHERE status = 'pending'";

    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ message: "Server error" });
        }

        res.json({
            success: true,
            users: results
        });
    });
});
router.post('/adminlogin',(req,res)=>{
    const{ username,password} = req.body||{};
    if(!username || !password){
        return res.status(400).json({
            success: false ,
            message: "All fields are required"
        });
    }
     if(username  !== admin.username || password!== admin.password){
        return res.status(401).json({
            success: false,
            message: "Invalid admin credentials"
        });
    }
        res.status(200).json({
            success: true,
            message: "Admin login successful"
        });
     });
router.post("/update-user-status", (req, res) => {
    const { userId, action } = req.body;
    // action = approve | reject

    if (!userId || !action) {
        return res.status(400).json({
            message: "User ID and action required"
        });
    }

    let status;
    if (action === "approve") status = "approved";
    else if (action === "reject") status = "rejected";
    else {
        return res.status(400).json({ message: "Invalid action" });
    }

    const sql = "UPDATE users SET status = ? WHERE id = ?";

    db.query(sql, [status, userId], (err, result) => {
        if (err) {
            return res.status(500).json({ message: "Server error" });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({
            success: true,
            message: `User ${status} successfully`
        });
    });
});

module.exports=router;
