# 🧭 Lost and Found Application

Welcome to the **Lost and Found App** — a simple, secure platform where users can report lost items or submit found items to help reconnect belongings with their rightful owners.

This project is built with **Angular** (frontend), **Node.js** (backend), and **MySQL** (database).

---

## 🚀 Features

- 🔍 Browse all reported lost and found items
- 📝 **User Authentication (Signup/Login)**
  - New users can register with full name, username, email, password, phone number, and address
  - Secure login with JWT token-based authentication
- 🗝️ **Protected Routes**
  - Only logged-in users can access the dashboard, report items, and view their uploads
- 📦 **User-specific Lost Item Upload**
  - Logged-in users can report lost items, which are associated with their user account
  - Users can view or manage only their uploaded items
- 📈 Dashboard displaying:
  - Total lost and found items
  - Recent reports
  - User profile welcome message
- 🖼️ Upload images for lost or found items
- 🗂️ Filter items by location, category, and date
- 🧹 Clean and responsive UI using Angular Material
- 🔐 Backend API secured using environment variables
- 🔒 Passwords securely hashed using bcrypt

---

## 🛠️ Tech Stack

- **Frontend**: Angular 16 + Angular Material
- **Backend**: Node.js with TypeScript (Express)
- **Database**: MySQL
- **Other Tools**
  - `dotenv` for environment variables
  - `multer` for image uploads
  - `bcrypt` for password hashing
  - `jsonwebtoken` for authentication

---

## 📂 Project Structure

```plaintext
lost-and-found-application/
├── lost-and-found-frontend/   # Angular frontend application
├── lost-and-found-backend/    # Node.js backend API with Express
├── database/                  # Database schema and SQL queries
└── README.md                  # This documentation


Run the frontend using:
ng serve -o

Backend:
npx tsx src/index.ts
```
