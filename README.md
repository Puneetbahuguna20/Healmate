# 🏥 HealMate – Smart Healthcare Management System

HealMate is a full-stack healthcare platform designed to streamline patient-doctor interactions, prescription management, and medical workflows through a modern web interface.

---

## 🚀 Features

* 👨‍⚕️ Doctor & Admin Dashboard
* 🧑‍💻 User Authentication & Authorization
* 📄 Digital Prescription Generation (PDF)
* 📂 Upload & Manage Medical Records
* 💳 Payment Integration (Razorpay)
* 📊 Category-based Health Services UI
* 🔄 Real-time Data Handling with Context API

---

## 🛠️ Tech Stack

### Frontend

* React.js
* Context API
* Tailwind CSS

### Backend

* Node.js
* Express.js

### Database

* MongoDB

### Other Tools

* Razorpay API
* PDF Generator
* Git & GitHub

---

## 📁 Project Structure

```
HealMate/
│── admin/        # Admin panel
│── backend/      # Server & APIs
│── frontend/     # User interface
│── .gitignore
│── package.json
```

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the repository

```
git clone https://github.com/your-username/HealMate.git
cd HealMate
```

### 2️⃣ Install dependencies

```
cd backend
npm install

cd ../frontend
npm install

cd ../admin
npm install
```

### 3️⃣ Setup environment variables

Create a `.env` file in backend:

```
PORT=5000
MONGO_URI=your_mongodb_connection
RAZORPAY_KEY=your_key
RAZORPAY_SECRET=your_secret
```

---

### 4️⃣ Run the project

```
# Backend
cd backend
npm run dev

# Frontend
cd frontend
npm start

# Admin Panel
cd admin
npm start
```

---

## 📸 Screenshots

*Add screenshots here (UI, dashboard, etc.)*

---

## 🌟 Future Improvements

* AI-based health recommendations
* Appointment scheduling system
* Notifications & reminders
* Mobile app integration

---

## 👨‍💻 Author

**Puneet Bahuguna**
B.Tech IT | Full Stack Developer

---

## ⭐ Contribute

Feel free to fork this repo and contribute to improve HealMate!

---

## 📌 Note

Make sure not to upload sensitive files like `.env`, `node_modules`, or `uploads`.

---
