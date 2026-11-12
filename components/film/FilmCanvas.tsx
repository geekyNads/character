"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer, MeshReflectorMaterial } from "@react-three/drei";
import { Bloom, EffectComposer, Noise, Vignette } from "@react-three/postprocessing";
import type { BloomEffect } from "postprocessing";
import { Suspense, useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { PISTOL_SIZE, Pistol } from "./models";
import { filmState as S, flash } from "./timeline";

const FOV = 24;
const FLOOR_Y = -0.09;
/** Muzzle in model space (barrel along +x, centred on the bounding box). */
const MUZZLE = new THREE.Vector3(PISTOL_SIZE.len / 2 + 0.004, 0.038, 0);

const ease = (t: number) => t * t * (3 - 2 * t);
const lerp = THREE.MathUtils.lerp;

export type FilmCanvasProps = { lite: boolean; active: boolean; still?: boolean };

export default function FilmCanvas({ lite, active, still }: FilmCanvasProps) {
  return (
    <Canvas
      dpr={lite ? [1, 1.25] : [1, 1.75]}
      frameloop={still ? "demand" : active ? "always" : "never"}
      gl={{ antialias: false, powerPreference: "high-performance", alpha: false }}
      camera={{ fov: FOV, near: 0.01, far: 30, position: [0, 0, 1] }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.05;
      }}
    >
      <color attach="background" args={["#050505"]} />
      <fogExp2 attach="fog" args={["#050505", 0.9]} />
      <Stage lite={lite} still={still} />
      <Post lite={lite} />
    </Canvas>
  );
}

function Post({ lite }: { lite: boolean }) {
  const bloom = useRef<BloomEffect>(null);
  useFrame(() => {
    if (bloom.current) bloom.current.intensity = 0.7 + 3.2 * flash.value(performance.now());
  });
  return (
    <EffectComposer multisampling={lite ? 0 : 4}>
      <Bloom ref={bloom} mipmapBlur luminanceThreshold={0.9} luminanceSmoothing={0.2} intensity={0.7} />
      <Noise opacity={0.035} premultiply />
      <Vignette darkness={0.72} offset={0.28} />
    </EffectComposer>
  );
}

function Stage({ lite, still }: { lite: boolean; still?: boolean }) {
  const { size, scene, invalidate } = useThree();
  const spot = useRef<THREE.SpotLight>(null);
  const rim = useRef<THREE.SpotLight>(null);
  const fill = useRef<THREE.DirectionalLight>(null);
  const arrival = useRef<THREE.SpotLight>(null);
  const muzzleLight = useRef<THREE.PointLight>(null);
  const muzzleGlow = useRef<THREE.Mesh>(null);
  const kick = useRef<THREE.Group>(null);
  const spotTarget = useMemo(() => new THREE.Object3D(), []);

  useEffect(() => {
    if (spot.current) spot.current.target = spotTarget;
    if (still) {
      // Reduced motion: one well-lit three-quarter frame, no scrubbed camera, no flash.
      Object.assign(S.pistol, { dolly: 1, sweep: 1, spot: 1, fill: 1, rim: 0.25 });
      S.orbit = 0.6;
      S.arrive = 0.35;
      invalidate();
    }
  }, [spotTarget, still, invalidate]);

  useFrame((state) => {
    const now = performance.now();
    const t = state.clock.elapsedTime;
    const camera = state.camera as THREE.PerspectiveCamera;
    const p = S.pistol;
    const aspect = size.width / size.height;
    const tan = Math.tan(THREE.MathUtils.degToRad(FOV / 2));

    // Framing: the pistol spans ~62% of the narrower view; the reveal starts 3.2× further out.
    const dEnd = Math.max(PISTOL_SIZE.len / (0.62 * 2 * tan * Math.min(aspect, 1.6)), PISTOL_SIZE.h / (0.55 * 2 * tan));
    const k = ease(p.dolly);
    const d = dEnd * 3.2 * Math.pow(1 / 3.2, k) * (1 + 1.6 * ease(S.pull));
    // Azimuth from the side profile (0) towards the muzzle (+): creep 48→24°, then orbit to 62°.
    const az = THREE.MathUtils.degToRad(lerp(lerp(48, 24, k), 62, ease(S.orbit)));
    const el = THREE.MathUtils.degToRad(lerp(lerp(20, 9, k), 5, ease(S.orbit)) + 8 * ease(S.pull));
    camera.position.set(Math.sin(az) * Math.cos(el) * d, Math.sin(el) * d, Math.cos(az) * Math.cos(el) * d);
    camera.lookAt(lerp(0.02, 0.03, ease(S.orbit)), 0, 0);
    if (!lite && !still) {
      camera.rotateX(0.0026 * Math.sin(t * 1.26)); // ±0.15° handheld
      camera.rotateY(0.0026 * Math.sin(t * 1.1 + 2));
    }

    // Spotlight sweeps muzzle → slide → grip; at full reveal it widens and a soft fill comes up.
    spotTarget.position.set(lerp(0.11, -0.05, ease(p.sweep)), lerp(0.012, -0.035, ease(p.sweep)), 0);
    const key = S.key;
    if (spot.current) {
      spot.current.intensity = 7 * p.spot * key;
      spot.current.angle = lerp(0.12, 0.42, p.fill);
    }
    if (rim.current) rim.current.intensity = 30 * p.rim * Math.max(key, 0.4);
    if (fill.current) fill.current.intensity = 0.08 * p.fill * key;
    if (arrival.current) arrival.current.intensity = 45 * S.arrive;
    scene.environmentIntensity = (0.01 + 0.3 * p.spot * (0.25 + 0.75 * p.fill)) * key;

    // The shot: muzzle flash, light thrown on the floor, recoil lifts the muzzle.
    const f = flash.value(now);
    const r = flash.recoil(now);
    if (muzzleLight.current) muzzleLight.current.intensity = 4 * f;
    if (muzzleGlow.current) {
      muzzleGlow.current.visible = f > 0.01;
      muzzleGlow.current.scale.setScalar(0.6 + 0.8 * f);
      (muzzleGlow.current.material as THREE.MeshBasicMaterial).opacity = f;
    }
    if (kick.current) {
      kick.current.rotation.z = 0.14 * r;
      kick.current.position.x = -0.006 * r;
    }
  });

  return (
    <>
      <Environment resolution={128} frames={1}>
        <Lightformer form="rect" intensity={4} position={[0, 2, 1.2]} scale={[3, 0.25, 1]} target={[0, 0, 0]} />
        <Lightformer form="rect" intensity={2} position={[-2, 0.5, -1.5]} scale={[0.2, 2, 1]} target={[0, 0, 0]} />
      </Environment>
      <primitive object={spotTarget} />
      <spotLight ref={spot} position={[0.05, 0.55, 0.42]} angle={0.12} penumbra={0.6} decay={2} intensity={0} />
      <spotLight ref={rim} position={[-0.25, 0.32, -0.55]} angle={0.5} penumbra={1} decay={2} intensity={3} />
      <directionalLight ref={fill} position={[0.6, 0.4, 1]} intensity={0} />
      <spotLight ref={arrival} position={[-0.05, 0.4, -0.45]} angle={0.35} penumbra={1} decay={2} intensity={0} />

      <group ref={kick}>
        <Suspense fallback={null}>
          <Pistol />
        </Suspense>
        <pointLight ref={muzzleLight} position={MUZZLE.clone().add(new THREE.Vector3(0.03, 0, 0))} color="#ffb36b" distance={1.5} decay={2} intensity={0} />
        <mesh ref={muzzleGlow} position={MUZZLE.clone().add(new THREE.Vector3(0.022, 0, 0))} visible={false}>
          <sphereGeometry args={[0.016, 24, 16]} />
          <meshBasicMaterial color="#ffd9a0" transparent opacity={0} toneMapped={false} depthWrite={false} blending={THREE.AdditiveBlending} />
        </mesh>
      </group>

      <Floor lite={lite} />
    </>
  );
}

function Floor({ lite }: { lite: boolean }) {
  const rough = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = c.height = 256;
    const g = c.getContext("2d")!;
    const img = g.createImageData(256, 256);
    for (let i = 0; i < img.data.length; i += 4) {
      const v = 120 + Math.random() * 110;
      img.data[i] = img.data[i + 1] = img.data[i + 2] = v;
      img.data[i + 3] = 255;
    }
    g.putImageData(img, 0, 0);
    const t = new THREE.CanvasTexture(c);
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.repeat.set(20, 20);
    return t;
  }, []);
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, FLOOR_Y, 0]}>
      <planeGeometry args={[8, 8]} />
      {lite ? (
        <meshStandardMaterial color="#070707" roughness={0.3} roughnessMap={rough} metalness={0.4} envMapIntensity={0} />
      ) : (
        <MeshReflectorMaterial
          resolution={512}
          blur={[400, 120]}
          mixBlur={1}
          mixStrength={2.5}
          mixContrast={1}
          depthScale={1.1}
          minDepthThreshold={0.4}
          maxDepthThreshold={1.3}
          roughness={0.75}
          roughnessMap={rough}
          metalness={0.5}
          envMapIntensity={0}
          color="#0a0a0a"
        />
      )}
    </mesh>
  );
}
