# 🌱 EcoVision (Eco-Visualizer)

EcoVision is a full-stack Environmental Dashboard and Prediction application. It provides users with dynamic visualizations, data-driven predictions, interactive geographical maps, and AI-powered insights concerning environmental trends, regions, and viable solutions.

---

## 🏗️ System Architecture

The application is split into two main parts: a **Frontend (Client)** and a **Backend (API)**. They run on separate servers but communicate with each other seamlessly.

1. **Frontend (Next.js - Port 3000):** The user interface where data is displayed through beautiful charts, maps, and interactive chat.
2. **Backend (Express.js - Port 5000):** The brain of the application. It processes requests, interacts with the database to fetch or save prediction/region data, and talks to Google's Gemini AI.
3. **Database (MySQL):** The persistent storage layer where all the structured data lives.

---

## 🛠️ Technology Stack & Concepts

### Frontend Technologies
* **Next.js & React:** Next.js is a React framework that allows us to build fast, SEO-friendly, and highly interactive user interfaces. It handles all our routing (like navigating from Home to Search).
* **TypeScript:** A strict syntactical superset of JavaScript that adds static typing. It helps catch errors before the code is even run and ensures the data we get from the backend matches what we expect on the frontend.
* **Tailwind CSS:** A utility-first CSS framework for rapidly styling the application directly inside our components without writing custom CSS files.
* **Chart.js & React-Chartjs-2:** Used for rendering powerful data visualizations (like line charts for temperature changes or bar charts for emissions).
* **Leaflet:** An open-source JavaScript library for mobile-friendly interactive maps. It helps visualize regions on an actual map.
* **Mermaid:** A diagramming and charting tool that renders markdown-inspired text definitions to create complex diagrams dynamically.

### Backend Technologies
* **Express.js (Node.js):** A fast, unopinionated web framework for Node.js. It acts as our API server, defining routes (endpoints) like `/api/regions` or `/api/chat`.
* **TypeScript:** Configured with `ts-node-dev` so our backend is completely type-safe.
* **Google Generative AI (Gemini):** Integrated into the backend to power the chat feature, allowing users to ask complex questions about environmental solutions and receive intelligent, AI-generated responses.

### Database Layer
* **MySQL:** A robust relational database management system where tables for Regions, Predictions, and Solutions are stored.
* **Prisma (ORM):** 
  * *What is it?* Prisma is a next-generation Object-Relational Mapper (ORM). Instead of writing complex raw SQL queries (like `SELECT * FROM users WHERE...`), Prisma lets us interact with our MySQL database using clean, readable TypeScript code.
  * *What does it do?* First, we define our database schema in a `schema.prisma` file. Prisma reads this file and automatically generates strict TypeScript types and the exact SQL commands needed to build (`prisma migrate`) and talk to the database (`prisma generate`). It handles all the heavy lifting of keeping the app and the database in perfect sync.

---

## 🔄 How the Frontend and Backend Work Together

Here is the typical flow of data in EcoVision:

1. **User Interaction:** A user visits `http://localhost:3000` and clicks on a specific environmental region.
2. **API Request:** The Next.js frontend sends an HTTP `GET` request (using `fetch` or `axios`) to the backend API at `http://localhost:5000/api/regions/1`.
3. **Backend Processing:** Express.js receives the request at the `/api/regions/:id` route. 
4. **Database Query (Prisma):** The Express controller uses Prisma to securely query the MySQL database (e.g., `prisma.region.findUnique({ id: 1 })`).
5. **JSON Response:** Prisma hands the precise data back to Express, which then sends a JSON payload back to the frontend.
6. **Visualization:** The React component receives the JSON data, updates its state, and dynamically renders the geographical map (Leaflet) and the temperature prediction charts (Chart.js) for the user to see.

---

## 🚀 Running the Project

For an effortless developer experience, the project is configured to run both the frontend and backend simultaneously from the root directory.

### Prerequisites 
- Node.js installed
- A local MySQL connection (User: `root`, Password: `password`)
- Database created: `CREATE DATABASE environmental_prediction;`

### Start Command
Simply open your terminal, navigate to the `ecovision` root folder, and run:

```bash
# Installs dependencies for the root, frontend, and backend packages
npm run install:all

# Boot up the database schema and add initial seed data
npm run dev:backend # (in a separate tab, temporarily to run Prisma migrations: \`npx prisma migrate dev\` then \`npx prisma seed\`)

# Start BOTH the Next.js Frontend and Express Backend concurrently
npm run dev
```

* Frontend runs on `http://localhost:3000`
* Backend runs on `http://localhost:5000`