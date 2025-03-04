import { useEffect } from 'react';
import L from 'leaflet';

export default function MapComponent() {
    useEffect(() => {
        if (!L.DomUtil.get('map')._leaflet_id) {
            const map = L.map('map').setView([44.388067, -79.691817], 12);

            L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 12,
                attribution: '&copy; OpenStreetMap'
            }).addTo(map);

            // Define a custom icon
            const customIcon = L.icon({
                iconUrl: '/location-pin.png',
                iconSize: [30, 30],
                iconAnchor: [15, 30],
                popupAnchor: [0, -30]
            });

            // Fetch properties from API and add markers
            async function populateMap() {
                try {
                    const response = await fetch('/api/notion');
                    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

                    const data = await response.json();
                    console.log("Fetched Properties:", data);

                    if (!data.results || data.results.length === 0) {
                        console.warn("No properties found.");
                        return;
                    }

                    data.results.forEach(property => {
                        const latitude = property.properties?.Latitude?.number;
                        const longitude = property.properties?.Longitude?.number;
                        const address = property.properties?.Address?.title?.[0]?.text?.content;
                        const area = property.properties?.Area?.select?.name || "Unknown Area"; // ✅ Include Area property
                        const details = property.properties?.Details?.rich_text?.[0]?.text?.content || "No details available";
                        const bath = property.properties?.Bath?.select?.name || "Not specified"; 
                        const bed = property.properties?.Bed?.select?.name || "Not specified"; 

                        if (!latitude || !longitude || !address) {
                            console.warn("Skipping invalid property:", property);
                            return;
                        }

                        L.marker([latitude, longitude], { icon: customIcon })
                            .addTo(map)
                            .bindPopup(`
                                <b>${address}</b><br>
                                <b>Area:</b> ${area}<br>  <!-- ✅ Display Area -->
                                <b>Bath:</b> ${bath}<br>
                                <b>Bed:</b> ${bed}<br>
                                <p>${details}</p>
                            `);
                    });

                } catch (error) {
                    console.error('Error fetching or processing data:', error);
                }
            }

            populateMap();
        }
    }, []);

    return <div id="map"></div>;
}