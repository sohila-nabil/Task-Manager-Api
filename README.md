# 🚀 Node.js Task Management API

A **RESTful API** built with **Node.js, Express, MongoDB, and JWT Authentication**.  
It provides authentication, user management, and task management features.  

---

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

## 🚀 Installation & Setup

1️⃣ Clone the repo:
```bash
git clone https://github.com/your-username/task-management-api.git
cd task-management-api
```

2️⃣ Install dependencies:
```bash
npm install
```

3️⃣ Create a `.env` file:
```env
PORT=5000
MONGO_URI=mongodb+srv://your-db-url
JWT_SECRET=your_jwt_secret
ADMIN_TOKEN=your_admin_token
CLOUDINARY_URL=your_cloudinary_url   # if using Cloudinary
```

4️⃣ Run the server:
```bash
npm run dev
```

---

## 🔑 API Endpoints

### Auth Routes
| Method | Endpoint       | Description      |
|--------|---------------|------------------|
| POST   | `/api/auth/signup` | Register new user |
| POST   | `/api/auth/login`  | Login user & return token |
| GET    | `/api/auth/me`     | Get logged-in user info |
| POST   | `/api/auth/upload` | Upload profile image |

### User Routes
| Method | Endpoint        | Description      |
|--------|----------------|------------------|
| GET    | `/api/users`   | Get all users (Admin only) |
| GET    | `/api/users/:id` | Get user by ID |

### Task Routes
| Method | Endpoint         | Description      |
|--------|-----------------|------------------|
| GET    | `/api/tasks`    | Get all tasks of logged-in user |
| POST   | `/api/tasks`    | Create new task |
| PUT    | `/api/tasks/:id`| Update task details |
| PATCH  | `/api/tasks/:id/status` | Update task status |
| DELETE | `/api/tasks/:id`| Delete task |

---

## 🔒 Authentication
- Uses **JWT tokens** for protecting routes.  
- Add the token in request headers:  



---
## Endpoints  

### 🔹 Register User  
**POST** `/api/auth/register`  

Registers a new user in the system.  

- Supports both **member** and **admin** roles.  
- **Admin role** is assigned only if a valid `adminToken` is provided.  
- Passwords are **hashed with bcrypt** before saving.  

---

#### 📥 Request Body  

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123",
  "adminToken": "optional_admin_token",
  "prfileImageUrl": "https://example.com/avatar.png"
}

#### 📥 Response
{
  "status": "success",
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "64a1234567b890cdef123456",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "member",
      "imageUrl": "https://example.com/avatar.png"
    }
  }
}
  

```
### 🔹 Login User  
**POST** `/api/auth/login`  

Authenticates a user with email and password.  

- Returns a **JWT token** on successful login.  
- Validates password using **bcrypt**.  
- If credentials are invalid, returns `401 Unauthorized` or `404 Not Found`.  

---

#### 📥 Request Body  

```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```
#### 📥 Response Returned
{
  "status": "success",
  "message": "Login successful",
  "data": {
    "user": {
      "id": "64a1234567b890cdef123456",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "member",
      "imageUrl": "https://example.com/avatar.png",
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
  }
}



## 🛠️ Scripts
- `npm run dev` → start server in dev mode with nodemon  
- `npm start` → start server in production  

---

## 📄 License
MIT License © 2025  
