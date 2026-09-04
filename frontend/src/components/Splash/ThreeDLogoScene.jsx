import React, { useEffect, useRef } from 'react';

/**
 * Three.js 3D Logo Scene
 * Renders the exact CodeSphere logo (Left Bracket <, Diamond ◆, Right Bracket >)
 * in true 3D space with neon emissive tubes, 3D particle vortex, pulsing rings,
 * radial light bursts, and dynamic camera movements.
 */
export default function ThreeDLogoScene({ onAnimationProgress, isTransitioningOut }) {
  const containerRef = useRef(null);

  useEffect(() => {
    // Check if Three.js is loaded from CDN or window
    const THREE = window.THREE;
    if (!THREE || !containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // 1. Scene & Fog
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x050711, 0.045);

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 7.5);

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3;
    container.appendChild(renderer.domElement);

    // 4. Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const purpleLight = new THREE.PointLight(0xa855f7, 3, 20);
    purpleLight.position.set(-3, 2, 4);
    scene.add(purpleLight);

    const cyanLight = new THREE.PointLight(0x06b6d4, 3, 20);
    cyanLight.position.set(3, -2, 4);
    scene.add(cyanLight);

    // 5. Logo Group Container
    const logoGroup = new THREE.Group();
    scene.add(logoGroup);

    // --- Create 3D Left Bracket `<` ---
    const leftCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.65, 0.95, 0),
      new THREE.Vector3(-1.45, 0, 0),
      new THREE.Vector3(-0.65, -0.95, 0)
    ], false, 'centripetal');

    const leftGeometry = new THREE.TubeGeometry(leftCurve, 64, 0.18, 16, false);
    const leftMaterial = new THREE.MeshStandardMaterial({
      color: 0xc084fc,
      emissive: 0x9333ea,
      emissiveIntensity: 1.0,
      metalness: 0.3,
      roughness: 0.15
    });
    const leftMesh = new THREE.Mesh(leftGeometry, leftMaterial);
    logoGroup.add(leftMesh);

    // --- Create 3D Center Diamond `◆` (Octahedron Gem) ---
    const diamondGeometry = new THREE.OctahedronGeometry(0.36, 0);
    const diamondMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: 0x818cf8,
      emissiveIntensity: 1.5,
      metalness: 0.1,
      roughness: 0.05
    });
    const diamondMesh = new THREE.Mesh(diamondGeometry, diamondMaterial);
    diamondMesh.rotation.z = Math.PI / 4;
    logoGroup.add(diamondMesh);

    // --- Create 3D Right Bracket `>` ---
    const rightCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.65, 0.95, 0),
      new THREE.Vector3(1.45, 0, 0),
      new THREE.Vector3(0.65, -0.95, 0)
    ], false, 'centripetal');

    const rightGeometry = new THREE.TubeGeometry(rightCurve, 64, 0.18, 16, false);
    const rightMaterial = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x0284c7,
      emissiveIntensity: 1.0,
      metalness: 0.3,
      roughness: 0.15
    });
    const rightMesh = new THREE.Mesh(rightGeometry, rightMaterial);
    logoGroup.add(rightMesh);

    // --- 6. 3D Particle Cloud / Vortex ---
    const particleCount = 1000;
    const particleGeo = new THREE.BufferGeometry();
    const particlePos = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);

    const c1 = new THREE.Color(0xa855f7);
    const c2 = new THREE.Color(0x06b6d4);

    for (let i = 0; i < particleCount; i++) {
      const radius = 1.2 + Math.random() * 5.0;
      const theta = Math.random() * Math.PI * 2;
      const phi = (Math.random() - 0.5) * Math.PI * 0.8;

      particlePos[i * 3] = radius * Math.cos(theta) * Math.cos(phi);
      particlePos[i * 3 + 1] = radius * Math.sin(phi);
      particlePos[i * 3 + 2] = radius * Math.sin(theta) * Math.cos(phi);

      const mixed = c1.clone().lerp(c2, Math.random());
      particleColors[i * 3] = mixed.r;
      particleColors[i * 3 + 1] = mixed.g;
      particleColors[i * 3 + 2] = mixed.b;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePos, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.045,
      vertexColors: true,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // --- 7. Pulse Shockwave Rings ---
    const rings = [];
    for (let r = 0; r < 3; r++) {
      const ringGeo = new THREE.RingGeometry(0.01, 0.05, 64);
      const ringMat = new THREE.MeshBasicMaterial({
        color: r % 2 === 0 ? 0xa855f7 : 0x06b6d4,
        transparent: true,
        opacity: 0,
        side: THREE.DoubleSide
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      scene.add(ringMesh);
      rings.push({ mesh: ringMesh, progress: -r * 0.35 });
    }

    // --- 8. Light Streaks (for Pop Out phase) ---
    const burstGroup = new THREE.Group();
    const streakCount = 18;
    const streaks = [];
    for (let s = 0; s < streakCount; s++) {
      const angle = (s / streakCount) * Math.PI * 2;
      const lineGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(Math.cos(angle) * 3.5, Math.sin(angle) * 3.5, (Math.random() - 0.5) * 1.5)
      ]);
      const lineMat = new THREE.LineBasicMaterial({
        color: s % 2 === 0 ? 0xc084fc : 0x38bdf8,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending
      });
      const streak = new THREE.Line(lineGeo, lineMat);
      burstGroup.add(streak);
      streaks.push(streak);
    }
    scene.add(burstGroup);

    // --- 9. Animation Loop ---
    let startTime = performance.now();
    let animId;

    const animate = () => {
      animId = requestAnimationFrame(animate);

      const elapsed = (performance.now() - startTime) / 1000;

      // Report animation progress to parent
      if (onAnimationProgress) {
        onAnimationProgress(elapsed);
      }

      // Gentle continuous 3D idle motion
      diamondMesh.rotation.x = elapsed * 0.8;
      diamondMesh.rotation.y = elapsed * 1.2;
      logoGroup.position.y = Math.sin(elapsed * 1.5) * 0.08;

      // Swirling particles
      particles.rotation.y = elapsed * 0.2;
      particles.rotation.z = Math.sin(elapsed * 0.1) * 0.15;

      // --- Timeline Phase 1: Appear (0.0s - 1.2s) ---
      if (elapsed < 1.2) {
        const t = Math.min(elapsed / 1.2, 1);
        logoGroup.scale.setScalar(t);
        camera.position.z = 7.5 - t * 0.7; // Glides smoothly from 7.5 to 6.8
      }

      // --- Timeline Phase 2: Pulse (1.2s - 2.4s) ---
      if (elapsed >= 1.2 && elapsed < 2.4) {
        rings.forEach((ring) => {
          ring.progress += 0.025;
          if (ring.progress > 0) {
            const p = ring.progress % 1;
            ring.mesh.scale.setScalar(1 + p * 35);
            ring.mesh.material.opacity = Math.max(0, 0.75 * (1 - p));
          }
        });
      } else {
        rings.forEach(r => { r.mesh.material.opacity = 0; });
      }

      // --- Timeline Phase 3: Transform & Energy builds (2.4s - 3.6s) ---
      if (elapsed >= 2.4 && elapsed < 3.6) {
        const chargeT = (elapsed - 2.4) / 1.2;
        particles.rotation.y = elapsed * (0.2 + chargeT * 1.5); // accelerates vortex
        leftMaterial.emissiveIntensity = 1.0 + chargeT * 2.5;
        rightMaterial.emissiveIntensity = 1.0 + chargeT * 2.5;
        diamondMaterial.emissiveIntensity = 1.5 + chargeT * 3.0;
        logoGroup.rotation.y = Math.sin(elapsed * 4) * 0.15 * chargeT;
      }

      // --- Timeline Phase 4: Pop Out (3.6s - 4.4s) ---
      if (elapsed >= 3.6 && elapsed < 4.4) {
        const popT = (elapsed - 3.6) / 0.8;
        // Elastic punch forward
        const scaleBoost = 1.0 + Math.sin(popT * Math.PI) * 0.45;
        logoGroup.scale.setScalar(scaleBoost);
        logoGroup.position.z = Math.sin(popT * Math.PI) * 1.2;

        // Flash radial rays
        streaks.forEach((st, idx) => {
          st.material.opacity = Math.sin(popT * Math.PI) * (0.8 + (idx % 2) * 0.2);
        });
      } else if (elapsed >= 4.4) {
        streaks.forEach(st => { st.material.opacity = 0; });
        logoGroup.position.z = 0;
      }

      // --- Timeline Phase 5: Brand Settle & Smooth Exit (4.4s+) ---
      if (elapsed >= 4.4) {
        leftMaterial.emissiveIntensity = 1.2;
        rightMaterial.emissiveIntensity = 1.2;
        diamondMaterial.emissiveIntensity = 1.8;
        logoGroup.scale.setScalar(1.0);
      }

      // Outward dive transition when finishing
      if (isTransitioningOut) {
        camera.position.z -= 0.35;
        logoGroup.scale.multiplyScalar(1.06);
        renderer.domElement.style.opacity = Math.max(0, parseFloat(renderer.domElement.style.opacity || 1) - 0.05);
      }

      renderer.render(scene, camera);
    };

    animate();

    // Resize handler
    const handleResize = () => {
      if (!containerRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [isTransitioningOut]);

  return (
    <div 
      ref={containerRef} 
      className="absolute inset-0 w-full h-full pointer-events-none z-10"
    />
  );
}
