import express from 'express';
import pool from '../config/database.js';

const router = express.Router();

// Endpoints

// Get all properties
router.get("/", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM properties ORDER BY id");
        res.json(result.rows)
    } catch (error) {
        console.error("Error fetching properties:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});





export default router;