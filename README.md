# XBYTE

**A web application that allows users to create and share text-based content with others via unique links**

## Tech Stack:
 - **HTML**
 - **CSS**
 - **Vanilla JavaScript**
 - **Node.js**
 - **MySQL**

## Features
 - **Create and share text content via unique links**
 - **Secure user authentication with hashed passwords**
 - **Login system powered by JWT**
 - **Content stored using MySQL**

<br>

*Note: You need to install all required packages before running the web app*
<br>

## How to Use

**Clone the repository**

```bash
git clone https://github.com/utopiaLF/xbyte.git
cd xbyte
```
<br>

## Make sure you have Node.js and MySQL installed

```bash
npm install express bcryptjs cors dotenv body-parser mysql2 jsonwebtoken jwt-decode path
```

<br>

## Setup Database (MySQL)
 - **Create the database and tables using the provided `schema.sql`**

```bash
mysql -u your_username -p < schema.sql
```

<br>

№№ Create a .env file in the root folder and add:
```bash
JWT_SECRET=your_secret_password
```

**This project is licensed under the [MIT License](./LICENSE). Have fun!**
## Make sure you're in the root folder
 - **Start the server**
```bash
node server.js
```
**The server will run at: http://localhost:3000**
