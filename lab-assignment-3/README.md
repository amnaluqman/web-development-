# Lab Assignment 3 — User Authentication & Role-Based Access Control

Khaadi e-commerce site with user authentication, password hashing, sessions, and role-based access control (RBAC) for the Admin Panel.

## Features
- User registration & login with bcrypt password hashing
- Session-based authentication using express-session + connect-mongo
- Role-based access control (Customer vs Admin)
- Protected admin routes via `isAdmin` middleware
- Flash messages for user feedback
- Dynamic navbar (Login/Register vs Logout/Profile)

## Tech Stack
- Node.js + Express
- EJS Templates
- MongoDB + Mongoose
- bcryptjs, express-session, connect-mongo, connect-flash

## How to Run
1. `npm install`
2. `node seed.js` (to seed sample products)
3. `node server.js`
4. Visit `http://localhost:3000`

## Files inside this folder
- `models/` — User & Product schemas
- `views/` — EJS templates (including admin panel)
- `public/` — Static CSS, images, scripts
- `server.js` — Main Express server with auth routes
- `seed.js` — Sample product seeder
