import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import Globe from 'react-globe.gl';
import * as THREE from 'three';

const famousThings = {
    "United States of America": "Statue of Liberty, Grand Canyon, Hollywood",
    "China": "Great Wall of China, Forbidden City",
    "India": "Taj Mahal, Golden Temple, Rich Culture",
    "Japan": "Mount Fuji, Sushi, Cherry Blossoms",
    "France": "Eiffel Tower, Louvre Museum, Wine",
    "Italy": "Colosseum, Pasta, Leaning Tower of Pisa",
    "Brazil": "Christ the Redeemer, Amazon Rainforest, Carnival",
    "Egypt": "Pyramids of Giza, Sphinx, Nile River",
    "Australia": "Sydney Opera House, Great Barrier Reef, Kangaroos",
    "United Kingdom": "Big Ben, Stonehenge, London Eye",
    "Russia": "Red Square, Hermitage Museum",
    "Canada": "Niagara Falls, CN Tower, Maple Syrup",
    "Mexico": "Chichen Itza, Tacos, Day of the Dead",
    "Spain": "Sagrada Familia, Paella, Flamenco",
    "Argentina": "Tango, Iguazu Falls",
    "South Africa": "Kruger National Park, Table Mountain",
    "Germany": "Brandenburg Gate, Oktoberfest",
    "Turkey": "Hagia Sophia, Hot Air Balloons in Cappadocia",
    "Greece": "Acropolis of Athens, Santorini",
    "Thailand": "Grand Palace, Phi Phi Islands, Pad Thai",
    "Switzerland": "Swiss Alps, Chocolate, Watches"
};

const ThreeDBackground = () => {
    const globeRef = useRef();
    const location = useLocation();
    const [countries, setCountries] = useState({ features: [] });
    // Keep track of which country is hovered
    const [hoverD, setHoverD] = useState(null);
    // Keep track of the user's mouse pointer for the arrow SVG drawing
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [uiLoaded, setUiLoaded] = useState(false);

    const isDeepDive = location.pathname.includes('/product') || location.pathname.includes('/checkout') || location.pathname.includes('/health') || location.pathname.includes('/admin');

    useEffect(() => {
        const timer = setTimeout(() => setUiLoaded(true), 1500); // Lazy Load high-res textures
        // Load the country outlines polygons
        fetch('https://raw.githubusercontent.com/vasturiano/react-globe.gl/master/example/datasets/ne_110m_admin_0_countries.geojson')
            .then(res => res.json())
            .then(setCountries);

        // We'll capture the mouse position globally to draw the pointer line
        const handleMouseMove = (e) => {
            setMousePos({ x: e.clientX, y: e.clientY });
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    useEffect(() => {
        if (!globeRef.current) return;
        const globe = globeRef.current;
        const scene = globe.scene();

        // Earth's Axial Tilt removed - rotating the top-level scene breaks globe.gl internal raycaster matrix!

        // --- 1. Deep Space Skybox Background ---
        const textureLoader = new THREE.TextureLoader();
        scene.background = textureLoader.load('//unpkg.com/three-globe/example/img/night-sky.png');

        // --- Background Space Particles (Enhancing Starfield) ---
        const isMobile = window.innerWidth <= 768;
        const count = isMobile ? 200 : 2000;
        const positions = new Float32Array(count * 3);
        const colors = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 800;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 800;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 800;
            const starBrightness = Math.random() * 0.5 + 0.5;
            colors[i * 3] = starBrightness;
            colors[i * 3 + 1] = starBrightness;
            colors[i * 3 + 2] = starBrightness;
        }

        const canvas = document.createElement('canvas');
        canvas.width = 64; canvas.height = 64;
        const context = canvas.getContext('2d');
        context.beginPath();
        context.arc(32, 32, 30, 0, 2 * Math.PI, false);
        context.fillStyle = 'white';
        context.fill();
        const texture = new THREE.CanvasTexture(canvas);

        const particlesGeometry = new THREE.BufferGeometry();
        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        const particlesMaterial = new THREE.PointsMaterial({
            size: 1.5,
            vertexColors: true,
            transparent: true,
            opacity: 0.8,
            map: texture,
            alphaTest: 0.1
        });
        const particles = new THREE.Points(particlesGeometry, particlesMaterial);
        // Turn off raycasting for particles so they don't block hovering
        particles.raycast = () => { };
        scene.add(particles);

        // --- 1B. Immersive Cloud Layer Wrapper ---
        const cloudGeometry = new THREE.SphereGeometry(101, 64, 64); // Slightly larger than globe (radius 100)
        const cloudMaterial = new THREE.MeshPhongMaterial({
            map: textureLoader.load('/images/clouds.png'),
            transparent: true,
            opacity: 0.6,
            blending: THREE.AdditiveBlending,
            side: THREE.DoubleSide,
            depthWrite: false
        });
        const clouds = new THREE.Mesh(cloudGeometry, cloudMaterial);
        // Turn off raycasting for clouds so the user can hover the actual earth polygons through them!
        clouds.raycast = () => { };
        scene.add(clouds);

        // --- 2. Orbiting Moon ---
        const moonGeometry = new THREE.SphereGeometry(6, 32, 32);
        const moonMaterial = new THREE.MeshStandardMaterial({
            map: textureLoader.load('/images/moon.jpg'),
            roughness: 0.8,
            metalness: 0.1,
            color: '#e0e0e0',
            emissive: '#222222'
        });
        const moon = new THREE.Mesh(moonGeometry, moonMaterial);
        // Turn off raycasting for the moon as well
        moon.raycast = () => { };
        scene.add(moon);

        // Add a light emitting from the moon to give physical glow
        const moonLight = new THREE.PointLight('#ffffff', 0.8, 300);
        scene.add(moonLight);

        // Enhance global lighting for a realistic earth
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
        scene.add(ambientLight);
        const directionalLight = new THREE.DirectionalLight(0xffffff, 3.0);
        directionalLight.position.set(200, 100, 150);
        scene.add(directionalLight);

        // --- Window Resize Listener for Responsiveness ---
        const handleResize = () => {
            if (globeRef.current && globeRef.current.camera()) {
                globeRef.current.camera().aspect = window.innerWidth / window.innerHeight;
                globeRef.current.camera().updateProjectionMatrix();
                globeRef.current.renderer().setSize(window.innerWidth, window.innerHeight);
            }
        };
        window.addEventListener('resize', handleResize);

        // --- 3. Animation Loop ---
        let animationFrameId;
        const animate = () => {
            const time = Date.now() * 0.001;

            // Earth slowly rotates on its axis naturally via globe.controls().autoRotate, 
            // but we can also rotate the independent cloud layer slightly faster
            if (!isMobile) {
                clouds.rotation.y += 0.0008;
            }

            // Revolve the moon around the earth
            const orbitRadius = 180; // Proportional distance
            moon.position.x = Math.cos(time * 0.2) * orbitRadius;
            moon.position.z = Math.sin(time * 0.2) * orbitRadius;
            moon.position.y = Math.sin(time * 0.15) * 40;
            // The moon has its own rotation 
            moon.rotation.y += 0.008;

            moonLight.position.copy(moon.position);

            particles.rotation.y += 0.0002;
            particles.rotation.x += 0.0001;

            animationFrameId = requestAnimationFrame(animate);
        };
        animate();

        // Control the globe (OrbitControls built into Globe.gl)
        globe.controls().autoRotate = true;
        globe.controls().autoRotateSpeed = 0.5;
        // Constrain the camera so users don't get lost in space
        globe.controls().minDistance = 140; // Don't zoom through the earth
        globe.controls().maxDistance = 450; // Don't pan infinitely out
        globe.controls().enablePan = false; // Prevent shifting off center

        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener('resize', handleResize);
            scene.background = null;
            scene.remove(particles);
            scene.remove(clouds);
            scene.remove(moon);
            scene.remove(moonLight);
            scene.remove(ambientLight);
            scene.remove(directionalLight);
            particlesGeometry.dispose();
            cloudGeometry.dispose();
            moonGeometry.dispose();
            particlesMaterial.dispose();
            cloudMaterial.dispose();
            moonMaterial.dispose();
            texture.dispose();
        };
    }, []);

    // Configuration for the left info box
    const boxWidth = 320;
    const boxHeight = 150;
    const boxX = 30; // 30px from left edge
    // Use an approximate vertical center fallback, assuming full screen
    const boxY = typeof window !== 'undefined' ? window.innerHeight / 2 - boxHeight / 2 : 300;

    // We only render our arrow line if there is a hovered country 
    // and our mouse has moved successfully
    const showLines = hoverD && mousePos.x !== 0;

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
            zIndex: -2, pointerEvents: 'auto',
            transition: 'opacity 1s ease, filter 1s ease',
            opacity: isDeepDive ? 0.15 : 1,
            filter: isDeepDive ? 'brightness(0.3) blur(5px)' : 'none',
            background: isDeepDive ? 'linear-gradient(to bottom, #0f172a, #000000)' : 'transparent'
        }}>
            <Globe
                ref={globeRef}
                backgroundColor="rgba(0,0,0,0)" // Keep it transparent so particles/skybox show
                // Switch to REAL EARTH Daytime "Blue Marble" view
                globeImageUrl={uiLoaded ? "//unpkg.com/three-globe/example/img/earth-blue-marble.jpg" : ""}
                bumpImageUrl={uiLoaded ? "//unpkg.com/three-globe/example/img/earth-topology.png" : ""}

                polygonsData={countries.features}
                // When hover, elevate that country slightly
                polygonAltitude={d => d === hoverD ? 0.08 : 0.01}
                // Make non-hovered transparent, hovered bright white glass
                polygonCapColor={d => d === hoverD ? 'rgba(255, 255, 255, 0.4)' : 'rgba(255, 255, 255, 0)'}
                polygonSideColor={() => 'rgba(255, 255, 255, 0.2)'}
                polygonStrokeColor={() => 'rgba(255, 255, 255, 0.3)'}

                onPolygonHover={(polygon) => {
                    setHoverD(polygon);
                }}
                polygonsTransitionDuration={400}
                // Suppress the default hover tooltip by returning empty string!
                polygonLabel={() => ''}
            />

            {/* The interactive animated SVG arrow/line connecting box to mouse cursor */}
            <svg style={{ position: 'absolute', top: 0, left: 0, width: '100vw', height: '100vh', pointerEvents: 'none', zIndex: 1000 }}>
                {showLines && (
                    <path
                        // Draw a quadratic bezier curve pointing to cursor
                        d={`M ${boxX + boxWidth} ${boxY + boxHeight / 2} Q ${(boxX + boxWidth + mousePos.x) / 2} ${mousePos.y} ${mousePos.x} ${mousePos.y}`}
                        fill="none"
                        stroke="rgba(255, 255, 255, 0.8)"
                        strokeWidth="2.5"
                        strokeDasharray="8,6"
                        style={{ filter: 'drop-shadow(0 0 4px rgba(0,0,0,0.8))' }}
                    />
                )}
                {/* Visual circle dot right at the end of pointer */}
                {showLines && (
                    <circle cx={mousePos.x} cy={mousePos.y} r="6" fill="#fff" stroke="#3b82f6" strokeWidth="2" style={{ filter: 'drop-shadow(0 0 5px rgba(0,0,0,0.5))' }} />
                )}
            </svg>

            {/* Premium Left-Side Information Box */}
            <div style={{
                position: 'absolute',
                left: `${boxX}px`,
                top: `${boxY}px`,
                width: `${boxWidth}px`,
                zIndex: 1000,
                background: 'rgba(15, 23, 42, 0.80)',
                backdropFilter: 'blur(16px)',
                borderRadius: '20px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                padding: '24px',
                color: 'white',
                boxShadow: '0 15px 35px rgba(0,0,0,0.5)',
                transition: 'opacity 0.4s ease, transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                // Hide off-screen when nothing is hovered
                opacity: hoverD ? 1 : 0,
                transform: hoverD ? 'translateX(0) scale(1)' : 'translateX(-40px) scale(0.95)',
                pointerEvents: 'none', // Allow passing mouse events directly to globe behind it
                fontFamily: "'Outfit', 'Inter', sans-serif"
            }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    marginBottom: '15px',
                    borderBottom: '1px solid rgba(255,255,255,0.1)',
                    paddingBottom: '12px'
                }}>
                    <span style={{ fontSize: '28px', marginRight: '12px' }}>📍</span>
                    <h3 style={{ margin: 0, fontSize: '1.4rem', color: '#60a5fa', fontWeight: '800' }}>
                        {hoverD ? hoverD.properties.ADMIN : 'Select a Location'}
                    </h3>
                </div>

                <div style={{ marginBottom: '12px' }}>
                    <strong style={{ color: '#94a3b8', fontSize: '0.80rem', textTransform: 'uppercase', letterSpacing: '1.5px', display: 'block' }}>Famous For</strong>
                    <div style={{ marginTop: '6px', fontSize: '1.05rem', lineHeight: '1.5', color: '#f8fafc' }}>
                        {/* Fallback procedural string for missing countries */}
                        {hoverD ? (famousThings[hoverD.properties.ADMIN] || 'Rich scenic landscapes, historical heritage, and vibrant cultural traditions.') : ''}
                    </div>
                </div>

                <div>
                    <strong style={{ color: '#94a3b8', fontSize: '0.80rem', textTransform: 'uppercase', letterSpacing: '1.5px', display: 'block' }}>Population</strong>
                    <div style={{ marginTop: '4px', fontSize: '1.1rem', fontWeight: 'bold', color: '#34d399' }}>
                        {hoverD ? `${Math.round(+hoverD.properties.POP_EST / 1e4) / 1e2} Million` : ''}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ThreeDBackground;
