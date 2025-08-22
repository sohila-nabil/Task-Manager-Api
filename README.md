# 🚀 Node.js Task Management API

A **RESTful API** built with **Node.js, Express, MongoDB, and JWT Authentication**.  
It provides authentication, user management, and task management features.  

---
## Postman Collection
You can test all API endpoints using this Postman collection:

👉 [Download collection](./postman/task-manager.postman_collection.json)

Or import directly in Postman:

## 📌 Features
### 🔑 Authentication
- **Sign Up** (create new account)  
- **Login** (generate JWT token)  
- **Get User Info** (get profile details of logged-in user)  
- **Profile Image Upload** (upload user profile picture using Multer/Cloudinary)

### 👤 User Management
- **Get All Users** (admin only)  
- **Get Specific User by ID**  

### ✅ Task Management
- **Get All Tasks (for user)**  
- **Create Task**  
- **Update Task**  
- **Update Task Status** (e.g., Pending → In Progress → Completed)  
- **Delete Task**  

---

## ⚙️ Tech Stack
- **Node.js** + **Express.js**  
- **MongoDB** + **Mongoose**  
- **JWT (JSON Web Token)** for authentication  
- **Multer / Cloudinary** (for image upload)  
- **bcrypt.js** (for password hashing)  

---

## 📂 Project Structure
```
project/
│── models/         # Mongoose models (User, Task)
│── controllers/    # Business logic for routes
│── routes/         # API endpoints
│── middleware/     # Auth & validation
│── utils/          # generat token
│── config/         # Database connection & config
│── server.js       # Entry point
```

---

