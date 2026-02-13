import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const HEX_SIZE = 4;

function createHexGeometry(radius = HEX_SIZE) {
    const shape = new THREE.Shape();

    // Pointy-top hex
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
    return new THREE.CircleGeometry(HEX_SIZE * 0.7, 16);
}


// odd-q vertical layout
function axialToWorld(q, r) {
    return {
        x: HEX_SIZE * Math.sqrt(3) * (r + (q & 1) / 2 + 0.5),
        y: HEX_SIZE * 1.5 * (q + 0.5)
    };
}

export default function HexWorld({ regenerateKey, petri, petri_size }) {
    const mountRef = useRef(null);

    useEffect(() => {
        const container = mountRef.current;
        if (!container) return;

        const width = container.clientWidth || 800;
        const height = container.clientHeight || 600;

        // Scene
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x2a2a2a);

        // Orthographic camera for 2D grid
        const aspect = width / height;
        const viewSize = 60;

        const camera = new THREE.OrthographicCamera(-viewSize * aspect, viewSize * aspect, viewSize, -viewSize, 0.1, 1000);

        camera.position.set(0, 0, 100);
        camera.lookAt(0, 0, 0);

        // Renderer
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(width, height);
        container.appendChild(renderer.domElement);

        // Geometry
        const tileGeo = createHexGeometry();
        const cellGeo = createCellGeometry();

        // Materials must enable vertexColors
        const tileMat = new THREE.MeshBasicMaterial();
        const cellMat = new THREE.ShaderMaterial({
            vertexShader: `
                attribute vec3 instanceFrontColor;
                attribute vec3 instanceBackColor;

                varying vec3 vFrontColor;
                varying vec3 vBackColor;
                varying vec2 vUv;

                void main() {
                    vFrontColor = instanceFrontColor;
                    vBackColor = instanceBackColor;
                    vUv = uv;

                    vec4 worldPosition = instanceMatrix * vec4(position, 1.0);
                    gl_Position = projectionMatrix * modelViewMatrix * worldPosition;
                }`,
            fragmentShader: `
                varying vec3 vFrontColor;
                varying vec3 vBackColor;
                varying vec2 vUv;

                void main() {
                    vec2 centerEllipse = vec2(1.2, 0.5); 
                    vec2 centerCircle = vec2(0.5, 0.5);

                    // Precompute scaled UV for ellipse
                    vec2 scaledUV = vUv - centerEllipse;
                    scaledUV.x /= 1.5;
                    scaledUV.y /= 0.5;

                    // Cache distances
                    float distEllipse = length(scaledUV);
                    float distCircle = length(vUv - centerCircle);

                    // Ellipsoid gradient fill
                    float fillT = smoothstep(0.5, 0.55, distEllipse);
                    vec3 col = mix(vFrontColor, vBackColor, fillT);

                    // Outline color (average with white)
                    vec3 outlineColor = (vFrontColor + vBackColor) * 0.375 + vec3(0.25);

                    // Compute outline masks
                    float outlineCircle = smoothstep(0.4, 0.45, distCircle) - smoothstep(0.5, 0.52, distCircle);
                    float outlineEllipse = smoothstep(0.45, 0.5, distEllipse) - smoothstep(0.6, 0.62, distEllipse);

                    // Combine outlines
                    float outlineMask = max(outlineCircle, outlineEllipse);

                    // Apply outline once
                    col = mix(col, outlineColor, outlineMask);

                    gl_FragColor = vec4(col, 1.0);

                }`,
            transparent: false,
            depthTest: true,
            depthWrite: true
        });



        const tileCount = petri_size.x * petri_size.y;

        const tiles = new THREE.InstancedMesh(tileGeo, tileMat, tileCount);
        const cells = new THREE.InstancedMesh(cellGeo, cellMat, tileCount);
        const frontColors = new Float32Array(tileCount * 3);
        const backColors = new Float32Array(tileCount * 3);


        const dummy = new THREE.Object3D();
        const color = new THREE.Color();

        // Compute grid bounds properly
        const totalWidth = HEX_SIZE * Math.sqrt(3) * (petri_size.y + 0.5);
        const totalHeight = HEX_SIZE * 1.5 * petri_size.x;

        const offsetX = totalWidth / 2;
        const offsetY = totalHeight / 2;

        let index = 0;
        let cellIndex = 0;

        for (let q = 0; q < petri_size.x; q++) {
            for (let r = 0; r < petri_size.y; r++) {
                const cell = petri[q][r];           // ← use real petri cell or null

                const { x, y } = axialToWorld(q, r);
                const worldX = x - offsetX;
                const worldY = y - offsetY;

                dummy.rotation.set(0, 0, 0);
                // Tile (always drawn)
                dummy.position.set(worldX, worldY, 0);
                dummy.updateMatrix();
                tiles.setMatrixAt(index, dummy.matrix);

                color.set('#' + (16 + Math.random() * 10 | 0).toString(16).repeat(3));
                tiles.setColorAt(index, color);

                // Cell (only if exists)
                if (cell) {
                    dummy.rotation.set(0, 0, cell.rotation / 6 * 2 * Math.PI); // full circle in radians
                    dummy.position.set(worldX, worldY, 0.01);
                    dummy.updateMatrix();
                    cells.setMatrixAt(cellIndex, dummy.matrix);

                    const front = new THREE.Color(cell.getFrontColorCSS());
                    const back = new THREE.Color(cell.getBackColorCSS());

                    frontColors[cellIndex * 3 + 0] = front.r;
                    frontColors[cellIndex * 3 + 1] = front.g;
                    frontColors[cellIndex * 3 + 2] = front.b;

                    backColors[cellIndex * 3 + 0] = back.r;
                    backColors[cellIndex * 3 + 1] = back.g;
                    backColors[cellIndex * 3 + 2] = back.b;

                    cellIndex++;
                }

                index++;
            }
        }

        tiles.instanceMatrix.needsUpdate = true;
        tiles.instanceColor.needsUpdate = true;

        cells.count = cellIndex;
        cells.instanceMatrix.needsUpdate = true;

        cells.geometry.setAttribute(
            'instanceFrontColor',
            new THREE.InstancedBufferAttribute(frontColors, 3)
        );

        cells.geometry.setAttribute(
            'instanceBackColor',
            new THREE.InstancedBufferAttribute(backColors, 3)
        );
        cells.instanceMatrix.needsUpdate = true;
        cells.geometry.attributes.instanceFrontColor.needsUpdate = true;
        cells.geometry.attributes.instanceBackColor.needsUpdate = true;

        scene.add(tiles);
        scene.add(cells);

        function animate() {
            renderer.render(scene, camera);
            requestAnimationFrame(animate);
        }

        animate();

        return () => {
            renderer.dispose();
            tileGeo.dispose();
            cellGeo.dispose();
            tileMat.dispose();
            cellMat.dispose();
            container.removeChild(renderer.domElement);
        };
    }, [regenerateKey, petri, petri_size]);

    return (<div ref={mountRef} style={{ width: '100%', height: '85dvh' }} />);
}
