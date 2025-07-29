# NASA API Integration Documentation

## Overview

AstroInsight integrates with multiple NASA APIs to provide users with comprehensive space exploration data. This document details the implementation, usage patterns, and data structures for each NASA API integration.

## Table of Contents

1. [NASA APIs Overview](#nasa-apis-overview)
2. [Astronomy Picture of the Day (APOD)](#astronomy-picture-of-the-day-apod)
3. [Mars Rover Photos](#mars-rover-photos)
4. [Near Earth Object Web Service (NeoWs)](#near-earth-object-web-service-neows)
5. [NASA Earth API](#nasa-earth-api)
6. [Implementation Patterns](#implementation-patterns)
7. [Error Handling](#error-handling)
8. [Best Practices](#best-practices)

## NASA APIs Overview

### Supported APIs

| API | Purpose | Screen Component | Data Type |
|-----|---------|------------------|-----------|
| APOD | Daily astronomy images | `Apodscreen` | Images/Videos |
| Mars Rover Photos | Mars surface imagery | `MarsRoverscreen` | Rover photos |
| NeoWs | Near Earth Objects | `Asteroidscreen` | Asteroid data |
| Earth API | Earth imagery | `Earthscreen` | Satellite images |

### API Authentication

Most NASA APIs require an API key. The application uses NASA's demo key for development, but production should use a registered API key.

```javascript
const NASA_API_KEY = process.env.REACT_APP_NASA_API_KEY || 'DEMO_KEY';
```

## Astronomy Picture of the Day (APOD)

### API Endpoint
```
https://api.nasa.gov/planetary/apod?api_key={API_KEY}
```

### Screen Component
**Location**: `src/screens/Apodscreen.js`

### Data Structure

```typescript
interface APODData {
  copyright?: string;
  date: string;           // YYYY-MM-DD format
  explanation: string;    // Detailed description
  hdurl?: string;        // High-definition image URL
  media_type: 'image' | 'video';
  service_version: string;
  title: string;
  url: string;           // Standard resolution URL
  thumbnail_url?: string; // For videos
}
```

### Implementation Example

```javascript
import React, { useState, useEffect } from 'react';
import Loading from '../components/Loading';
import Error from '../components/Error';

function Apodscreen() {
  const [apodData, setApodData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAPOD = async (date = null) => {
    setLoading(true);
    setError(null);
    
    try {
      const dateParam = date ? `&date=${date}` : '';
      const response = await fetch(
        `https://api.nasa.gov/planetary/apod?api_key=${NASA_API_KEY}${dateParam}`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setApodData(data);
    } catch (err) {
      setError('Failed to fetch APOD data. Please try again.');
      console.error('APOD fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAPOD();
  }, []);

  if (loading) return <Loading />;
  if (error) return <Error error={error} />;
  if (!apodData) return <div>No data available</div>;

  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4">Astronomy Picture of the Day</h1>
      
      <div className="card mx-auto" style={{ maxWidth: "58rem" }}>
        {apodData.media_type === 'image' ? (
          <img
            src={apodData.hdurl || apodData.url}
            className="card-img-top"
            alt={apodData.title}
            loading="lazy"
          />
        ) : (
          <div className="embed-responsive embed-responsive-16by9">
            <iframe
              src={apodData.url}
              className="embed-responsive-item"
              title={apodData.title}
              allowFullScreen
            />
          </div>
        )}
        
        <div className="card-body">
          <h5 className="card-title">{apodData.title}</h5>
          <p className="card-text text-muted">
            <small>Date: {apodData.date}</small>
            {apodData.copyright && (
              <small className="d-block">Copyright: {apodData.copyright}</small>
            )}
          </p>
          <p className="card-text">{apodData.explanation}</p>
          
          {apodData.hdurl && (
            <a
              href={apodData.hdurl}
              className="btn btn-primary"
              target="_blank"
              rel="noopener noreferrer"
            >
              View HD Image
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export default Apodscreen;
```

### Features

- **Date Selection**: Users can view APOD for specific dates
- **Media Support**: Handles both images and videos
- **HD Images**: Links to high-definition versions
- **Responsive Design**: Works on all device sizes
- **Loading States**: Shows loading spinner during fetch
- **Error Handling**: Graceful error display

### Usage Patterns

```javascript
// Fetch specific date
const fetchSpecificDate = (date) => {
  fetchAPOD(date); // date in YYYY-MM-DD format
};

// Fetch random date
const fetchRandomDate = () => {
  const start = new Date(1995, 5, 16); // APOD start date
  const end = new Date();
  const randomDate = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  const dateString = randomDate.toISOString().split('T')[0];
  fetchAPOD(dateString);
};
```

## Mars Rover Photos

### API Endpoint
```
https://api.nasa.gov/mars-photos/api/v1/rovers/{rover}/photos?sol={sol}&api_key={API_KEY}
```

### Screen Component
**Location**: `src/screens/MarsRoverscreen.js`

### Available Rovers
- **Curiosity**: Active since 2012
- **Opportunity**: 2004-2018 (Ended)
- **Spirit**: 2004-2010 (Ended)
- **Perseverance**: Active since 2021
- **Ingenuity**: Mars helicopter (2021-2024)

### Data Structure

```typescript
interface MarsPhoto {
  id: number;
  sol: number;           // Martian day
  camera: {
    id: number;
    name: string;        // e.g., "FHAZ", "RHAZ", "MAST"
    rover_id: number;
    full_name: string;   // e.g., "Front Hazard Avoidance Camera"
  };
  img_src: string;       // Photo URL
  earth_date: string;    // YYYY-MM-DD
  rover: {
    id: number;
    name: string;        // Rover name
    landing_date: string;
    launch_date: string;
    status: 'active' | 'complete';
    max_sol: number;
    max_date: string;
    total_photos: number;
    cameras: CameraInfo[];
  };
}

interface CameraInfo {
  name: string;
  full_name: string;
}
```

### Implementation Example

```javascript
import React, { useState, useEffect } from 'react';
import Loading from '../components/Loading';
import Error from '../components/Error';

function MarsRoverscreen() {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRover, setSelectedRover] = useState('curiosity');
  const [selectedSol, setSelectedSol] = useState(1000);
  const [selectedCamera, setSelectedCamera] = useState('all');
  const [selectedImage, setSelectedImage] = useState(null);

  const rovers = ['curiosity', 'opportunity', 'spirit', 'perseverance'];
  
  const cameras = {
    curiosity: ['FHAZ', 'RHAZ', 'MAST', 'CHEMCAM', 'MAHLI', 'MARDI', 'NAVCAM'],
    opportunity: ['FHAZ', 'RHAZ', 'NAVCAM', 'PANCAM', 'MINITES'],
    spirit: ['FHAZ', 'RHAZ', 'NAVCAM', 'PANCAM', 'MINITES'],
    perseverance: ['EDL_RUCAM', 'EDL_RDCAM', 'EDL_DDCAM', 'EDL_PUCAM1', 'EDL_PUCAM2', 'NAVCAM_LEFT', 'NAVCAM_RIGHT', 'MCZ_LEFT', 'MCZ_RIGHT', 'FRONT_HAZCAM_LEFT_A', 'FRONT_HAZCAM_RIGHT_A', 'REAR_HAZCAM_LEFT', 'REAR_HAZCAM_RIGHT', 'SKYCAM', 'SHERLOC_WATSON']
  };

  const fetchMarsPhotos = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const cameraParam = selectedCamera !== 'all' ? `&camera=${selectedCamera}` : '';
      const response = await fetch(
        `https://api.nasa.gov/mars-photos/api/v1/rovers/${selectedRover}/photos?sol=${selectedSol}&api_key=${NASA_API_KEY}${cameraParam}`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setPhotos(data.photos);
      
      if (data.photos.length === 0) {
        setError('No photos found for the selected criteria. Try a different sol or camera.');
      }
    } catch (err) {
      setError('Failed to fetch Mars rover photos. Please try again.');
      console.error('Mars photos fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMarsPhotos();
  }, [selectedRover, selectedSol, selectedCamera]);

  const handleImageClick = (imgSrc) => {
    setSelectedImage(imgSrc);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Mars Rover Photos</h1>
      
      {/* Controls */}
      <div className="row mb-4">
        <div className="col-md-4">
          <label className="form-label">Rover:</label>
          <select 
            className="form-select"
            value={selectedRover}
            onChange={(e) => setSelectedRover(e.target.value)}
          >
            {rovers.map(rover => (
              <option key={rover} value={rover}>
                {rover.charAt(0).toUpperCase() + rover.slice(1)}
              </option>
            ))}
          </select>
        </div>
        
        <div className="col-md-4">
          <label className="form-label">Sol (Martian Day):</label>
          <input
            type="number"
            className="form-control"
            value={selectedSol}
            onChange={(e) => setSelectedSol(parseInt(e.target.value))}
            min="0"
            max="4000"
          />
        </div>
        
        <div className="col-md-4">
          <label className="form-label">Camera:</label>
          <select 
            className="form-select"
            value={selectedCamera}
            onChange={(e) => setSelectedCamera(e.target.value)}
          >
            <option value="all">All Cameras</option>
            {cameras[selectedRover]?.map(camera => (
              <option key={camera} value={camera}>{camera}</option>
            ))}
          </select>
        </div>
      </div>

      {loading && <Loading />}
      {error && <Error error={error} />}

      {/* Photo Grid */}
      {!loading && !error && photos.length > 0 && (
        <div className="row">
          {photos.map((photo) => (
            <div key={photo.id} className="col-md-4 mb-4">
              <div className="card">
                <img
                  src={photo.img_src}
                  className="card-img-top"
                  alt={`Mars photo from ${photo.camera.full_name}`}
                  style={{ height: '200px', objectFit: 'cover', cursor: 'pointer' }}
                  onClick={() => handleImageClick(photo.img_src)}
                  loading="lazy"
                />
                <div className="card-body">
                  <h6 className="card-title">{photo.camera.full_name}</h6>
                  <p className="card-text">
                    <small className="text-muted">
                      Sol: {photo.sol} | Earth Date: {photo.earth_date}
                    </small>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Image Modal */}
      {selectedImage && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.8)' }}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <button 
                  type="button" 
                  className="btn-close"
                  onClick={closeModal}
                ></button>
              </div>
              <div className="modal-body text-center">
                <img
                  src={selectedImage}
                  className="img-fluid"
                  alt="Mars rover photo"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MarsRoverscreen;
```

### Features

- **Multi-Rover Support**: Switch between different Mars rovers
- **Camera Selection**: Filter by specific camera types
- **Sol Navigation**: Browse photos by Martian day
- **Image Modal**: Full-size image viewing
- **Lazy Loading**: Optimized image loading
- **Responsive Grid**: Adaptive layout for different screen sizes

## Near Earth Object Web Service (NeoWs)

### API Endpoint
```
https://api.nasa.gov/neo/rest/v1/feed?start_date={start_date}&end_date={end_date}&api_key={API_KEY}
```

### Screen Component
**Location**: `src/screens/Asteroidscreen.js`

### Data Structure

```typescript
interface NeoData {
  links: {
    next?: string;
    prev?: string;
    self: string;
  };
  element_count: number;
  near_earth_objects: {
    [date: string]: NearEarthObject[];
  };
}

interface NearEarthObject {
  id: string;
  neo_reference_id: string;
  name: string;
  nasa_jpl_url: string;
  absolute_magnitude_h: number;
  estimated_diameter: {
    kilometers: DiameterRange;
    meters: DiameterRange;
    miles: DiameterRange;
    feet: DiameterRange;
  };
  is_potentially_hazardous_asteroid: boolean;
  close_approach_data: CloseApproachData[];
  orbital_data: OrbitalData;
}

interface DiameterRange {
  estimated_diameter_min: number;
  estimated_diameter_max: number;
}

interface CloseApproachData {
  close_approach_date: string;
  close_approach_date_full: string;
  epoch_date_close_approach: number;
  relative_velocity: {
    kilometers_per_second: string;
    kilometers_per_hour: string;
    miles_per_hour: string;
  };
  miss_distance: {
    astronomical: string;
    lunar: string;
    kilometers: string;
    miles: string;
  };
  orbiting_body: string;
}
```

### Implementation Example

```javascript
import React, { useState, useEffect } from 'react';
import Loading from '../components/Loading';
import Error from '../components/Error';

function Asteroidscreen() {
  const [neoData, setNeoData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [startDate, setStartDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState(() => {
    const today = new Date();
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    return nextWeek.toISOString().split('T')[0];
  });

  const fetchNeoData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(
        `https://api.nasa.gov/neo/rest/v1/feed?start_date=${startDate}&end_date=${endDate}&api_key=${NASA_API_KEY}`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setNeoData(data);
    } catch (err) {
      setError('Failed to fetch asteroid data. Please try again.');
      console.error('NEO fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNeoData();
  }, [startDate, endDate]);

  const formatDistance = (distance) => {
    const km = parseFloat(distance.kilometers);
    return km > 1000000 ? 
      `${(km / 1000000).toFixed(2)} million km` : 
      `${km.toLocaleString()} km`;
  };

  const formatVelocity = (velocity) => {
    return `${parseFloat(velocity.kilometers_per_hour).toLocaleString()} km/h`;
  };

  const formatDiameter = (diameter) => {
    const min = diameter.kilometers.estimated_diameter_min.toFixed(3);
    const max = diameter.kilometers.estimated_diameter_max.toFixed(3);
    return `${min} - ${max} km`;
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Near Earth Objects (Asteroids)</h1>
      
      {/* Date Range Controls */}
      <div className="row mb-4">
        <div className="col-md-6">
          <label className="form-label">Start Date:</label>
          <input
            type="date"
            className="form-control"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div className="col-md-6">
          <label className="form-label">End Date:</label>
          <input
            type="date"
            className="form-control"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
      </div>

      {loading && <Loading />}
      {error && <Error error={error} />}

      {!loading && !error && neoData && (
        <div>
          <div className="alert alert-info">
            <strong>Total Objects:</strong> {neoData.element_count}
          </div>

          {Object.entries(neoData.near_earth_objects).map(([date, objects]) => (
            <div key={date} className="mb-5">
              <h3 className="mb-3">{new Date(date).toLocaleDateString()}</h3>
              
              <div className="row">
                {objects.map((neo) => (
                  <div key={neo.id} className="col-md-6 col-lg-4 mb-4">
                    <div className={`card h-100 ${neo.is_potentially_hazardous_asteroid ? 'border-warning' : 'border-success'}`}>
                      <div className="card-header">
                        <h6 className="card-title mb-0">
                          {neo.name}
                          {neo.is_potentially_hazardous_asteroid && (
                            <span className="badge bg-warning ms-2">Hazardous</span>
                          )}
                        </h6>
                      </div>
                      
                      <div className="card-body">
                        <p className="card-text">
                          <strong>Diameter:</strong><br />
                          {formatDiameter(neo.estimated_diameter)}
                        </p>
                        
                        {neo.close_approach_data[0] && (
                          <>
                            <p className="card-text">
                              <strong>Miss Distance:</strong><br />
                              {formatDistance(neo.close_approach_data[0].miss_distance)}
                            </p>
                            
                            <p className="card-text">
                              <strong>Velocity:</strong><br />
                              {formatVelocity(neo.close_approach_data[0].relative_velocity)}
                            </p>
                          </>
                        )}
                        
                        <a
                          href={neo.nasa_jpl_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-sm btn-outline-primary"
                        >
                          View Details
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Asteroidscreen;
```

### Features

- **Date Range Selection**: Customizable date ranges for asteroid tracking
- **Hazard Classification**: Visual indicators for potentially hazardous asteroids
- **Detailed Information**: Size, velocity, and distance data
- **External Links**: Direct links to NASA JPL database
- **Responsive Cards**: Organized display of asteroid information

## NASA Earth API

### API Endpoint
```
https://api.nasa.gov/planetary/earth/imagery?lon={lon}&lat={lat}&date={date}&api_key={API_KEY}
```

### Screen Component
**Location**: `src/screens/Earthscreen.js`

### Data Structure

```typescript
interface EarthImagery {
  date: string;          // Image capture date
  id: string;           // Unique identifier
  resource: {
    dataset: string;     // Satellite dataset
    planet: string;      // Always "earth"
  };
  service_version: string;
  url: string;          // Image URL
}

interface EarthAssets {
  count: number;
  results: EarthAsset[];
}

interface EarthAsset {
  date: string;
  id: string;
  thumbnail: string;
  title: string;
  url: string;
}
```

### Implementation Example

```javascript
import React, { useState, useEffect } from 'react';
import Loading from '../components/Loading';
import Error from '../components/Error';

function Earthscreen() {
  const [earthImage, setEarthImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [coordinates, setCoordinates] = useState({
    lat: 40.7128,  // New York City default
    lon: -74.0060
  });
  const [selectedDate, setSelectedDate] = useState(() => {
    const date = new Date();
    date.setFullYear(date.getFullYear() - 1); // Default to 1 year ago
    return date.toISOString().split('T')[0];
  });

  const fetchEarthImage = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(
        `https://api.nasa.gov/planetary/earth/imagery?lon=${coordinates.lon}&lat=${coordinates.lat}&date=${selectedDate}&api_key=${NASA_API_KEY}`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setEarthImage(data);
    } catch (err) {
      setError('Failed to fetch Earth imagery. Please try different coordinates or date.');
      console.error('Earth imagery fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCoordinateChange = (field, value) => {
    setCoordinates(prev => ({
      ...prev,
      [field]: parseFloat(value)
    }));
  };

  const presetLocations = [
    { name: 'New York City', lat: 40.7128, lon: -74.0060 },
    { name: 'London', lat: 51.5074, lon: -0.1278 },
    { name: 'Tokyo', lat: 35.6762, lon: 139.6503 },
    { name: 'Sydney', lat: -33.8688, lon: 151.2093 },
    { name: 'Amazon Rainforest', lat: -3.4653, lon: -62.2159 },
    { name: 'Sahara Desert', lat: 23.8859, lon: 9.6446 },
    { name: 'Mount Everest', lat: 27.9881, lon: 86.9250 },
    { name: 'Grand Canyon', lat: 36.1069, lon: -112.1129 }
  ];

  const selectPresetLocation = (location) => {
    setCoordinates({ lat: location.lat, lon: location.lon });
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">NASA Earth Imagery</h1>
      
      {/* Controls */}
      <div className="row mb-4">
        <div className="col-md-4">
          <label className="form-label">Latitude:</label>
          <input
            type="number"
            className="form-control"
            value={coordinates.lat}
            onChange={(e) => handleCoordinateChange('lat', e.target.value)}
            min="-90"
            max="90"
            step="0.0001"
          />
        </div>
        
        <div className="col-md-4">
          <label className="form-label">Longitude:</label>
          <input
            type="number"
            className="form-control"
            value={coordinates.lon}
            onChange={(e) => handleCoordinateChange('lon', e.target.value)}
            min="-180"
            max="180"
            step="0.0001"
          />
        </div>
        
        <div className="col-md-4">
          <label className="form-label">Date:</label>
          <input
            type="date"
            className="form-control"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            max={new Date().toISOString().split('T')[0]}
          />
        </div>
      </div>

      {/* Preset Locations */}
      <div className="mb-4">
        <h5>Preset Locations:</h5>
        <div className="d-flex flex-wrap gap-2">
          {presetLocations.map((location, index) => (
            <button
              key={index}
              className="btn btn-outline-secondary btn-sm"
              onClick={() => selectPresetLocation(location)}
            >
              {location.name}
            </button>
          ))}
        </div>
      </div>

      <div className="text-center mb-4">
        <button 
          className="btn btn-primary"
          onClick={fetchEarthImage}
          disabled={loading}
        >
          {loading ? 'Loading...' : 'Get Earth Image'}
        </button>
      </div>

      {loading && <Loading />}
      {error && <Error error={error} />}

      {earthImage && !loading && !error && (
        <div className="text-center">
          <div className="card mx-auto" style={{ maxWidth: '600px' }}>
            <img
              src={earthImage.url}
              className="card-img-top"
              alt={`Earth imagery for ${coordinates.lat}, ${coordinates.lon}`}
              style={{ height: '400px', objectFit: 'cover' }}
            />
            <div className="card-body">
              <h5 className="card-title">Earth Imagery</h5>
              <p className="card-text">
                <strong>Coordinates:</strong> {coordinates.lat}°, {coordinates.lon}°<br />
                <strong>Date:</strong> {earthImage.date}<br />
                <strong>Dataset:</strong> {earthImage.resource?.dataset}
              </p>
              <a
                href={earthImage.url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
              >
                View Full Resolution
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Earthscreen;
```

### Features

- **Coordinate Input**: Precise latitude/longitude selection
- **Preset Locations**: Quick access to interesting Earth locations
- **Date Selection**: Historical imagery browsing
- **High Resolution**: Access to full-resolution satellite images
- **Interactive Interface**: User-friendly controls for exploration

## Implementation Patterns

### Common API Integration Pattern

```javascript
// Custom hook for NASA API calls
import { useState, useEffect } from 'react';

const useNasaAPI = (endpoint, dependencies = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(endpoint);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err.message);
      console.error('API fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (endpoint) {
      fetchData();
    }
  }, dependencies);

  return { data, loading, error, refetch: fetchData };
};

// Usage in component
function MyNasaComponent() {
  const { data, loading, error } = useNasaAPI(
    `https://api.nasa.gov/planetary/apod?api_key=${NASA_API_KEY}`,
    []
  );

  if (loading) return <Loading />;
  if (error) return <Error error={error} />;
  
  return <div>{/* Render data */}</div>;
}
```

### Error Handling Strategy

```javascript
const handleAPIError = (error, context) => {
  let userMessage = 'An unexpected error occurred. Please try again.';
  
  if (error.name === 'TypeError' && error.message.includes('fetch')) {
    userMessage = 'Network error. Please check your internet connection.';
  } else if (error.message.includes('400')) {
    userMessage = 'Invalid request parameters. Please check your input.';
  } else if (error.message.includes('403')) {
    userMessage = 'API access denied. Please check your API key.';
  } else if (error.message.includes('429')) {
    userMessage = 'Too many requests. Please wait a moment and try again.';
  } else if (error.message.includes('500')) {
    userMessage = 'NASA API server error. Please try again later.';
  }
  
  console.error(`${context} error:`, error);
  return userMessage;
};
```

### Caching Strategy

```javascript
// Simple cache implementation
class APICache {
  constructor(maxAge = 5 * 60 * 1000) { // 5 minutes default
    this.cache = new Map();
    this.maxAge = maxAge;
  }

  get(key) {
    const item = this.cache.get(key);
    if (!item) return null;
    
    if (Date.now() - item.timestamp > this.maxAge) {
      this.cache.delete(key);
      return null;
    }
    
    return item.data;
  }

  set(key, data) {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  clear() {
    this.cache.clear();
  }
}

const apiCache = new APICache();

// Usage in API calls
const fetchWithCache = async (url) => {
  const cached = apiCache.get(url);
  if (cached) return cached;
  
  const response = await fetch(url);
  const data = await response.json();
  
  apiCache.set(url, data);
  return data;
};
```

## Error Handling

### Common Error Scenarios

1. **Network Errors**: Connection issues, timeouts
2. **API Rate Limiting**: Exceeded request limits
3. **Invalid Parameters**: Malformed requests
4. **No Data**: Valid request but no results
5. **Server Errors**: NASA API downtime

### Error Recovery Strategies

```javascript
const withRetry = async (apiCall, maxRetries = 3, delay = 1000) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await apiCall();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      
      // Exponential backoff
      await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
    }
  }
};

// Usage
const fetchAPODWithRetry = () => withRetry(async () => {
  const response = await fetch(`https://api.nasa.gov/planetary/apod?api_key=${NASA_API_KEY}`);
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.json();
});
```

## Best Practices

### 1. API Key Management

```javascript
// Environment-based configuration
const config = {
  NASA_API_KEY: process.env.REACT_APP_NASA_API_KEY || 'DEMO_KEY',
  BASE_URL: 'https://api.nasa.gov',
  TIMEOUT: 10000 // 10 seconds
};

// Validate API key on app start
const validateAPIKey = async () => {
  try {
    const response = await fetch(`${config.BASE_URL}/planetary/apod?api_key=${config.NASA_API_KEY}`);
    return response.ok;
  } catch {
    return false;
  }
};
```

### 2. Request Optimization

```javascript
// Debounced search for user input
import { useCallback } from 'react';
import { debounce } from 'lodash';

const useDebounceCallback = (callback, delay) => {
  return useCallback(debounce(callback, delay), [callback, delay]);
};

// Usage in component
const debouncedSearch = useDebounceCallback((coordinates) => {
  fetchEarthImage(coordinates);
}, 500);
```

### 3. Data Validation

```javascript
const validateNASAResponse = (data, expectedFields) => {
  if (!data || typeof data !== 'object') {
    throw new Error('Invalid response format');
  }
  
  for (const field of expectedFields) {
    if (!(field in data)) {
      throw new Error(`Missing required field: ${field}`);
    }
  }
  
  return true;
};

// Usage
const processAPODData = (data) => {
  validateNASAResponse(data, ['title', 'explanation', 'url', 'date']);
  return data;
};
```

### 4. Performance Optimization

```javascript
// Image lazy loading with intersection observer
const LazyImage = ({ src, alt, ...props }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={imgRef} {...props}>
      {isInView && (
        <img
          src={src}
          alt={alt}
          onLoad={() => setIsLoaded(true)}
          style={{ opacity: isLoaded ? 1 : 0 }}
        />
      )}
    </div>
  );
};
```

### 5. Accessibility

```javascript
// Screen reader support for dynamic content
const announceToScreenReader = (message) => {
  const announcement = document.createElement('div');
  announcement.setAttribute('aria-live', 'polite');
  announcement.setAttribute('aria-atomic', 'true');
  announcement.setAttribute('class', 'sr-only');
  announcement.textContent = message;
  
  document.body.appendChild(announcement);
  
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
};

// Usage after successful data fetch
useEffect(() => {
  if (data && !loading) {
    announceToScreenReader(`Loaded ${data.length} new items`);
  }
}, [data, loading]);
```