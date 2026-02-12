import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import Cell from './Cell';

const GRID_W = 10;
const GRID_H = 10;
const HEX_SIZE = 2;

function createHexGeometry(radius) {
    const shape = new THREE.Shape();

    // Pointy-top hex: start at top vertex, go clockwise
    for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i + Math.PI / 2;  // offset by 90°
        const x = radius * Math.cos(angle);
        const y = radius * Math.sin(angle);

        if (i === 0) shape.moveTo(x, y);
        else shape.lineTo(x, y);
    }

    shape.closePath();
    return new THREE.ShapeGeometry(shape);  // no rotateX needed for 2D top-down
}

function axialToWorld(q, r, size) {
    const y = size * 1.5 * q;
    const x = size * Math.sqrt(3) * (r + q / 2);
    return { x, y };
}

export default function HexWorld({ regenerateKey }) {
    const mountRef = useRef(null);

    useEffect(() => {
        if (!mountRef.current) return;

        const width = mountRef.current.clientWidth || 800;
        const height = mountRef.current.clientHeight || 600;

        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x444444);

        const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
        camera.position.set(0, 0, 50);
        camera.lookAt(0, 0, 0);

        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(width, height);
        mountRef.current.appendChild(renderer.domElement);

        // Ground tiles (full hex grid, colored)
        const tileGeo = createHexGeometry(HEX_SIZE);
        const tileMat = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide });
        const tiles = new THREE.InstancedMesh(tileGeo, tileMat, GRID_W * GRID_H);

        // Cells (smaller circles on top)
        const cellGeo = new THREE.CircleGeometry(HEX_SIZE * 0.45, 24);
        const cellMat = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide });
        const cells = new THREE.InstancedMesh(cellGeo, cellMat, GRID_W * GRID_H);

        const dummy = new THREE.Object3D();
        const color = new THREE.Color();

        let tileIndex = 0;
        let cellIndex = 0;

        const totalWidth = HEX_SIZE * 1.5 * GRID_W;
        const totalHeight = HEX_SIZE * Math.sqrt(3) * GRID_H;
        const offsetX = totalWidth / 2;
        const offsetY = totalHeight / 2;

        for (let q = 0; q < GRID_W; q++) {
            for (let r = 0; r < GRID_H; r++) {
                const cell = Cell.random();
                const { x, y } = axialToWorld(q, r, HEX_SIZE);
                const tile_color = '#' + (20 + Math.random() * 30 | 0).toString(16).repeat(3)
                // Ground tile
                dummy.position.set(x - offsetX, y - offsetY, 0.005);
                dummy.scale.set(1, 1, 1);
                dummy.updateMatrix();
                tiles.setMatrixAt(tileIndex, dummy.matrix);
                color.set(tile_color); // dark gray ground or customize
                tiles.setColorAt(tileIndex, color);
                tileIndex++;

                // if (Math.random() > 0.2) continue;
                // Cell circle on top
                dummy.position.z = 0.01;
                dummy.updateMatrix();
                cells.setMatrixAt(cellIndex, dummy.matrix);
                color.set(cell.getFrontColorCSS());
                cells.setColorAt(cellIndex, color);
                cellIndex++;
            }
        }

        tiles.instanceColor.needsUpdate = true;
        cells.instanceColor.needsUpdate = true;

        scene.add(tiles);
        scene.add(cells);

        function animate() {
            requestAnimationFrame(animate);
            renderer.render(scene, camera);
        }

        animate();

        return () => {
            renderer.dispose();
            tileGeo.dispose();
            tileMat.dispose();
            cellGeo.dispose();
            cellMat.dispose();
            mountRef.current.removeChild(renderer.domElement);
        };
    }, [regenerateKey]);

    return <div ref={mountRef} style={{ width: '100%', height: '600px' }} />;
}