# Qdrant Collection Specification

## Collection: `student_baselines`

| Property | Value |
| --- | --- |
| **Vector Size** | 384 (Output of `all-MiniLM-L6-v2`) |
| **Distance Metric** | Cosine |

### Payload Schema (per point)

```json
{
  "student_id": "UUID string",
  "course_id": "UUID string",
  "submission_id": "UUID string",
  "week_number": "Integer (1-3)",
  "is_corrupted": "Boolean",
  "created_at": "ISO 8601 Timestamp"
}
```

### Usage
- Points are stored as individual submission samples.
- Search filter: `must match student_id` and `must match course_id`.
- Score aggregation: Mean vector of non-corrupted samples for a student.
