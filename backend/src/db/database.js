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

//movies tablosu
db.serialize(() => {
  db.run(
    `CREATE TABLE IF NOT EXISTS Movies (
    Id INTEGER PRIMARY KEY AUTOINCREMENT,
    Title TEXT NOT NULL,
    Description TEXT,
    Image TEXT,
    Imdb_Point REAL,
    Release_Year INTEGER,
    Director TEXT,
    Duration TEXT,
    Types TEXT,
    Is_Watched BOOLEAN DEFAULT 0,
    Is_Liked BOOLEAN DEFAULT 0,
    Created_At DATETIME DEFAULT CURRENT_TIMESTAMP,
    Updated_At DATETIME DEFAULT CURRENT_TIMESTAMP
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
    `CREATE TABLE IF NOT EXISTS Books (
    Id           INTEGER  PRIMARY KEY AUTOINCREMENT,
    Title        TEXT     NOT NULL,
    Author       TEXT     NOT NULL,
    Publish_Date INTEGER,
    Genre        TEXT,
    Description  TEXT,
    Image        TEXT,
    Page_Count   NUMERIC,
    Is_Read      BOOLEAN  DEFAULT 0,
    Is_Liked     BOOLEAN  DEFAULT 0,
    Created_At   DATETIME DEFAULT CURRENT_TIMESTAMP,
    Updated_At   DATETIME DEFAULT CURRENT_TIMESTAMP
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
    `CREATE TABLE IF NOT EXISTS  Users (
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
        console.log("Users Tablosu Hazır.");
      }
    }
  );

  db.run(
    `CREATE TABLE IF NOT EXISTS  Readbooks (
    Id          INTEGER      PRIMARY KEY  AUTOINCREMENT,
    Book_Name   TEXT  NOT NULL,
    Completed   BOOLEN ,
    Author_Name TEXT,
     Genre       TEXT,
    Is_Liked     BOOLEN DEFAULT 0,
    Like_Count  INTEGER DEFAULT 0,
    Creation_At DATETIME  DEFAULT CURRENT_TIMESTAMP,
    Updated_At  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    User_Id     NUMERIC   REFERENCES Users (id) 
)`,
    (err) => {
      if (err) {
        console.error("Tablo oluşturma hatası:", err.message);
      } else {
        console.log("Readbooks Tablosu Hazır");
      }
    }
  );
});

module.exports = db;
