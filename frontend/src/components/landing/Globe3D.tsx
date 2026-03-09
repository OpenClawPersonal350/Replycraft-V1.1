import { useRef, useMemo } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { Sphere, OrbitControls } from "@react-three/drei";
import * as THREE from "three";

function latLngToVec3(lat: number, lng: number, radius: number): [number, number, number] {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  return [
    -(radius * Math.sin(phi) * Math.cos(theta)),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta),
  ];
}

const cities = [
  { lat: 40.7, lng: -74.0 }, { lat: 51.5, lng: -0.1 }, { lat: 35.7, lng: 139.7 },
  { lat: -33.9, lng: 151.2 }, { lat: 25.2, lng: 55.3 }, { lat: -23.5, lng: -46.6 },
  { lat: 19.1, lng: 72.9 }, { lat: 48.9, lng: 2.3 }, { lat: 1.3, lng: 103.8 },
  { lat: 34.1, lng: -118.2 }, { lat: 30.0, lng: 31.2 }, { lat: 55.8, lng: 37.6 },
];

const connections: [number, number][] = [
  [0, 1], [1, 7], [7, 11], [11, 4], [4, 6],
  [6, 8], [8, 2], [2, 3], [0, 5], [5, 3],
  [1, 4], [0, 9], [4, 10], [10, 6],
];

function ConnectionArc({ from, to, delay }: { from: [number, number, number]; to: [number, number, number]; delay: number }) {
  const tubeRef = useRef<THREE.Mesh>(null);

  const geometry = useMemo(() => {
    const fromVec = new THREE.Vector3(...from);
    const toVec = new THREE.Vector3(...to);
    const dist = fromVec.distanceTo(toVec);
    const mid = new THREE.Vector3()
      .addVectors(fromVec, toVec)
      .multiplyScalar(0.5)
      .normalize()
      .multiplyScalar(2 + dist * 0.35);
    const curve = new THREE.QuadraticBezierCurve3(fromVec, mid, toVec);
    return new THREE.TubeGeometry(curve, 44, 0.012, 6, false);
  }, [from, to]);

  useFrame((state) => {
    if (tubeRef.current) {
      const t = state.clock.getElapsedTime();
      const cycle = ((t - delay) % 5) / 5;
      const mat = tubeRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = cycle > 0 && cycle < 0.5 ? 0.5 * Math.sin((cycle / 0.5) * Math.PI) : 0;
    }
  });

  return (
    <mesh ref={tubeRef} geometry={geometry}>
      <meshBasicMaterial color="#6366f1" transparent opacity={0} />
    </mesh>
  );
}

function EarthWithArcs() {
  const groupRef = useRef<THREE.Group>(null);
  const texture = useLoader(THREE.TextureLoader, "/images/earth-texture.jpg");

  const earthMaterial = useMemo(() => new THREE.MeshPhongMaterial({
    map: texture, specular: new THREE.Color("#334466"), shininess: 15,
  }), [texture]);

  const positions = useMemo(() => cities.map((c) => latLngToVec3(c.lat, c.lng, 2.01)), []);

  useFrame((_, delta) => {
    if (groupRef.current) groupRef.current.rotation.y += delta * 0.1;
  });

  return (
    <group ref={groupRef}>
      <Sphere args={[2, 64, 64]} material={earthMaterial} />
      {connections.map(([a, b], i) => (
        <ConnectionArc key={i} from={positions[a]} to={positions[b]} delay={i * 0.6} />
      ))}
    </group>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 3, 5]} intensity={1.2} />
      <directionalLight position={[-3, -1, -3]} intensity={0.3} color="#4da6ff" />
      <EarthWithArcs />
      <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.4}
        minPolarAngle={Math.PI / 3} maxPolarAngle={(2 * Math.PI) / 3} />
    </>
  );
}

export function Globe3D() {
  return (
    <div className="w-full h-full">
      <Canvas camera={{ position: [0, 0, 5.5], fov: 45 }} dpr={[1, 2]}>
        <Scene />
      </Canvas>
    </div>
  );
}
