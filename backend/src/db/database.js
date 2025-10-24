const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const dbPath = path.join(__dirname, "Main.sqlite");

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Veritabanı bağlantı hatası:", err.message);
  } else {
    console.log("SQLite veritabanına bağlandı.");
  }
});

db.serialize(() => {
  db.run(
    `CREATE TABLE IF NOT EXISTS movies (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    image TEXT,
    imdb_point REAL,
    release_year INTEGER,
    director TEXT,
    duration TEXT,
    types TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`,
    (err) => {
      if (err) {
        console.error("Tablo oluşturma hatası:", err.message);
      } else {
        console.log("Movies tablosu hazır.");
      }
    }
  );
  // Books tablosu
  db.run(
    `CREATE TABLE IF NOT EXISTS books (
    id           INTEGER  PRIMARY KEY AUTOINCREMENT,
    title        TEXT     NOT NULL,
    author       TEXT     NOT NULL,
    publish_date INTEGER,
    genre        TEXT,
    description  TEXT,
    image        TEXT,
    Page_Count   NUMERIC,
    is_read      BOOLEAN  DEFAULT 0,
    created_at   DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at   DATETIME DEFAULT CURRENT_TIMESTAMP
  )`,
    (err) => {
      if (err) {
        console.error("Books tablo oluşturma hatası:", err.message);
      } else {
        console.log("Books tablosu hazır.");
      }
    }
  );

  //Users tablosu

    db.run(
      `CREATE TABLE IF NOT EXISTS  users (
        Id            TEXT         PRIMARY KEY,
        Username      TEXT         UNIQUE                                   NOT NULL,
        Email         TEXT         UNIQUE                                   NOT NULL,
        Password_Hash TEXT         NOT NULL,
        Full_Name     TEXT,
        Avatar_url    TEXT,
        Creation_date TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
        Updated_at    TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
        Position      VARCHAR DEFAULT 'standard',
        Bio           TEXT,
        Phone         TEXT    
    )`,
      (err) => {
        if (err) {
          console.error("Tablo oluşturma hatası:", err.message);
        } else {
          console.log("Users tablosu hazır.");
        }
      }
    );
});

module.exports = db;
