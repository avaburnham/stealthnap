# StealthNap 🚙🌙

StealthNap is a web app for car campers and nomads to discover, track, and share stealth camping locations, gear, and tips.

---

## Features

- **Gear Tracker:** Add and manage your car camping gear.
- **Camping Locations Map:** Find and share legal/stealth camping spots on an interactive map, searchable by zip code.
- **Location Details:** Add notes, amenities, and verification info for each spot.
- **Responsive Design:** Works great on mobile and desktop.
- **Modern Tech Stack:** React + Express + PostgreSQL + Prisma + React-Leaflet.

---

## Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/avaburnham/stealthnap.git
cd stealthnap
```

---

### 2. Backend Setup (`server/`)

- **Install dependencies:**
    ```
    cd server
    npm install
    ```
- **Set up your environment:**
    - Create a `.env` file with your database URL:
        ```
        DATABASE_URL=postgresql://youruser:yourpassword@localhost:5432/stealthnap
        ```
- **Migrate your database:**
    ```
    npx prisma migrate dev --name init
    npx prisma generate
    ```
- **Start the backend:**
    ```
    npm run dev
    ```

---

### 3. Frontend Setup (`stealthnap-frontend/`)

- **Install dependencies:**
    ```
    cd ../stealthnap-frontend
    npm install
    ```
- **Start the frontend:**
    ```
    npm start
    ```
    The app will be available at [http://localhost:3000](http://localhost:3000).

---

## API Endpoints

- `GET /api/gear` — List all gear items
- `POST /api/gear` — Add new gear
- `GET /api/locations` — List all locations
- `POST /api/locations` — Add a new location

See the backend `src/index.ts` for more details.

---

## Tech Stack

- **Frontend:** React, Bootstrap, React-Leaflet
- **Backend:** Node.js, Express, Prisma, PostgreSQL

---

## Contributing

PRs and suggestions welcome!  
See [issues](https://github.com/avaburnham/stealthnap/issues) or open a new one.

---

## License

MIT

---

*StealthNap is made for and by adventurers who believe that the world is a parking lot full of dreams. Safe travels!*
