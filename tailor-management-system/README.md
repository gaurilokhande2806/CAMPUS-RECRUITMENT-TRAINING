# Tailor Management System (TailorSys CRM)

An enterprise-grade, data-driven management platform designed for boutique tailors, fashion houses, and garment manufacturers. Built with a robust **Spring Boot** backend, **Hibernate ORM**, **MySQL database**, and a premium **Single-Page Application (SPA)** frontend served directly from Spring Boot static resources.

---

## Technical Stack
* **Backend:** Java 17, Spring Boot 3.3.0, Spring Data JPA, Hibernate, Maven.
* **Frontend:** HTML5, Premium Vanilla CSS3 (Slate theme tokens, glassmorphism, responsive utilities), Modular ES5/6 JavaScript, FontAwesome, Chart.js.
* **Database:** MySQL 8.0+

---

## Project Structure
```
tailor-system/
│
├── database/
│   └── tailor_db.sql         # Database schema creation and seed data SQL script
│
├── backend/                  # Spring Boot Maven Project Root
│   ├── .mvn/wrapper/        # Maven wrapper binaries
│   ├── mvnw / mvnw.cmd       # Maven wrapper execution scripts (Unix / Windows)
│   ├── pom.xml               # Maven dependencies and plugin configurations
│   │
│   └── src/
│       └── main/
│           ├── java/com/tailor/
│           │   ├── TailorApplication.java   # Spring Boot entry point
│           │   ├── model/                  # JPA Entity models
│           │   ├── repository/             # Spring Data JPA Repository interfaces
│           │   └── controller/             # REST controllers (APIs)
│           │
│           └── resources/
│               ├── application.properties  # Database connection strings and Hibernate parameters
│               └── static/                 # Embedded Frontend SPA files
│                   ├── index.html          # Main application page
│                   ├── css/style.css       # Premium style tokens and transitions
│                   └── js/                 # Modular state and views coordinators
│                       ├── app.js          # Core app lifecycle and state router
│                       ├── auth.js         # Authentication session and role checks
│                       ├── dashboard.js    # Dashboard view, timeline, Chart.js rendering
│                       ├── customers.js    # Customers directory, side-profile drawers, CSV exports
│                       ├── measurements.js # Sizes forms, version logs, revisions comparison
│                       ├── orders.js       # Draggable Kanban board, cards, tailors
│                       ├── inventory.js    # Fabrics stock levels, usage logging
│                       ├── billing.js      # GST math, invoice previews, UPI QR generators
│                       └── reports.js      # Growth metrics, performance logs, Excel downloads
└── README.md                 # Setup and execution guide
```

---

## Installation & Setup Instructions

### 1. Database Setup (MySQL)
1. Open your MySQL client (MySQL Workbench, Command Line, or IntelliJ Database Explorer).
2. Connect to your local MySQL instance.
3. Import and execute the SQL script located at:  
   `[root]/database/tailor_db.sql`
4. This script creates the `tailor_db` schema, structures all required tables, and populates them with extensive seed data.

### 2. Connect Database with Spring Boot
1. Navigate to:  
   `backend/src/main/resources/application.properties`
2. If your local MySQL instance uses a different username or password, modify these properties:
   ```properties
   spring.datasource.username=YOUR_MYSQL_USERNAME  (Default: root)
   spring.datasource.password=YOUR_MYSQL_PASSWORD  (Default: root)
   ```
3. Make sure MySQL is running on `localhost:3306`.

### 3. Open and Run in IntelliJ IDEA
1. Launch **IntelliJ IDEA**.
2. Click **Open** or **Import Project** and select the **`backend/`** directory (choose the directory containing `pom.xml`).
3. Ensure that your project SDK is configured to **Java 17** (File > Project Structure > Project > SDK).
4. Wait for Maven to index and download the dependencies configured in `pom.xml` (IntelliJ does this automatically).
5. Open `src/main/java/com/tailor/TailorApplication.java` and click the green **Run** play icon next to the `main` method.
6. Open your web browser and navigate to:  
   **`http://localhost:8080`**

### 4. Running via Terminal (Alternative)
If you prefer running via the terminal, navigate to the `backend/` directory and execute:
```cmd
# Windows PowerShell / CMD
.\mvnw.cmd spring-boot:run

# Unix / macOS Terminal
./mvnw spring-boot:run
```

---

## How to Test the Application
Once the app loads, sign in using one of the seeded credentials:

* **Administrator Profile:**  
  * Username: `admin`  
  * Password: `admin123`  
  * *Access:* Complete systems, billing, inventory, and analytics access.
  
* **Designer Profile:**  
  * Username: `designer`  
  * Password: `designer123`  
  * *Access:* Manage customers, measurements, and production tickets. (Billing & Reports hidden).

* **Tailor Profile:**  
  * Username: `tailor1`  
  * Password: `tailor123`  
  * *Access:* Kanban board to update assigned orders.

---

## Custom Feature Walkthroughs
1. **Dynamic Dashboard:** Displays real-time summary statistics, todays deliveries schedule timeline, and 4 interactive Chart.js graphs mapping revenue, items categories, and roll levels.
2. **Customer Profiles:** Click on a customer's name in the directory to slide open a detailed side panel showing contact information, order summary, and sizing details.
3. **Measurements Versioning:** Click "New Sizing" inside the Measurements page to insert a revision. Compare two versions side-by-side using the "Comparison View" drawer.
4. **Draggable Kanban Board:** Drag and drop order cards between columns (Pending, Cutting, Stitching, Ready, Delivered). Cards color-code themselves automatically based on deadlines.
5. **Auto GST Invoice:** In the Billing view, select an order to calculate 18% GST, generate invoice print sheets, and output UPI QR payments.
