"use client"

import { Suspense, useRef } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, Environment, ContactShadows, useGLTF, Center, Float } from "@react-three/drei"
import type * as THREE from "three"

// 3D Model Component
function Model3D({ url }: { url: string }) {
  const modelRef = useRef<THREE.Group>(null)

  // Load the GLTF model
  const { scene } = useGLTF(url)

  // Animate the model
  useFrame((state) => {
    if (modelRef.current) {
      modelRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.1
      modelRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1
    }
  })

  return (
    <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.5}>
      <Center>
        <primitive ref={modelRef} object={scene} scale={[0.5, 0.5, 0.5]} position={[0, 0, 0]} />
      </Center>
    </Float>
  )
}

// Fallback 3D Object (Dragon-like shape) - Properly sized to fit container
function DefaultModel() {
  const meshRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.1
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1
    }
  })

  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.4}>
      <group ref={meshRef} position={[0, 0, 0]} scale={[0.4, 0.4, 0.4]}>
        {/* Main body */}
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[1, 32, 32]} />
          <meshStandardMaterial
            color="#2563EB"
            metalness={0.7}
            roughness={0.3}
            emissive="#1E40AF"
            emissiveIntensity={0.1}
          />
        </mesh>

        {/* Wings */}
        <mesh position={[-1.2, 0.4, 0]} rotation={[0, 0, Math.PI / 6]}>
          <coneGeometry args={[0.6, 1.5, 8]} />
          <meshStandardMaterial color="#3B82F6" metalness={0.8} roughness={0.2} transparent opacity={0.8} />
        </mesh>

        <mesh position={[1.2, 0.4, 0]} rotation={[0, 0, -Math.PI / 6]}>
          <coneGeometry args={[0.6, 1.5, 8]} />
          <meshStandardMaterial color="#3B82F6" metalness={0.8} roughness={0.2} transparent opacity={0.8} />
        </mesh>

        {/* Tail */}
        <mesh position={[0, -0.4, -1.2]} rotation={[Math.PI / 4, 0, 0]}>
          <cylinderGeometry args={[0.25, 0.08, 1.2, 8]} />
          <meshStandardMaterial color="#1D4ED8" metalness={0.6} roughness={0.4} />
        </mesh>

        {/* Head/Neck */}
        <mesh position={[0, 0.6, 0.8]} rotation={[Math.PI / 8, 0, 0]}>
          <cylinderGeometry args={[0.3, 0.5, 0.8, 8]} />
          <meshStandardMaterial color="#1E40AF" metalness={0.7} roughness={0.3} />
        </mesh>

        {/* Eyes */}
        <mesh position={[-0.15, 0.8, 1.1]}>
          <sphereGeometry args={[0.05, 8, 8]} />
          <meshStandardMaterial color="#FBBF24" emissive="#F59E0B" emissiveIntensity={0.5} />
        </mesh>
        <mesh position={[0.15, 0.8, 1.1]}>
          <sphereGeometry args={[0.05, 8, 8]} />
          <meshStandardMaterial color="#FBBF24" emissive="#F59E0B" emissiveIntensity={0.5} />
        </mesh>
      </group>
    </Float>
  )
}

// Loading component
function Loader() {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-white text-lg animate-pulse">Loading 3D Model...</div>
    </div>
  )
}

interface Scene3DProps {
  modelUrl?: string
  className?: string
}

export function Scene3D({ modelUrl, className = "" }: Scene3DProps) {
  return (
    <div className={`w-full h-full ${className}`}>
      <Canvas
        camera={{
          position: [6, 3, 8], // Moved camera much further back
          fov: 45, // Reduced field of view for better fit
          near: 0.1,
          far: 1000,
        }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
        style={{ background: "transparent" }}
      >
        {/* Camera Controls - Adjusted for proper viewing distance */}
        <OrbitControls
          enablePan={false}
          enableZoom={true}
          enableRotate={true}
          autoRotate={true}
          autoRotateSpeed={0.8}
          minDistance={5} // Minimum distance to keep model in view
          maxDistance={15} // Maximum distance
          minPolarAngle={Math.PI / 6}
          maxPolarAngle={Math.PI - Math.PI / 6}
          target={[0, 0, 0]}
        />

        {/* Lighting Setup */}
        <ambientLight intensity={0.4} />

        {/* Main directional light */}
        <directionalLight
          position={[5, 8, 5]}
          intensity={1}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
          shadow-camera-far={30}
          shadow-camera-left={-8}
          shadow-camera-right={8}
          shadow-camera-top={8}
          shadow-camera-bottom={-8}
        />

        {/* Accent lights */}
        <pointLight position={[-4, 3, -4]} intensity={0.5} color="#60A5FA" />
        <pointLight position={[4, -2, 4]} intensity={0.3} color="#A78BFA" />
        <spotLight position={[0, 8, 0]} intensity={0.4} angle={0.5} penumbra={1} color="#FBBF24" />

        {/* Environment */}
        <Environment preset="night" />

        {/* 3D Model */}
        <Suspense fallback={<Loader />}>{modelUrl ? <Model3D url={modelUrl} /> : <DefaultModel />}</Suspense>

        {/* Ground Shadow */}
        <ContactShadows position={[0, -2.5, 0]} opacity={0.25} scale={12} blur={2.5} far={6} resolution={256} />
      </Canvas>
    </div>
  )
}

// Preload the default model
useGLTF.preload("/models/solar_system_animation.glb")
