# Team Database Setup Guide

This guide helps teammates get the BadgerRent database running on their local machine.

## 🎯 The Problem with Local Databases

**Important:** PostgreSQL runs **locally** on each person's computer. This means:
- ✅ Your database is on **your** machine
- ❌ Teammates **cannot** access your database
- 👥 Each teammate needs their **own** local PostgreSQL setup
- 🔄 We use **migration scripts** to keep everyone's database structure in sync

## 📋 Setup Steps for New Teammates

### **Step 1: Install PostgreSQL**

**On Mac:**
```bash
# Install Homebrew (if not installed)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install PostgreSQL
brew install postgresql@16

# Add to PATH
echo 'export PATH="/opt/homebrew/opt/postgresql@16/bin:$PATH"' >> ~/.zprofile
source ~/.zprofile

# Start PostgreSQL service
brew services start postgresql@16

# Verify installation
psql --version
```

### **Step 2: Create the Database**

```bash
# Create the badgerrent database
createdb badgerrent

# Verify it was created
psql -l | grep badgerrent
```

### **Step 3: Set Up Environment Variables**

```bash
# From the backend directory
cd backend

# Copy the example environment file
cp .env.example .env

# Edit .env and update DB_USER to your Mac username
# Usually your Mac username is the default PostgreSQL user
```

### **Step 4: Run Database Migrations**

```bash
# Connect to the database
psql badgerrent

# Run the schema creation script (in psql shell)
\i ../database/migrations/001_create_properties_table.sql

# Exit psql
\q
```

### **Step 5: Load Sample Data (Optional)**

```bash
# If migration scripts exist, run them
psql badgerrent < ../database/seeds/sample_properties.sql
```

### **Step 6: Test the Connection**

```bash
# Start the backend server
npm run dev

# You should see: "✅ Connected to PostgreSQL database"
```

## 🔄 Keeping Databases in Sync

### **When Schema Changes:**
1. Run new migration scripts that teammates create
2. Migration files are in `database/migrations/`
3. Always run migrations in order (001, 002, 003, etc.)

### **When Data Changes:**
- We use seed scripts for sample/test data
- Real scraped data should be loaded via migration scripts
- Each teammate runs the same migration to get the same data

## 🆘 Troubleshooting

### "psql: command not found"
- PostgreSQL isn't installed or not in PATH
- Revisit Step 1

### "database 'badgerrent' does not exist"
- Run `createdb badgerrent`

### "role 'username' does not exist"
- Update `DB_USER` in `.env` to match your Mac username
- Or create a PostgreSQL user: `createuser your_username`

### Connection errors in the app
- Make sure PostgreSQL is running: `brew services list`
- Check your `.env` file has correct credentials
- Verify database exists: `psql -l`

## 📚 Useful Commands

```bash
# List all databases
psql -l

# Connect to badgerrent database
psql badgerrent

# Inside psql:
\dt              # List all tables
\d properties    # Describe properties table
SELECT COUNT(*) FROM properties;  # Count records
\q               # Quit psql
```

## 🔐 Security Note

- **NEVER** commit `.env` files (already in .gitignore)
- `.env.example` is safe to commit (no real credentials)
- Each teammate has their own `.env` with their local settings
