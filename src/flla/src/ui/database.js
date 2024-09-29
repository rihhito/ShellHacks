const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./users.db');

// Create a table to store users
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      email TEXT UNIQUE,
      password TEXT
    )
  `);
});

// Function to add a new user
const addUser = (name, email, password, callback) => {
  db.run(
    `INSERT INTO users (name, email, password) VALUES (?, ?, ?)`,
    [name, email, password],
    (err) => {
      if (err) {
        return callback(err);
      }
      callback(null);
    }
  );
};

// Function to log in
const loginUser = (email, password, callback) => {
  db.get(
    `SELECT * FROM users WHERE email = ? AND password = ?`,
    [email, password],
    (err, row) => {
      if (err) {
        return callback(err);
      }
      if (row) {
        return callback(null, row);
      } else {
        return callback(new Error('Invalid credentials'));
      }
    }
  );
};

module.exports = { addUser, loginUser };
