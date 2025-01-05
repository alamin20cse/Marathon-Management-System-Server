# Marathon Management System - Backend

This repository contains the backend implementation of the Marathon Management System API. The API is built with Node.js, Express, and MongoDB, providing endpoints for managing marathons and user registrations.

## Features

- JWT-based authentication and cookie-based token storage.
- CRUD operations for managing marathons.
- Marathon registration management with count updates.
- Sorting and searching functionality for marathons and registrations.
- Middleware for authentication and authorization.
- CORS configuration for secure cross-origin requests.

## Technologies Used

- Node.js
- Express.js
- MongoDB
- JWT for authentication
- dotenv for environment variable management
- cookie-parser for parsing cookies
- CORS for cross-origin resource sharing

## Prerequisites

Before running this project, ensure you have the following installed:

- Node.js (v14 or above)
- MongoDB (local or cloud-based)
- A MongoDB cluster URI with proper credentials
- A `.env` file with the following variables:
  ```env
  PORT=5000
  USER=<your_mongo_user>
  PASS=<your_mongo_password>
  SECRET_KEY=<your_jwt_secret_key>
  NODE_ENV=development



1. Clone the repository:
   ```bash
   git clone https:https:https://github.com/programming-hero-web-course2/b10a11-server-side-alamin20cse

## Live Link
Check out the live application here: https://marathon-management-syst-7b404.web.app/
