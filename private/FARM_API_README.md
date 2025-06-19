# Farm API Documentation

## Overview
The Farm API provides endpoints for managing farm-related information including location, soil conditions, weather data, and crop recommendations. This is an in-memory backend implementation that should be replaced with a real database in production.

## Data Structure

### Farm Object
```javascript
{
  id: number,
  userId: number,
  address: string,
  coordinates: {
    latitude: number,
    longitude: number
  },
  soilConditions: {
    temperature: string,      // Soil temperature in Celsius
    moisture: string,         // "High", "Medium", or "Low"
    condition: string,        // "Good", "Fair", or "Poor"
    pH: string,              // pH level (4.0-8.5)
    airTemp: string,         // Air temperature in Celsius
    humidity: number,        // Humidity percentage
    pressure: number,        // Atmospheric pressure
    windSpeed: string,       // Wind speed
    uvIndex: number,         // UV index
    description: string,     // Weather description
    icon: string            // Weather icon code
  },
  weatherData: object,       // Raw weather data from OpenWeather API
  cropRecommendations: array, // Array of recommended crops with scores
  isActive: boolean,
  createdAt: string,        // ISO timestamp
  updatedAt: string         // ISO timestamp
}
```

## API Endpoints

### 1. Get All Farms (Testing)
- **GET** `/api/farms`
- **Description**: Get all farms (for testing purposes)
- **Authentication**: Not required
- **Response**: List of all farms

### 2. Get User's Farms
- **GET** `/api/farms/my`
- **Description**: Get all farms belonging to the authenticated user
- **Authentication**: Required (JWT token)
- **Response**: List of user's farms

### 3. Get Specific Farm
- **GET** `/api/farms/:id`
- **Description**: Get a specific farm by ID
- **Authentication**: Required (JWT token)
- **Authorization**: User must own the farm
- **Response**: Farm object

### 4. Create Farm
- **POST** `/api/farms`
- **Description**: Create a new farm
- **Authentication**: Required (JWT token)
- **Body**:
  ```javascript
  {
    address: string,
    coordinates: {
      latitude: number,
      longitude: number
    },
    soilConditions: object,
    weatherData: object,        // Optional
    cropRecommendations: array  // Optional
  }
  ```
- **Response**: Created farm object
- **Validation**: Checks if farm already exists at the same location for the user

### 5. Update Farm
- **PUT** `/api/farms/:id`
- **Description**: Update an existing farm
- **Authentication**: Required (JWT token)
- **Authorization**: User must own the farm
- **Body**: Any farm fields to update
- **Response**: Updated farm object

### 6. Delete Farm
- **DELETE** `/api/farms/:id`
- **Description**: Delete a farm
- **Authentication**: Required (JWT token)
- **Authorization**: User must own the farm
- **Response**: Success message

### 7. Check Farm Location
- **POST** `/api/farms/check-location`
- **Description**: Check if a farm exists at specific coordinates
- **Authentication**: Required (JWT token)
- **Body**:
  ```javascript
  {
    latitude: number,
    longitude: number
  }
  ```
- **Response**:
  ```javascript
  {
    success: boolean,
    farmExists: boolean,
    userOwnsFarm: boolean,
    farm: object | null
  }
  ```

## Error Responses

All endpoints return consistent error responses:

```javascript
{
  success: false,
  message: "Error description"
}
```

Common HTTP status codes:
- `400` - Bad Request (missing required fields)
- `401` - Unauthorized (missing or invalid token)
- `403` - Forbidden (user doesn't own the resource)
- `404` - Not Found (farm doesn't exist)
- `409` - Conflict (farm already exists at location)
- `500` - Internal Server Error

## Testing

Run the test script to verify the API is working:

```bash
npm install  # Install dependencies including axios
npm test     # Run the test script
```

## Integration with Frontend

The farm data structure matches the data collected in `mapping.jsx`:

- **Location**: Address and coordinates from map selection
- **Soil Conditions**: Calculated from weather data (temperature, moisture, pH, etc.)
- **Weather Data**: Raw data from OpenWeather API
- **Crop Recommendations**: Generated based on soil conditions

## Security Features

1. **Authentication**: All sensitive endpoints require JWT token
2. **Authorization**: Users can only access their own farms
3. **Input Validation**: Required fields are validated
4. **Duplicate Prevention**: Prevents creating multiple farms at the same location

## Future Enhancements

1. Replace in-memory storage with a real database (MongoDB, PostgreSQL)
2. Add data persistence across server restarts
3. Implement farm data versioning/history
4. Add bulk operations for multiple farms
5. Implement farm sharing between users
6. Add farm analytics and reporting endpoints 