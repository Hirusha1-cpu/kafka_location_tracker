import React, { useEffect, useState } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import io from 'socket.io-client';
import { Car } from 'lucide-react';

const containerStyle = {
  width: '100%',
  height: '100vh'
};

const defaultCenter = {
  lat: 40.7128,
  lng: -74.0060
};

const MapComponent = () => {
  const [location, setLocation] = useState(defaultCenter);
  const [map, setMap] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const socket = io('http://localhost:5002', {
      withCredentials: true,
      transports: ['websocket', 'polling']
    });

    socket.on('connect', () => {
      console.log('Socket connected!');
    });

    socket.on('locationUpdate', (data) => {
      console.log('Received location update:', data);
      setLocation({
        lat: data.latitude,
        lng: data.longitude
      });
    });

    return () => socket.disconnect();
  }, []);

  const onLoad = React.useCallback(function callback(map) {
    setMap(map);
    setIsLoaded(true);
  }, []);

  const onUnmount = React.useCallback(function callback() {
    setMap(null);
    setIsLoaded(false);
  }, []);

  return (
    <div style={{ width: '100%', height: '100vh' }}>
      <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={location}
          zoom={13}
          onLoad={onLoad}
          onUnmount={onUnmount}
        >
          {isLoaded && (
            <Marker
              position={location}
              icon={{
                path: window.google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
                scale: 5,
                fillColor: '#4285F4',
                fillOpacity: 1,
                strokeWeight: 1
              }}
            />
          )}
        </GoogleMap>
      </LoadScript>
    </div>
  );
};

export default MapComponent;