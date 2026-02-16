import React, { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import Cell from './Cell';

/* =========================
   GEOMETRY HELPERS
========================= */

function createCellGeometry(scale) {
    return new THREE.CircleGeometry(scale * 0.8, 16);
}

// odd-q vertical layout
function axialToWorld(q, r, scale) {
    return {
        x: scale * Math.sqrt(3) * (r + (q & 1) / 2 + 0.5),
        y: scale * 1.5 * (q + 0.5)
    };
}

/* =========================
   COMPONENT
========================= */

export default function HexWorld({ petri, petri_size, hexScale = 1.5 }) {

    const mountRef = useRef(null);
    const threeRef = useRef(null);

    /* ---------- Stable GPU resources ---------- */

    const cellGeo = useMemo(() => createCellGeometry(hexScale), [hexScale]);

    const bgGeo = useMemo(() => new THREE.PlaneGeometry(2, 2), []);

    /* =========================
       BACKGROUND MATERIAL
    ========================= */

    const bgMat = useMemo(() => new THREE.ShaderMaterial({

        depthTest: false,
        depthWrite: false,

        uniforms: {
            uResolution: { value: new THREE.Vector2() },
            uCameraPos: { value: new THREE.Vector2() },
            uViewSize: { value: 60.0 },
            uAspect: { value: 1.0 },
            uHexSize: { value: hexScale },
            uColor: { value: new THREE.Color('#7a719e') },
            uOffset: { value: new THREE.Vector2() },
            uWorldSize: { value: new THREE.Vector2() }
        },

        vertexShader: `void main() {gl_Position = vec4(position.xy,0.0,1.0);}`,

        fragmentShader: `
uniform vec2 uWorldSize;
uniform vec2 uResolution;
uniform vec2 uCameraPos;
uniform float uViewSize;
uniform float uAspect;
uniform float uHexSize;
uniform vec3 uColor;
uniform float uVariation;
uniform vec2 uOffset;
uniform float uZoom;

float hash(vec2 p){
	p = fract(p * vec2(123.34,456.21));
	p += dot(p,p+45.32);
	return fract(p.x*p.y);
}

vec2 axialToWorld(vec2 axial) {
    float q = axial.x;
    float r = axial.y;
    float shiftX = uHexSize * sqrt(3.0) * 0.5;
    float shiftY = uHexSize * 0.75;
    float x = (sqrt(3.0) * r + sqrt(3.0)/2.0 * q) * uHexSize + shiftX;
    float y = (3.0/2.0 * q) * uHexSize + shiftY;
    return vec2(x, y);
}

vec2 worldToAxial(vec2 world){
    float shiftX = uHexSize * sqrt(3.0) * 0.5;
    float shiftY = uHexSize * 0.75;

    vec2 ws = world - vec2(shiftX, shiftY);

    float qStd = (sqrt(3.0)/3.0 * ws.x - 1.0/3.0 * ws.y) / uHexSize;
    float rStd = (2.0/3.0 * ws.y) / uHexSize;
    float sStd = -qStd - rStd;

    float q = round(qStd);
    float r = round(rStd);
    float s = round(sStd);

    float qd = abs(qStd - q);
    float rd = abs(rStd - r);
    float sd = abs(sStd - s);

    if (qd > rd && qd > sd) q = -r - s;
    else if (rd > sd) r = -q - s;

    return vec2(r, q);
}

void main(){
	vec2 uv = gl_FragCoord.xy / uResolution;

	vec2 span = vec2(uViewSize * uAspect * 2.0, uViewSize * 2.0);
	vec2 world = (uv - 0.5) * span + uCameraPos + uOffset;

	vec2 canvasMin = vec2(0) - uHexSize * 0.35;
	vec2 canvasMax = uWorldSize + uHexSize * 0.35;

    vec2 axial = worldToAxial(world);
    vec2 center = axialToWorld(axial);

	float color_add =
		(center.x > canvasMin.x + 2.0 &&
		 center.y > canvasMin.y &&
		 center.x < canvasMax.x - 2.0 &&
		 center.y < canvasMax.y)
        ? 0.75 : 
        (center.x < canvasMin.x - 3.0 ||
		 center.y < canvasMin.y - 3.0 ||
		 center.x > canvasMax.x + 3.0 ||
		 center.y > canvasMax.y + 3.0)
        ? 1.0 : 1.45;

	float n = hash(axial) * 0.25 + 1.0;
	vec3 baseColor = uColor * (n * color_add);

	gl_FragColor = vec4(baseColor,1.0);
}`
    }), [hexScale]);

    /* =========================
       CELL MATERIAL
    ========================= */

    const cellMat = useMemo(() => new THREE.ShaderMaterial({

        depthTest: true,
        depthWrite: true,

        vertexShader: `
attribute vec3 instanceFrontColor;
attribute vec3 instanceBackColor;
attribute float instanceSize;

varying vec3 vFrontColor;
varying vec3 vBackColor;
varying float vScale;
varying vec2 vUv;

void main(){

	vFrontColor = instanceFrontColor;
	vBackColor  = instanceBackColor;
	vScale = mix(0.3,1.0,instanceSize/100.0);
	vUv = uv;

	vec4 worldPosition = instanceMatrix * vec4(position,1.0);
	gl_Position = projectionMatrix * modelViewMatrix * worldPosition;
}`,

        fragmentShader: `
varying vec3 vFrontColor;
varying vec3 vBackColor;
varying float vScale;
varying vec2 vUv;

void main(){

	vec2 centerEllipse = vec2(1.0, 0.5);
	vec2 centerCircle =vec2(0.5);

	vec2 scaledUV=(vUv-centerEllipse)/vec2(1.5,0.5);

	float distEllipse=length(scaledUV);
	float distCircle =length(vUv-centerCircle);

	float fillT=smoothstep(0.5,0.55,distEllipse);
	vec3 col=mix(vFrontColor,vBackColor,fillT);

	vec3 avg=(vFrontColor+vBackColor)*0.5;

	float minComp=min(min(avg.r,avg.g),avg.b);
	vec3 outlineColor=avg;

	if(avg.r==minComp) outlineColor.r=min(avg.r+0.3,1.0);
	else if(avg.g==minComp) outlineColor.g=min(avg.g+0.3,1.0);
	else outlineColor.b=min(avg.b+0.3,1.0);

	float outlineCircle=
		smoothstep(0.42,0.45,distCircle)
		- smoothstep(0.5,1.0,distCircle);

	float outlineEllipse=
		smoothstep(0.45,0.5,distEllipse/vScale)
		- smoothstep(0.52,0.55,distEllipse);

	col=mix(col,outlineColor,max(outlineCircle,outlineEllipse));

	gl_FragColor=vec4(col,1.0);
}`
    }), []);

    /* ==========================================================
       THREE INITIALIZATION
    ========================================================== */

    useEffect(() => {

        const container = mountRef.current;
        if (!container) return;

        const renderer = new THREE.WebGLRenderer({ antialias: true });

        container.appendChild(renderer.domElement);

        container.style.touchAction = 'none';

        const scene = new THREE.Scene();

        const baseViewSize = 60;

        const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 1000);
        camera.position.z = 10;

        const totalHeight = hexScale * 1.5 * petri_size.y;
        const totalWidth = hexScale * Math.sqrt(3) * (petri_size.x + 0.5);

        const offsetX = totalWidth / 2;
        const offsetY = totalHeight / 2;

        bgMat.uniforms.uOffset.value.set(offsetX, offsetY);
        bgMat.uniforms.uWorldSize.value.set(totalWidth, totalHeight);

        function updateViewUniforms(width, height) {
            const aspect = width / height;

            camera.left = -baseViewSize * aspect;
            camera.right = baseViewSize * aspect;
            camera.top = baseViewSize;
            camera.bottom = -baseViewSize;

            camera.updateProjectionMatrix();

            bgMat.uniforms.uResolution.value.set(width, height);
            bgMat.uniforms.uAspect.value = width / height;

            bgMat.uniforms.uViewSize.value = baseViewSize / camera.zoom;
        }

        function resize() {
            const w = container.clientWidth;
            const h = container.clientHeight;
            renderer.setSize(w, h, false);
            updateViewUniforms(w, h);
        }

        new ResizeObserver(resize).observe(container);
        resize();

        const maxCount = petri_size.x * petri_size.y;

        const cells = new THREE.InstancedMesh(cellGeo, cellMat, maxCount);
        cells.frustumCulled = false;

        const bg = new THREE.Mesh(bgGeo, bgMat);
        bg.position.z = -1;
        bg.frustumCulled = false;

        scene.add(bg);
        scene.add(cells);

        const frontColors = new THREE.InstancedBufferAttribute(new Float32Array(maxCount * 3), 3);
        const backColors = new THREE.InstancedBufferAttribute(new Float32Array(maxCount * 3), 3);
        const scales = new THREE.InstancedBufferAttribute(new Float32Array(maxCount), 1);

        cells.geometry.setAttribute('instanceFrontColor', frontColors);
        cells.geometry.setAttribute('instanceBackColor', backColors);
        cells.geometry.setAttribute('instanceSize', scales);

        threeRef.current = { renderer, scene, camera, cells, frontColors, backColors, scales };

        /* ---------- CAMERA ---------- */

        const dragStart = new THREE.Vector2();
        const camStart = new THREE.Vector3();
        let isDragging = false;
        let lastPinchDist = -1;
        let pinchThreshold = 5; // pixels — ignore tiny changes

        container.addEventListener('pointerdown', e => {
            if (e.pointerType === 'touch' && e.touches?.length === 2) return;
            isDragging = true;
            dragStart.set(e.clientX, e.clientY);
            camStart.copy(camera.position);
        }, { passive: false });

        container.addEventListener('pointermove', e => {
            if (!isDragging) return;
            if (e.pointerType === 'touch' && e.touches?.length === 2) return;

            const dx = (e.clientX - dragStart.x) / container.clientWidth;
            const dy = (e.clientY - dragStart.y) / container.clientHeight;

            const worldW = (camera.right - camera.left) / camera.zoom;
            const worldH = (camera.top - camera.bottom) / camera.zoom;

            camera.position.x = camStart.x - dx * worldW;
            camera.position.y = camStart.y + dy * worldH;

            bgMat.uniforms.uCameraPos.value.set(camera.position.x, camera.position.y);
        }, { passive: false });

        window.addEventListener('pointerup', () => {
            isDragging = false;
            lastPinchDist = -1;
        });

        container.addEventListener('pointercancel', () => {
            isDragging = false;
            lastPinchDist = -1;
        });

        // Pinch zoom (touch only)
        container.addEventListener('touchstart', e => {
            if (e.touches.length === 2) {
                e.preventDefault();
                const t1 = e.touches[0];
                const t2 = e.touches[1];
                lastPinchDist = Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY);
            }
        }, { passive: false });

        container.addEventListener('touchmove', e => {
            if (e.touches.length !== 2) return;
            e.preventDefault();

            const t1 = e.touches[0];
            const t2 = e.touches[1];
            const dist = Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY);

            if (lastPinchDist > 0 && Math.abs(dist - lastPinchDist) > pinchThreshold) {
                const factor = dist / lastPinchDist;
                camera.zoom = THREE.MathUtils.clamp(camera.zoom * factor, 0.2, 5);
                camera.updateProjectionMatrix();
                bgMat.uniforms.uViewSize.value = baseViewSize / camera.zoom;
            }

            lastPinchDist = dist;
        }, { passive: false });

        /* ---------- RENDER LOOP ---------- */

        let raf;
        const animate = () => {
            renderer.render(scene, camera);
            raf = requestAnimationFrame(animate);
        };
        animate();

        return () => {
            cancelAnimationFrame(raf);
            renderer.dispose();
            container.removeChild(renderer.domElement);
        };

    }, [cellGeo, cellMat, bgGeo, bgMat, petri_size, hexScale]);

    /* ==========================================================
       INSTANCE UPDATE
    ========================================================== */

    useEffect(() => {

        const ctx = threeRef.current;
        if (!ctx) return;

        const { cells, frontColors, backColors, scales } = ctx;
        const dummy = new THREE.Object3D();

        const totalHeight = hexScale * 1.5 * petri_size.y;
        const totalWidth = hexScale * Math.sqrt(3) * (petri_size.x + 0.5);

        const offsetX = totalWidth / 2;
        const offsetY = totalHeight / 2;

        let index = 0;

        for (let q = 0; q < petri_size.x; q++) {
            for (let r = 0; r < petri_size.y; r++) {

                const cell = petri[q][r];
                if (!(cell instanceof Cell)) continue;

                const { x, y } = axialToWorld(r, q, hexScale);

                dummy.position.set(x - offsetX, y - offsetY, 0.01);

                dummy.rotation.z = cell.rotation / 3 * Math.PI;

                dummy.updateMatrix();
                cells.setMatrixAt(index, dummy.matrix);

                const f = new THREE.Color(cell.getFrontColorCSS());
                const b = new THREE.Color(cell.getBackColorCSS());

                frontColors.setXYZ(index, f.r, f.g, f.b);
                backColors.setXYZ(index, b.r, b.g, b.b);
                scales.setX(index, cell.stat.mass | 0);

                index++;
            }
        }

        cells.count = index;
        cells.instanceMatrix.needsUpdate = true;
        frontColors.needsUpdate = true;
        backColors.needsUpdate = true;
        scales.needsUpdate = true;

    }, [petri, petri_size, hexScale]);

    return <div id='petri' ref={mountRef} />;
}
