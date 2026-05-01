# GreenWatch API Documentation

This document describes the backend API endpoints for the GreenWatch application.

**Base URL**: `https://dhwoadncdzhflgtsdciv.supabase.co/functions/v1/make-server-b8d06af6`

---

## Authentication Endpoints

### Register New User
**POST** `/auth/register`

Create a new user account in the database.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "role": "citizen" // or "authority"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "role": "citizen"
  }
}
```

---

### Login
**POST** `/auth/login`

Authenticate user and get session token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "role": "citizen"
  },
  "session": {
    "access_token": "jwt-token",
    "refresh_token": "refresh-token"
  }
}
```

---

## Incidents Endpoints

### Get All Incidents
**GET** `/incidents`

Retrieve all incident reports from the database.

**Response:**
```json
{
  "incidents": [
    {
      "id": "uuid",
      "type": "Illegal Logging",
      "description": "Trees being cut in protected area",
      "location": "North Forest, Zone A",
      "latitude": "40.7484",
      "longitude": "-73.9857",
      "status": "Pending",
      "severity": "High",
      "region": "North",
      "reported_by_email": "citizen@demo.com",
      "attachment_name": "photo.jpg",
      "attachment_url": "data:image/jpeg;base64,...",
      "attachment_type": "image/jpeg",
      "created_at": "2026-05-01T10:30:00Z",
      "updated_at": "2026-05-01T10:30:00Z"
    }
  ]
}
```

---

### Get Single Incident
**GET** `/incidents/:id`

Retrieve a specific incident by ID.

**Response:**
```json
{
  "incident": {
    "id": "uuid",
    "type": "Water Pollution",
    "description": "Chemical waste detected",
    ...
  }
}
```

---

### Create Incident
**POST** `/incidents`

Submit a new incident report.

**Request Body:**
```json
{
  "type": "Forest Fire",
  "description": "Fire spotted near camping area",
  "location": "South Forest, Zone C",
  "coordinates": {
    "lat": 40.7414,
    "lng": -73.9882
  },
  "severity": "Medium",
  "region": "South",
  "reportedBy": "citizen@example.com",
  "attachment": {
    "name": "evidence.jpg",
    "url": "data:image/jpeg;base64,...",
    "type": "image/jpeg"
  }
}
```

**Response:**
```json
{
  "success": true,
  "incident": {
    "id": "uuid",
    "type": "Forest Fire",
    ...
  }
}
```

---

### Update Incident Status
**PUT** `/incidents/:id/status`

Change incident status (Authorities only - no enforcement yet).

**Request Body:**
```json
{
  "status": "Approved" // "Pending", "Approved", or "Resolved"
}
```

**Response:**
```json
{
  "success": true,
  "incident": {
    "id": "uuid",
    "status": "Approved",
    ...
  }
}
```

---

## Notifications Endpoints

### Get All Notifications
**GET** `/notifications`

Retrieve all notifications (automatically created when incidents are reported).

**Response:**
```json
{
  "notifications": [
    {
      "id": "uuid",
      "incident_id": "incident-uuid",
      "message": "New High severity incident reported: Illegal Logging at North Forest, Zone A",
      "read": false,
      "created_at": "2026-05-01T10:30:00Z"
    }
  ]
}
```

---

### Mark Notification as Read
**PUT** `/notifications/:incidentId/read`

Mark notifications for a specific incident as read.

**Response:**
```json
{
  "success": true
}
```

---

### Mark All Notifications as Read
**PUT** `/notifications/read-all`

Mark all unread notifications as read.

**Response:**
```json
{
  "success": true
}
```

---

## Database Tables

### profiles
- `id` (UUID, Primary Key)
- `email` (Text, Unique)
- `role` (Text: 'citizen' or 'authority')
- `created_at` (Timestamp)
- `updated_at` (Timestamp)

### incidents
- `id` (UUID, Primary Key)
- `type` (Text)
- `description` (Text)
- `location` (Text)
- `latitude` (Decimal)
- `longitude` (Decimal)
- `status` (Text: 'Pending', 'Approved', 'Resolved')
- `severity` (Text: 'Low', 'Medium', 'High')
- `region` (Text)
- `reported_by_email` (Text)
- `attachment_name` (Text, Optional)
- `attachment_url` (Text, Optional)
- `attachment_type` (Text, Optional)
- `created_at` (Timestamp)
- `updated_at` (Timestamp)

### notifications
- `id` (UUID, Primary Key)
- `incident_id` (UUID, Foreign Key → incidents)
- `message` (Text)
- `read` (Boolean)
- `created_at` (Timestamp)

---

## Frontend Integration

The frontend uses these API endpoints through wrapper functions in `/src/utils/api.ts`:

```typescript
import { authApi, incidentsApi, notificationsApi } from '@/utils/api';

// Register
await authApi.register(email, password, role);

// Login
await authApi.login(email, password);

// Get incidents
await incidentsApi.getAll();

// Create incident
await incidentsApi.create(incidentData);

// Update status
await incidentsApi.updateStatus(id, 'Approved');

// Get notifications
await notificationsApi.getAll();
```

---

## Error Responses

All endpoints return errors in this format:

```json
{
  "error": "Error message description"
}
```

Common HTTP status codes:
- `200` - Success
- `400` - Bad Request (validation error)
- `401` - Unauthorized (login failed)
- `404` - Not Found
- `500` - Internal Server Error

---

## Security Notes

- All API requests include `Authorization: Bearer ${publicAnonKey}` header
- Row Level Security (RLS) enabled on all tables
- Passwords hashed by Supabase Auth
- Email auto-confirmed (no email server configured)
- File attachments stored as base64 data URLs

---

This API provides a complete backend for the GreenWatch environmental monitoring platform!
