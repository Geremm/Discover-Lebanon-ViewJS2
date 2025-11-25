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

app.use(cors({origin: "http://localhost:8081"})); 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());


// app.get('/api/items', (req, res) => {
//     const category = req.query.category; // ex: /api/items?category=hotels
    
//     if (category) {
//         const filtered = allItems.filter(item => item.category === category);
//         return res.json(filtered);
//     }
    
//     res.json(allItems);
// });

// 2. Récupérer un item spécifique par son ID

// app.get('/api/item/:id', (req, res) => {
//     const id = parseInt(req.params.id); // Convertir l'ID de l'URL en nombre
//     const item = allItems.find(i => i.id === id);
    
//     if (item) {
//         res.json(item);
//     } else {
//         res.status(404).json({ success: false, message: "Item not found" });
//     }
// });


const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
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

app.get('/api/items', (req, res) => {
    const category = req.query.category;
    
    // 1. Préparer la requête produits
    let queryProducts = 'SELECT * FROM products';
    let params = [];

    if (category) {
        queryProducts += ' WHERE category = ?';
        params.push(category);
    }

    // 2. Première requête : Récupérer les produits
    db.query(queryProducts, params, (err, products) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ success: false, message: "Erreur DB Produits" });
        }

        // 3. Deuxième requête : Récupérer TOUTES les images (Callback imbriqué)
        db.query('SELECT * FROM product_carousel_images', (err2, images) => {
            if (err2) {
                console.error(err2);
                return res.status(500).json({ success: false, message: "Erreur DB Images" });
            }

            // 4. La fusion (Javascript)
            // Maintenant qu'on a 'products' et 'images', on les assemble
            const result = products.map(product => {
                const productImages = images
                    .filter(img => img.product_id === product.id)
                    .map(img => img.image_url);

                return {
                    ...product,
                    carouselImages: productImages
                };
            });

            // 5. On envoie la réponse
            res.json(result);
        });
    });
});

app.get('/api/item/:id', (req, res) => {
    const id = parseInt(req.params.id);

    // 1. Première requête : Le produit
    db.query('SELECT * FROM products WHERE id = ?', [id], (err, rows) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ success: false, message: "Erreur serveur" });
        }

        if (rows.length === 0) {
            return res.status(404).json({ success: false, message: "Item not found" });
        }

        const product = rows[0];

        // 2. Deuxième requête : Les images de ce produit
        db.query('SELECT imageUrl FROM product_carousel_images WHERE product_id = ?', [id], (err2, imageRows) => {
            if (err2) {
                console.error(err2);
                return res.status(500).json({ success: false, message: "Erreur serveur images" });
            }

            // 3. On ajoute le tableau au produit
            product.carouselImages = imageRows.map(img => img.imageUrl);

            // 4. On renvoie le 
            res.json(product);
        });
    });
});
// 1. API TO SAVE A NEW RESERVATION
app.post('/api/reserve', (req, res) => {
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
    console.log(result);
    res.status(201).json({ message: "Reservation successful", id: result.insertId });
  });
});

app.get('/api/my-bookings/:userId', (req, res) => {
  const userId = req.params.userId;

  const sql = `
    SELECT 
      b.id AS order_id,
      b.booking_date,
      b.booking_time,
      b.guests,
      b.status,
      b.notes,
      -- Ensure these column names match your 'products' table exactly
      p.title AS product_name,   -- If your column is 'name', change this to p.name
      p.imageUrl AS product_image, -- If your column is 'image', change this to p.image
      p.category
    FROM bookings b
    JOIN products p ON b.product_id = p.id
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

app.get('/api/admin/bookings', (req, res) => {
    const sql = `
        SELECT 
            b.id, 
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

        console.log(results);
        res.json(results);
    });
});

// 2. Valider une réservation (Changer status pending -> completed)
app.put('/api/admin/bookings/:id/complete', (req, res) => {
    const id = req.params.id;
    
    const sql = "UPDATE bookings SET status = 'completed' WHERE id = ?";
    
    db.query(sql, [id], (err, result) => {
        if (err) return res.status(500).json({ error: "Erreur DB" });
        res.json({ success: true, message: "Réservation validée !" });
    });
});

app.put('/api/admin/bookings/:id/pending', (req, res) => {
    const id = req.params.id;
    
    const sql = "UPDATE bookings SET status = 'pending' WHERE id = ?";
    
    db.query(sql, [id], (err, result) => {
        if (err) return res.status(500).json({ error: "Erreur DB" });
        res.json({ success: true, message: "Réservation validée !" });
    });
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

// 1. AJOUTER UN FAVORI
app.post('/api/favorites', (req, res) => {
    const { userId, productId } = req.body;
    // INSERT IGNORE : Si c'est déjà favori, on ne fait rien (pas d'erreur)
    const sql = "INSERT IGNORE INTO user_favorites (user_id, product_id) VALUES (?, ?)";
    
    db.query(sql, [userId, productId], (err, result) => {
        if (err) return res.status(500).json({ success: false, message: "Erreur DB" });
        res.json({ success: true, message: "Favori ajouté" });
    });
});

// 2. RETIRER UN FAVORI
app.delete('/api/favorites/:userId/:productId', (req, res) => {
    const { userId, productId } = req.params;
    const sql = "DELETE FROM user_favorites WHERE user_id = ? AND product_id = ?";
    
    db.query(sql, [userId, productId], (err, result) => {
        if (err) return res.status(500).json({ success: false, message: "Erreur DB" });
        res.json({ success: true, message: "Favori retiré" });
    });
});

// 3. LISTER LES FAVORIS (Avec détails et images)
app.get('/api/favorites/:userId', (req, res) => {
    const userId = req.params.userId;

    // A. On récupère les produits liés à ce user
    const sql = `
        SELECT p.* FROM products p
        JOIN user_favorites uf ON p.id = uf.product_id
        WHERE uf.user_id = ?
    `;

    db.query(sql, [userId], (err, products) => {
        if (err) return res.status(500).json({ error: "DB Error" });
        if (products.length === 0) return res.json([]); // Pas de favoris = tableau vide

        // B. On récupère les images du carrousel pour ces produits
        db.query('SELECT * FROM product_carousel_images', (err2, images) => {
            if (err2) return res.status(500).json({ error: "DB Error Images" });

            // C. On fusionne
            const result = products.map(product => {
                const productImages = images
                    .filter(img => img.product_id === product.id)
                    .map(img => img.imageUrl); // Ton screen montre 'imageUrl'

                return {
                    ...product, // Copie toutes les colonnes (qui sont déjà en camelCase chez toi)
                    carouselImages: productImages
                };
            });

            res.json(result);
        });
    });
});

app.listen(port, () => {
 console.log(`Server is running at http://localhost:${port}`);
});