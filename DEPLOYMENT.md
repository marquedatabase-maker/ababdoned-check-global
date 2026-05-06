# Deployment Guide 🚀

Apne application ko Render aur Vercel par deploy karne ke liye niche diye gaye steps follow karein.

## 1. Backend (Render.com par)
Render par ek naya **Web Service** banayein:
- **Build Command:** `npm install`
- **Start Command:** `node index.js`
- **Environment Variables:**
  - `MONGO_URI`: Aapka MongoDB Atlas connection string.
  - `JWT_SECRET`: Koi bhi random strong string.
  - `PORT`: 5000 (Render ise automatically handle karta hai).

## 2. Frontend (Vercel.com par)
Vercel par ek naya project connect karein:
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Environment Variables:**
  - `VITE_API_URL`: Aapka Render backend ka URL (e.g., `https://your-app.onrender.com/api`).
  > **Note:** `/api` last mein lagana zaroori hai.

## 3. Important Tips
- **CORS:** Backend mein `app.use(cors())` enabled hai, toh sab domains allow honge.
- **Webhook URL:** Jab aap `VITE_API_URL` set kar denge, toh Dashboard automatically sahi webhook URL dikhayega.
- **MongoDB:** MongoDB Atlas mein `0.0.0.0/0` (Allow all IP) zaroori hai Render ke liye.

App ready hai! Agar koi error aaye toh bataiye. ✌️
