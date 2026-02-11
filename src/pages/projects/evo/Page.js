import AZInstrumentsPanel, { AZInstrumentsSubpanel } from '../../../components/elements/AZInstrumentsPanel';
import AZInputRange from '../../../components/elements/AZInputRange';
import AZInputValue from '../../../components/elements/AZInputValue';
import AZRuntimeButton from '../../../components/elements/AZRuntimeButton';
import RuntimeProvider, { useRuntime } from '../../../providers/RuntimeProvider';
import Cell, { TYPE } from './Cell';
import AZButton from '../../../components/elements/AZButton';
import './Styles.css';
import { useEffect, useRef, useCallback } from 'react';


export default function Page() {
	const canvasRef = useRef(null);
	const iwRef = useRef(null); // size input
	const ibRef = useRef(null); // brain cells input
	const foodRef = useRef(null);
	const speedRef = useRef(null);

	const runtimeTimeoutRef = useRef(100);

	const petriRef = useRef([]);
	const widthRef = useRef(20);
	const cofRef = useRef(0);
	const cellRadRef = useRef(0);
	const foodRadRef = useRef(0);
	const pulRadRef = useRef(0);
	const bcRef = useRef(5);
	const fcRef = useRef(5);
	const idCounterRef = useRef(0);
	const lineWRef = useRef(1);
	const targetRef = useRef({ id: 1, type: 4 });
	const fixerRef = useRef(false);
	const stepsRef = useRef(0);

	const gameCtxRef = useRef(null);

	const draw = useCallback((force) => {
		const doForce = !!force;
		const ctx = gameCtxRef.current;
		if (!ctx) return;
		const petri = petriRef.current;
		const width = widthRef.current;
		const cof = cofRef.current;
		const cell_rad = cellRadRef.current;
		const food_rad = foodRadRef.current;
		const lineW = lineWRef.current;
		const pul_rad = pulRadRef.current;
		const target = targetRef.current;

		// Only skip frames during runtime with very fast speed for performance
		if (!doForce && runtimeTimeoutRef.current < 10 && stepsRef.current % 10 !== 0) return;

		let tx = -1,
			ty = -1;
		ctx.clearRect(0, 0, 1000, 1000);
		ctx.font = food_rad + 'px serif';

		for (let x = 0; x < width; x++) for (let y = 0; y < width; y++) {
			const cell = petri[x][y];
			switch (cell) {
				case TYPE.EMPTY:
					continue;
				case TYPE.MEAT:
					ctx.fillStyle = 'crimson';
					ctx.beginPath();
					ctx.arc((x + 0.5) * cof, (y + 0.5) * cof, food_rad, 0, 7);
					ctx.fill();
					continue;
				case TYPE.VEG:
					ctx.fillStyle = 'green';
					ctx.beginPath();
					ctx.arc((x + 0.5) * cof, (y + 0.5) * cof, food_rad, 0, 7);
					ctx.fill();
					continue;
				default:
					ctx.lineWidth = 1;
					ctx.strokeStyle = 'black';
					const r = 0.78 * petri[x][y].way;
					const fx = (x + 0.5) * cof;
					const fy = (y + 0.5) * cof;
					ctx.fillStyle = petri[x][y].kin;
					ctx.beginPath();
					ctx.arc(fx, fy, cell_rad, 0, 7);
					ctx.fill();
					ctx.stroke();
					ctx.fillStyle = 'black';
					ctx.beginPath();
					ctx.arc(fx, fy, cell_rad, 3.768 + r, 5.652 + r);
					ctx.fill();
					ctx.fillStyle = 'white';
					ctx.beginPath();
					ctx.arc(fx, fy, cell_rad, 3.925 + r, 5.495 + r);
					ctx.fill();
					if (target.type === TYPE.CELL && target.id === petri[x][y].id) {
						tx = x;
						ty = y;
					}
			}
		}

		if (targetRef.current.type !== TYPE.CELL) {
			tx = targetRef.current.x;
			ty = targetRef.current.y;
		}

		ctx.lineWidth = lineW;
		ctx.strokeStyle = 'gold';
		ctx.beginPath();
		ctx.arc((tx + 0.5) * cof, (ty + 0.5) * cof, pul_rad, 0, 7);
		ctx.stroke();
	}, []);

	const cycle = useCallback(() => {
		fixerRef.current = !fixerRef.current;
		const petri = petriRef.current;
		const width = widthRef.current;
		for (let i = fcRef.current; i > 0; i--) {
			const x = (Math.random() * width) | 0,
				y = (Math.random() * width) | 0;
			if (petri[x][y] === TYPE.EMPTY) petri[x][y] = TYPE.VEG;
		}

		for (let x = 0; x < width; x++) for (let y = 0; y < width; y++)
			if (typeof petri[x][y] === 'object' && petri[x][y].fixer !== fixerRef.current)
				petri[x][y].step(x, y);

		draw();
		stepsRef.current++;
		return true;
	}, [draw]);

	const setup = useCallback(() => {
		stepsRef.current = 0;

		const width = parseInt(iwRef.current.value, 10) || 20;
		widthRef.current = width;
		bcRef.current = parseInt(ibRef.current.value, 10) || 5;
		cofRef.current = Math.floor(1000 / width);
		cellRadRef.current = (cofRef.current * 0.4) | 0;
		foodRadRef.current = (cofRef.current * 0.3) | 0;
		lineWRef.current = (cofRef.current >> 4) | 0 || 1;
		pulRadRef.current = cofRef.current >> 1;

		petriRef.current = new Array(width);
		idCounterRef.current = 0;
		const cellRefs = { idCounterRef, fixerRef, petriRef, widthRef };
		for (let x = 0; x < width; x++) {
			petriRef.current[x] = [];
			for (let y = 0; y < width; y++) {
				petriRef.current[x][y] = Math.random() < 0.3 ? new Cell(bcRef.current, 0, null, null, cellRefs) : Math.random() < 0.3 ? TYPE.VEG : TYPE.EMPTY;
			}
		}
		draw();
	}, [draw]);

	const screen_clicked = useCallback((e) => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		const rect = canvas.getBoundingClientRect();
		const x = ((e.clientX - rect.left) / canvas.offsetWidth * 1000 / cofRef.current) | 0;
		const y = ((e.clientY - rect.top) / canvas.offsetHeight * 1000 / cofRef.current) | 0;
		const cell = petriRef.current[x] && petriRef.current[x][y];
		targetRef.current = typeof cell === 'object' ? { id: cell.id, type: TYPE.CELL } : { x: x, y: y, type: -TYPE.CELL };
		draw(true);
		if (typeof cell === 'object' && cell.prettyLog) cell.prettyLog();
	}, [draw]);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		const ctx = canvas.getContext('2d');
		gameCtxRef.current = ctx;

		// set defaults in inputs
		if (iwRef.current) iwRef.current.value = String(widthRef.current || 20);
		if (ibRef.current) ibRef.current.value = String(bcRef.current || 5);
		if (foodRef.current) foodRef.current.value = String(fcRef.current || 5);
		if (speedRef.current) speedRef.current.value = String(runtimeTimeoutRef.current || 100);

		setup();

		const handleClick = (e) => {
			screen_clicked(e);
			e.preventDefault();
		};
		canvas.addEventListener('click', handleClick);

		// keyboard shortcuts: P - toggle run/pause (click run button), S - step, R - reset
		const keyHandler = (e) => {
			if (e.code === 'KeyP') {
				const btn = document.querySelector('.az-run-button');
				if (btn) btn.click();
			} else if (e.code === 'KeyS') {
				cycle();
			} else if (e.code === 'KeyR') {
				setup();
			}
		};
		document.addEventListener('keydown', keyHandler);

		return () => {
			canvas.removeEventListener('click', handleClick);
			document.removeEventListener('keydown', keyHandler);
		};
	}, [cycle, setup, screen_clicked]);

	function Inner() {
		const { registerRunner, timeout, setTimeout, running } = useRuntime();

		useEffect(() => { registerRunner(cycle); }, [registerRunner]);

		useEffect(() => { runtimeTimeoutRef.current = timeout; }, [timeout]);

		useEffect(() => { if (!running) { draw(true); } }, [running]);

		return (
			<>
				<AZInstrumentsPanel>
					<AZInstrumentsSubpanel>
						<AZInputValue ref={iwRef} label="Size" color="magenta"
							min={10} max={100} step={1} defaultValue={20}
						/>
						<AZInputValue ref={ibRef} label="Brain cells" color="magenta"
							min={1} max={50} step={1} defaultValue={5}
						/>
						<AZButton onClick={setup} color="gold">Reset</AZButton>
						<AZRuntimeButton />
					</AZInstrumentsSubpanel>
					<AZInstrumentsSubpanel>
						<AZInputRange ref={foodRef} label="Food per cycle" color="green"
							min={0} max={50} defaultValue={5}
							onChange={(e) => { fcRef.current = parseInt(e.target.value, 10) || 0; }}
						/>
						<AZInputRange ref={speedRef} label="Delay between steps" color="purple"
							min={0} max={1000} defaultValue={runtimeTimeoutRef.current}
							onChange={(e) => { setTimeout(parseInt(e.target.value, 10) || 0); }}
						/>
					</AZInstrumentsSubpanel>
				</AZInstrumentsPanel>
				<canvas ref={canvasRef} id="game" className="unselectable" width={1000} height={1000} />
			</>
		);
	}

	return (
		<RuntimeProvider initialTimeout={runtimeTimeoutRef.current}>
			<Inner />
		</RuntimeProvider>
	);
}
