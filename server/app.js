const express = require('express');
const mysql = require("mysql2");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const cors = require("cors");
const allItems = require('./data/database').allItems;


const app = express();
const port = 3000;

const JWT_SECRET = "KhazzDiscoverChris17";

app.use(cors({origin: "http://localhost:8080"})); 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
 res.send('Hello World! je suis dans le  /');
});

app.get('/api/items', (req, res) => {
    const category = req.query.category; // ex: /api/items?category=hotels
    
    if (category) {
        const filtered = allItems.filter(item => item.category === category);
        return res.json(filtered);
    }
    
    res.json(allItems);
});

// 2. Récupérer un item spécifique par son ID
app.get('/api/item/:id', (req, res) => {
    const id = parseInt(req.params.id); // Convertir l'ID de l'URL en nombre
    const item = allItems.find(i => i.id === id);
    
    if (item) {
        res.json(item);
    } else {
        res.status(404).json({ success: false, message: "Item not found" });
    }
});


const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "efrei",
  port: 3306
});

db.connect(err => {
  if (err) {
    console.error("Erreur MySQL :", err);
  } else {
    console.log("Connecté à MySQL");
  }
});

function generateToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email },
    JWT_SECRET,
    { expiresIn: "1h" }
  );
}

app.post("/api/register", async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password)
    return res.status(400).json({ success: false, message: "Missing fields" });

  const checkSql = "SELECT * FROM users WHERE email = ?";
  db.query(checkSql, [email], async (err, results) => {
    if (err) return res.status(500).json({ success: false, message: "DB error" });
    if (results.length > 0) 
      return res.status(400).json({ success: false, message: "Email already used" });
    try {
      const hashed = await bcrypt.hash(password, 10);
      const insertSql = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";
      db.query(insertSql, [name, email, hashed], (err2, result) => {
        if (err2) return res.status(500).json({ success: false, message: "DB error" });
        return res.json({ success: true, message: "Registration successful" });
      });
    } catch (e) {
      return res.status(500).json({ success: false, message: "Hashing error" });
    }
  });
});
app.post("/api/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ success: false, message: "Missing fields" });

  const sql = "SELECT * FROM users WHERE email = ?";
  db.query(sql, [email], async (err, results) => {
    if (err) return res.status(500).json({ success: false, message: "DB error" });
    if (results.length === 0)
      return res.status(400).json({ success: false, message: "Invalid email" });

    const user = results[0];
    try {
      const match = await bcrypt.compare(password, user.password);
      if (!match)
        return res.status(400).json({ success: false, message: "Invalid password" });
      const token = generateToken(user);
      return res.json({
        success: true,
        message: "Login successful",
        token,
        user: { id: user.id, name: user.name, email: user.email, role: user.role }
      });
    } catch (e) {
      return res.status(500).json({ success: false, message: "Compare error" });
    }
  });
});

app.listen(port, () => {
 console.log(`Server is running at http://localhost:${port}`);
});