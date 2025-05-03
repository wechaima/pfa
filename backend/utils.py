import json
from pathlib import Path
from typing import List, Dict, Union
from models import Video, Article, Course

def load_data(file_path: str) -> List[Dict]:
    """Charge les données JSON depuis un fichier"""
    with open(file_path, 'r', encoding='utf-8') as f:
        return json.load(f)

def get_all_domains(data_dir: str = "../data") -> List[str]:
    """Retourne tous les domaines disponibles"""
    domains = set()
    for file in Path(data_dir).glob("*.json"):
        parts = file.stem.split('_')
        if len(parts) > 1:
            domains.add(parts[-1])
    return sorted(domains)

def get_content_by_type(domain: str, content_type: str, data_dir: str = "../data") -> List[Union[Video, Article, Course]]:
    """Récupère le contenu par type et domaine"""
    file_path = Path(data_dir) / f"{content_type}_{domain}.json"
    if not file_path.exists():
        return []
    
    data = load_data(file_path)
    model_map = {
        "videos": Video,
        "articles": Article,
        "courses": Course  # Note: maintenant correspond exactement à la structure JSON
    }
    
    try:
        return [model_map[content_type](**item) for item in data]
    except Exception as e:
        print(f"Error processing {file_path}: {e}")
        if data:
            print(f"First problematic item: {data[0]}")
        raise