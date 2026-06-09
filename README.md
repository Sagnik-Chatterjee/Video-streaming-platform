# 🎥 Video Streaming Platform

A full-stack video streaming platform built using **React.js**, **Node.js**, **Express.js**, **MongoDB Atlas**, and **Cloudinary**. The platform enables users to upload, manage, and stream videos while providing authentication, profile management, channel subscriptions, and search functionality.

## 🌐 Live Demo

### Frontend

https://video-streaming-platform-ashy.vercel.app

### Backend API

https://video-streaming-platform-8bc6.onrender.com

### API Base URL

```text
https://video-streaming-platform-8bc6.onrender.com/api/v1
```

---

# ✨ Features

## 🔐 Authentication & Authorization

* User Registration
* User Login
* User Logout
* JWT-based Authentication
* Access Token & Refresh Token Mechanism
* Cookie-based Authentication
* Protected Routes
* Automatic Session Recovery
* Persistent Login Sessions

## 👤 User Profile Management

* View Profile
* Edit Profile Details
* Change Password
* Update Avatar
* Update Cover Image
* View Channel Profile
* Watch History

## 🎬 Video Management

* Upload Videos
* Upload Video Thumbnails
* Stream Videos
* View Individual Videos
* Update Video Title
* Update Video Description
* Update Video Thumbnail
* Delete Videos
* Publish / Unpublish Videos
* View Channel Videos

## 📺 Subscription System

* Subscribe to Channels
* Unsubscribe from Channels
* View Subscriber Count
* View Subscribed Channels

## 🔍 Search

* Search Videos
* Browse Uploaded Content

---

# 🏗️ Tech Stack

## Frontend

* React.js
* React Router
* Context API
* Axios
* CSS3
* Vite

## Backend

* Node.js
* Express.js
* MongoDB Atlas
* Mongoose
* JWT Authentication
* Multer

## Cloud Services

* Cloudinary (Image & Video Storage)

## Deployment

* Frontend: Vercel
* Backend: Render

---

# 📂 Project Structure

```text
Video-streaming-platform
│
├── Backend
│   │
│   ├── src
│   │   ├── app.js
│   │   ├── index.js
│   │   ├── constants.js
│   │   │
│   │   ├── db
│   │   │   └── index.js
│   │   │
│   │   ├── middleware
│   │   │   ├── auth.middleware.js
│   │   │   └── multer.middleware.js
│   │   │
│   │   ├── controllers
│   │   │   ├── user.controller.js
│   │   │   ├── video.controller.js
│   │   │   └── subscription.controller.js
│   │   │
│   │   ├── models
│   │   │   ├── User.js
│   │   │   ├── Video.js
│   │   │   └── Subscription.js
│   │   │
│   │   ├── routes
│   │   │   ├── user.routes.js
│   │   │   ├── video.routes.js
│   │   │   └── subscription.routes.js
│   │   │
│   │   └── utils
│   │       ├── ApiError.js
│   │       ├── ApiResponse.js
│   │       ├── asyncHandler.js
│   │       └── cloudinary.js
│
├── Video streaming frontend
│   │
│   ├── src
│   │   ├── assets
│   │   ├── context
│   │   │   └── AuthContext.js
│   │   ├── pages
│   │   ├── utils
│   │   │   ├── api.js
│   │   │   └── capitalize.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── styles
│
└── README.md
```

---

# 🔐 Authentication Flow

The application uses JWT Authentication with automatic token refreshing.

### Flow

1. User logs in.
2. Backend generates:

   * Access Token
   * Refresh Token
3. Protected routes verify access tokens.
4. Axios interceptors detect expired access tokens.
5. Refresh token endpoint automatically issues a new access token.
6. Original request is retried seamlessly.
7. User remains logged in without interruption.

This improves security while providing a smooth user experience.

---

# ⚡ Frontend Features

## Authentication Context

The application uses React Context API for global authentication state management.

### AuthContext Features

* User State Management
* Token Management
* Persistent Sessions
* Login Functionality
* Logout Functionality
* Automatic Session Restoration

## Axios API Layer

A centralized API layer handles:

* API Communication
* Credential Management
* Token Refresh Logic
* Error Handling
* Request Retrying

---

# 📄 Frontend Pages

## Authentication

* Login Page
* Register Page

## Home & Navigation

* Homepage
* Navbar

## Video Features

* Video Page
* Add Video Page
* Update Title Page
* Update Description Page
* Update Thumbnail Page

## Profile Management

* Profile Page
* User Profile Page
* Edit Profile Page
* Edit Avatar Page
* Edit Cover Page

## Search

* Search Page

---

# 🌐 API Endpoints

## User Routes

| Method | Endpoint                        | Description              |
| ------ | ------------------------------- | ------------------------ |
| POST   | `/api/v1/users/register`        | Register User            |
| POST   | `/api/v1/users/login`           | Login User               |
| POST   | `/api/v1/users/logout`          | Logout User              |
| POST   | `/api/v1/users/refresh-token`   | Refresh Access Token     |
| POST   | `/api/v1/users/change-password` | Change Password          |
| GET    | `/api/v1/users/current-user`    | Get Current User         |
| PATCH  | `/api/v1/users/update-account`  | Update Account Details   |
| PATCH  | `/api/v1/users/avatar`          | Update Avatar            |
| PATCH  | `/api/v1/users/cover-image`     | Update Cover Image       |
| GET    | `/api/v1/users/c/:username`     | Get User Channel Profile |
| GET    | `/api/v1/users/history`         | Get Watch History        |
| GET    | `/api/v1/users/p/:id`           | Get Channel Details      |

---

## Video Routes

| Method | Endpoint                              | Description              |
| ------ | ------------------------------------- | ------------------------ |
| GET    | `/api/v1/videos`                      | Get All Videos           |
| POST   | `/api/v1/videos`                      | Upload Video             |
| GET    | `/api/v1/videos/channel/:userId`      | Get Videos Of Channel    |
| GET    | `/api/v1/videos/video/:videoId`       | Get Video By ID          |
| PATCH  | `/api/v1/videos/video/:videoId`       | Delete Video             |
| GET    | `/api/v1/videos/search`               | Search Videos            |
| PATCH  | `/api/v1/videos/title/:videoId`       | Update Video Title       |
| PATCH  | `/api/v1/videos/description/:videoId` | Update Video Description |
| PATCH  | `/api/v1/videos/thumbnail/:videoId`   | Update Thumbnail         |
| PATCH  | `/api/v1/videos/publish/:videoId`     | Toggle Publish Status    |

---

## Subscription Routes

| Method | Endpoint                                | Description             |
| ------ | --------------------------------------- | ----------------------- |
| GET    | `/api/v1/subscriptions/c/:channelId`    | Get Subscribed Channels |
| POST   | `/api/v1/subscriptions/c/:channelId`    | Subscribe / Unsubscribe |
| GET    | `/api/v1/subscriptions/u/:subscriberId` | Get Channel Subscribers |

---

# ⚙️ Environment Variables

Create a `.env` file inside the Backend directory.

```env
PORT=8000

MONGODB_URI=your_mongodb_connection_string

ACCESS_TOKEN_SECRET=your_access_token_secret
ACCESS_TOKEN_EXPIRY=1d

REFRESH_TOKEN_SECRET=your_refresh_token_secret
REFRESH_TOKEN_EXPIRY=10d

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

CORS_ORIGIN=http://localhost:5173
```

---

# 🛠️ Installation

## Clone Repository

```bash
git clone https://github.com/Sagnik-Chatterjee/Video-streaming-platform.git
```

## Backend Setup

```bash
cd Backend

npm install

npm run dev
```

## Frontend Setup

```bash
cd "Video streaming frontend"

npm install

npm run dev
```

---


# 🔮 Future Improvements

* Comments System
* Video Likes
* Playlists
* Recommendation Engine
* Advanced Search Filters
* Real-Time Notifications
* Analytics Dashboard
* Video Categories
* Trending Videos Section

---

# 👨‍💻 Author

**Sagnik Chatterjee**

GitHub: https://github.com/Sagnik-Chatterjee

---

# 📜 License

This project is licensed under the MIT License.
