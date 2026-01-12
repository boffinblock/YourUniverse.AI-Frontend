# Batch Duplicate Characters API Documentation

## Overview
To fully optimize character duplication and avoid multiple API calls, a backend batch endpoint should be implemented.

## Implementation Status
✅ **IMPLEMENTED** - The frontend now uses the backend batch-duplicate endpoint.

## Backend Endpoint

### Endpoint
```
POST /api/v1/characters/batch-duplicate
```

### Request Headers
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

### Request Body
```json
{
  "characterIds": ["char-id-1", "char-id-2", "char-id-3"]
}
```

### Response
```json
{
  "success": true,
  "data": {
    "characters": [
      {
        "id": "new-char-id-1",
        "name": "Character Name (Copy)",
        // ... full character object
      },
      {
        "id": "new-char-id-2",
        "name": "Character Name 2 (Copy)",
        // ... full character object
      }
    ],
    "message": "Successfully duplicated 2 character(s)"
  }
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message",
  "message": "Detailed error description"
}
```

## Implementation Benefits
1. **Single API Call**: One request instead of N requests
2. **Atomic Operation**: All or nothing - if one fails, handle rollback
3. **Better Performance**: Reduced network overhead
4. **Server-Side Optimization**: Backend can optimize database operations

## Frontend Implementation
✅ **COMPLETE** - The frontend implementation is in:
- `src/lib/api/characters/endpoints.ts` - `duplicateCharactersBatch` function
- `src/hooks/character/use-duplicate-character.ts` - React Query hook
- `src/components/pages/character-page.tsx` - UI integration

## Features
- ✅ Single API call for multiple characters
- ✅ Client-side validation (UUID format, min 1, max 100)
- ✅ Proper error handling with structured error responses
- ✅ Automatic cache invalidation after duplication
- ✅ Success/error toast notifications
- ✅ Loading states and disabled states during operation

