import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import axios from 'axios';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const prisma = new PrismaClient();
const PORT = process.env.PORT || 4000;

// --- Health check ---
// @ts-ignore
app.get('/', (_req, res) => res.send('StealthNap backend running!'));

// --- JWT Auth Middleware ---
export function authMiddleware(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    res.status(401).json({ error: 'No token provided' });
    return;
  }
  const token = authHeader.split(' ')[1];
  try {
    const user = jwt.verify(token, process.env.JWT_SECRET || 'default_secret');
    // @ts-ignore
    req.user = user;
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
    return;
  }
}

// --- Admin Only Middleware ---
function adminOnly(req: Request, res: Response, next: NextFunction): void {
  // @ts-ignore
  if (!req.user || req.user.role !== 'admin') {
    res.status(403).json({ error: 'Forbidden: Admins only' });
    return;
  }
  next();
}

// --- AUTH ROUTES ---
// @ts-ignore
app.post('/api/signup', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password required.' });

  try {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(409).json({ error: 'Email already registered.' });

    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { email, password: hashed, role: 'user' },
    });
    res.status(201).json({ message: 'User created.', userId: user.id });
  } catch {
    res.status(500).json({ error: 'Server error.' });
  }
});

// @ts-ignore
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password required.' });

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'default_secret',
      { expiresIn: '7d' }
    );
    res.json({ token, userId: user.id, email: user.email, role: user.role });
  } catch {
    res.status(500).json({ error: 'Server error.' });
  }
});

// --- GEAR ROUTES ---
app.get('/api/gear', async (_req, res) => {
  const gear = await prisma.gear.findMany();
  res.json(gear);
});

// @ts-ignore
app.post('/api/gear', authMiddleware, async (req: Request, res: Response) => {
  const { name, category, description } = req.body;
  // @ts-ignore
  const userId = req.user?.userId;

  if (!name || !category) return res.status(400).json({ error: 'Name and category are required.' });

  try {
    const data: any = { name, category, description };
    if (userId) data.userId = userId;

    const newGear = await prisma.gear.create({ data });
    res.status(201).json(newGear);
  } catch (error) {
    console.error('Error adding gear:', error);
    res.status(500).json({ error: 'Failed to add gear' });
  }
});

// --- LOCATION ROUTES ---
app.get('/api/locations', async (_req, res) => {
  const locations = await prisma.location.findMany({
    include: { user: { select: { email: true } } },
    orderBy: { id: 'desc' },
  });
  res.json(locations);
});

interface OpenCageResult {
  results?: {
    geometry: {
      lat: number;
      lng: number;
    };
    components?: {
      country_code?: string;
    };
  }[];
}

async function geocodeLocation(zipCode: string, address?: string): Promise<{ lat: number; lng: number } | null> {
  const key = process.env.OPENCAGE_API_KEY;
  if (!key) throw new Error("Missing OPENCAGE_API_KEY in .env");

  const parts = [address, zipCode].filter(Boolean).join(', ');
  const query = `${parts}, USA`;

  const response = await axios.get('https://api.opencagedata.com/geocode/v1/json', {
    params: {
      q: query,
      key,
      countrycode: 'us',
      language: 'en',
    },
  });

  const result = response.data as OpenCageResult;
  const geometry = result.results?.[0]?.geometry;

  if (geometry) return { lat: geometry.lat, lng: geometry.lng };
  return null;
}

app.post('/api/locations', authMiddleware, async (req: Request, res: Response) => {
  const { name, zipCode, address, notes, latitude, longitude, country } = req.body;
  // @ts-ignore
  const userId = req.user.userId;

  let lat = latitude ?? null;
  let lng = longitude ?? null;

  try {
    if ((!lat || !lng) && zipCode) {
      const geo = await geocodeLocation(zipCode, address);
      if (geo) {
        lat = geo.lat;
        lng = geo.lng;
      }
    }

    const newLocation = await prisma.location.create({
      data: {
        name,
        zipCode,
        address,
        notes,
        latitude: lat,
        longitude: lng,
        country,
        userId,
      },
    });

    res.status(201).json(newLocation);
  } catch (error) {
    console.error('❌ Failed to create location:', error);
    res.status(500).json({ error: 'Failed to add location' });
  }
});

// @ts-ignore
app.delete('/api/locations/:id', authMiddleware, adminOnly, async (req: Request, res: Response) => {
  const locationId = parseInt(req.params.id, 10);
  if (isNaN(locationId)) return res.status(400).json({ error: 'Invalid location ID.' });

  try {
    const deletedLocation = await prisma.location.delete({ where: { id: locationId } });
    res.json({ message: 'Location deleted', deletedLocation });
  } catch {
    res.status(404).json({ error: 'Location not found.' });
  }
});

// --- FORUM ROUTES ---
app.get('/api/threads', async (_req, res) => {
  const threads = await prisma.thread.findMany({
    include: {
      user: { select: { id: true, email: true } },
      comments: {
        include: {
          user: { select: { id: true, email: true } },
        },
        orderBy: { createdAt: 'asc' },
      },
    },
    orderBy: { id: 'desc' },
  });
  res.json(threads);
});

// @ts-ignore
app.post('/api/threads', authMiddleware, async (req, res) => {
  const { title, content } = req.body;
  // @ts-ignore
  const userId = req.user.userId;
  if (!title || !content || !userId) return res.status(400).json({ error: 'Title, content, and user required.' });

  const thread = await prisma.thread.create({
    data: { title, content, userId },
    include: {
      user: { select: { id: true, email: true } },
      comments: {
        include: {
          user: { select: { id: true, email: true } },
        },
      },
    },
  });
  res.status(201).json(thread);
});

// @ts-ignore
app.post('/api/threads/:threadId/comments', authMiddleware, async (req, res) => {
  const { content } = req.body;
  const threadId = Number(req.params.threadId);
  // @ts-ignore
  const userId = req.user.userId;
  if (!content || !userId) return res.status(400).json({ error: 'Content and user required.' });

  const comment = await prisma.comment.create({
    data: { content, threadId, userId },
    include: { user: { select: { id: true, email: true } } },
  });
  res.status(201).json(comment);
});

// --- Start Server ---
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
