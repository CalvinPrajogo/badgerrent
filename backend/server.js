import express from "express";
import cors from "cors";
import propertiesRouter from "./routes/properties.js";

const app = express();

// Port that server will listen on
const PORT = 3001;

// Middleware - functions that run on every request
app.use(express.json());
app.use(cors());

// Routes
app.get("/", (req, res) => {
    res.json({ message: "BadgerRent API is running!" });
});

// Mount properties router at /api/properties
app.use("/api/properties", propertiesRouter);

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
})