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

app.use(cors({
  origin: "http://localhost:8080",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

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
    console.log("Connected to MySQL");
  }
});

function generateToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email },
    JWT_SECRET,
    { expiresIn: "1h" }
  );
}

function verifyToken(token) {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded; // { id, email, iat, exp }
  } catch (err) {
    return null;
  }
}

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  
  const token = authHeader && authHeader.split(' ')[1]; 
  if (token == null) {

    return res.status(401).json({ message: "Access denied. No token." });
  }
  const decodedUser = verifyToken(token);

  if (decodedUser === null) {
    return res.status(403).json({ message: "Invalid or expired token." });
  }
  req.user = decodedUser; 
  next();
};

app.get('/api/items', (req, res) => {
    const category = req.query.category;
    
    let queryProducts = 'SELECT * FROM products';
    let params = [];

    if (category) {
        queryProducts += ' WHERE category = ?';
        params.push(category);
    }

    db.query(queryProducts, params, (err, products) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ success: false, message: "Error DB products" });
        }

        db.query('SELECT * FROM product_carousel_images', (err2, images) => {
            if (err2) {
                console.error(err2);
                return res.status(500).json({ success: false, message: "Error DB Images" });
            }

            const result = products.map(product => {
                const productImages = images
                    .filter(img => img.product_id === product.id)
                    .map(img => img.image_url);

                return {
                    ...product,
                    carouselImages: productImages
                };
            });

            res.json(result);
        });
    });
});

app.get('/api/item/:id', authenticateToken,(req, res) => {
    const id = parseInt(req.params.id);

    db.query('SELECT * FROM products WHERE id = ?', [id], (err, rows) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ success: false, message: "Server error" });
        }

        if (rows.length === 0) {
            return res.status(404).json({ success: false, message: "Item not found" });
        }

        const product = rows[0];

        db.query('SELECT imageUrl FROM product_carousel_images WHERE product_id = ?', [id], (err2, imageRows) => {
            if (err2) {
                console.error(err2);
                return res.status(500).json({ success: false, message: "Erreur serveur images" });
            }

            product.carouselImages = imageRows.map(img => img.imageUrl);

            res.json(product);
        });
    });
});
app.post('/api/reserve', authenticateToken,(req, res) => {
  const { userId, productId, date, time, guests, notes } = req.body;

  const sql = `
    INSERT INTO bookings (user_id, product_id, booking_date, booking_time, guests, notes) 
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(sql, [userId, productId, date, time, guests, notes], (err, result) => {
    if (err) {
      console.error("Error saving booking:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.status(201).json({ message: "Reservation successful", id: result.insertId });
  });
});

app.get('/api/my-bookings/:userId', authenticateToken,(req, res) => {
  const userId = req.params.userId;

  const sql = `
    SELECT 
      b.id AS order_id,
      b.booking_date,
      b.booking_time,
      b.guests,
      b.status,
      b.notes,
      p.title AS product_name,
      p.imageUrl AS product_image,
      p.category,
      p.price AS product_price
    FROM bookings b
    LEFT JOIN products p ON b.product_id = p.id  -- <--- CHANGED TO 'LEFT JOIN'
    WHERE b.user_id = ?
    ORDER BY b.booking_date DESC
  `;

  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.error("Error fetching bookings:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json(results);
  });
});

app.get('/api/admin/bookings', authenticateToken,(req, res) => {
    const sql = `
        SELECT 
            b.id, 
            b.product_id,
            b.user_id,
            b.booking_date,
            b.booking_time, 
            b.status,
            u.name as user_name,
            p.name as product_name
        FROM bookings b
        JOIN users u ON b.user_id = u.id
        JOIN products p ON b.product_id = p.id
        ORDER BY b.booking_date DESC
    `;

    db.query(sql, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Erreur DB" });
        }
        results.forEach(row => {
            row.booking_date = row.booking_date.toISOString().split('T')[0];
            if (row.booking_time === "Check-in")
              row.booking_time = ""
             
        });
        res.json(results);
    });
});

app.put('/api/admin/bookings/:id/complete', authenticateToken,(req, res) => {
    const id = req.params.id;
    
    const sql = "UPDATE bookings SET status = 'completed' WHERE id = ?";
    
    db.query(sql, [id], (err, result) => {
        if (err) return res.status(500).json({ error: "Erreur DB" });
        res.json({ success: true, message: "Réservation validée !" });
    });
});

app.put('/api/admin/bookings/:id/pending', authenticateToken,(req, res) => {
    const id = req.params.id;
    
    const sql = "UPDATE bookings SET status = 'pending' WHERE id = ?";
    
    db.query(sql, [id], (err, result) => {
        if (err) return res.status(500).json({ error: "Erreur DB" });
        res.json({ success: true, message: "Réservation validée !" });
    });
});


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
      console.log("Generated JWT:", token);
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

app.put('/api/users/:id/password', authenticateToken,async (req, res) => {
    const userId = req.params.id;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
        return res.status(400).json({ success: false, message: "Champs manquants" });
    }

    db.query('SELECT * FROM users WHERE id = ?', [userId], async (err, results) => {
        if (err) return res.status(500).json({ success: false, message: "Erreur DB" });
        if (results.length === 0) return res.status(404).json({ success: false, message: "Utilisateur non trouvé" });

        const user = results[0];

        const match = await bcrypt.compare(currentPassword, user.password);
        if (!match) {
            return res.status(401).json({ success: false, message: "Mot de passe actuel incorrect" });
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, 10);

        db.query('UPDATE users SET password = ? WHERE id = ?', [hashedNewPassword, userId], (errUpdate) => {
            if (errUpdate) return res.status(500).json({ success: false, message: "Erreur mise à jour" });
            
            res.json({ success: true, message: "Mot de passe modifié avec succès" });
        });
    });
});
app.post('/api/favorites', authenticateToken,(req, res) => {
    const { userId, productId } = req.body;
    const sql = "INSERT IGNORE INTO user_favorites (user_id, product_id) VALUES (?, ?)";
    
    db.query(sql, [userId, productId], (err, result) => {
        if (err) return res.status(500).json({ success: false, message: "Erreur DB" });
        res.json({ success: true, message: "Favori ajouté" });
    });
});

app.delete('/api/favorites/:userId/:productId', authenticateToken,(req, res) => {
    const { userId, productId } = req.params;
    const sql = "DELETE FROM user_favorites WHERE user_id = ? AND product_id = ?";
    
    db.query(sql, [userId, productId], (err, result) => {
        if (err) return res.status(500).json({ success: false, message: "Erreur DB" });
        res.json({ success: true, message: "Favori retiré" });
    });
});

app.get('/api/favorites/:userId', authenticateToken,(req, res) => {
    const userId = req.params.userId;

    const sql = `
        SELECT p.* FROM products p
        JOIN user_favorites uf ON p.id = uf.product_id
        WHERE uf.user_id = ?
    `;

    db.query(sql, [userId], (err, products) => {
        if (err) return res.status(500).json({ error: "DB Error" });
        if (products.length === 0) return res.json([]); 

        db.query('SELECT * FROM product_carousel_images', (err2, images) => {
            if (err2) return res.status(500).json({ error: "DB Error Images" });

            const result = products.map(product => {
                const productImages = images
                    .filter(img => img.product_id === product.id)
                    .map(img => img.imageUrl); 

                return {
                    ...product, 
                    carouselImages: productImages
                };
            });

            res.json(result);
        });
    });
});
app.post('/api/cancel-booking/:id', authenticateToken,(req, res) => {
  const bookingId = req.params.id;
  
  const sql = "UPDATE bookings SET status = 'cancelled' WHERE id = ?";

  db.query(sql, [bookingId], (err, result) => {
    if (err) {
      console.error("Error cancelling booking:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json({ success: true, message: "Booking cancelled" });
  });
});
app.post('/api/users/:id', authenticateToken,(req, res) => {
    const userId = req.params.id;
    const { name } = req.body;

    if (!name) {
        return res.status(400).json({ success: false, message: "Nom manquant" });
    }

    const sql = "UPDATE users SET name = ? WHERE id = ?";

    db.query(sql, [name, userId], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ success: false, message: "Erreur SQL" });
        }
        
        res.json({ success: true, message: "Nom mis à jour avec succès" });
    });
});

app.delete('/api/admin/bookings/delete/:id', authenticateToken,(req, res) => {
    const id = req.params.id;
    const sql = "DELETE FROM bookings WHERE id = ?";
    
    db.query(sql, [id], (err, result) => {
        if (err) return res.status(500).json({ error: "Erreur DB" });
        res.json({ success: true, message: "Réservation supprimée !" });
    });
});

app.post('/api/admin/products', authenticateToken,(req, res) => {
    const { 
        id,
        category, subCategory, name, title, 
        shortDesc, longDesc, imageUrl, 
        price, lat, lng, phone 
    } = req.body;

    if (!category || !name || !imageUrl) {
        return res.status(400).json({ success: false, message: "Champs obligatoires manquants" });
    }

    const sql = `
        INSERT INTO products 
        (id, category, subCategory, name, title, shortDesc, longDesc, imageUrl, price, lat, lng, phone)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
        id,
        category, subCategory, name, title, 
        shortDesc, longDesc, imageUrl, 
        price || null, lat || null, lng || null, phone || null
    ];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ success: false, message: "Erreur SQL" });
        }
        res.json({ success: true, message: "Produit ajouté", id: result.insertId });
    });
});


app.delete('/api/admin/products/:id', authenticateToken,(req, res) => {
    const id = req.params.id;
    
    const sql = "DELETE FROM products WHERE id = ?";
    
    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ success: false, message: "Erreur SQL" });
        }
        res.json({ success: true, message: "Produit supprimé !" });
    });
});

app.listen(port, () => {
 console.log(`Server is running at http://localhost:${port}`);
});