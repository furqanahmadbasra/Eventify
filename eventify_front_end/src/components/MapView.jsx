import React, { useEffect, useState, useRef } from 'react';
import useEventFilterStore from '../store/useEventFilterStore';
import useEventStore from '../store/useEventStore'; // <-- ✅ Import your store
import useEventDetailStore from '../store/useEventDetailStore'; // Import the Zustand store

const MapView = () => {
    const filters = useEventFilterStore((state) => state.filters);
    const eventResults = useEventStore((state) => state.eventResults); // <-- ✅ Get eventResults
    const [map, setMap] = useState(null); // State to hold the map instance
    const { openPanel } = useEventDetailStore((state) => state); // Get the openPanel function from Zustand store
    const setFakeEventData = useEventStore((state) => state.setFakeEventData);

    const markersRef = useRef([]);


    useEffect(() => {
        // Set fake event data when component mounts
        setFakeEventData();
    }, [setFakeEventData]); // Add setFakeEventData as a dependency to ensure it runs only once

    useEffect(() => {
        // console.log("Event Results:", eventResults);
    }, [eventResults]);

    useEffect(() => {
        // console.log("Filters updated in B", filters);
        // console.log("Event Results", eventResults);
        // console.log("Geocoder loaded:", window.L.Control.Geocoder);

        if (window.L && window.L.Control && window.L.Control.Geocoder) {
            // Try to get the user's location
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const userLat = position.coords.latitude;
                    const userLng = position.coords.longitude;

                    // Initialize map only once
                    if (!map) {
                        const newMap = window.L.map('map', {
                            center: [userLat, userLng],
                            zoom: 13,
                            minZoom: 4,
                            zoomControl: false,
                            attributionControl: false
                        });

                        window.L.tileLayer('https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png', {
                            maxZoom: 19,
                            attribution: ''
                        }).addTo(newMap);

                        setMap(newMap); // Save map instance to state
                    }

                    // Prevent multiple geocoders
                    const existingGeocoder = document.querySelector('.leaflet-control-geocoder');

                    if (!existingGeocoder) {
                        const geocoderControl = window.L.Control.geocoder({
                            defaultMarkGeocode: true,
                        })
                            .on('markgeocode', function (e) {
                                const { center } = e.geocode;
                                map.setView(center, 13);
                                window.L.marker(center)
                                    .addTo(map)
                                    .bindPopup(e.geocode.name)
                                    .openPopup();
                            });

                        geocoderControl.addTo(map);
                    }


                    // Add user location marker
                    const userMarker = window.L.marker([userLat, userLng])
                        .addTo(map)
                        .bindPopup('You are here')
                        .openPopup();

                    userMarker.on('click', function () {
                        map.setView(userMarker.getLatLng(), 13);
                    });

                    // // Add geocoder
                    // window.L.Control.geocoder({
                    //     defaultMarkGeocode: true,
                    // })
                    //     .on('markgeocode', function (e) {
                    //         const { center } = e.geocode;
                    //         map.setView(center, 13);
                    //         window.L.marker(center)
                    //             .addTo(map)
                    //             .bindPopup(e.geocode.name)
                    //             .openPopup();
                    //     })
                    //     .addTo(map);

                    // // Loop over eventResults and add markers
                    // const bounds = [];
                    // eventResults.forEach((event) => {
                    //     if (event.latitude && event.longitude) {
                    //         console.log("Adding marker for event:", event);
                    //         const marker = window.L.marker([event.latitude, event.longitude])
                    //             .addTo(map)
                    //             .bindPopup(`<strong>${event.title}</strong><br/>${event.city}, ${event.country}`);

                    //         // Add click event to zoom in on the marker
                    //         marker.on('click', function () {
                    //             map.setView(marker.getLatLng(), 13); // Zoom to the marker
                    //             openPanel(event); // Open panel with event data
                    //         });

                    //         bounds.push([event.latitude, event.longitude]);
                    //     }
                    // });


                    // Remove existing markers from the map
                    markersRef.current.forEach((marker) => {
                        map.removeLayer(marker);
                    });
                    markersRef.current = []; // Clear the array


                    const bounds = [];
                    const locationGroups = {};

                    // Step 1: Group events by their lat/lng
                    eventResults.forEach((event) => {
                        if (event.latitude && event.longitude) {
                            const key = `${event.latitude},${event.longitude}`;
                            if (!locationGroups[key]) {
                                locationGroups[key] = [];
                            }
                            locationGroups[key].push(event);
                        }
                    });

                    // Step 2: Place ONE marker per location
                    Object.entries(locationGroups).forEach(([key, eventsAtLocation]) => {
                        const [lat, lng] = key.split(',').map(Number);

                        const marker = window.L.marker([lat, lng])
                            .addTo(map)
                            .bindPopup(() => {
                                return `
                <div style="min-width: 150px;">
                    <h4>${eventsAtLocation.length} Event${eventsAtLocation.length > 1 ? 's' : ''}</h4>
                    <ul style="padding-left: 16px; margin: 0;">
                        ${eventsAtLocation.map(event => `<li style="margin-bottom: 4px;">${event.title}</li>`).join('')}
                    </ul>
                </div>
            `;
                            });

                        marker.on('click', function () {
                            map.setView(marker.getLatLng(), 13); // Zoom to the marker
                            openPanel(eventsAtLocation); // ⚡ Pass all events at this location
                            // console.log("the events at that locations are ", eventsAtLocation)
                        });

                        // ✅ Save marker to ref
                        markersRef.current.push(marker);
                        bounds.push([lat, lng]);
                    });


                    // Fit map to all markers if there are any
                    if (bounds.length > 0) {
                        map.fitBounds(bounds, { padding: [50, 50] });
                    }

                },
                (error) => {
                    console.error("Geolocation error:", error.message);
                    alert("Could not get your location. Using default location.");
                    // fallback: use default location
                    // [Use your old code with static location here if needed]
                },
                { enableHighAccuracy: true }
            );
        }
    }, [filters, eventResults, map, openPanel]); // Add map as a dependency to avoid re-initializing the map

    return (
        <div
            id="map"
            style={{
                height: '649px',
                width: '100%',
            }}
        ></div>
    );
};

export default MapView;
