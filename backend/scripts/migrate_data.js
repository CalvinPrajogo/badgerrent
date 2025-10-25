import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import pool from "../config/database.js";

// ES modules don't have __dirname, so we derive it here
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to the JSON file
const jsonFilePath = path.join(__dirname, '../../scraping/data/raw/mpm_properties.json');

// Read and parse the JSON file
const rawData = fs.readFileSync(jsonFilePath, 'utf-8');
const properties = JSON.parse(rawData);

console.log(`Loaded ${properties.length} properties from JSON file`);

/**
 * Data Cleaning Function
 * 
 * Scraped data is messy! This function normalizes each property object
 * to match our database schema requirements.
 * 
 * Common issues in scraped data:
 * - Bedrooms might be "Studio" instead of a number
 * - Bathrooms might be strings like "1.5" instead of numbers
 * - Rent might have "$" or commas
 * - Extra whitespace, special characters, etc.
 */
function cleanProperty(property) {
    // Helper: Convert bedrooms (handle "Studio" case)
    // "Studio" apartments have 0 bedrooms by convention
    let bedrooms = property.bedrooms;
    if (bedrooms === "Studio" || bedrooms === "studio") {
        bedrooms = 0;
    } else {
        bedrooms = parseInt(bedrooms, 10) || 0;  // Parse to integer, default to 0 if invalid
    }

    // Helper: Convert bathrooms to number (can be decimal like 1.5)
    let bathrooms = parseFloat(property.bathrooms) || 1;  // Default to 1 if invalid

    // Helper: Clean rent (remove $, commas, parse to integer)
    let rent = property.rent;
    if (typeof rent === 'string') {
        rent = rent.replace(/[$,]/g, '');  // Remove $ and commas
    }
    rent = parseInt(rent, 10) || 0;  // Parse to integer

    // Helper: Clean address (trim whitespace)
    const address = (property.address || '').trim();

    // Helper: Clean company name (trim whitespace)
    const company = (property.company || '').trim();

    // Return cleaned object matching our database schema
    return {
        address,
        rent,
        bedrooms,
        bathrooms,
        company
    };
}

/**
 * Main Migration Function
 * 
 * This is an async function because database operations are asynchronous.
 * Think of it like a Python async function or a Flask route handler.
 * 
 * Steps:
 * 1. Clean all the data
 * 2. Start a database transaction (all-or-nothing insert)
 * 3. Insert each property
 * 4. Commit if successful, rollback if any error
 */
async function migrateData() {
    try {
        console.log('Cleaning and validating data...');
        
        // Clean all properties (like Python list comprehension)
        // [cleanProperty(p) for p in properties]
        const cleanedProperties = properties.map(cleanProperty);
        
        // Filter out any properties with missing required fields
        const validProperties = cleanedProperties.filter(p => {
            return p.address && p.rent > 0 && p.company;
        });

        console.log(`${validProperties.length} properties are valid (${properties.length - validProperties.length} skipped)`);

        // Start a database transaction
        // A transaction ensures ALL inserts succeed or ALL fail (atomicity)
        // Like wrapping multiple SQL statements in BEGIN...COMMIT in psql
        console.log('Starting database transaction...');
        await pool.query('BEGIN');

        // Insert each property into the database
        let insertedCount = 0;
        for (const property of validProperties) {
            try {
                // Parameterized query to prevent SQL injection
                // $1, $2, etc. are placeholders that get replaced safely
                await pool.query(
                    `INSERT INTO properties (address, rent, bedrooms, bathrooms, company)
                     VALUES ($1, $2, $3, $4, $5)`,
                    [property.address, property.rent, property.bedrooms, property.bathrooms, property.company]
                );
                insertedCount++;
            } catch (error) {
                // If a specific property fails (e.g., duplicate address), log it but continue
                console.warn(`Failed to insert property: ${property.address}`, error.message);
            }
        }

        // Commit the transaction (make all inserts permanent)
        await pool.query('COMMIT');
        
        console.log(`Successfully inserted ${insertedCount} properties into database`);
        console.log('Migration complete!');

    } catch (error) {
        // If anything goes wrong, rollback the transaction
        // This undoes all inserts, keeping the database clean
        await pool.query('ROLLBACK');
        console.error('Migration failed:', error);
        throw error;  // Re-throw to exit with error code
    } finally {
        // Always close the database connection when done
        // Like Python's "finally" block or context manager cleanup
        await pool.end();
        console.log('Database connection closed');
    }
}

/**
 * Execute the migration
 * 
 * This is the entry point - when you run "node migrate_data.js",
 * this code executes.
 * 
 * We call the async function and handle any errors.
 */
migrateData()
    .then(() => {
        console.log('All done!');
        process.exit(0);  // Exit successfully
    })
    .catch((error) => {
        console.error('Fatal error:', error);
        process.exit(1);  // Exit with error code
    });