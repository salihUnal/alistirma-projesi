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
  let query = "SELECT * FROM Movies";
  let params = [];

  if (search) {
    query +=
      " WHERE title LIKE ? OR description LIKE ? OR Director LIKE ? OR CAST(Release_Year AS TEXT) LIKE ?";
    params = [`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`];
  }

  if (type) {
    query += search ? " AND types LIKE ?" : " WHERE Types LIKE ?";
    params.push(`%${type}%`);
  }

  query += " ORDER BY Id DESC";

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
// Helper fonksiyon: Veritabanından gelen büyük harfli sütun isimlerini küçük harfli camelCase'e çevir
function mapBookRowToApiFormat(row) {
  if (!row) return null;
  return {
    id: row.Id,
    title: row.Title,
    author: row.Author,
    publish_date: row.Publish_Date,
    genre: row.Genre,
    description: row.Description,
    image: row.Image,
    Page_Count: row.Page_Count,
    is_read: row.Is_Read === 1 || row.Is_Read === true,
    like_count: row.Like_Count || 0,
    created_at: row.Created_At,
    updated_at: row.Updated_At,
  };
}

app.get("/api/books", (req, res) => {
  const { search, genre } = req.query;
  let query = "SELECT * FROM Books";
  let params = [];

  if (search) {
    query +=
      " WHERE Title LIKE ? OR Author LIKE ? OR Description LIKE ? OR CAST(Publish_Date AS TEXT) LIKE ?";
    params = [`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`];
  }

  if (genre) {
    query += search ? " AND Genre LIKE ?" : " WHERE Genre LIKE ?";
    params.push(`%${genre}%`);
  }

  query += " ORDER BY Id ASC";

  db.all(query, params, (err, rows) => {
    if (err) {
      console.error("Books query error:", err);
      res.status(500).json({ error: err.message });
      return;
    }
    // Veritabanından gelen büyük harfli sütun isimlerini küçük harfli format'a çevir
    const books = rows.map(mapBookRowToApiFormat);
    res.json(books);
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
      res.status(404).json({ error: "Film Bulunamadı" });
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
  db.get("SELECT * FROM Books WHERE Id = ?", [id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!row) {
      res.status(404).json({ error: "Kitap Bulunamadı!!" });
      return;
    }
    // Veritabanından gelen büyük harfli sütun isimlerini küçük harfli format'a çevir
    const book = mapBookRowToApiFormat(row);
    res.json(book);
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
    is_watched,
  } = req.body;

  const typesString = Array.isArray(types) ? types.join(",") : types;

  db.run(
    "INSERT INTO movies (title, description, image, imdb_point, release_year, director, duration, types,is_watched) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
    [
      title,
      description,
      image,
      imdb_point,
      release_year,
      director,
      duration,
      typesString,
      is_watched ?? false,
    ],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ id: this.lastID, message: "Film Başarıyla Eklendi" });
    }
  );
});

app.patch("/api/movies/:id", (req, res) => {
  const { id } = req.params;
  const { is_watched } = req.body;

  if (typeof is_watched !== "boolean") {
    return res
      .status(400)
      .json({ error: "is_watched alanı boolean (true/false) olmalıdır" });
  }
  const sql = "UPDATE movies SET updated_at = ? ,is_watched = ? WHERE id = ?";
  const params = [new Date().toISOString(), is_watched, id];

  db.run(sql, params, function (err) {
    if (err) {
      console.error("Film Güncellemesi Hatası:", err);
      return res.status(500).json({ error: "Film güncellenirken hata oluştu" });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: "Film bulunamadı" });
    }

    db.get("SELECT * FROM movies WHERE id = ?", [id], (err, row) => {
      if (err) {
        return res
          .status(500)
          .json({ error: "Güncellenmiş film verisi getirilemedi" });
      }
      const movie = {
        ...row,
        types: row.types ? row.types.split(",") : [],
      };

      return res.json(movie);
    });
  });
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
    Like_Count,
    is_liked,
  } = req.body;

  // Veritabanı sütun isimleri büyük harfli: Title, Author, Publish_Date, Genre, Description, Image, Page_Count, Is_Read
  db.run(
    "INSERT INTO Books (Title, Author, Publish_Date, Genre, Description, Image, Page_Count, Is_Read, Like_Count, is_liked) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?,?)",
    [
      title,
      author,
      publish_date,
      genre,
      description,
      image,
      Page_Count,
      is_read ? 1 : 0, // Boolean'ı 1/0'a çevir
      Like_Count ? 1 : 0,
      is_liked ? 1 : 0,
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
  // Veritabanı sütun isimleri büyük harfli: Is_Read, Updated_At, Id
  const sql = "UPDATE Books SET Updated_At = ?, Is_Read = ? WHERE Id = ?";
  const params = [new Date().toISOString(), is_read ? 1 : 0, id];

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

    db.get("SELECT * FROM Books WHERE Id = ?", [id], (err, row) => {
      if (err) {
        return res
          .status(500)
          .json({ error: "Güncellenmiş kitap verisi getirilemedi" });
      }
      // Veritabanından gelen büyük harfli sütun isimlerini küçük harfli format'a çevir
      const book = mapBookRowToApiFormat(row);
      return res.json(book);
    });
  });
});

app.post("/api/books/:id/like", (req, res) => {
  const { id } = req.params;

  // Veritabanı sütun isimleri büyük harfli: Like_Count, Updated_At, Id
  db.run(
    "UPDATE Books SET Like_Count = COALESCE(Like_Count, 0) + 1, Updated_At = ? WHERE Id = ?",
    [new Date().toISOString(), id],
    function (err) {
      if (err) {
        return res.status(500).json({ error: "Beğeni eklenirken hata oluştu" });
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: "Kitap Bulunamadı" });
      }

      db.get("SELECT Like_Count FROM Books WHERE Id = ?", [id], (err, row) => {
        if (err)
          return res.status(500).json({ error: "Beğeni sayısı alınamadı" });
        res.json({ like_count: row.Like_Count || 0, liked: true });
      });
    }
  );
});

app.delete("/api/books/:id/like", (req, res) => {
  const { id } = req.params;

  // Veritabanı sütun isimleri büyük harfli: Like_Count, Updated_At, Id
  db.run(
    "UPDATE Books SET Like_Count = MAX(COALESCE(Like_Count, 0) - 1, 0), Updated_At = ? WHERE Id = ?",
    [new Date().toISOString(), id],
    function (err) {
      if (err) {
        return res
          .status(500)
          .json({ error: "Beğeni kaldırılırken hata oluştu" });
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: "Kitap Bulunamadı" });
      }

      db.get("SELECT Like_Count FROM Books WHERE Id = ?", [id], (err, row) => {
        if (err)
          return res.status(500).json({ error: "Beğeni sayısı alınamadı" });
        res.json({ like_count: row.Like_Count || 0, liked: false });
      });
    }
  );
});

app.post("/api/movies/:id/like", (req, res) => {
  const { id } = req.params;

  db.run(
    "UPDATE Movies SET Like_Count = COALESCE(Like_Count, 0) + 1, updated_at = ? WHERE id = ?",
    [new Date().toISOString(), id],
    function (err) {
      if (err) {
        console.error("Movie Like (POST) Error:", err);
        return res.status(500).json({ error: "Beğeni eklenirken hata oluştu" });
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: "Film Bulunamadı" });
      }

      db.get(
        "SELECT  Like_Count FROM Movies WHERE Id = ?",
        [id],
        (err, row) => {
          if (err)
            return res.status(500).json({ error: "Beğeni sayısı alınamadı" });
          res.json({ like_count: row.Like_Count || 0, liked: true });
        }
      );
    }
  );
});

app.delete("/api/movies/:id/like", (req, res) => {
  const { id } = req.params;

  db.run(
    "UPDATE Movies SET Like_Count = MAX(COALESCE(Like_Count, 0) - 1, 0), updated_at = ? WHERE id = ?",
    [new Date().toISOString(), id],
    function (err) {
      if (err) {
        console.error("Movie Like (DELETE) Error:", err);
        return res
          .status(500)
          .json({ error: "Beğeni kaldırılırken hata oluştu" });
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: "Film Bulunamadı" });
      }

      db.get("SELECT Like_Count FROM Movies WHERE Id = ?", [id], (err, row) => {
        if (err)
          return res.status(500).json({ error: "Beğeni sayısı alınamadı" });
        res.json({ like_count: row.Like_Count || 0, liked: false });
      });
    }
  );
});

app.get("/api/mybooks", (req, res) => {
  const { search } = req.query;
  let query = "SELECT * FROM Readbooks";
  let params = [];

  if (search) {
    query += " WHERE Book_Name LIKE ? OR Author_Name LIKE ? OR Genre LIKE ?";
    params = [`%${search}%`, `%${search}%`];
  }

  query += " ORDER BY Id DESC";

  db.all(query, params, (err, rows) => {
    if (err) {
      console.error("MyBooks (GET) Error:", err.message);
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

app.get("/api/mybooks/:id", (req, res) => {
  const { id } = req.params;
  db.get("SELECT * FROM Readbooks WHERE Id = ?", [id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    if (!row) {
      res.status(404).json({ error: "Kitap Bulunamadı" });
      return;
    }

    res.json(row);
  });
});

app.post("/api/mybooks", (req, res) => {
  const { Book_Name, Author_Name, Completed, User_Id } = req.body;

  if (!Book_Name || !Author_Name) {
    return res.status(400).json({ error: "Kitap adı ve Yazar adı zorunludur" });
  }
  const sql = `
    INSERT INTO Readbooks (
      Book_Name, 
      Completed, 
      Author_Name,
      Genre,
      Creation_At, 
      Updated_At, 
      User_Id
    ) VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  const newBook = {
    Book_Name: Book_Name,
    Completed: Completed ?? true, // Eğer gönderilmezse varsayılan 'true'
    Author_Name: Author_Name,
    Genre: Genre ?? "Bilinmiyor",
    Creation_At: new Date().toISOString(),
    Updated_At: new Date().toISOString(),
    User_Id: User_Id || 1, // Şimdilik varsayılan 1, Geliştirme Önerisi'ne bakın
  };

  const params = [
    newBook.Book_Name,
    newBook.Completed,
    newBook.Author_Name,
    newBook.Genre,
    newBook.Creation_At,
    newBook.Updated_At,
    newBook.User_Id,
  ];

  db.run(sql, params, function (err) {
    if (err) {
      console.error("MyBooks (POST) Error:", err.message);
      res.status(500).json({ error: err.message });
      return;
    }
    // Yeni eklenen kitabı Id'si ile birlikte geri dön
    res.status(201).json({ id: this.lastID, ...newBook });
  });
});

app.delete("/api/mybooks/:id", (req, res) => {
  const { id } = req.params;

  db.run("DELETE FROM Readbooks WHERE Id = ?", [id], function (err) {
    if (err) {
      console.error("Kitap Silme Hatası", err.message);
      return res.status(500).json({ error: "Kitap Silinirken Hata Oluştu" });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: "Kitap Bulunamadı" });
    }

    res.json({ message: "Kitap Başarıyla Silindi", id: id });
  });
});

app.patch("/api/mybooks/:id", (req, res) => {
  const { id } = req.params;
  const { Book_Name, Author_Name, Completed, Genre } = req.body;

  const sql = `UPDATE Readbooks SET Book_Name = ?, Author_Name = ?, Genre = ?,
        Completed = ?,
        Updated_At = ? 
    WHERE Id = ?`;

  const params = [
    Book_Name,
    Author_Name,
    Genre || null,
    Completed ?? true,
    new Date().toISOString(),
    id,
  ];

  if (!Book_Name || !Author_Name) {
    return res
      .status(400)
      .json({ error: "Kitap adı, yazar adı ve tamamlama durumu zorunludur" });
  }

  db.run(sql, params, function (err) {
    if (err) {
      console.error("Kitap Güncellemesi Hatası", err.message);
      return res
        .status(500)
        .json({ error: "Kitap güncellenirken hata oluştu" });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: "Kitap Bulunamadı" });
    }

    db.get("SELECT * FROM Readbooks WHERE Id = ?", [id], (err, row) => {
      if (err) {
        return res
          .status(500)
          .json({ error: "Güncellenmiş kitap verisi getirilemedi" });
      }
      res.json(row);
      // res.json({ message: "Kitap Başarıyla Güncellendi", id: id });
    });
  });
});

app.post("/api/mybooks/:id/like", (req, res) => {
  const { id } = req.params;
  db.run(
    "UPDATE Readbooks SET Like_Count = COALESCE(Like_Count, 0) + 1, Updated_At = ? WHERE Id = ?",
    [new Date().toISOString(), id],
    function (err) {
      if (err) {
        return res.status(500).json({ error: "Beğeni eklenirken hata oluştu" });
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: "Kitap Bulunamadı" });
      }

      db.get(
        "SELECT Like_Count FROM Readbooks WHERE Id = ?",
        [id],
        (err, row) => {
          if (err)
            return res.status(500).json({ error: "Beğeni sayısı alınamadı" });
          res.json({ like_count: row.Like_Count || 0, liked: true });
        }
      );
    }
  );
});

app.delete("/api/mybooks/:id/like", (req, res) => {
  const { id } = req.params;

  // Veritabanı sütun isimleri büyük harfli: Like_Count, Updated_At, Id
  db.run(
    "UPDATE Readbooks SET Like_Count = MAX(COALESCE(Like_Count, 0) - 1, 0), Updated_At = ? WHERE Id = ?",
    [new Date().toISOString(), id],
    function (err) {
      if (err) {
        return res
          .status(500)
          .json({ error: "Beğeni kaldırılırken hata oluştu" });
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: "Kitap Bulunamadı" });
      }

      db.get(
        "SELECT Like_Count FROM Readbooks WHERE Id = ?",
        [id],
        (err, row) => {
          if (err)
            return res.status(500).json({ error: "Beğeni sayısı alınamadı" });
          res.json({ like_count: row.Like_Count || 0, liked: false });
        }
      );
    }
  );
});

app.listen(PORT, () => {
  console.log(`Server ${PORT} portunda çalışıyor`);
});
