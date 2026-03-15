# Firebase Deployment Guide for FourSix46

This guide outlines the steps to deploy the **FourSix46** application (Frontend & Backend) to the Google Firebase platform.

## 1. Prerequisites

Before you begin, ensure you have the following installed:
*   **Node.js** (v18 or v20 recommended)
*   **Firebase CLI**
    ```bash
    npm install -g firebase-tools
    ```

## 2. Initial Setup

1.  **Login to Firebase:**
    Open your terminal in the root folder (`FourSix46`) and run:
    ```bash
    firebase login
    ```

2.  **Initialize the Project:**
    Run the initialization command in the **root directory** (`Major Projects\FourSix46`):
    ```bash
    firebase init
    ```

3.  **Select Features:**
    Use the arrow keys and Spacebar to select:
    *   `Functions`: Configure a Cloud Functions directory and its files (for the Backend).
    *   `Hosting`: Configure files for Firebase Hosting and (optionally) set up GitHub Action deploys (for the Frontend).
    *   *(Optional)* `Firestore`: If you are deploying security rules/indexes.
    *   *(Optional)* `Storage`: If you are deploying storage rules.

4.  **Project Setup Questions:**
    *   **Select a default Firebase project**: Choose your existing project ``.
    *   **Functions Setup**:
        *   *Language*: JavaScript or TypeScript (Choose **JavaScript** to match your existing `server.js`).
        *   *ESLint*: No (unless you want strict linting).
        *   *Install dependencies*: Yes.
        *   **Note**: This will create a `functions` folder in your root directory.
    *   **Hosting Setup**:
        *   *Public directory*: `foursix46courier/dist` (This tells Firebase where your built frontend files are).
        *   *Configure as a single-page app (rewrite all urls to /index.html)?*: **Yes** (Important for React/Vite routing).
        *   *Set up automatic builds and deploys with GitHub?*: Optional (No for now).

## 3. Frontend Configuration (Hosting)

Your frontend is already set up with Vite. We just need to ensure it builds correctly for production.

1.  **Verify `package.json` in `foursix46courier`:**
    Ensure you have the build script:
    ```json
    "scripts": {
      "build": "vite build",
      ...
    }
    ```

2.  **Build the Frontend:**
    Before deploying, you must generate the static files.
    ```bash
    cd foursix46courier
    npm run build
    cd ..
    ```
    This creates the `dist` folder that you pointed Firebase to in the previous step.

## 4. Backend Configuration (Cloud Functions)

Since Firebase Cloud Functions works differently than a standalone Express server (like used in Vercel/Render), we need to adapt your `FourSix46backend/server.js`.

### Step A: Prepare the `functions` directory
1.  Navigate to the newly created `functions` folder.
2.  Install the dependencies your backend needs (copying from your backend `package.json`):
    ```bash
    cd functions
    npm install express cors dotenv firebase-admin nodemailer pdfkit stripe
    ```

### Step B: Adapt the Code
You cannot simply copy `server.js` because Cloud Functions exports a trigger instead of listening on a port.

1.  Open `functions/index.js`.
2.  Copy the content from `FourSix46backend/server.js` **WITH THESE CHANGES**:

    **Remove:**
    ```javascript
    // Remove the app.listen part at the bottom
    // PORT = process.env.PORT || 5000;
    // app.listen(PORT, ...);
    ```

    **Add/Change:**
    ```javascript
    const functions = require("firebase-functions");
    // ... all your requires and app setup ...

    // At the very end, EXPORT the app instead of listening
    exports.api = functions.region('us-central1').https.onRequest(app);
    ```

3.  **Important Note on `serviceAccountKey.json`**:
    *   In Cloud Functions, `admin.initializeApp()` usually works without arguments (it uses the default project credentials automatically).
    *   You can likely simplify your init code to:
        ```javascript
        admin.initializeApp();
        const db = admin.firestore();
        ```

### Step C: Environment Variables
Create a `.env` file inside the `functions` folder with your production secrets (Stripe keys, Email passwords).
*Note: Include this in `.gitignore` so secrets aren't shared.*

```env
STRIPE_SECRET_KEY=sk_test_...
EMAIL_USER=...
EMAIL_PASS=...
OWNER_EMAIL=...
```

For newer Firebase Functions (v2) or if using `dotenv` package (which you are), the `.env` file in the `functions` directory will be loaded automatically.

## 5. Connecting Frontend to Backend

In your Frontend code (e.g., `src/lib/api.ts` or wherever you fetch data), update the `API_URL`.

*   **Development**: `http://localhost:5001/us-central1/api` (or similar emulator port)
*   **Production**: It will look like: `https://us-central1.net/api`

You can also set up a **Rewrite** in `firebase.json` to make the API available at the same domain (e.g., `your-site.com/api`):

```json
// firebase.json
{
  "hosting": {
    "public": "foursix46courier/dist",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "rewrites": [
      {
        "source": "/api/**",
        "function": "api"
      },
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  },
  "functions": {
    "source": "functions"
  }
}
```
*If you add this rewrite, your frontend can just call `/api/...` relative to the domain.*

## 6. Deploying

Once everything is set up:

1.  **Build the Frontend:**
    ```bash
    cd foursix46courier
    npm run build
    cd ..
    ```

2.  **Deploy everything:**
    ```bash
    firebase deploy
    ```
    Or deploy specific parts:
    ```bash
    firebase deploy --only hosting
    firebase deploy --only functions
    ```

## 7. Troubleshooting

*   **Missing Permissions**: Ensure the account logged in via `firebase login` has Owner/Editor permissions on `.
*   **CORS Issues**: If calling the function directly (not via rewrite), ensure your `cors` middleware allows the Firebase Hosting domain.
*   **Cold Starts**: Cloud Functions may take a few seconds to start up if not used recently. This is normal.
