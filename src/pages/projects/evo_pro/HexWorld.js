import React, { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';

const HEX_SIZE = 2;

/* =========================
   GEOMETRY HELPERS
========================= */

function createHexGeometry(radius = HEX_SIZE) {
    const shape = new THREE.Shape();

    for (let i = 0; i < 6; i++) {
        const angle = Math.PI / 3 * i + Math.PI / 2;
        const x = radius * Math.cos(angle);
        const y = radius * Math.sin(angle);

        if (i === 0) shape.moveTo(x, y);
        else shape.lineTo(x, y);
    }

    shape.closePath();
    return new THREE.ShapeGeometry(shape);
}

function createCellGeometry() {
    return new THREE.CircleGeometry(HEX_SIZE * 0.75, 16);
}

// odd-q vertical layout
function axialToWorld(q, r) {
    return {
        x: HEX_SIZE * Math.sqrt(3) * (r + (q & 1) / 2 + 0.5),
        y: HEX_SIZE * 1.5 * (q + 0.5)
    };
}

/* =========================
   COMPONENT
========================= */

export default function HexWorld({ regenerateKey, petri, petri_size, time }) {

    const mountRef = useRef(null);
    const threeRef = useRef(null);

    /* ---------- Stable GPU resources ---------- */

    const tileGeo = useMemo(() => createHexGeometry(), []);
    const cellGeo = useMemo(() => createCellGeometry(), []);

    const tileMat = useMemo(
        () => new THREE.MeshBasicMaterial({ vertexColors: true }),
        []
    );

    const cellMat = useMemo(() => new THREE.ShaderMaterial({

        vertexShader: `
            attribute vec3 instanceFrontColor;
            attribute vec3 instanceBackColor;
            attribute float instanceSize;

            varying vec3 vFrontColor;
            varying vec3 vBackColor;
            varying float vScale;
            varying vec2 vUv;

            void main() {
                vFrontColor = instanceFrontColor;
                vBackColor = instanceBackColor;
                vScale = mix(0.3, 1.0, instanceSize / 100.0);
                vUv = uv;

                vec4 worldPosition = instanceMatrix * vec4(position, 1.0);
                gl_Position = projectionMatrix * modelViewMatrix * worldPosition;
            }`,
        fragmentShader: `
            varying vec3 vFrontColor;
            varying vec3 vBackColor;
            varying float vScale;
            varying vec2 vUv;

            void main() {
                vec2 centerEllipse = vec2(1.0, 0.5); 
                vec2 centerCircle = vec2(0.5, 0.5);

                vec2 scaledUV = (vUv - centerEllipse) / vec2(1.5, 0.5);

                float distEllipse = length(scaledUV);
                float distCircle = length(vUv - centerCircle);

                float fillT = smoothstep(0.5, 0.55, distEllipse);
                vec3 col = mix(vFrontColor, vBackColor, fillT);

                vec3 outlineColor = (vFrontColor + vBackColor) * 0.7 + vec3(0.15);

                float outlineCircle = smoothstep(0.42, 0.45, distCircle) - smoothstep(0.5, 1.0, distCircle);
                float outlineEllipse = smoothstep(0.45, 0.5, distEllipse / vScale) - smoothstep(0.52, 0.55, distEllipse);

                float outlineMask = max(outlineCircle, outlineEllipse);

                col = mix(col, outlineColor, outlineMask);

                gl_FragColor = vec4(col, 1.0);
            }`,

        depthTest: true,
        depthWrite: true
    }), []);

    /* ==========================================================
       EFFECT A — INITIALIZE THREE (RUNS ONCE)
    ========================================================== */

    useEffect(() => {

        const container = mountRef.current;
        if (!container) return;

        const width = container.clientWidth || 800;
        const height = container.clientHeight || 600;

        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(width, height);
        container.appendChild(renderer.domElement);

        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x2a2a2a);

        const aspect = width / height;
        const viewSize = 60;

        const camera = new THREE.OrthographicCamera(
            -viewSize * aspect,
            viewSize * aspect,
            viewSize,
            -viewSize,
            0.1,
            100
        );

        camera.position.set(0, 0, 10);

        const maxCount = petri_size.x * petri_size.y;

        const tiles = new THREE.InstancedMesh(tileGeo, tileMat, maxCount);
        const cells = new THREE.InstancedMesh(cellGeo, cellMat, maxCount);

        scene.add(tiles);
        scene.add(cells);

        /* Allocate instanced attributes ONCE */

        const frontColors =
            new THREE.InstancedBufferAttribute(new Float32Array(maxCount * 3), 3);

        const backColors =
            new THREE.InstancedBufferAttribute(new Float32Array(maxCount * 3), 3);

        const scales =
            new THREE.InstancedBufferAttribute(new Float32Array(maxCount), 1);

        cells.geometry.setAttribute('instanceFrontColor', frontColors);
        cells.geometry.setAttribute('instanceBackColor', backColors);
        cells.geometry.setAttribute('instanceSize', scales);

        threeRef.current = {
            renderer,
            scene,
            camera,
            tiles,
            cells,
            frontColors,
            backColors,
            scales
        };

        const animate = () => {
            renderer.render(scene, camera);
            requestAnimationFrame(animate);
        };
        animate();

        return () => {
            renderer.dispose();
            container.removeChild(renderer.domElement);
        };

    }, [cellGeo, cellMat, petri_size, tileGeo, tileMat]);


    /* ==========================================================
       EFFECT B — UPDATE INSTANCE DATA (FAST PATH)
    ========================================================== */

    useEffect(() => {

        const ctx = threeRef.current;
        if (!ctx) return;

        const {
            tiles,
            cells,
            frontColors,
            backColors,
            scales
        } = ctx;

        const dummy = new THREE.Object3D();
        const color = new THREE.Color('#111');

        const totalWidth =
            HEX_SIZE * Math.sqrt(3) * (petri_size.y + 0.5);
        const totalHeight =
            HEX_SIZE * 1.5 * petri_size.x;

        const offsetX = totalWidth / 2;
        const offsetY = totalHeight / 2;

        let index = 0;
        let cellIndex = 0;

        for (let q = 0; q < petri_size.x; q++) {
            for (let r = 0; r < petri_size.y; r++) {

                const cell = petri[q][r];
                const { x, y } = axialToWorld(q, r);

                const worldX = x - offsetX;
                const worldY = y - offsetY;

                /* tiles */
                dummy.position.set(worldX, worldY, 0);
                dummy.rotation.set(0, 0, 0);
                dummy.updateMatrix();

                tiles.setMatrixAt(index, dummy.matrix);
                tiles.setColorAt(index, color);

                /* cells */
                if (cell) {

                    dummy.position.set(worldX, worldY, 0.01);
                    dummy.rotation.set(
                        0,
                        0,
                        (cell.rotation + time) / 6 * Math.PI * 2
                    );

                    dummy.updateMatrix();
                    cells.setMatrixAt(cellIndex, dummy.matrix);

                    const front = new THREE.Color(cell.getFrontColorCSS());
                    const back = new THREE.Color(cell.getBackColorCSS());

                    frontColors.setXYZ(cellIndex, front.r, front.g, front.b);
                    backColors.setXYZ(cellIndex, back.r, back.g, back.b);
                    scales.setX(cellIndex, cell.stat.mass | 0);

                    cellIndex++;
                }

                index++;
            }
        }

        cells.count = cellIndex;

        tiles.instanceMatrix.needsUpdate = true;
        tiles.instanceColor.needsUpdate = true;
        cells.instanceMatrix.needsUpdate = true;

        frontColors.needsUpdate = true;
        backColors.needsUpdate = true;
        scales.needsUpdate = true;

    }, [petri, petri_size, time, regenerateKey]);


    return (
        <div
            ref={mountRef}
            style={{ width: '100%', height: '85dvh' }}
        />
    );
}
