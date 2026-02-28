const express = require("express")
const router = express.Router()
const db = require("../config/db");

router.post("/login", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({
            message: "All fields are required"
        });
    }

    const sql = "SELECT * FROM users WHERE username = ?";

    db.query(sql, [username], (err, results) => {
        if (err) {
            return res.status(500).json({ message: "Server error" });
        }

        if (results.length === 0) {
            return res.status(401).json({ message: "User not found" });
        }

        const user = results[0];

        if (user.password !== password) {
            return res.status(401).json({ message: "Invalid password" });
        }

        if (user.status !== "approved") {
            return res.status(403).json({
                message: "Account not approved by admin"
            });
        }

        res.json({
            success: true,
            message: "Login successful",
            user: {
                id: user.id,
                username: user.username,
                email: user.email
            }
        });
    });
});


router.post('/register',(req,res)=>{
    const {username,password,confirmpassword,email} = req.body ||{};
    if (!username || !password || !confirmpassword){
        return res.status(400).json({
            success: false,
            message: "All fields are required"
        });
    }
    if(password!=confirmpassword){
        return res.status(400).json({
            success: false,
            message: "Password donot match"
        });
    }
    const sql = "INSERT INTO users (username, password, email) VALUES (?, ?, ?)";
db.query(sql, [username, password,email], (err) => {
  if (err) {
console.error(err);
return res.status(500).json({ message: err.message });
  }

  res.status(201).json({
    success: true,
    message: "User registered successfully",
    user: username
  });
});
console.log(req.body);

  
});

module.exports = router;