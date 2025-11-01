const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const db = require("./db/database");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = "q4t7w!z%C*F-JaNdRgUkXp2s5v8y/A?D(G+KbPeShV"; // Bunu karmaşık bir şeyle değiştirin

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
// =============================================
// AUTH ROUTES (YENİ EKLENDİ)
// =============================================

// KULLANICI KAYIT ENDPOINT'İ
app.post("/api/register", (req, res) => {
  const { username, email, password, full_name, avatar_url } = req.body;

  if (!username || !email || !password) {
    return res
      .status(400)
      .json({ error: "Kullanıcı adı, email ve şifre gerekli" });
  }

  // Şifreyi hashle
  bcrypt.hash(password, 10, (err, hash) => {
    if (err) {
      console.error("Password hashing error:", err);
      return res
        .status(500)
        .json({ error: "Şifre hashlenirken bir hata oluştu" });
    }

    const user = {
      id: uuidv4(),
      username: username.toLowerCase(),
      email,
      password_hash: hash,
      full_name: full_name || null,
      Position: "standard", // Varsayılan rol
      avatar_url: avatar_url || null,
      Creation_Date: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      Bio: null,
      Phone: null,
    };

    // Veritabanı CREATE TABLE ile eşleşen tam sorgu
    const sql = `INSERT INTO users (
      Id, Username, Email, Password_Hash, Full_Name, Avatar_url,
      Creation_date, Updated_at, Position, Bio, Phone
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    const params = [
      user.id,
      user.username,
      user.email,
      user.password_hash,
      user.full_name,
      user.avatar_url,
      user.Creation_Date,
      user.updated_at,
      user.Position,
      user.Bio,
      user.Phone,
    ];

    db.run(sql, params, function (err) {
      if (err) {
        console.error("Register error:", err);
        if (err.message.includes("UNIQUE constraint failed")) {
          return res
            .status(400)
            .json({ error: "Bu kullanıcı adı veya email zaten kullanımda" });
        }
        return res.status(500).json({ error: "Kayıt olurken bir hata oluştu" });
      }

      // Hassas bilgileri (şifre hashi) geri gönderme
      const { password_hash: _, ...userWithoutPassword } = user;
      res.status(201).json(userWithoutPassword);
    });
  });
});

// KULLANICI GİRİŞ ENDPOINT'İ
app.post("/api/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "Kullanıcı adı ve şifre gerekli" });
  }

  const sql = "SELECT * FROM users WHERE Username = ?";

  db.get(sql, [username.toLowerCase()], (err, user) => {
    if (err) {
      return res.status(500).json({ error: "Veritabanı hatası" });
    }
    if (!user) {
      return res.status(404).json({ error: "Kullanıcı bulunamadı" });
    }

    // Şifreleri karşılaştır
    bcrypt.compare(password, user.Password_Hash, (err, result) => {
      if (err) {
        return res.status(500).json({ error: "Şifre karşılaştırma hatası" });
      }
      if (!result) {
        return res.status(401).json({ error: "Geçersiz şifre" });
      }

      // Şifre doğru, JWT oluştur
      const token = jwt.sign(
        { id: user.Id, username: user.Username, role: user.Position },
        JWT_SECRET,
        { expiresIn: "1h" } // Token 1 saat geçerli
      );

      // Hassas bilgileri gönderme
      res.json({
        message: "Giriş başarılı",
        token: token,
        user: {
          username: user.Username,
          role: user.Position,
        },
      });
    });
  });
});

app.get("/api/movies", (req, res) => {
  const { search, type } = req.query;
  let query = "SELECT * FROM movies";
  let params = [];

  if (search) {
    query +=
      " WHERE title LIKE ? OR description LIKE ? OR director LIKE ? OR CAST(release_year AS TEXT) LIKE ?";
    params = [`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`];
  }

  if (type) {
    query += search ? " AND types LIKE ?" : " WHERE types LIKE ?";
    params.push(`%${type}%`);
  }

  query += " ORDER BY id DESC";

  db.all(query, params, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    // Types string'ini array'e çevir
    const movies = rows.map((row) => ({
      ...row,
      types: row.types ? row.types.split(",") : [],
    }));

    res.json(movies);
  });
});
app.get("/api/books", (req, res) => {
  const { search, genre } = req.query;
  let query = "SELECT * FROM books";
  let params = [];

  if (search) {
    query += " WHERE title LIKE ? OR author LIKE ? OR description LIKE ?";
    params = [`%${search}%`, `%${search}%`, `%${search}%`];
  }

  if (genre) {
    query += search ? " AND genre LIKE ?" : " WHERE genre LIKE ?";
    params.push(`%${genre}%`);
  }

  query += " ORDER BY id ASC";

  db.all(query, params, (err, rows) => {
    if (err) {
      console.error("Books query error:", err);
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

app.get("/api/movies/:id", (req, res) => {
  const { id } = req.params;

  db.get("SELECT * FROM movies WHERE id = ?", [id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    if (!row) {
      res.status(404).json({ error: "Film bulunamadı" });
      return;
    }

    // Types string'ini array'e çevir
    const movie = {
      ...row,
      types: row.types ? row.types.split(",") : [],
    };

    res.json(movie);
  });
});

app.get("/api/books/:id", (req, res) => {
  const { id } = req.params;
  db.get("SELECT * FROM books WHERE id = ?", [id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!row) {
      res.status(404).json({ error: "Kitap Bulunamadı!!" });
      return;
    }
    res.json(row);
  });
});

app.post("/api/movies", (req, res) => {
  const {
    title,
    description,
    image,
    imdb_point,
    release_year,
    director,
    duration,
    types,
  } = req.body;

  const typesString = Array.isArray(types) ? types.join(",") : types;

  db.run(
    "INSERT INTO movies (title, description, image, imdb_point, release_year, director, duration, types) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
    [
      title,
      description,
      image,
      imdb_point,
      release_year,
      director,
      duration,
      typesString,
    ],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ id: this.lastID, message: "Film başarıyla eklendi" });
    }
  );
});

app.post("/api/books", (req, res) => {
  const {
    title,
    author,
    publish_date,
    genre,
    description,
    image,
    Page_Count,
    is_read,
  } = req.body;

  db.run(
    "INSERT INTO books (title, author, publish_date, genre, description, image,  Page_Count,is_read) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
    [
      title,
      author,
      publish_date,
      genre,
      description,
      image,
      Page_Count,
      is_read,
    ],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ id: this.lastID, message: "Kitap başarıyla eklendi" });
    }
  );
});

app.patch("/api/books/:id", (req, res) => {
  const { id } = req.params;
  const { is_read } = req.body;

  if (typeof is_read !== "boolean") {
    return res
      .status(400)
      .json({ error: "is_read alanı boolean (true/false) olmalıdır" });
  }
  const sql = "UPDATE books SET updated_at = ? ,is_read = ? WHERE id = ?";
  const params = [new Date().toISOString(), is_read, id];

  db.run(sql, params, function (err) {
    if (err) {
      console.error("Kitap Güncellemesi Hatası:", err);
      return res
        .status(500)
        .json({ error: "Kitap güncellenirken hata oluştu" });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: "Kitap bulunamadı" });
    }

    db.get("SELECT * FROM books WHERE id = ?", [id], (err, row) => {
      if (err) {
        return res
          .status(500)
          .json({ error: "Güncellenmiş kitap verisi getirilemedi" });
      }
      return res.json(row);
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server ${PORT} portunda çalışıyor`);
});
