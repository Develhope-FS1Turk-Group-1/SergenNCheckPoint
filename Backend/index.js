const express = require('express');
const app = express();
const cors = require('cors');
const pgp = require('pg-promise')();
require('dotenv').config();
const db = pgp(process.env.CONNECTION_URL);

const PORT = 4000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// SQL queries
const sql = {
    getAllCars: 'SELECT * FROM cars',
    getAllCarsWithOwners: 'SELECT c.car_name, p.fullname AS owner_name FROM cars c LEFT JOIN persons p ON c.owner_id = p.id',
    getCarById: 'SELECT * FROM cars WHERE id=$1',
    createCar: 'INSERT INTO cars (car_name, owner_id) VALUES ($1, $2) RETURNING *',
    deleteCar: 'DELETE FROM cars WHERE id=$1 RETURNING *',
    sellCar: 'UPDATE cars SET owner_id = $1 WHERE id = $2 RETURNING *',
    getAllPersons: 'SELECT * FROM persons',
    getPersonById: 'SELECT * FROM persons WHERE id=$1',
    createPerson: 'INSERT INTO persons (fullname) VALUES ($1) RETURNING *',
    deletePerson: 'DELETE FROM persons WHERE id=$1 RETURNING *'
};

// Create Car
app.post('/cars', async (req, res) => {
    const { car_name } = req.body;
    try {
        const newCar = await db.one(sql.createCar, [car_name, null]); // Set owner_id to null if not provided
        res.status(201).json(newCar);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete Car
app.delete('/cars/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const deletedCar = await db.oneOrNone(sql.deleteCar, +id);
        if (deletedCar) {
            res.json(deletedCar);
        } else {
            res.status(404).json({ message: 'Car not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Sell Car (Update Car's owner)
app.put('/cars/:id/sell/:owner_id', async (req, res) => {
    const { id, owner_id } = req.params;
    try {
        const updatedCar = await db.one(sql.sellCar, [owner_id, id]);
        if (updatedCar) {
            res.json(updatedCar);
        } else {
            res.status(404).json({ message: 'Car not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get All Cars
app.get('/cars', async (req, res) => {
    try {
        const cars = await db.any(sql.getAllCars);
        res.json(cars);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get All Cars with Owners
app.get('/carsOwners', async (req, res) => {
    try {
        const carsOwners = await db.any(sql.getAllCarsWithOwners);
        res.json(carsOwners);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create Person
app.post('/persons', async (req, res) => {
    const { fullname } = req.body;
    try {
        const newPerson = await db.one(sql.createPerson, [fullname]);
        res.status(201).json(newPerson);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete Person
app.delete('/persons/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const deletedPerson = await db.oneOrNone(sql.deletePerson, +id);
        if (deletedPerson) {
            res.json(deletedPerson);
        } else {
            res.status(404).json({ message: 'Person not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get All Persons
app.get('/persons', async (req, res) => {
    try {
        const persons = await db.any(sql.getAllPersons);
        res.json(persons);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
