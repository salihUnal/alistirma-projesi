const db = require("./db/database");

const testMovies = [
  {
    title: "Amerikan Sapigi",
    description: "Psikolojik Film",
    image: "/images/American_Psyho.jpg",
    imdb_point: 9.8,
    release_year: 2000,
    director: "Mary Harron",
    duration: "102 dk",
    types: "Suç,Korku,Gerilim,Drama,Popüler",
  },
  {
    title: "Harry Potter Felsefe Taşı",
    description: "Fantastik-Bilim Kurgu Film",
    image: "/images/Harry_Potter_Felsefe_Tasi.jpg",
    imdb_point: 9.0,
    release_year: 2001,
    director: "Chris Columbus",
    duration: "152 dk",
    types: "Bilim Kurgu,Gençlik,Fantastik",
  },
  {
    title: "Hulk",
    description: "Fantastik-Süperkahraman Film",
    image: "/images/Hulk.jpg",
    imdb_point: 8.9,
    release_year: 2003,
    director: "Ang Lee",
    duration: "138 dk",
    types: "Bilim Kurgu,Fantastik,Çizgi Roman",
  },
  {
    title: "Makinist",
    description: "Psikolojik Gerilim Film",
    image: "/images/Makinist.jpg",
    imdb_point: 9.7,
    release_year: 2004,
    director: "Brad Anderson",
    duration: "101 dk",
    types: "Suç,Korku,Gerilim,Drama",
  },
  {
    title: "Kuzuların Sessizliği",
    description: "Psikolojik Film",
    image: "/images/KuzularınSessizliği.jpg",
    imdb_point: 8.6,
    release_year: 1991,
    director: "Jonathan Demme",
    duration: "118 dk",
    types: "Suç,Korku,Gerilim,Drama,Popüler",
  },
  {
    title: "Terminator",
    description: "Fantastik-Bilim Kurgu Film",
    image: "/images/Terminator.jpg",
    imdb_point: 9.0,
    release_year: 1984,
    director: "James Cameron",
    duration: "97 dk",
    types: "Bilim Kurgu,Aksiyon,Fantastik,Popüler",
  },
];

// Test verilerini ekle
db.serialize(() => {
  const stmt = db.prepare(
    "INSERT INTO movies (title, description, image, imdb_point, release_year, director, duration, types) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
  );

  testMovies.forEach((movie) => {
    stmt.run(
      movie.title,
      movie.description,
      movie.image,
      movie.imdb_point,
      movie.release_year,
      movie.director,
      movie.duration,
      movie.types
    );
  });

  stmt.finalize();
  console.log("Test verileri eklendi!");
});

db.close();
