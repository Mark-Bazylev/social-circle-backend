# Social Circle Backend

  The Social Circle Backend is a RESTful API server designed to facilitate social networking functionalities.
  It offers various endpoints for user authentication, post management, account management, friend requests, comments, and chat messaging.
## Table of Contents

- [Usage](#usage)
  - [Start the Server](#1-start-the-server)
  - [Interacting with the API](#2-interacting-with-the-api)
  - [Environment Variables](#3-environment-variables)

## Usage

## 1. **Start the Server:**
   - Run `npm install` to install dependencies.
   - Run `npm start` to start the server.

## 2. **Interacting with the API:**
   - Use Postman or any other API testing tool to interact with the backend API.
   - **User Authentication:**
     - **POST Request - Register:**
       - Endpoint: `POST /api/v1/auth/register`
       - Description: Registers a new user account.

     - **POST Request - Login:**
       - Endpoint: `POST /api/v1/auth/login`
       - Description: Logs in an existing user and returns an authentication token.

- For the Following Ensure to include a **Bearer token** in the header for authorization.

   - **Posts:**
     - **GET Request - Get All Posts:**
       - Endpoint: `GET /api/v1/posts`
       - Description: Retrieves all posts.

     - **GET Request - Get Single Post:**
       - Endpoint: `GET /api/v1/posts/:id`
       - Description: Retrieves a single post by its ID.

     - **GET Request - Get User Posts:**
       - Endpoint: `GET /api/v1/posts/users/:userId`
       - Description: Retrieves posts of a specific user.

     - **POST Request - Create Post:**
       - Endpoint: `POST /api/v1/posts`
       - Description: Creates a new post.

     - **DELETE Request - Delete Post:**
       - Endpoint: `DELETE /api/v1/posts/:id`
       - Description: Deletes a post by its ID.

   - **Accounts:**
     - **GET Request - Get All Accounts:**
       - Endpoint: `GET /api/v1/accounts`
       - Description: Retrieves all user accounts.

     - **GET Request - Get Account:**
       - Endpoint: `GET /api/v1/accounts/:userId`
       - Description: Retrieves a user account by its ID.

     - **PATCH Request - Edit Account:**
       - Endpoint: `PATCH /api/v1/accounts/edit`
       - Description: Edits user account information.

   - **Friend Requests:**
     - **GET Request - Get Friends Data:**
       - Endpoint: `GET /api/v1/friendsRequest`
       - Description: Retrieves friend data of the user.

     - **POST Request - Send Friend Request:**
       - Endpoint: `POST /api/v1/friendsRequest/send`
       - Description: Sends a friend request to another user.

     - **POST Request - Accept Friend Request:**
       - Endpoint: `POST /api/v1/friendsRequest/accept`
       - Description: Accepts a friend request.

   - **Comments:**
     - **POST Request - Create Comment:**
       - Endpoint: `POST /api/v1/comments`
       - Description: Creates a new comment.

     - **GET Request - Get My Comments:**
       - Endpoint: `GET /api/v1/comments`
       - Description: Retrieves comments made by the user.

     - **GET Request - Get Comment:**
       - Endpoint: `GET /api/v1/comments/:id`
       - Description: Retrieves a comment by its ID.

     - **GET Request - Get Post Comments:**
       - Endpoint: `GET /api/v1/comments/post/:postId`
       - Description: Retrieves comments of a specific post.

  - **Chat:**
     - **GET Request - Get Chat Messages By Page:**
       - Endpoint: `GET /api/v1/chat`
       - Description: Retrieves chat messages based on pagination and users involved.
       - **Query Parameters:**
         - `pageIndex`: Specifies the page index for pagination.
         - `userId`: Specifies the user ID.
         - `otherUserId`: Specifies the other user's ID.

## 3. **Environment Variables:**
   - Ensure you have set up the necessary environment variables in the `.env` file. Example variables include:
     - `MONGO_URI`: MongoDB connection URI.
     - `JWT_SECRET`: Secret key for JWT token generation.
     - `JWT_LIFETIME`: Lifetime of JWT tokens.
     - `PORT`: Port number for the server to listen on.
