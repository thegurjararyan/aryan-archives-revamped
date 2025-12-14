# 🥀 AryanArchives (v2.0)

> "No filters. Just raw memories."

A personal digital garden and archive built to bridge the gap between **Poetry** and **Code**. This isn't just a portfolio; it's a living, breathing journal that reacts to the user.

🔗 **Live Demo:** [https://aryan-archives-revamped-svg8.vercel.app](https://aryan-archives-revamped-svg8.vercel.app)

---

## 🎨 The Philosophy
Most websites are rigid and digital. AryanArchives is designed to feel **organic, tactile, and imperfect**.
- **The Ink Cursor:** A canvas-based trail that bleeds ink as you move your mouse.
- **The Grain:** A subtle noise overlay that makes the screen feel like physical paper.
- **The "Soul" Engine:** Memories age over time (turning sepia), and the UI changes based on the content (Poetry vs. Tech Logs).

## 🛠️ Tech Stack
- **Frontend:** React + Vite
- **Styling:** Tailwind CSS + Custom CSS Animations
- **Backend:** Supabase (PostgreSQL + Auth)
- **Deployment:** Vercel
- **Animations:** Framer Motion + Canvas API

## ✨ Key Features

### 1. The "VIP Gate" (Hidden Feature) 🗝️
A restricted area hidden in the footer.
- **Concept:** Allows specific people (friends, loved ones) to access private, encrypted messages.
- **Mechanism:** Users must verify their identity using a "Name + Date" combination. The system smartly ignores the year, checking only the Day and Month match.

### 2. Immersive Effects
- **Vinyl Switch:** A toggle to play Lofi rain sounds for reading atmosphere.
- **Hand-Drawn aesthetic:** SVG filters and handwriting fonts make the site feel like a sketchbook.
- **Smart Navbar:** Disappears when you scroll down to read, reappears when you scroll up.

### 3. Admin Panel (CMS)
A fully functional, password-protected dashboard to:
- Write/Edit/Delete posts.
- Manage the "VIP List" (Add friends and secret messages dynamically).
- Toggle "Locked" status on sensitive posts.

---

## 🚀 Running Locally

1. **Clone the repo**
   ```bash
   git clone [https://github.com/thegurjararyan/aryan-archives-revamped.git](https://github.com/thegurjararyan/aryan-archives-revamped.git)
   cd aryan-archives-revamped
   Install dependencies

Bash

npm install
Setup Environment Variables Create a .env file and add your Supabase keys:

Code snippet

VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
Run the server

Bash

npm run dev
🖤 Credits
Designed & Developed by Aryan. Because code is poetry, and poetry is code.
