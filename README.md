# WanderlustHub

A full-stack accommodation booking platform inspired by Airbnb. Users can explore vacation rentals, create and manage their own listings, and leave reviews with star ratings.

![Node.js](https://img.shields.io/badge/Node.js-22.x-339933?logo=node.js)
![Express](https://img.shields.io/badge/Express-4.18-000000?logo=express)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?logo=mongodb)
![EJS](https://img.shields.io/badge/View%20Engine-EJS-000000)

## Features

- **User Authentication** — Sign up, login, and logout with Passport.js (local strategy)
- **CRUD Listings** — Create, read, update, and delete vacation rental listings
- **Image Upload** — Cloudinary integration for listing images
- **Reviews & Ratings** — Add and delete reviews with 1–5 star ratings
- **Authorization** — Only listing owners can edit/delete their listings; only review authors can delete their reviews
- **Flash Messages** — Success and error notifications via connect-flash
- **Server-Side Validation** — Joi schema validation for listings and reviews
- **Session Persistence** — MongoDB session store with connect-mongo

## Tech Stack

| Layer | Technology |
|-------|------------|
| Runtime | Node.js 22.x |
| Framework | Express.js |
| Database | MongoDB (Mongoose ODM) |
| Auth | Passport.js (Local Strategy), passport-local-mongoose |
| Storage | Cloudinary (Multer + multer-storage-cloudinary) |
| View Engine | EJS + EJS-Mate (layouts) |
| Validation | Joi |
| Styling | Bootstrap 5 + Custom CSS |

## Project Structure

```
WanderlustHub/
├── app.js              # Entry point, Express config, middleware
├── cloudConfig.js      # Cloudinary configuration
├── middleware.js       # Auth, validation, authorization middleware
├── schemas.js          # Joi validation schemas
├── controllers/        # Request handlers (MVC)
├── models/             # Mongoose models (Listing, Review, User)
├── routes/             # Express routers
├── views/              # EJS templates
├── public/             # Static assets (CSS, JS)
├── utils/              # wrapAsync, ExpressError
└── init/               # Database seed script
```

## Prerequisites

- Node.js 22.x (or compatible LTS)
- MongoDB (local or [MongoDB Atlas](https://www.mongodb.com/atlas))
- [Cloudinary](https://cloudinary.com/) account for image uploads

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/WanderlustHub.git
cd WanderlustHub
```

### 2. Install dependencies

```bash
npm install
```

### 3. Environment variables

Create a `.env` file in the root directory:

```
ATLAS_URL=mongodb+srv://username:password@cluster.mongodb.net/wanderlust
SECRET=your-session-secret-key
CLOUD_NAME=your-cloudinary-cloud-name
CLOUD_API_KEY=your-cloudinary-api-key
CLOUD_API_SECRET=your-cloudinary-api-secret
```

### 4. Run the application

```bash
npm run dev
```

The app runs at [http://localhost:3000](http://localhost:3000).

### Optional: Seed the database

```bash
node init/index.js
```

> **Note:** Edit `init/index.js` to use your MongoDB URL and a valid user ID for `owner` before seeding.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server with nodemon |

## License

ISC

---

*Built with ❤️ for travel enthusiasts*
