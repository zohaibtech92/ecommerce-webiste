# MERN E-Commerce — Windows Setup

## Requirements
- Windows 10/11
- Node.js 20.19+ (Node 24.x is supported)
- npm 10+
- MongoDB Community Server running locally, or a MongoDB Atlas URI

## Important Windows dependency fix
This package intentionally contains **no `node_modules` or `dist` folders**. Do not copy `node_modules` from another operating system or another Node version.

The project has no native Node modules such as `better-sqlite3`, so the previous Windows native-binding problem does not apply to this project.

## Install
Open PowerShell in the project root:

```powershell
node -v
npm.cmd -v
npm.cmd run install-all
```

If `npm run install-all` is blocked or you prefer separate installs:

```powershell
npm.cmd install
npm.cmd install --prefix server
npm.cmd install --prefix client
```

## Environment files
Copy the examples:

```powershell
Copy-Item server\.env.example server\.env
Copy-Item client\.env.example client\.env
```

For local MongoDB, keep:

```text
MONGODB_URI=mongodb://127.0.0.1:27017/mern_ecommerce
```

Stripe is optional. Leave the Stripe keys blank if you only want Cash on Delivery.

## Seed sample products
After MongoDB is running:

```powershell
npm.cmd run seed --prefix server
```

The seed creates an admin account:
- Email: `admin@example.com`
- Password: `admin123`

Change this password before using the application outside local development.

## Run
Use two PowerShell windows:

Terminal 1:
```powershell
npm.cmd run dev --prefix server
```

Terminal 2:
```powershell
npm.cmd run dev --prefix client
```

Or run both from the root:

```powershell
npm.cmd run dev
```

Frontend: http://localhost:5173  
Backend health check: http://localhost:5000/api/health

## Deploy to Vercel
Import the repository into Vercel with the repository root as the project root. The included `vercel.json` builds `client` and routes `/api/*` to the Express serverless function.

Add these Vercel environment variables:

```text
MONGODB_URI=<your MongoDB Atlas connection string>
JWT_SECRET=<a long random secret>
JWT_EXPIRES_IN=30d
NODE_ENV=production
CLIENT_URL=https://<your-vercel-domain>
STRIPE_SECRET_KEY=<your Stripe secret key, if using card payments>
VITE_STRIPE_PUBLIC_KEY=<your Stripe publishable key, if using card payments>
```

Leave `VITE_API_URL` unset for a single Vercel project so the client uses the same-origin `/api` function. If the frontend and backend are deployed separately, set `VITE_API_URL` to the backend URL ending in `/api` and set `CLIENT_URL` to the frontend URL.

## If npm reports a corrupted dependency tree
From the project root:

```powershell
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force server\node_modules -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force client\node_modules -ErrorAction SilentlyContinue
npm.cmd cache verify
npm.cmd run install-all
```

Do **not** use `npm install --allow-git=all` for this project. It has no Git dependencies.

## Node version note
If your current Node version is 24.x, you do not need to downgrade it for this project. If npm reports an engine incompatibility, run `node -v` and update Node to a supported LTS/current release rather than forcing incompatible packages.
