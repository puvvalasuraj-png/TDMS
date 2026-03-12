import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const db = new Database("database.sqlite");

// Initialize Database
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'user'
  );

  CREATE TABLE IF NOT EXISTS tradespersons (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    skill TEXT NOT NULL,
    experience INTEGER NOT NULL,
    location TEXT NOT NULL,
    charges INTEGER NOT NULL,
    availability TEXT DEFAULT 'Available'
  );

  CREATE TABLE IF NOT EXISTS bookings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    worker_id INTEGER NOT NULL,
    booking_date TEXT NOT NULL,
    status TEXT DEFAULT 'Pending',
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (worker_id) REFERENCES tradespersons(id)
  );
`);

// Seed some data if empty
const workerCount = db.prepare("SELECT COUNT(*) as count FROM tradespersons").get() as { count: number };
if (workerCount.count === 0) {
  const insertWorker = db.prepare("INSERT INTO tradespersons (name, phone, skill, experience, location, charges, availability) VALUES (?, ?, ?, ?, ?, ?, ?)");
  insertWorker.run("John Doe", "123-456-7890", "Electrician", 5, "New York", 50, "Available");
  insertWorker.run("Jane Smith", "987-654-3210", "Plumber", 8, "Los Angeles", 60, "Available");
  insertWorker.run("Mike Johnson", "555-0199", "Carpenter", 10, "Chicago", 45, "Busy");
  insertWorker.run("Sarah Williams", "555-0122", "Painter", 3, "Houston", 35, "Available");
  insertWorker.run("Robert Brown", "555-0133", "Mechanic", 12, "Phoenix", 70, "Available");
}

async function startServer() {
  const app = express();
  app.use(express.json());

  // Auth Routes
  app.post("/api/register", (req, res) => {
    const { name, email, password } = req.body;
    try {
      const info = db.prepare("INSERT INTO users (name, email, password) VALUES (?, ?, ?)").run(name, email, password);
      res.json({ id: info.lastInsertRowid, name, email });
    } catch (e) {
      res.status(400).json({ error: "Email already exists" });
    }
  });

  app.post("/api/login", (req, res) => {
    const { email, password } = req.body;
    const user = db.prepare("SELECT * FROM users WHERE email = ? AND password = ?").get(email, password) as any;
    if (user) {
      res.json({ id: user.id, name: user.name, email: user.email, role: user.role });
    } else {
      res.status(401).json({ error: "Invalid credentials" });
    }
  });

  // Tradespersons Routes
  app.get("/api/workers", (req, res) => {
    const { skill, location } = req.query;
    let query = "SELECT * FROM tradespersons WHERE 1=1";
    const params = [];
    if (skill) {
      query += " AND skill = ?";
      params.push(skill);
    }
    if (location) {
      query += " AND location LIKE ?";
      params.push(`%${location}%`);
    }
    const workers = db.prepare(query).all(...params);
    res.json(workers);
  });

  app.get("/api/workers/:id", (req, res) => {
    const worker = db.prepare("SELECT * FROM tradespersons WHERE id = ?").get(req.params.id);
    res.json(worker);
  });

  // Booking Routes
  app.post("/api/bookings", (req, res) => {
    const { user_id, worker_id, booking_date } = req.body;
    const info = db.prepare("INSERT INTO bookings (user_id, worker_id, booking_date) VALUES (?, ?, ?)").run(user_id, worker_id, booking_date);
    res.json({ id: info.lastInsertRowid });
  });

  app.get("/api/bookings/user/:userId", (req, res) => {
    const bookings = db.prepare(`
      SELECT b.*, t.name as worker_name, t.skill as worker_skill 
      FROM bookings b 
      JOIN tradespersons t ON b.worker_id = t.id 
      WHERE b.user_id = ?
    `).all(req.params.userId);
    res.json(bookings);
  });

  // Admin Routes
  app.get("/api/admin/bookings", (req, res) => {
    const bookings = db.prepare(`
      SELECT b.*, u.name as user_name, t.name as worker_name, t.skill as worker_skill, t.availability as worker_availability
      FROM bookings b 
      JOIN users u ON b.user_id = u.id 
      JOIN tradespersons t ON b.worker_id = t.id
    `).all();
    res.json(bookings);
  });

  app.post("/api/admin/bookings/:id/status", (req, res) => {
    const { status } = req.body;
    db.prepare("UPDATE bookings SET status = ? WHERE id = ?").run(status, req.params.id);
    res.json({ success: true });
  });

  app.post("/api/admin/workers/:id/availability", (req, res) => {
    const { availability } = req.body;
    db.prepare("UPDATE tradespersons SET availability = ? WHERE id = ?").run(availability, req.params.id);
    res.json({ success: true });
  });

  app.get("/api/admin/workers", (req, res) => {
    const workers = db.prepare("SELECT * FROM tradespersons").all();
    res.json(workers);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  const PORT = 3000;
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
