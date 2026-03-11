# Database Migration Instructions

This folder contains a full backup of the `stratos` database in JSON format, exported from MongoDB Atlas.

## Contents
- `users.json`: Exported data from the 'users' collection.
- `lesson_progress.json`: Exported data from the 'lesson_progress' collection.
- `master_database_backup.json`: A consolidated file containing all collections.

## How to Import on a New Laptop

### Option 1: Using MongoDB Compass (Easiest)
1. Install [MongoDB Compass](https://www.mongodb.com/products/compass).
2. Connect to your local MongoDB or Atlas instance.
3. Create a database named `stratos`.
4. For each collection (e.g., `users`), click "Import Data" and select the corresponding `.json` file.

### Option 2: Using a Script
You can use a Python script similar to the export script to import this data. 
If you have the project repository on the new laptop, you can look for an import script or ask me to create one.

### Option 3: Using `mongoimport`
If you have MongoDB Database Tools installed:
```bash
mongoimport --db stratos --collection users --file users.json --jsonArray
mongoimport --db stratos --collection lesson_progress --file lesson_progress.json --jsonArray
```

---
Generated on: 2026-03-11
