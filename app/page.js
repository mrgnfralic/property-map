"use client"

import dynamic from 'next/dynamic';
import './globals.css';
import 'leaflet/dist/leaflet.css';

const Map = dynamic(() => import('/components/Map'), { ssr: false });

export default function Home() {
    return (
        <div>
            <h1>Property Map</h1>
            <Map />
        </div>
    );
}
