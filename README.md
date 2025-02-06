# 🎉 IRC Project 🎉

This project is an IRC (Internet Relay Chat) application built with a **Node.js + Express** backend and a **React** frontend. It supports real-time communication using **Socket.IO** and provides features for channel and user management.

## ✨ Features

### 🌐 Server-Side (Node.js + Express)
- **Simultaneous Connections**: Supports multiple users connecting at the same time.
- **Channel Management**:
    - ➕ Create a channel
    - ❌ Delete a channel
    - 📜 List all channels
    - ➡️ Join a channel
    - ⬅️ Quit a channel
    - 🔄 Join multiple channels simultaneously
    - 💾 Persistent storage of channels and messages using MongoDB
- **User Management**:
    - 🔄 Change nickname
    - ✉️ Send private messages
    - 👥 List users in a channel
- **Notifications**:
    - 🔔 Notify when a user joins a channel
    - 🔕 Notify when a user leaves a channel

### 💻 Client-Side (React)
- **User Interface**:
    - 🖥️ Clear and intuitive channel management interface
    - 💬 Ergonomic chat interface
    - 🎨 Advanced and well-elaborated design
- **Real-Time Chat**:
    - 🔄 Communicate with the server via Socket.IO
    - 📨 Send messages to all users in a channel
    - 🛠️ Execute commands via the user interface
- **Data Persistence**:
    - 💾 Save and retrieve messages and channels

## 🚀 Getting Started

### 📋 Prerequisites
- Node.js
- MongoDB

### 📦 Installation

1. Clone the repository:
     ```sh
     git clone git@github.com:Klemso/Internet-Relay-Chat.git
     cd Internet-Relay-Chat
     ```

2. Install dependencies for both backend and frontend:
     ```sh
     cd backend
     npm install
     cd ../frontend
     npm install
     ```

3. Set up environment variables:
     - Create a `.env` file in the backend directory based on `.env.copy` and fill in the required values.

## 🏃 Running the Application

1. Start the backend server:
     ```sh
     cd backend
     npm start
     ```

2. Start the frontend development server:
     ```sh
     cd frontend
     npm start
     ```

3. Open your browser and navigate to `http://localhost:3000`.

## 🧪 Running Tests

### Backend Tests
- To run backend tests, navigate to the backend directory and run:
    ```sh
    npm test
    ```

### Frontend Tests
- To run frontend tests, navigate to the frontend directory and run:
    ```sh
    npm test
    ```

## 🗂️ Project Structure

### Backend
- `controllers/`: Contains the logic for handling requests.
- `models/`: Contains Mongoose models for MongoDB.
- `routes/`: Defines API routes.
- `server.js`: Entry point for the backend server.
- `tests/`: Contains backend tests.

### Frontend
- `src/`: Contains the source code for the React application.
- `components/`: Contains React components.
- `utils/`: Contains utility functions.
- `App.js`: Main application component.
- `index.js`: Entry point for the React application.
- `public/`: Contains static files.
- `tests/`: Contains frontend tests.

## 🛠️ Commands

### Backend 
- `npm start`: Start the backend server.
- `npm test`: Run backend tests.

### Frontend
- `npm start`: Start the frontend development server.
- `npm test`: Run frontend tests.
- `npm run build`: Build the frontend for production.

---

# Made by these guys

<div style="display: flex; justify-content: space-around;">
  <img src="/frontend/public/bastian-tenue-de-plongée-modified.png" alt="Bastian Harel" width="200"/>
  <img src="/frontend/public/axel-modified.png" alt="Axel Huguet" width="200"/>
  <img src="/frontend/public/clement-baleine-modified.png" alt="Clément Lores" width="200"/>
</div>
