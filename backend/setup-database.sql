-- Create database if not exists
CREATE DATABASE IF NOT EXISTS social_app;
USE social_app;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    address VARCHAR(255),
    gender VARCHAR(10),
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create posts table
CREATE TABLE IF NOT EXISTS posts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userId INT NOT NULL,
    content TEXT NOT NULL,
    likes INT DEFAULT 0,
    dislikes INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);

-- Insert sample pending users for admin to approve
INSERT INTO users (username, email, password, address, gender, status) VALUES
('testuser', 'test@example.com', 'password123', 'Kathmandu', 'Male', 'pending'),
('demo', 'demo@example.com', 'demo123', 'Pokhara', 'Female', 'pending')
ON DUPLICATE KEY UPDATE username=username;

SELECT 'Database setup complete!' as message;
