import React, { useEffect, useState } from 'react';

const MapViewForEvent = ({ onMapClick }) => {
  const [map, setMap] = useState(null);

  useEffect(() => {
    if (window.L && window.L.Control && window.L.Control.Geocoder) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLat = position.coords.latitude;
          const userLng = position.coords.longitude;

          if (!map) {
            const newMap = window.L.map('map', {
              center: [userLat, userLng],
              zoom: 13,
              minZoom: 4,
              zoomControl: true,
              attributionControl: false,
            });

            window.L.tileLayer('https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png', {
              maxZoom: 19,
              attribution: '',
            }).addTo(newMap);

            setMap(newMap);

            // Add click event listener to the map
            newMap.on('click', (e) => {
              const { lat, lng } = e.latlng;
              // console.log('Map clicked at:', lat, lng); // Debugging log
              if (onMapClick) {
                onMapClick(lat, lng); // Pass latitude and longitude to the parent component
              }

              // Add a marker at the clicked location
              window.L.marker([lat, lng])
                .addTo(newMap)
                .bindPopup(`Latitude: ${lat.toFixed(6)}, Longitude: ${lng.toFixed(6)}`)
                .openPopup();
            });
          }
        },
        (error) => {
          console.error('Geolocation error:', error.message);
          alert('Could not get your location. Using default location.');
          const defaultLat = 51.505;
          const defaultLng = -0.09;

          if (!map) {
            const newMap = window.L.map('map', {
              center: [defaultLat, defaultLng],
              zoom: 13,
              minZoom: 4,
              zoomControl: true,
              attributionControl: false,
            });

            window.L.tileLayer('https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png', {
              maxZoom: 19,
              attribution: '',
            }).addTo(newMap);

            setMap(newMap);

            // Add click event listener to the map
            newMap.on('click', (e) => {
              const { lat, lng } = e.latlng;
              // console.log('Map clicked at:', lat, lng); // Debugging log
              if (onMapClick) {
                onMapClick(lat, lng); // Pass latitude and longitude to the parent component
              }

              // Add a marker at the clicked location
              window.L.marker([lat, lng])
                .addTo(newMap)
                .bindPopup(`Latitude: ${lat.toFixed(6)}, Longitude: ${lng.toFixed(6)}`)
                .openPopup();
            });
          }
        },
        { enableHighAccuracy: true }
      );
    }
  }, [map, onMapClick]);

  return (
    <div
      id="map"
      style={{
        height: '300px',
        width: '100%',
        border: '1px solid #ccc',
        borderRadius: '8px',
      }}
    ></div>
  );
};

export default MapViewForEvent;