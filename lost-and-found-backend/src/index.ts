import express, { Request, Response } from "express";
import cors from "cors";
import multer from "multer";
import path from "path";
import mysql from "mysql2";
import { ResultSetHeader } from "mysql2";
// import { environment } from "./config/environment";
import * as dotenv from "dotenv";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

dotenv.config();
const app = express();
const PORT = process.env.PORTNO;

// Simulated __dirname (safe if you're not using ES Modules)
const __dirname = path.resolve();

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ Serve uploaded images statically
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ Multer storage config
const storage = multer.diskStorage({
  destination: path.join(__dirname, "uploads"),
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// ✅ MySQL connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  timezone: "Z", // use UTC to avoid shifting
  dateStrings: true, // treat DATE/DATETIME as strings, not JS Date objects
});

db.connect((err) => {
  if (err) {
    console.error("❌ MySQL connection error:", err);
  } else {
    console.log("✅ Connected to MySQL");
  }
});

// ✅ POST: User signup
app.post("/api/signup", async (req: Request, res: Response) => {
  const { full_name, username, email, password, phone_number, address } =
    req.body;

  if (
    !full_name ||
    !username ||
    !email ||
    !password ||
    !phone_number ||
    !address
  ) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Check if user already exists
  db.query(
    "SELECT * FROM users WHERE email = ?",
    [email],
    async (err, results) => {
      if (err) {
        console.error("❌ Error checking user:", err);
        return res.status(500).json({ message: "Internal server error" });
      }

      if (results.length > 0) {
        return res.status(409).json({ message: "User already exists" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insert new user
      const sql =
        "INSERT INTO users (full_name, username, email, password, phone_number, address) VALUES (?, ?, ?, ?, ?, ?)";
      db.query(
        sql,
        [full_name, username, email, hashedPassword, phone_number, address],
        (err, result) => {
          if (err) {
            console.error("❌ Error creating user:", err);
            return res.status(500).json({ message: "Internal server error" });
          }

          res.status(201).json({ message: "✅ User registered successfully" });
        }
      );
    }
  );
});

// ✅ POST: User login
app.post("/api/login", (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  // Check if user exists
  db.query(
    "SELECT * FROM users WHERE email = ?",
    [email],
    async (err, results) => {
      if (err) {
        console.error("❌ Error fetching user:", err);
        return res.status(500).json({ message: "Internal server error" });
      }

      if (results.length === 0) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      const user = results[0];

      // Compare passwords
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      // Create JWT token
      const token = jwt.sign(
        { id: user.id, username: user.username, email: user.email },
        process.env.JWT_SECRET as string,
        { expiresIn: "3h" }
      );

      res.status(200).json({
        message: "✅ Login successful",
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
        },
      });
    }
  );
});

// ✅ POST: Lost item
// app.post("/api/lost-items", upload.single("image"), (req, res) => {
//   let {
//     itemName,
//     category,
//     description,
//     lastSeenLocation,
//     dateLost,
//     contactInfo,
//     phone_number,
//     address,
//   } = req.body;
//   console.log(req.body);

//   const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

//   try {
//     dateLost = new Date(dateLost);
//     dateLost.setDate(dateLost.getDate() + 1);
//     // dateLost = dateLost.split("T")[0];
//     console.log("Formatted dateLost:", dateLost);
//   } catch (err) {
//     return res.status(400).json({ message: "Invalid date format" });
//   }

//   const sql = `
//     INSERT INTO items (itemName, category, description, lastSeenLocation, dateLost, contactInfo, phone_number, address,  imageUrl)
//     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
//   `;

//   db.query(
//     sql,
//     [
//       itemName,
//       category,
//       description,
//       lastSeenLocation,
//       dateLost,
//       contactInfo,
//       phone_number,
//       address,
//       imageUrl,
//     ],
//     (err, result) => {
//       if (err) {
//         console.error("❌ Error inserting item:", err);
//         return res.status(500).json({ message: "Internal server error" });
//       }

//       const insertResult = result as ResultSetHeader;
//       res.status(201).json({
//         message: "✅ Item added successfully",
//         itemId: insertResult.insertId,
//       });
//     }
//   );
// });

app.post("/api/lost-items", upload.single("image"), (req, res) => {
  let {
    itemName,
    category,
    description,
    lastSeenLocation,
    dateLost,
    contactInfo,
    phone_number,
    address,
    username, // ✅ Added username field
  } = req.body;

  console.log("Received lost item data:", req.body);

  // Handle image upload path
  const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

  // Format dateLost
  try {
    dateLost = new Date(dateLost);
    dateLost.setDate(dateLost.getDate() + 1);
    console.log("Formatted dateLost:", dateLost);
  } catch (err) {
    return res.status(400).json({ message: "Invalid date format" });
  }

  // SQL query for lost_items table with username
  const sql = `
    INSERT INTO lost_items 
    (itemName, category, description, lastSeenLocation, dateLost, contactInfo, phone_number, address, username, imageUrl)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  // Execute database query
  db.query(
    sql,
    [
      itemName,
      category,
      description,
      lastSeenLocation,
      dateLost,
      contactInfo,
      phone_number,
      address,
      username, // ✅ Add username value here
      imageUrl,
    ],
    (err, result) => {
      if (err) {
        console.error("❌ Error inserting lost item:", err);
        return res.status(500).json({ message: "Internal server error" });
      }

      const insertResult = result as ResultSetHeader;
      res.status(201).json({
        message: "✅ Lost item reported successfully",
        itemId: insertResult.insertId,
      });
    }
  );
});

// ✅ GET all lost items
app.get("/api/lost-items", (req, res) => {
  db.query(
    "SELECT * FROM lost_items where username = 'admin' ORDER BY dateLost DESC",
    (err, results) => {
      if (err) {
        console.error("❌ Error fetching items:", err);
        return res.status(500).json({ message: "Internal server error" });
      }
      res.status(200).json(results);
    }
  );
});

// ✅ GET lost items by username
app.get("/api/lost-items-all/:username", (req, res) => {
  const username = req.params.username;

  const sql = `SELECT * FROM lost_items WHERE username = ? ORDER BY dateLost DESC`;

  db.query(sql, [username], (err, results) => {
    if (err) {
      console.error("❌ Error fetching lost items:", err);
      return res.status(500).json({ message: "Internal server error" });
    }

    res.status(200).json(results);
  });
});

// GET lost item by ID
app.get("/api/lost-items/:id", async (req, res) => {
  const itemId = req.params.id;
  console.log("Received request for item ID:", itemId);
  db.query("SELECT * FROM lost_items where id=?", [itemId], (err, results) => {
    if (err) {
      console.error("❌ Error fetching items:", err);
      return res.status(500).json({ message: "Internal server error" });
    }
    console.log("Results:", results);
    res.status(200).json(results);
  });
});

// PUT lost item by ID
app.put("/api/lost-items/:id", upload.single("image"), async (req, res) => {
  console.log("Received request to update item ID:", req.params.id);
  const itemId = req.params.id;
  const {
    itemName,
    category,
    description,
    lastSeenLocation,
    contactInfo,
    phone_number,
    address,
  } = req.body;
  const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;
  console.log(req.body);
  console.log(itemName, category, description, lastSeenLocation, contactInfo);

  if (!itemName || !category || !description || !contactInfo) {
    console.error("❌ Missing required fields");
    return res.status(400).json({ message: "Missing required fields" });
  }

  const sql = `UPDATE lost_items SET itemName=?, category=?, description=?, lastSeenLocation=?, contactInfo=?,phone_number=?,address=?, imageUrl=? WHERE id=?`;

  db.query(
    sql,
    [
      itemName,
      category,
      description,
      lastSeenLocation,
      contactInfo,
      phone_number,
      address,
      imageUrl,
      itemId,
    ],
    (err, result) => {
      if (err) {
        console.error("❌ Error inserting item:", err);
        return res.status(500).json({ message: "Internal server error" });
      }

      const insertResult = result as ResultSetHeader;
      res.status(201).json({
        message: "✅ Item updated successfully",
        itemId: insertResult.insertId,
      });
    }
  );
});

app.delete("/api/lost-items/:id", async (req: Request, res: Response) => {
  const itemId = req.params.id;
  console.log(itemId);
  try {
    const result = await db.execute("DELETE FROM items WHERE id = ?", [itemId]);
    const deleteResult = result as any;

    if (deleteResult.affectedRows > 0) {
      res.status(200).json({ message: "✅ Item deleted successfully" });
    } else {
      res.status(200).json({ message: "✅ Item deleted successfully" });
    }
  } catch (error) {
    console.error("❌ Error deleting item:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
});

// ✅ GET all found items
app.get("/api/found-items", (req, res) => {
  db.query(
    "SELECT * FROM Found_Items ORDER BY date_found DESC",
    (err, results) => {
      if (err) {
        console.error("❌ Error fetching items:", err);
        return res.status(500).json({ message: "Internal server error" });
      }
      res.status(200).json(results);
    }
  );
});

// GET found item by ID
app.get("/api/found-items/:id", async (req, res) => {
  const itemId = req.params.id;
  console.log("Received request for lost item ID:", itemId);
  db.query("SELECT * FROM found_items where id=?", [itemId], (err, results) => {
    if (err) {
      console.error("❌ Error fetching items:", err);
      return res.status(500).json({ message: "Internal server error" });
    }
    res.status(200).json(results);
  });
});

// ✅ POST: Found item
app.post("/api/found-items", upload.single("image"), (req, res) => {
  console.log("Received request to add found item");
  let {
    item_name,
    category,
    description,
    found_location,
    date_found,
    contact_info,
    phone_number,
    address,
  } = req.body;
  console.log(req.body);
  // console.log(itemName, category, description, lastSeenLocation, dateLost, contactInfo)

  const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

  try {
    // date_found = new Date(date_found).toISOString().slice(0, 10);
    date_found = new Date(date_found);
    date_found.setDate(date_found.getDate() + 1);
  } catch (err) {
    return res.status(400).json({ message: "Invalid date format" });
  }

  const sql = `
    INSERT INTO Found_Items (item_name, category, description, found_location, date_found, contact_info, phone_number, address, imageUrl)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [
      item_name,
      category,
      description,
      found_location,
      date_found,
      contact_info,
      phone_number,
      address,
      imageUrl,
    ],
    (err, result) => {
      if (err) {
        console.error("❌ Error inserting item:", err);
        return res.status(500).json({ message: "Internal server error" });
      }

      const insertResult = result as ResultSetHeader;
      res.status(201).json({
        message: "✅ Item added successfully",
        itemId: insertResult.insertId,
      });
    }
  );
});

// PUT found item by ID
app.put("/api/found-items/:id", upload.single("image"), async (req, res) => {
  console.log("Received request to update item ID:", req.params.id);
  const itemId = req.params.id;
  const {
    item_name,
    category,
    description,
    found_location,
    contact_info,
    phone_number,
    address,
  } = req.body;
  const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;
  console.log(req.body);
  console.log(item_name, category, description, found_location, contact_info);

  if (!item_name || !category || !description || !contact_info) {
    console.error("❌ Missing required fields");
    return res.status(400).json({ message: "Missing required fields" });
  }

  const sql = `UPDATE found_items SET item_name=?, category=?, description=?, found_location=?, contact_info=?,phone_number=?,address=?, imageUrl=? WHERE id=?`;

  db.query(
    sql,
    [
      item_name,
      category,
      description,
      found_location,
      contact_info,
      phone_number,
      address,
      imageUrl,
      itemId,
    ],
    (err, result) => {
      if (err) {
        console.error("❌ Error inserting item:", err);
        return res.status(500).json({ message: "Internal server error" });
      }

      const insertResult = result as ResultSetHeader;
      res.status(201).json({
        message: "✅ Item updated successfully",
        itemId: insertResult.insertId,
      });
    }
  );
});

//Delete found item by ID
app.delete("/api/found-items/:id", async (req: Request, res: Response) => {
  const itemId = req.params.id;
  console.log(itemId);
  try {
    const result = await db.execute("DELETE FROM found_items WHERE id = ?", [
      itemId,
    ]);
    const deleteResult = result as any;

    if (deleteResult.affectedRows > 0) {
      res.status(200).json({ message: "✅ Item deleted successfully" });
    } else {
      // res.status(404).json({ message: 'item not found' });
      res.status(200).json({ message: "✅ Item deleted successfully" });
    }
  } catch (error) {
    console.error("❌ Error deleting item:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
