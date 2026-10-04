"use client";

import { useEffect, useRef } from "react";
import { scene } from "@/lib/scene-state";
import type { Shape } from "@/lib/content/types";
import { SKY_FRAGMENT, SKY_VERTEX, POINTS_FRAGMENT, POINTS_VERTEX } from "./shaders";

// The whole background: a sky that climbs from day into orbit, and a particle form that
// reshapes for each project. three.js loads after first paint so it never blocks the page.
export default function SkyCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    let disposed = false;
    let cleanup = () => {};

    (async () => {
      const THREE = await import("three");
      const { makeShape } = await import("./shapes");
      if (disposed) return;

      const coarse = matchMedia("(pointer: coarse)").matches;
      const narrow = innerWidth < 900;
      const nav = navigator as Navigator & { deviceMemory?: number };
      const low = (nav.hardwareConcurrency ?? 8) <= 4 || (nav.deviceMemory ?? 8) <= 4;
      const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
      const COUNT = low ? (narrow ? 3500 : 7000) : narrow ? 6000 : 12000;

      let renderer: import("three").WebGLRenderer;
      try {
        renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: false, powerPreference: "high-performance" });
      } catch {
        canvas.style.display = "none";
        return;
      }
      document.documentElement.classList.add("has-gl");
      const dpr = Math.min(devicePixelRatio, low ? 1 : coarse ? 1.5 : 1.75);
      renderer.setPixelRatio(dpr);

      const three = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
      camera.position.set(0, 0, 10);

      const sky = new THREE.ShaderMaterial({
        depthWrite: false,
        depthTest: false,
        defines: { OCTAVES: low ? 4 : 6 },
        uniforms: {
          uTime: { value: 0 },
          uA: { value: 0 },
          uRes: { value: new THREE.Vector2() },
          uMouse: { value: new THREE.Vector2() },
        },
        vertexShader: SKY_VERTEX,
        fragmentShader: SKY_FRAGMENT,
      });
      const skyMesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), sky);
      skyMesh.frustumCulled = false;
      skyMesh.renderOrder = -1;
      three.add(skyMesh);

      // particles
      const cache = new Map<Shape, Float32Array>();
      const shapeOf = (s: Shape) => {
        let a = cache.get(s);
        if (!a) cache.set(s, (a = makeShape(s, COUNT)));
        return a;
      };
      const pos = shapeOf("globe").slice();
      let target = shapeOf("globe");
      const speed = new Float32Array(COUNT), rand = new Float32Array(COUNT);
      for (let i = 0; i < COUNT; i++) { speed[i] = 0.025 + Math.random() * 0.055; rand[i] = Math.random(); }
      const geo = new THREE.BufferGeometry();
      const posAttr = new THREE.BufferAttribute(pos, 3).setUsage(THREE.DynamicDrawUsage);
      geo.setAttribute("position", posAttr);
      geo.setAttribute("aR", new THREE.BufferAttribute(rand, 1));
      const pts = new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        uniforms: {
          uTime: { value: 0 }, uColor: { value: new THREE.Color() }, uAlpha: { value: 1 }, uTurb: { value: 0 },
          uSize: { value: 2.4 }, uMouse: { value: new THREE.Vector2(9, 9) }, uAspect: { value: 1 }, uPR: { value: dpr },
        },
        vertexShader: POINTS_VERTEX,
        fragmentShader: POINTS_FRAGMENT,
      });
      const form = new THREE.Group();
      form.add(new THREE.Points(geo, pts));
      three.add(form);

      // size: follow width changes, ignore the mobile URL bar sliding in and out
      let lastW = 0, lastH = 0;
      const resize = () => {
        const w = canvas.clientWidth, h = canvas.clientHeight;
        if (w === lastW && Math.abs(h - lastH) < 160) return;
        lastW = w; lastH = h;
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        sky.uniforms.uRes.value.set(w * dpr, h * dpr);
        pts.uniforms.uAspect.value = w / h;
      };
      resize();
      const ro = new ResizeObserver(resize);
      ro.observe(canvas);

      const mouse = new THREE.Vector2(), sm = new THREE.Vector2(), mNdc = new THREE.Vector2(9, 9);
      const onMove = (e: PointerEvent) => {
        if (e.pointerType === "touch") return;
        mouse.set(e.clientX / innerWidth - 0.5, e.clientY / innerHeight - 0.5);
        mNdc.set((e.clientX / innerWidth) * 2 - 1, -(e.clientY / innerHeight) * 2 + 1);
      };
      addEventListener("pointermove", onMove, { passive: true });

      const dark = new THREE.Color(0.06, 0.11, 0.22), glow = new THREE.Color(0.78, 0.87, 1);
      const clock = new THREE.Clock();
      let sa = scene.altitude, current: Shape = "globe", alpha = 1, turb = 0;
      form.position.set(narrow ? 0 : 2.6, narrow ? 1.55 : 0.35, 0);
      form.scale.setScalar(narrow ? 0.62 : 1);

      const frame = () => {
        const t = reduce ? 0 : clock.getElapsedTime();
        const mobile = canvas.clientWidth < 900;
        sa += (scene.altitude - sa) * (reduce ? 1 : 0.08);
        sm.lerp(mouse, 0.05);
        sky.uniforms.uTime.value = t;
        sky.uniforms.uA.value = sa;
        sky.uniforms.uMouse.value.copy(sm);

        const want: Shape = scene.mode === "work" ? scene.shapes[Math.round(scene.progress)] ?? "globe" : "globe";
        if (want !== current) { current = want; target = shapeOf(want); turb = 1; }
        // keep the form (ring included) inside the frame on any desktop aspect ratio
        const halfW = 3.15 * camera.aspect, fit = Math.min(1, Math.max(0.7, (halfW - 0.6) / 4.4));
        const side = Math.max(1.2, Math.min(2.6, halfW - 2.95 * fit));
        const place = scene.mode === "work"
          ? mobile ? [0, 1.25, 0.6] : [side, 0.1, fit]
          : mobile ? [0, 1.55, 0.62] : [side, 0.35, fit];
        const wantAlpha = { hero: 1, activity: mobile ? 0.14 : 0.2, work: 1, after: mobile ? 0.16 : 0.25 }[scene.mode];
        form.position.x += (place[0] - form.position.x) * 0.06;
        form.position.y += (place[1] - form.position.y) * 0.06;
        form.scale.setScalar(form.scale.x + (place[2] - form.scale.x) * 0.06);
        alpha += (wantAlpha - alpha) * 0.06;
        turb *= 0.965;
        const u = pts.uniforms;
        u.uAlpha.value = alpha; u.uTurb.value = turb; u.uTime.value = t;
        (u.uColor.value as import("three").Color).copy(dark).lerp(glow, Math.min(1, sa * 2.2));
        u.uSize.value = (mobile ? 2.6 : 2.2) + sa * 1.2;
        (u.uMouse.value as import("three").Vector2).lerp(mNdc, 0.15);

        // flow each particle toward its place in the current shape
        for (let i = 0, j = 0; i < COUNT; i++, j += 3) {
          const k = reduce ? 1 : speed[i];
          pos[j] += (target[j] - pos[j]) * k;
          pos[j + 1] += (target[j + 1] - pos[j + 1]) * k;
          pos[j + 2] += (target[j + 2] - pos[j + 2]) * k;
        }
        posAttr.needsUpdate = true;

        form.rotation.y = t * 0.12 + sm.x * 0.5;
        form.rotation.x = sm.y * 0.3;
        camera.position.x = sm.x * 0.5;
        camera.position.y = -sm.y * 0.35;
        camera.lookAt(0, 0, 0);
        renderer.render(three, camera);
      };

      // render only while the tab is visible; low-end devices run at half rate
      let raf = 0, tick = 0;
      const loop = () => {
        raf = requestAnimationFrame(loop);
        if (low && ++tick % 2) return;
        frame();
      };
      loop();
      canvas.classList.add("ready");

      cleanup = () => {
        cancelAnimationFrame(raf);
        ro.disconnect();
        removeEventListener("pointermove", onMove);
        geo.dispose(); pts.dispose(); sky.dispose(); renderer.dispose();
      };
    })();

    return () => { disposed = true; cleanup(); };
  }, []);

  return <canvas ref={ref} className="sky" aria-hidden="true" />;
}
