import requests

# Fonction pour interroger Ollama uniquement
def ask_ollama(prompt: str, model="llama2"):
    try:
        response = requests.post(
            "http://localhost:11434/api/generate",
            json={"model": model, "prompt": prompt, "stream": False}
        )
        return response.json()["response"].strip()
    except Exception as e:
        print(f"[OLLAMA ERROR] {e}")
        return None

# Fonction principale sans Chroma
def get_answer(question: str):
    response = ask_ollama(question)
    if response:
        return {"source": "ollama", "answer": response}
    else:
        return {"error": "Ollama n'a pas pu répondre."}
