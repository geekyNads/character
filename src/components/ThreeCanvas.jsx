import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";

const CONFIG = {
    modelPath: "./likhit.glb",

    camera: {
        fov: 32,
        near: 0.1,
        far: 100,
        position: new THREE.Vector3(0, 0, 6)
    },

    interaction: {
        rotationYStrength: 0.35,
        rotationXStrength: 0.15,
        positionStrengthX: 0.22,
        positionStrengthY: 0.15,
        lerpFactor: 0.055
    },

    floating: {
        positionAmplitude: 0.05,
        rotationAmplitude: 0.02,
        speed: 1.2
    },

    renderer: {
        maxPixelRatio: 1.8
    }
};

// 4 scroll keyframes for parallax interpolation
// p: scroll percentage (0.0 to 1.0)
// pos: [x, y, z] target positions
// rot: [x, y, z] target rotations in radians
// scale: model scale factor
const KEYFRAMES = [
    { p: 0.0, pos: [0, -0.15, 0], rot: [0, 0, 0], scale: 1.15 },          // Section 1: Hero (Centered, facing forward)
    { p: 0.2, pos: [1.6, 0.1, -0.5], rot: [0.15, -0.6, -0.1], scale: 1.25 }, // Section 2: About (Right-shifted, profile view)
    { p: 0.4, pos: [-1.6, -0.1, 0.5], rot: [-0.1, 0.6, 0.25], scale: 1.4 }   // Section 3: Projects (Left-shifted, zoomed/angled)
];

function getScrollTarget(progress) {
    let prev = KEYFRAMES[0];
    let next = KEYFRAMES[KEYFRAMES.length - 1];

    // Find bounding keyframes
    for (let i = 0; i < KEYFRAMES.length - 1; i++) {
        if (progress >= KEYFRAMES[i].p && progress <= KEYFRAMES[i + 1].p) {
            prev = KEYFRAMES[i];
            next = KEYFRAMES[i + 1];
            break;
        }
    }

    const range = next.p - prev.p;
    const factor = range === 0 ? 0 : (progress - prev.p) / range;
    const lerp = (a, b, t) => a + (b - a) * t;

    return {
        pos: [
            lerp(prev.pos[0], next.pos[0], factor),
            lerp(prev.pos[1], next.pos[1], factor),
            lerp(prev.pos[2], next.pos[2], factor)
        ],
        rot: [
            lerp(prev.rot[0], next.rot[0], factor),
            lerp(prev.rot[1], next.rot[1], factor),
            lerp(prev.rot[2], next.rot[2], factor)
        ],
        scale: lerp(prev.scale, next.scale, factor)
    };
}

export default function ThreeCanvas() {
    const containerRef = useRef(null);
    const canvasRef = useRef(null);
    const scrollProgressRef = useRef(0);

    useEffect(() => {
        if (!containerRef.current || !canvasRef.current) return;

        // --- Core Setup ---
        const scene = new THREE.Scene();

        const camera = new THREE.PerspectiveCamera(
            CONFIG.camera.fov,
            window.innerWidth / window.innerHeight,
            CONFIG.camera.near,
            CONFIG.camera.far
        );
        camera.position.copy(CONFIG.camera.position);

        const renderer = new THREE.WebGLRenderer({
            canvas: canvasRef.current,
            antialias: true,
            alpha: true,
            powerPreference: "high-performance"
        });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, CONFIG.renderer.maxPixelRatio));
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        renderer.physicallyCorrectLights = true;
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.1;

        // --- Lighting ---
        const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
        scene.add(ambientLight);

        const keyLight = new THREE.DirectionalLight(0xffffff, 5.5);
        keyLight.position.set(4, 6, 5);
        keyLight.castShadow = true;
        keyLight.shadow.mapSize.width = 2048;
        keyLight.shadow.mapSize.height = 2048;
        keyLight.shadow.bias = -0.0001;
        scene.add(keyLight);

        const fillLight = new THREE.DirectionalLight(0xbfd4ff, 2.5);
        fillLight.position.set(-5, 2, 4);
        scene.add(fillLight);

        const rimLight = new THREE.DirectionalLight(0xffffff, 3.5);
        rimLight.position.set(0, 3, -8);
        scene.add(rimLight);

        // --- Model Container ---
        const modelGroup = new THREE.Group();
        scene.add(modelGroup);
        let model = null;

        // --- Loaders ---
        const loadingManager = new THREE.LoadingManager();
        const dracoLoader = new DRACOLoader();
        dracoLoader.setDecoderPath("https://cdn.jsdelivr.net/npm/three@0.165/examples/jsm/libs/draco/");

        const gltfLoader = new GLTFLoader(loadingManager);
        gltfLoader.setDRACOLoader(dracoLoader);

        gltfLoader.load(
            CONFIG.modelPath,
            (gltf) => {
                model = gltf.scene;

                model.traverse((child) => {
                    if (child.isMesh) {
                        child.castShadow = true;
                        child.receiveShadow = true;
                        child.frustumCulled = true;
                        if (child.material) {
                            child.material.envMapIntensity = 1.5;
                        }
                    }
                });

                // Auto centering and placing at local zero
                const box = new THREE.Box3().setFromObject(model);
                const center = box.getCenter(new THREE.Vector3());
                model.position.sub(center);

                modelGroup.add(model);
            },
            undefined,
            (error) => {
                console.error("Failed to load GLB:", error);
            }
        );

        // --- Interaction & Scroll States ---
        const cursor = { x: 0, y: 0 };
        const current = {
            posX: 0, posY: 0, posZ: 0,
            rotX: 0, rotY: 0, rotZ: 0,
            scale: 1.0
        };
        let currentOpacity = 1.0;

        const handleMouseMove = (event) => {
            cursor.x = (event.clientX / window.innerWidth) * 2 - 1;
            cursor.y = (event.clientY / window.innerHeight) * 2 - 1;
        };

        const handleScroll = () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = docHeight <= 0 ? 0 : scrollTop / docHeight;
            scrollProgressRef.current = progress;
        };

        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("scroll", handleScroll, { passive: true });

        // Trigger once initially
        handleScroll();

        // --- Resize ---
        const handleResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, CONFIG.renderer.maxPixelRatio));
        };
        window.addEventListener("resize", handleResize);

        // --- Animation Loop ---
        const clock = new THREE.Clock();
        let animationFrameId;

        const animate = () => {
            animationFrameId = requestAnimationFrame(animate);

            const delta = clock.getDelta();
            const elapsedTime = clock.getElapsedTime();

            // Smooth interpolation factor (frame-rate independent lerp)
            const lerpAlpha = 1.0 - Math.pow(1.0 - CONFIG.interaction.lerpFactor, delta * 60);

            // Clamp scroll progress for 3D model positions/rotation (ends at Section 3, p = 0.4)
            const modelScrollProgress = Math.min(scrollProgressRef.current, 0.4);
            const scrollTarget = getScrollTarget(modelScrollProgress);

            // Add floating effect
            const floatOffset = Math.sin(elapsedTime * CONFIG.floating.speed) * CONFIG.floating.positionAmplitude;
            const floatRotation = Math.sin(elapsedTime * CONFIG.floating.speed * 0.8) * CONFIG.floating.rotationAmplitude;

            // Interpolate towards the scroll + mouse interaction targets
            const targetX = scrollTarget.pos[0] + cursor.x * CONFIG.interaction.positionStrengthX;
            const targetY = scrollTarget.pos[1] - cursor.y * CONFIG.interaction.positionStrengthY + floatOffset;
            const targetZ = scrollTarget.pos[2];

            const targetRotX = scrollTarget.rot[0] + cursor.y * CONFIG.interaction.rotationXStrength;
            const targetRotY = scrollTarget.rot[1] + cursor.x * CONFIG.interaction.rotationYStrength + floatRotation;
            const targetRotZ = scrollTarget.rot[2];

            current.posX = THREE.MathUtils.lerp(current.posX, targetX, lerpAlpha);
            current.posY = THREE.MathUtils.lerp(current.posY, targetY, lerpAlpha);
            current.posZ = THREE.MathUtils.lerp(current.posZ, targetZ, lerpAlpha);

            current.rotX = THREE.MathUtils.lerp(current.rotX, targetRotX, lerpAlpha);
            current.rotY = THREE.MathUtils.lerp(current.rotY, targetRotY, lerpAlpha);
            current.rotZ = THREE.MathUtils.lerp(current.rotZ, targetRotZ, lerpAlpha);

            current.scale = THREE.MathUtils.lerp(current.scale, scrollTarget.scale, lerpAlpha);

            // Apply to group
            modelGroup.position.set(current.posX, current.posY, current.posZ);
            modelGroup.rotation.set(current.rotX, current.rotY, current.rotZ);
            modelGroup.scale.setScalar(current.scale);

            // Smoothly fade opacity based on scroll progress past Section 3 (p = 0.4)
            let targetOpacity = 1.0;
            if (scrollProgressRef.current > 0.4) {
                // Fades out completely by p = 0.5 (transition from Section 3 to Section 4)
                targetOpacity = Math.max(0, 1.0 - (scrollProgressRef.current - 0.4) / 0.1);
            }
            currentOpacity = THREE.MathUtils.lerp(currentOpacity, targetOpacity, lerpAlpha);

            if (canvasRef.current) {
                canvasRef.current.style.opacity = currentOpacity.toFixed(3);
                canvasRef.current.style.visibility = currentOpacity < 0.005 ? "hidden" : "visible";
            }

            renderer.render(scene, camera);
        };

        animate();

        // --- Cleanup ---
        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("scroll", handleScroll);
            window.removeEventListener("resize", handleResize);

            renderer.dispose();
            dracoLoader.dispose();

            scene.traverse((object) => {
                if (!object.isMesh) return;
                object.geometry?.dispose();
                if (Array.isArray(object.material)) {
                    object.material.forEach((material) => material.dispose());
                } else {
                    object.material?.dispose();
                }
            });
        };
    }, []);

    return (
        <div ref={containerRef} className="webgl-container">
            <canvas ref={canvasRef} />
        </div>
    );
}
