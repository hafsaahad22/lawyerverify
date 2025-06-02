# Wix Database Integration Guide

## Current Setup
- **Data Storage**: In-memory storage with 3 demo lawyers
- **Demo Lawyers in Database**:
  - CNIC: `12345-1234567-1`, Letter ID: `LTR-12345`, Name: "Advocate Ayesha Siddiqi"
  - CNIC: `98765-7654321-9`, Letter ID: `LTR-54321`, Name: "Barrister Khalid Mehmood"  
  - CNIC: `11111-1111111-1`, Letter ID: `LTR-11111`, Name: "Advocate Sarah Khan"

## Integration Options for Wix

### Option 1: Wix Data Collections (Recommended)
**Best for**: Full Wix integration, easy management
```javascript
// In Wix backend code
import wixData from 'wix-data';

// Create collections: 'Lawyers', 'VerificationRequests'
export function verifyLawyer(cnic, letterId) {
  return wixData.query('Lawyers')
    .eq('cnic', cnic)
    .eq('letterId', letterId)
    .find()
    .then(results => {
      if (results.items.length > 0) {
        return { verified: true, fullName: results.items[0].fullName };
      }
      return { verified: false };
    });
}
```

### Option 2: External Database + Wix HTTP Functions
**Best for**: Keeping current setup, connecting via API
```javascript
// Wix HTTP Function
import { fetch } from 'wix-fetch';

export function post_verifyLawyer(request) {
  const { cnic, letterId } = request.body;
  
  return fetch('https://your-app.replit.app/api/verify-lawyer', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ cnic, letterId })
  })
  .then(response => response.json());
}
```

### Option 3: PostgreSQL + Wix Secrets
**Best for**: Production scale, real database
1. Create PostgreSQL database
2. Store connection string in Wix Secrets Manager
3. Use database connector in Wix backend

### Option 4: Embed Current App in Wix
**Best for**: Quick deployment
1. Deploy current app to Replit
2. Embed via HTML iframe in Wix page
3. Style iframe to match Wix site

## Migration Steps

### To Wix Data Collections:
1. Export current lawyer data from memory storage
2. Create Wix Data Collections with same schema
3. Import data to Wix collections
4. Replace API calls with Wix Data queries

### To Keep External Database:
1. Deploy current app to production
2. Create Wix HTTP Functions to proxy requests
3. Update Wix frontend to call HTTP functions
4. Maintain current admin panel separately

## Data Schema for Wix Collections

### Lawyers Collection
- `cnic` (Text, Required, Unique)
- `letterId` (Text, Required, Unique) 
- `fullName` (Text, Required)
- `verified` (Boolean, Default: true)
- `createdAt` (Date, Auto-generated)

### VerificationRequests Collection
- `cnic` (Text, Required)
- `letterId` (Text, Required)
- `status` (Text, Default: "pending")
- `submittedAt` (Date, Auto-generated)
- `reviewedAt` (Date, Optional)
- `reviewedBy` (Text, Optional)