# Redis Key Patterns

IntegriGuard uses Redis for session management, result caching, and as a Celery broker.

## Key Patterns

| Key Pattern | Data Type | Description | TTL |
| --- | --- | --- | --- |
| `session:{user_id}` | String/JSON | Stores JWT session data and user permissions. | 8 Hours |
| `risk_cache:{submission_id}` | JSON | Cached risk scores for fast dashboard retrieval. | 1 Hour |
| `baseline_count:{student_id}` | Integer | Counter for collected baseline samples. | Permanent |

## Usage in Pipeline
- **Celery Broker**: Redis handles the background task queue for submission analysis.
- **Speed Optimization**: API first checks `risk_cache` before querying the PostgreSQL or ML service.
