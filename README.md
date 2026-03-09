# Buy2Enjoy

Buy2Enjoy is a full-stack e-commerce and unified booking "Super App" designed to provide a seamless user experience across retail, travel, and healthcare services.

## Technology Stack

This application is built using the **MERN** stack along with modern UI libraries and real-time features.

### 💻 Coding Languages
*   **JavaScript (ES6+)**: The primary programming language used for both the frontend (React) and backend (Node.js/Express) logic.
*   **HTML5 / JSX**: Used to structure the user interface within React components.
*   **CSS3**: Used heavily alongside utility-first frameworks to style the application.

### ⚛️ Frontend Technologies
*   **React 18**: The core frontend library for building the interactive user interface.
*   **Vite**: The build tool and development server, chosen for its speed and optimal Hot Module Replacement (HMR).
*   **Tailwind CSS**: A utility-first CSS framework used for rapid, responsive, and custom styling without writing raw CSS files.
*   **React Router DOM**: Used to handle seamless client-side routing between different pages (Home, Login, Profile, etc.) without reloading the browser.
*   **React Globe.gl & Three.js**: Used to power the interactive 3D globe visualization on the homepage.
*   **Lucide React**: Provides the scalable SVG vector icons used throughout the interface.
*   **Axios**: A promise-based HTTP client used to seamlessly request and post data to the backend API.

### ⚙️ Backend Technologies
*   **Node.js**: The JavaScript runtime environment that executes the backend server.
*   **Express.js**: A fast, unopinionated web framework for Node.js used to build the RESTful API routes and handle HTTP requests securely.
*   **Socket.io**: Enables real-time, bi-directional communication between the server and the frontend (used for live order notifications and alerts).
*   **JSON Web Tokens (JWT)**: Used alongside HTTP-Only cookies to securely authenticate and maintain user sessions.
*   **Bcrypt.js**: Used for securely hashing user passwords before they are stored in the database.

### 🗄️ Database
*   **MongoDB**: A NoSQL document database used to store all application data flexibly using JSON-like structures.
*   **Mongoose**: An Object Data Modeling (ODM) library for MongoDB and Node.js. It manages relationships between data, provides schema validation, and translates between objects in code and the representation of those objects in MongoDB.

## Getting Started

To run this project locally:

1.  Make sure you have MongoDB running locally or have a MongoDB URI.
2.  Install dependencies in the root, `frontend`, and `backend` directories.
3.  Seed the database: `npm run data:import` (from the root or backend).
4.  Start the development server: `npm run dev` (from the root directory).
    *   This will concurrently start the backend server on port `5000` and the frontend Vite server on port `5173`.
