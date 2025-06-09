import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Request, Response } from 'express';
dotenv.config();


const app = express();
app.use(cors());
app.use(express.json());

// @ts-ignore
app.get('/', (req, res) => res.send('StealthNap backend running!'));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));


import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Get all gear
app.get('/api/gear', async (req, res) => {
  const gear = await prisma.gear.findMany();
  res.json(gear);
});


//@ts-ignore
app.post('/api/gear', async (req: Request, res: Response) => {
  const { name, category, description } = req.body;
  try {
    if (!name || !category) {
      return res.status(400).json({ error: 'Name and category are required.' });
    }
    const newGear = await prisma.gear.create({
      data: {
        name,
        category,
        description,
      },
    });
    res.status(201).json(newGear);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to add gear' });
  }
});


// Get all locations
app.get('/api/locations', async (req, res) => {
  const locations = await prisma.location.findMany();
  res.json(locations);
});

// Add new location
app.post('/api/locations', async (req, res) => {
  const { name, zipCode, address, notes, latitude, longitude } = req.body;
  const newLocation = await prisma.location.create({
    data: {
      name,
      zipCode,
      address,
      notes,
      latitude,   // add these two lines!
      longitude,
    },
  });
  res.json(newLocation);
});
