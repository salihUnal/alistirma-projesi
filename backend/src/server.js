const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const db = require("./db/database");

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
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

app.listen(PORT, () => {
  console.log(`Server ${PORT} portunda çalışıyor`);
});
