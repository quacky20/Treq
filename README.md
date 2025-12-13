# TREQ - Real-time Chat Application

A modern, real-time chat application built with React and Node.js, featuring WebSocket communication for instant messaging.

## Features

- 🔐 User authentication (register/login)
- 💬 Real-time messaging with WebSocket
- 👥 Online/offline user status
- 🎨 Modern UI with Tailwind CSS
- 🔒 Secure password hashing with bcrypt
- 🍪 JWT-based session management
- 📱 Responsive design
- 🗑️ Account and message deletion

## Tech Stack

### Frontend
- **React** 19.2.0 - UI framework
- **Vite** 7.2.4 - Build tool
- **Tailwind CSS** 4.1.17 - Styling
- **Axios** - HTTP client
- **WebSocket** - Real-time communication

### Backend
- **Node.js** with Express 5.2.1
- **MongoDB** with Mongoose 9.0.1
- **WebSocket (ws)** 8.18.3 - Real-time messaging
- **JWT** - Authentication
- **bcrypt** - Password hashing

## Project Structure

```
treq/
├── api/                         # Backend server
│   ├── config/
│   │   ├── database.js          # MongoDB connection
│   │   └── cors.js              # CORS configuration
│   ├── controllers/
│   │   ├── authController.js    # Authentication logic
│   │   ├── userController.js    # User management
│   │   └── messageController.js # Message handling
│   ├── middleware/
│   │   ├── auth.js              # JWT verification
│   │   └── errorHandler.js      # Error handling
│   ├── models/
│   │   ├── User.js              # User schema
│   │   └── Message.js           # Message schema
│   ├── routes/
│   │   ├── authRoutes.js        # Auth endpoints
│   │   ├── userRoutes.js        # User endpoints
│   │   └── messageRoutes.js     # Message endpoints
│   ├── websocket/
│   │   └── wsHandler.js         # WebSocket logic
│   ├── utils/
│   │   └── constants.js         # App constants
│   ├── index.js                 # Server entry point
│   ├── .env.example
│   └── package.json
│
├── client/                      # Frontend application
│   ├── src/
│   │   ├── components/          # Reusable components
│   │   │   ├── Avatar.jsx
│   │   │   ├── Contact.jsx
│   │   │   ├── Logo.jsx
│   │   │   ├── Menu.jsx
│   │   │   └── Toast.jsx
│   │   ├── context/
│   │   │   └── UserContext.jsx
│   │   ├── pages/
│   │   │   ├── Chat.jsx
│   │   │   └── RegisterAndLoginForm.jsx
│   │   ├── App.jsx
│   │   ├── Routes.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── public/
│   ├── index.html
│   ├── vite.config.js
│   ├── .env.example
│   └── package.json
│
└── README.md
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB Atlas account or local MongoDB installation
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/quacky20/Treq
   cd treq
   ```

2. **Backend Setup**
   ```bash
   cd api
   npm install
   ```

   Create a `.env` file in the `api` directory:
   ```env
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_secret_key_here
   CLIENT_URL=http://localhost:5173
   PORT=4000
   ```

3. **Frontend Setup**
   ```bash
   cd ../client
   npm install
   ```

   Create a `.env` file in the `client` directory:
   ```env
   VITE_API_URL=http://localhost:4000
   VITE_WS_URL=ws://localhost:4000
   ```

### Running the Application

1. **Start the backend server**
   ```bash
   cd api
   npm run dev
   ```
   Server will run on `http://localhost:4000`

2. **Start the frontend (in a new terminal)**
   ```bash
   cd client
   npm run dev
   ```
   Application will run on `http://localhost:5173`

3. **Open your browser**
   Navigate to `http://localhost:5173`


## API Endpoints

### Authentication
- `POST /register` - Register a new user
- `POST /login` - Login user
- `POST /logout` - Logout user
- `GET /profile` - Get current user profile

### Messages
- `GET /messages/:userID` - Get messages with a specific user
- `DELETE /messages` - Delete all user messages

### Users
- `GET /people` - Get all registered users
- `DELETE /account` - Delete user account

### Health
- `GET /test` - Test endpoint
- `GET /health` - Health check

## Features in Detail

### Real-time Messaging
- WebSocket connection for instant message delivery
- Automatic reconnection on connection loss
- Online/offline status indicators

### User Management
- Secure password hashing
- JWT-based authentication
- Session persistence with cookies

### UI/UX
- Clean, modern interface
- Toast notifications for user actions
- Responsive design for all devices
- Keyboard shortcuts (ESC to exit chat)

## Environment Variables

### Backend (`api/.env`)
| Variable | Description |
|----------|-------------|
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret key for JWT tokens |
| `CLIENT_URL` | Frontend URL for CORS |
| `PORT` | Server port (default: 4000) |

### Frontend (`client/.env`)
| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Backend API URL |
| `VITE_WS_URL` | WebSocket server URL |


## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is open source and available under the [ISC License](LICENSE).

## Author

Yours truly

## Acknowledgments

- Material Symbols for icons
- Tailwind CSS for styling utilities
- MongoDB for database
- Vercel and Render for hosting