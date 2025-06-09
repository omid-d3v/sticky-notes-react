# Sticky Notes Birthday Board

A modern, full-stack web application that allows users to create public "sticky note" boards for special occasions like birthdays. Friends and colleagues can leave messages on a public link, while an authenticated admin can manage all the notes and boards through a secure panel.



---

## ✨ Features

* **Public Note Boards:** Anyone with a link can view a board and see all the congratulatory messages.
* **Secure Admin Panel:** A protected area for managing all aspects of the application.
* **Authentication:** Admins log in securely using Firebase Authentication (Email/Password).
* **Full CRUD Functionality:** Admins can create new boards and create, read, update, and delete sticky notes on any board.
* **Dynamic Routing:** Each board has a unique, shareable URL.
* **Modern Frontend:** Built with React, TypeScript, and Vite for a fast and smooth user experience.
* **Serverless Backend:** Powered by a Cloudflare Worker that acts as a secure proxy to the Firebase backend.
* **Clean & Responsive UI:** Aesthetically pleasing design that works well on all devices.

---

## 🚀 Tech Stack

* **Frontend:**
    * [React](https://reactjs.org/)
    * [TypeScript](https://www.typescriptlang.org/)
    * [Vite](https://vitejs.dev/)
    * [React Router](https://reactrouter.com/) for routing
    * [GSAP](https://greensock.com/gsap/) for animations
* **Backend & Database:**
    * [Firebase Firestore](https://firebase.google.com/docs/firestore) for the database
    * [Firebase Authentication](https://firebase.google.com/docs/auth) for user management
* **Deployment & Infrastructure:**
    * [Vercel](https://vercel.com/) for frontend hosting
    * [Cloudflare Workers](https://workers.cloudflare.com/) for the serverless proxy API

---

## 🛠️ Setup and Installation

To run this project locally, follow these steps:

### 1. Prerequisites

* Node.js (v18 or higher)
* A Firebase project with Firestore and Authentication enabled.
* A Cloudflare account.

### 2. Clone the Repository

```bash
git clone [https://github.com/omid-d3v/sticky-notes-react/.git](https://github.com/omid-d3v/sticky-notes-react.git)
cd your-repo-name
```

### 3. Backend Setup (Cloudflare Worker)

The backend is a Cloudflare Worker that acts as a secure proxy to Firebase.

1.  **Create a Worker:** Follow the [Cloudflare documentation](https://developers.cloudflare.com/workers/get-started/guide/) to create a new worker.
2.  **Copy the Code:** Replace the default worker code with the contents of the provided worker script.
3.  **Set Environment Variables:** In your Cloudflare Worker dashboard, go to **Settings > Variables** and add the following secrets:
    * `GCP_PROJECT_ID`: Your Google Cloud/Firebase Project ID.
    * `FIREBASE_SERVICE_ACCOUNT_KEY_JSON`: The full JSON content of your Firebase service account key.
4.  **Deploy** the worker. Note down the public URL of your worker (e.g., `https://your-worker.your-name.workers.dev`).

### 4. Frontend Setup

1.  **Install Dependencies:**
    ```bash
    npm install
    ```

2.  **Create Environment File:**
    In the root of the frontend project, create a file named `.env` and add the following variables. Replace the placeholder values with your actual Firebase project configuration and the URL of your deployed Cloudflare Worker.

    ```env
    # Firebase Client Configuration
    VITE_FIREBASE_API_KEY="YOUR_API_KEY"
    VITE_FIREBASE_AUTH_DOMAIN="YOUR_AUTH_DOMAIN"
    VITE_FIREBASE_PROJECT_ID="YOUR_PROJECT_ID"
    VITE_FIREBASE_STORAGE_BUCKET="YOUR_STORAGE_BUCKET"
    VITE_FIREBASE_MESSAGING_SENDER_ID="YOUR_MESSAGING_SENDER_ID"
    VITE_FIREBASE_APP_ID="YOUR_APP_ID"

    # Cloudflare Worker URL
    VITE_PROXY_BASE_URL="[https://your-worker.your-name.workers.dev](https://your-worker.your-name.workers.dev)"
    ```

3.  **Run the Development Server:**
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:5173`.

### 5. Create an Admin User

1.  Go to your Firebase Console > Authentication > Users.
2.  Click "Add user" and create a user with an email and password.
3.  Use these credentials to log into the admin panel at `http://localhost:5173/login`.

---

## ☁️ Deployment

* **Frontend:** The frontend is configured for seamless deployment on [Vercel](https://vercel.com/). Simply import your Git repository into Vercel. You will need to add the same environment variables from your `.env` file to the Vercel project settings.
* **Backend:** The backend is already deployed as a Cloudflare Worker in the setup steps.
