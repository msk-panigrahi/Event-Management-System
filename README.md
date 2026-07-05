# 🎟️ EventHub

> A full-stack Event Management System built with the MERN stack that enables users to discover events, book tickets, and manage bookings while providing administrators with event management, analytics, and QR-based ticket verification.

<p align="center">

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![Node.js](https://img.shields.io/badge/Node.js-339933?logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?logo=express)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?logo=mongodb)
![JWT](https://img.shields.io/badge/JWT-Authentication-orange)
![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white)

</p>

---

# 📖 Overview

EventHub is a full-stack web application designed to simplify the event management experience for both users and administrators.

Users can explore events, book tickets, and download QR-based tickets, while administrators can create and manage events, monitor bookings through analytics, and validate attendee tickets using an integrated QR scanner.

This project was developed as part of a **Web Development Internship**, focusing on practical full-stack application development using the MERN stack.

---

# 🎯 Highlights

- 🔐 JWT Authentication & Authorization
- 👥 Role-Based Access (Admin & User)
- 🎉 Event Creation & Management
- 🎫 Ticket Booking with Seat Validation
- 📱 QR Code Ticket Generation
- ✅ QR-Based Check-in Verification
- 📊 Analytics Dashboard
- 📄 PDF Ticket Download
- 📷 Event Image Upload
- 📱 Fully Responsive UI

---

# 📸 Screenshots

## Landing Page

<p align="center">
<img src="images/landing-page.png" width="750">
</p>

---

## Login

<p align="center">
<img src="images/login.png" width="750">
</p>

---

## Events

<p align="center">
<img src="images/events.png" width="750">
</p>

---

## Event Details

<p align="center">
<img src="images/event-details.png" width="750">
</p>

---

## Ticket Booking

<p align="center">
<img src="images/booking.png" width="750">
</p>

---

## QR Ticket

<p align="center">
<img src="images/qr-ticket.png" width="750">
</p>

---

## Admin Dashboard

<p align="center">
<img src="images/admin-dashboard.png" width="750">
</p>

---

## Analytics Dashboard

<p align="center">
<img src="images/analytics.png" width="750">
</p>

---

# ✨ Features

### 👤 User

- User Registration & Login
- Browse Available Events
- View Event Details
- Ticket Booking
- Seat Availability Validation
- QR Code Ticket Generation
- Download Ticket as PDF

### 🛠 Administrator

- Role-Based Access Control
- Create, Update & Delete Events
- Publish / Unpublish Events
- Upload Event Images
- QR Ticket Verification
- Duplicate Check-in Prevention
- Revenue & Booking Analytics

---

# 🛠 Tech Stack

| Category | Technologies |
|----------|--------------|
| **Frontend** | React.js, Vite, React Router, Axios, Context API |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB, Mongoose |
| **Authentication** | JWT, bcrypt |
| **File Upload** | Multer |
| **Charts** | Chart.js |
| **Utilities** | React Toastify, html5-qrcode, jsPDF |

---

# 📂 Project Structure

```text
Event-Management-System
│
├── backend
│   ├── config
│   ├── controllers
│   ├── middleware
│   ├── models
│   ├── routes
│   ├── uploads
│   └── server.js
│
├── frontend
│   ├── public
│   └── src
│       ├── components
│       ├── context
│       ├── pages
│       ├── services
│       └── utils
│
├── images
│
└── README.md
```

---

# 🚀 Getting Started

## Clone the Repository

```bash
git clone https://github.com/msk-panigrahi/Event-Management-System.git

cd Event-Management-System
```

---

## Backend Setup

```bash
cd backend

npm install

npm run dev
```

---

## Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

---

# ⚙ Environment Variables

### Backend (.env)

```env
PORT=

MONGODB_URI=

JWT_SECRET=

JWT_EXPIRE=

CLIENT_URL=
```

### Frontend (.env)

```env
VITE_API_URL=
```

---

# 🚀 Future Enhancements

- 💳 Razorpay Payment Gateway Integration
- 📧 Email Notifications
- 🔑 Google Authentication
- 🔔 Real-time Notifications

---

# 👨‍💻 Author

**Mithun Sai Kumar Panigrahi**

Developed as part of a Web Development Internship to strengthen practical experience in designing and building scalable full-stack web applications using the MERN stack.

If you found this project useful, consider giving it a ⭐ on GitHub.