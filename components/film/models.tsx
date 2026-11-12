"use client";

/** The pistol: a licensed GLB (CC BY 4.0, credited in the footer and README). */
import { useMemo, type Ref } from "react";
import * as THREE from "three";
import { useGLTF } from "@react-three/drei";

/* ---------------------------------- Pistol --------------------------------- */

/**
 * Pistol model by TORI106 (Sketchfab), CC BY 4.0, credited in the footer and README.
 * Compressed (meshopt + 1K WebP); maker marks and serials removed.
 * Normalised here to real size (217 mm long), centred on its bounding box, barrel along +x.
 */
export const PISTOL_URL = "/models/pistol.glb";
export const PISTOL_SIZE = { len: 0.217, h: 0.14 };
const BARREL_SIGN = -1; // flip to -1 if the source model's muzzle points along -x

export function Pistol(props: { ref?: Ref<THREE.Group> }) {
  const { scene } = useGLTF(PISTOL_URL, false, true);
  const model = useMemo(() => {
    const root = scene.clone(true);
    const box = new THREE.Box3().setFromObject(root);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const s = PISTOL_SIZE.len / Math.max(size.x, size.y, size.z);
    root.position.copy(center).multiplyScalar(-s);
    root.scale.setScalar(s);
    root.traverse((o) => {
      const m = (o as THREE.Mesh).material as THREE.MeshStandardMaterial | undefined;
      if (!m) return;
      m.color.setScalar(0.22); // source textures are light grey; darken to black oxide
      m.envMapIntensity = 1.2; // the set is lit mostly by reflections
    });
    return root;
  }, [scene]);
  return (
    <group ref={props.ref}>
      <group rotation={[0, BARREL_SIGN > 0 ? 0 : Math.PI, 0]}>
        <primitive object={model} />
      </group>
    </group>
  );
}

useGLTF.preload(PISTOL_URL, false, true);
