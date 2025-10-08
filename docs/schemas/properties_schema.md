# Properties Table Schema

This document outlines the database schema for storing rental property information in the BadgerRent application.

## Table Overview

The `properties` table stores rental property listings with essential information including location, pricing, and property details.

## Schema Definition

```sql
CREATE TABLE properties (
  id SERIAL PRIMARY KEY,
  address VARCHAR(255) NOT NULL,
  rent INTEGER NOT NULL,
  bedrooms INTEGER NOT NULL,
  bathrooms INTEGER NOT NULL,
  company VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Column Specifications

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | SERIAL | PRIMARY KEY | Unique identifier for each property |
| `address` | VARCHAR(255) | NOT NULL | Full street address of the property |
| `rent` | INTEGER | NOT NULL | Monthly rent amount in dollars |
| `bedrooms` | INTEGER | NOT NULL | Number of bedrooms |
| `bathrooms` | INTEGER | NOT NULL | Number of bathrooms |
| `company` | VARCHAR(100) | NOT NULL | Property management company name |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Record creation timestamp |
| `updated_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Last update timestamp |

## Indexes

```sql
-- Index for searching by company
CREATE INDEX idx_properties_company ON properties(company);

-- Index for rent range queries
CREATE INDEX idx_properties_rent ON properties(rent);

-- Index for bedroom/bathroom filtering
CREATE INDEX idx_properties_beds_baths ON properties(bedrooms, bathrooms);
```

## Sample Data

```sql
INSERT INTO properties (address, rent, bedrooms, bathrooms, company) VALUES
('123 State Street, Madison, WI 53703', 1200, 2, 1, 'MPM Properties'),
('456 University Ave, Madison, WI 53715', 950, 1, 1, 'Tallard Management'),
('789 Johnson St, Madison, WI 53706', 1500, 3, 2, 'Cardinal Group');
```

## Usage Notes

- All rent amounts are stored as integers representing dollars (no cents)
- Addresses should include full street address with city, state, and ZIP
- Company names should be standardized for consistency
- Timestamps are automatically managed by PostgreSQL

