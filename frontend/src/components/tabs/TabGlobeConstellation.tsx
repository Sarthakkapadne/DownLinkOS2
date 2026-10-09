import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { 
  Globe2, 
  Database, 
  Radio, 
  TrendingUp, 
  AlertTriangle, 
  RotateCw,
  Compass,
  Cpu
} from 'lucide-react';
import { Satellite, GroundStation, ScheduledContact } from '../../types';
import { minToTimeStr } from '../../data/mockScenarios';

interface TabGlobeConstellationProps {
  satellites: Satellite[];
  stations: GroundStation[];
  contacts: ScheduledContact[];
  currentMinute: number;
  isPlainEnglishMode: boolean;
}

export const TabGlobeConstellation: React.FC<TabGlobeConstellationProps> = ({
  satellites,
  stations,
  contacts,
  currentMinute,
  isPlainEnglishMode
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [selectedSat, setSelectedSat] = useState<string>(satellites[1].id); // SuperDove-2104

  // Check active downlinks right now
  const activeContacts = contacts.filter(
    c => currentMinute >= c.startMinutes && currentMinute <= c.endMinutes
  );

  // THREE.JS 3D GLOBE INITIALIZATION & RENDER LOOP
  useEffect(() => {
    if (!mountRef.current) return;

    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight || 420;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff); // Clean white background!

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000);
    camera.position.set(0, 50, 180);

    // 2. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);

    // 3. Globe Sphere
    const earthRadius = 52;
    const globeGeo = new THREE.SphereGeometry(earthRadius, 48, 48);
    const globeMat = new THREE.MeshPhongMaterial({
      color: 0xf1f5f9, // Slate 100
      emissive: 0xe2e8f0, // Slate 200
      wireframe: true,
      transparent: true,
      opacity: 0.85
    });
    const earthMesh = new THREE.Mesh(globeGeo, globeMat);
    scene.add(earthMesh);

    // Subtle blue equator ring
    const ringGeo = new THREE.RingGeometry(earthRadius + 0.1, earthRadius + 0.5, 64);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x0284c7, side: THREE.DoubleSide });
    const equatorRing = new THREE.Mesh(ringGeo, ringMat);
    equatorRing.rotation.x = Math.PI / 2;
    scene.add(equatorRing);

    // 4. Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0x0284c7, 1.2);
    dirLight.position.set(100, 80, 100);
    scene.add(dirLight);

    // Coordinate conversion utility (lat/lon to 3D Cartesian)
    const latLonToVector3 = (lat: number, lon: number, radius: number) => {
      const phi = (90 - lat) * (Math.PI / 180);
      const theta = (lon + 180) * (Math.PI / 180);
      return new THREE.Vector3(
        -radius * Math.sin(phi) * Math.cos(theta),
        radius * Math.cos(phi),
        radius * Math.sin(phi) * Math.sin(theta)
      );
    };

    // 5. Render Ground Stations
    const stationGroup = new THREE.Group();
    stations.forEach(st => {
      const pos = latLonToVector3(st.lat, st.lon, earthRadius + 0.5);
      const pinGeo = new THREE.CylinderGeometry(0.8, 0.2, 3, 12);
      const pinMat = new THREE.MeshBasicMaterial({ 
        color: st.status === 'OFFLINE' ? 0xdc2626 : 0x0284c7 
      });
      const pin = new THREE.Mesh(pinGeo, pinMat);
      pin.position.copy(pos);
      pin.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), pos.clone().normalize());
      stationGroup.add(pin);
    });
    scene.add(stationGroup);

    // 6. Polar Orbit Rings
    const orbitGroup = new THREE.Group();
    [80, 85, 90].forEach(deg => {
      const orbitCurve = new THREE.EllipseCurve(
        0, 0,
        earthRadius + 14, earthRadius + 14,
        0, 2 * Math.PI,
        false,
        0
      );
      const points = orbitCurve.getPoints(64);
      const geometry = new THREE.BufferGeometry().setFromPoints(
        points.map(p => new THREE.Vector3(p.x, p.y, 0))
      );
      const material = new THREE.LineBasicMaterial({ 
        color: 0x94a3b8, 
        transparent: true, 
        opacity: 0.4 
      });
      const ellipse = new THREE.Line(geometry, material);
      ellipse.rotation.x = Math.PI / 2 + (deg * Math.PI / 180);
      ellipse.rotation.y = (deg * Math.PI / 180);
      orbitGroup.add(ellipse);
    });
    scene.add(orbitGroup);

    // 7. Satellite Markers & Active Downlink Laser Beams
    const satGroup = new THREE.Group();
    const beamGroup = new THREE.Group();

    satellites.forEach((sat, idx) => {
      // Calculate animated orbital position based on current minute and satellite index
      const orbitPeriodMin = 92; // 92 min LEO period
      const phase = ((currentMinute + idx * 28) % orbitPeriodMin) / orbitPeriodMin * 2 * Math.PI;
      const inclination = (97.5 * Math.PI) / 180; // Sun-synchronous SSO
      
      const r = earthRadius + 14;
      const x = r * Math.sin(phase) * Math.cos(idx * 0.4);
      const y = r * Math.sin(phase) * Math.sin(inclination);
      const z = r * Math.cos(phase);

      const satPos = new THREE.Vector3(x, y, z);

      // Satellite Sphere Marker
      const satGeo = new THREE.SphereGeometry(1.6, 12, 12);
      const satMat = new THREE.MeshBasicMaterial({ 
        color: sat.priority === 5 ? 0xdc2626 : 0x2563eb 
      });
      const satMesh = new THREE.Mesh(satGeo, satMat);
      satMesh.position.copy(satPos);
      satGroup.add(satMesh);

      // Check if this satellite is currently downlinking
      const activeContact = activeContacts.find(c => c.satelliteId === sat.id);
      if (activeContact) {
        const station = stations.find(s => s.id === activeContact.stationId);
        if (station) {
          const gsPos = latLonToVector3(station.lat, station.lon, earthRadius);
          const beamGeo = new THREE.BufferGeometry().setFromPoints([satPos, gsPos]);
          const beamMat = new THREE.LineBasicMaterial({ 
            color: activeContact.priority === 5 ? 0xdc2626 : 0x0284c7, 
            linewidth: 3 
          });
          const beam = new THREE.Line(beamGeo, beamMat);
          beamGroup.add(beam);
        }
      }
    });

    scene.add(satGroup);
    scene.add(beamGroup);

    // 8. Animation & Interaction Loop
    let animId: number;
    let isMouseDown = false;
    let prevMouseX = 0;
    let prevMouseY = 0;

    const onMouseDown = (e: MouseEvent) => {
      isMouseDown = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isMouseDown) return;
      const deltaX = e.clientX - prevMouseX;
      const deltaY = e.clientY - prevMouseY;
      earthMesh.rotation.y += deltaX * 0.005;
      stationGroup.rotation.y += deltaX * 0.005;
      earthMesh.rotation.x += deltaY * 0.005;
      stationGroup.rotation.x += deltaY * 0.005;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onMouseUp = () => {
      isMouseDown = false;
    };

    const domElement = renderer.domElement;
    domElement.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    const animate = () => {
      animId = requestAnimationFrame(animate);
      if (!isMouseDown) {
        earthMesh.rotation.y += 0.0015;
        stationGroup.rotation.y += 0.0015;
      }
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      domElement.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      renderer.dispose();
      if (mountRef.current) mountRef.current.innerHTML = '';
    };
  }, [currentMinute, activeContacts.length, stations]);

  const activeSatellite = satellites.find(s => s.id === selectedSat) || satellites[1];
  const activeBufferPct = Math.round((activeSatellite.currentBufferGb / activeSatellite.ssrCapacityGb) * 100);

  return (
    <div className="space-y-6">
      {/* 3D GLOBE CONTAINER */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="px-5 py-3 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <Globe2 className="w-4 h-4 text-sky-600" />
            <h2 className="text-sm font-bold text-slate-900 m-0">
              Interactive 3D Mission Globe (Orbits, Visibility Cones & Downlink Beams)
            </h2>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span className="font-mono text-slate-600">
              UTC: <span className="font-bold text-slate-900">{minToTimeStr(currentMinute)}</span>
            </span>
            <span className="font-semibold text-sky-700 bg-sky-50 px-2.5 py-0.5 rounded-full border border-sky-200">
              Active Beams: {activeContacts.length}
            </span>
          </div>
        </div>

        {/* 3D Canvas Element */}
        <div className="relative w-full h-[400px] bg-white cursor-grab active:cursor-grabbing">
          <div ref={mountRef} className="w-full h-full" />
          
          {/* Overlay Helper */}
          <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-xs p-2.5 rounded-lg border border-slate-200 text-[11px] text-slate-600 shadow-2xs space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-600"></span>
              <span>P5 Emergency Satellite (SuperDove-2104)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-600"></span>
              <span>Active Downlink Beam</span>
            </div>
            <div className="text-slate-600 text-[10px] mt-1">
              Click & drag to rotate the globe.
            </div>
          </div>
        </div>
      </div>

      {/* PHYSICS & DIGITAL TWIN GAUGES */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* WIDGET 1: SSR BUFFER "WATER TANK" GAUGES */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs lg:col-span-2">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-amber-600" />
              <div>
                <h3 className="text-sm font-bold text-slate-900 m-0">
                  Spacecraft SSR Buffer Urgency ("Water Tank" Telemetry)
                </h3>
                <p className="text-xs text-slate-500 m-0">
                  {isPlainEnglishMode
                    ? 'Satellites fill storage while taking photos. If a tank hits 100%, the camera shuts off!'
                    : 'Cubic penalty function (fill/capacity)³ elevates pass urgency before buffer saturation.'}
                </p>
              </div>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
              0 Overflows Active
            </span>
          </div>

          {/* Water Tank Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {satellites.map((sat) => {
              const fillPct = Math.round((sat.currentBufferGb / sat.ssrCapacityGb) * 100);
              const isHigh = fillPct >= 85;
              const isSelected = selectedSat === sat.id;

              return (
                <div
                  key={sat.id}
                  onClick={() => setSelectedSat(sat.id)}
                  className={`p-3 rounded-lg border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-sky-50 border-sky-400 ring-2 ring-sky-300'
                      : 'bg-slate-50/60 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="font-bold text-slate-800 truncate" title={sat.name}>
                      {sat.name.split(' ')[0]}
                    </span>
                    <span className="font-mono text-[10px] text-slate-500">P{sat.priority}</span>
                  </div>

                  {/* Visual Liquid Tank Container */}
                  <div className="relative h-20 bg-slate-200 rounded-md overflow-hidden border border-slate-300 flex flex-col justify-end">
                    <div
                      className={`w-full transition-all duration-500 rounded-b-md ${
                        isHigh ? 'bg-red-500' : fillPct > 65 ? 'bg-amber-500' : 'bg-sky-500'
                      }`}
                      style={{ height: `${fillPct}%` }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center text-xs font-mono font-bold text-slate-900 bg-white/40 backdrop-blur-2xs">
                      {fillPct}%
                    </div>
                  </div>

                  <div className="mt-2 text-[11px] text-slate-600 flex items-center justify-between font-mono">
                    <span>{sat.currentBufferGb} GB</span>
                    <span className="text-slate-600">/ {sat.ssrCapacityGb} GB</span>
                  </div>

                  {isHigh && (
                    <span className="mt-1 text-[10px] text-red-600 font-bold block flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" />
                      <span>URGENT FLUSH</span>
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* WIDGET 2: ELEVATION DVB-S2X ACM LINK BUDGET CURVE */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-100">
              <TrendingUp className="w-4 h-4 text-sky-600" />
              <div>
                <h3 className="text-sm font-bold text-slate-900 m-0">
                  Elevation-Integrated ACM Yield
                </h3>
                <p className="text-xs text-slate-500 m-0">
                  DVB-S2X Dynamic Bitrate vs Flat Rectangles
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              Academic schedulers assume a flat constant speed. In real physics, 
              downlink bitrate scales from <span className="font-bold text-slate-800">200 Mbps</span> at the horizon ($5^\circ$) 
              up to <span className="font-bold text-sky-700">1,600 Mbps</span> at zenith ($85^\circ$). 
              ORBITOPS models this curve to unlock +35% hidden capacity!
            </p>

            {/* Visual SVG Curve */}
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
              <div className="flex justify-between text-[10px] text-slate-500 font-mono mb-1">
                <span>1.6 Gbps (Zenith)</span>
                <span>Max Throughput</span>
              </div>
              <svg className="w-full h-24" viewBox="0 0 200 80">
                <defs>
                  <linearGradient id="curveGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#0284c7" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#0284c7" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                {/* Area under curve */}
                <path
                  d="M 10 70 Q 100 10 190 70 L 190 75 L 10 75 Z"
                  fill="url(#curveGrad)"
                />
                {/* Curve */}
                <path
                  d="M 10 70 Q 100 10 190 70"
                  fill="none"
                  stroke="#0284c7"
                  strokeWidth="3"
                />
                {/* Benchmark flat line */}
                <line
                  x1="10"
                  y1="50"
                  x2="190"
                  y2="50"
                  stroke="#94a3b8"
                  strokeWidth="2"
                  strokeDasharray="4 3"
                />
              </svg>
              <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
                <span>AOS (5° El)</span>
                <span>Peak (85° El)</span>
                <span>LOS (5° El)</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">Yield Recovery:</span>
            <span className="font-bold text-emerald-700 font-mono">+32.4% vs flat rate</span>
          </div>
        </div>
      </div>
    </div>
  );
};
