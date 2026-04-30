from qdrant_client import QdrantClient
from qdrant_client.models import VectorParams, Distance, PointStruct
from sentence_transformers import SentenceTransformer
import datetime
import os

# Initialize Qdrant client
# Using memory storage if no environment variable is provided for testing
QDRANT_HOST = os.getenv("QDRANT_HOST", "localhost")
QDRANT_PORT = int(os.getenv("QDRANT_PORT", 6333))

try:
    # Short timeout for quick fallback
    client = QdrantClient(host=QDRANT_HOST, port=QDRANT_PORT, timeout=2.0)
    # Check connection
    client.get_collections()
except Exception:
    print("Qdrant not available, falling back to :memory:")
    # Fallback to local memory storage for demonstration/dev
    client = QdrantClient(":memory:")

COLLECTION_NAME = "student_baselines"

# Initialize embedding model
try:
    embedder = SentenceTransformer('all-MiniLM-L6-v2')
except Exception as e:
    print(f"Warning: SentenceTransformer could not be loaded: {e}. Using mock embeddings.")
    class MockEmbedder:
        def encode(self, text):
            # Return a deterministic mock vector of size 384
            import numpy as np
            return np.random.RandomState(hash(text) % (2**32)).rand(384).astype(np.float32)
    embedder = MockEmbedder()

def ensure_collection():
    """Ensure the Qdrant collection exists."""
    collections = client.get_collections().collections
    exists = any(c.name == COLLECTION_NAME for c in collections)
    if not exists:
        client.create_collection(
            collection_name=COLLECTION_NAME,
            vectors_config=VectorParams(size=384, distance=Distance.COSINE),
        )

def store_baseline_sample(student_id: str, course_id: str, text: str, week: int, ai_prob: float):
    """Stores a submission as a baseline sample in Qdrant."""
    ensure_collection()
    
    vector = embedder.encode(text).tolist()
    
    point_id = hash(f"{student_id}_{course_id}_{week}_{datetime.datetime.now()}") % (10**10)
    
    client.upsert(
        collection_name=COLLECTION_NAME,
        points=[
            PointStruct(
                id=point_id,
                vector=vector,
                payload={
                    "student_id": student_id,
                    "course_id": course_id,
                    "week": week,
                    "ai_prob": ai_prob,
                    "created_at": datetime.datetime.now().isoformat()
                }
            )
        ]
    )

def get_student_samples(student_id: str, course_id: str):
    """Retrieves all baseline samples for a student in a specific course."""
    ensure_collection()
    
    results = client.scroll(
        collection_name=COLLECTION_NAME,
        scroll_filter={
            "must": [
                {"key": "student_id", "match": {"value": student_id}},
                {"key": "course_id", "match": {"value": course_id}}
            ]
        },
        with_vectors=True,
        with_payload=True
    )[0]
    
    return results

def get_cohort_mean_embedding(course_id: str):
    """Calculates the mean embedding for all students in the same course."""
    ensure_collection()
    
    results = client.scroll(
        collection_name=COLLECTION_NAME,
        scroll_filter={
            "must": [
                {"key": "course_id", "match": {"value": course_id}}
            ]
        },
        with_vectors=True
    )[0]
    
    if not results:
        return None
        
    vectors = [r.vector for r in results]
    import numpy as np
    return np.mean(vectors, axis=0).tolist()
