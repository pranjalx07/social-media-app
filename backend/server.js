const express = require('express');
const path = require('path');
const cors = require("cors");
const app = express();
const db = require("./config/db");

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, '../frontend')));

// View engine setup
app.set('view engine','ejs');
app.set("views",path.join(__dirname, "views"));

// Routes
const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin");
const postRoutes = require("./routes/post");
const userRoutes= require("./routes/user");

app.use("/auth",authRoutes);
app.use("/admin",adminRoutes);
app.use("/posts",postRoutes);
app.use("/user",userRoutes);

app.get("/",(req,res)=>{
    res.send("Server is working")
});

// Start server
const PORT = 3000;
app.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}`);
});

