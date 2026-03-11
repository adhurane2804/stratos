import os
import json
from pymongo import MongoClient
from bson import json_util

def migrate_json_to_atlas():
    atlas_uri = "mongodb+srv://adhurane2804_db_user:zXH0dWFwK9XpRQma@cluster0.8wtdd0t.mongodb.net/"
    db_name = "stratos"
    data_dir = r"c:\Users\Admin\Downloads\stratos-main\db_migration_data"

    print(f"Connecting to MongoDB Atlas...")
    client = MongoClient(atlas_uri)
    db = client[db_name]

    # Map filenames to how they should be handled
    # If the value is a string, it's the collection name.
    # If the value is None, it's a multi-collection file.
    files_to_migrate = {
        "users.json": "users",
        "lesson_progress.json": "lesson_progress",
        "master_database_backup.json": None
    }

    for filename, collection_name in files_to_migrate.items():
        file_path = os.path.join(data_dir, filename)
        if not os.path.exists(file_path):
            print(f"File {file_path} not found. Skipping.")
            continue

        print(f"Processing {filename}...")
        
        with open(file_path, 'r', encoding='utf-8') as f:
            raw_data = json.load(f)
            
        if collection_name:
            # Single collection file
            documents = []
            if isinstance(raw_data, list):
                documents = [json_util.loads(json.dumps(doc)) for doc in raw_data]
            else:
                documents = [json_util.loads(json.dumps(raw_data))]
            
            if documents:
                print(f" - Found {len(documents)} documents for collection '{collection_name}'.")
                db[collection_name].delete_many({})
                db[collection_name].insert_many(documents)
                print(f" - Successfully migrated to '{collection_name}'.")
        else:
            # Multi-collection file (schema: { "coll1": [...], "coll2": [...] })
            for coll_name, coll_data in raw_data.items():
                print(f" - Found collection '{coll_name}' in {filename}...")
                if isinstance(coll_data, list):
                    documents = [json_util.loads(json.dumps(doc)) for doc in coll_data]
                    if documents:
                        print(f"   - Found {len(documents)} documents. Inserting...")
                        db[coll_name].delete_many({})
                        db[coll_name].insert_many(documents)
                        print(f"   - Successfully migrated to '{coll_name}'.")
                else:
                    print(f"   - Data for '{coll_name}' is not a list. Skipping.")

    # Cleanup the accidentally created collection from previous run
    if "master_database" in db.list_collection_names():
        db.drop_collection("master_database")
        print("\nDropped 'master_database' collection (cleanup from previous run).")

    print("\n--- Migration Complete! ---")

if __name__ == "__main__":
    try:
        migrate_json_to_atlas()
    except Exception as e:
        print(f"Error during migration: {e}")
