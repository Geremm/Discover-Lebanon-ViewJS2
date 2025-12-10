# Discover Lebanon - Web Project 🇱🇧

Welcome to the **Discover Lebanon** project! This web application allows users to explore the beauty of Lebanon, discover places, book hotels, restaurants, and activities. It features a user/admin management system.

## Features

### General
* **Responsive Design:** Fully adapted for Desktop, Tablet, and Mobile devices.
* **Dynamic Navigation:** Interactive mega-menu and sidebar navigation.
* **Services:** Browse Places, Hotels, Restaurants, and Activities with name search.

### User Features
* **Authentication:** Secure Login and Registration system.
* **User Dashboard:** Manage personal account details.
* **Trip Planning:** "Plan your trip" feature.
* **Add Favorite:** Click on the heart on the card that you want to add to your favorites.
* **Book Hotel/Restaurant:** Browse through the available options and make a reservation for your stay or dining experience.

### Admin Features
* **User:** The admin has access to the same features as the user, plus additional privileges.
* **Management:** Ability to add or remove items, and confirm user bookings after calling the concerned establishment. The same logic applies to cancellations.

---

##  Installation Guide

Follow these steps to set up the project locally.

### 1. Prerequisites
* **Node.js** & **npm** installed.
* **Local Server** (XAMPP, WAMP, or MAMP) for the MySQL database.

### 2. Database Setup (SQL Import)
Before starting the application, you must set up the database:

1.  Open **MySQL workbench**
2.  Create a new database named `efrei` 
3.  Click on **Server>Data Import**.
4.  Click on Import from Self-Contained File
5.  Select the file **`BDD.sql`** located in the root folder of this project.
6. Select `efrei` in Default target schema
7.  Click **Start Import** to execute the import.
8.  **Fix Product Icons (Important):**
    After importing, some special characters might appear as `?`. Run the following SQL script to fix the product names:

    ```sql
    USE efrei;

    SET SQL_SAFE_UPDATES = 0;

    UPDATE products 
    SET name = CONCAT('📍', SUBSTRING(name, 2)) 
    WHERE name LIKE '?%';

    SET SQL_SAFE_UPDATES = 1;
    ```

### 3. Project Setup
Before starting the server, you need to update the database connection settings to match your local MySQL credentials.

1.  Open the file **`app.js`**
2.  Locate the `mysql.createConnection` block and update the **password** and **database** name if necessary:

```javascript
const db = mysql.createConnection({
  host: "localhost",
  user: "root",       // Your MySQL username (usually 'root')
  password: "",   // <--- REPLACE with your own MySQL password
  database: "efrei",  // Make sure this matches your imported database name
  port: 3306
});
```
Open your terminal in the root project folder and run:

```bash
npm install

cd client
npm install
cd.. 

npm run dev
```

## 🔐 Test Credentials

Use the following accounts to test the application features.

| Role | Email | Password | Access Level |
| :--- | :--- | :--- | :--- |
| **Admin** | `Admin@gmail.com` | `AdminSPA159` | Acess to Admin Panel |
| **User** | `user@gmail.com` | `UserSPA159` | Access to "My Account" & planning features |