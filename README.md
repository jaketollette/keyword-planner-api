# Google Ads Keyword Planner API

A Node.js REST API for accessing Google Ads Keyword Planner data.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```bash
cp .env.example .env
```

3. Configure your Google Ads API credentials in `.env`:
```
PORT=3000
GOOGLE_ADS_CLIENT_ID=your_client_id
GOOGLE_ADS_CLIENT_SECRET=your_client_secret
GOOGLE_ADS_DEVELOPER_TOKEN=your_developer_token
GOOGLE_ADS_API_REFRESH_TOKEN=your_refresh_token
```

4. Start the server:
```bash
npm run dev  # Development mode
npm start    # Production mode
```

## API Endpoints

### Get Keywords
Retrieves keyword data based on provided seeds.

```
POST /api/keywords
```

#### Request Body
```typescript
{
  "requestType": "keywordAndUrlSeed" | "keywordSeed" | "urlSeed" | "siteSeed",
  "keywords"?: string[],  // Required for keywordAndUrlSeed and keywordSeed
  "url"?: string         // Required for keywordAndUrlSeed, urlSeed, and siteSeed
}
```

#### Response
```typescript
{
  "low": [
    {
      "keyword": string,
      "averageMonthly": number,
      "competition": "LOW" | "MEDIUM" | "HIGH" | "UNSPECIFIED" | "UNKNOWN",
      "competitionIndex": number
    }
  ],
  "medium": [...],
  "high": [...]
}
```

#### Example
```bash
curl -X POST http://localhost:3000/api/keywords \
  -H "Content-Type: application/json" \
  -d '{
    "requestType": "keywordSeed",
    "keywords": ["organic coffee", "coffee beans"]
  }'
```

### Get Recommendations
Returns top 9 keywords from each competition level (low, medium, high).

```
POST /api/recommendations
```

#### Request Body
Same as `/api/keywords` endpoint.

#### Response
```typescript
[
  {
    "keyword": string,
    "averageMonthly": number,
    "competition": "LOW" | "MEDIUM" | "HIGH" | "UNSPECIFIED" | "UNKNOWN",
    "competitionIndex": number
  }
]
```

#### Example
```bash
curl -X POST http://localhost:3000/api/recommendations \
  -H "Content-Type: application/json" \
  -d '{
    "requestType": "urlSeed",
    "url": "https://example-coffee-shop.com"
  }'
```

### List Customers
Returns list of available Google Ads customers.

```
GET /api/customers
```

#### Response
Array of Google Ads customer information.

#### Example
```bash
curl http://localhost:3000/api/customers
```

## Health Check

```
GET /health
```

Returns API health status.

#### Response
```json
{
  "status": "OK"
}
```

## Development

```bash
npm run dev     # Start development server
npm run build   # Build for production
npm start       # Start production server
npm test        # Run tests
```

## Error Handling

All endpoints return appropriate HTTP status codes:
- 200: Success
- 400: Bad Request (invalid input)
- 500: Server Error

Error responses include an error message:
```json
{
  "error": "Error message description"
}
```