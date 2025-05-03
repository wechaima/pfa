
from chromadb import Client
from chromadb.config import Settings

# Configuration pour ChromaDB
chroma_client = Client(Settings(
    chroma_db_impl="duckdb+parquet",
    persist_directory="./chromadb"  # dossier où sauvegarder ta base
))

# Créer ou récupérer une collection
def get_collection(name="default"):
    return chroma_client.get_or_create_collection(name)
