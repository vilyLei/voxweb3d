/**
 * VoxTTGame — Match-3 Mini Game
 *
 * 4x4 grid of Box/Sphere entities with 3 colors.
 * Click a cell to flood-fill eliminate connected same-color group (>=2).
 * When no more moves remain, a full refill animation plays (scale 0->1).
 * If still no moves after refill, the game is over.
 */

import TTMock from "../app/platform/TTMock";
import RendererDevice from "../vox/render/RendererDevice";
import RendererParam from "../vox/scene/RendererParam";
import RendererScene from "../vox/scene/RendererScene";
import Box3DEntity from "../vox/entity/Box3DEntity";
import Sphere3DEntity from "../vox/entity/Sphere3DEntity";
import IRendererScene from "../vox/scene/IRendererScene";
import Color4 from "../vox/material/Color4";
import { SpecularMode, LambertLightMaterial } from "../vox/material/mcase/LambertLightMaterial";
import { MaterialContextParam, DebugMaterialContext } from "../materialLab/base/DebugMaterialContext";
import { PointLight } from "../light/base/PointLight";
import { DirectionLight } from "../light/base/DirectionLight";
import MouseEvent from "../vox/event/MouseEvent";
import MouseEvt3DDispatcher from "../vox/event/MouseEvt3DDispatcher";

// ---------------------------------------------------------------------------
// Grid constants
// ---------------------------------------------------------------------------
const COLS = 4;
const ROWS = 4;
const CELL_SPACING = 120;

const COLORS: Color4[] = [
    new Color4(1.0, 0.2, 0.2, 1.0), // Red
    new Color4(0.2, 1.0, 0.2, 1.0), // Green
    new Color4(0.2, 0.4, 1.0, 1.0), // Blue
];

interface GridCell {
    colorIdx: number;
    entity: Box3DEntity | Sphere3DEntity;
    material: LambertLightMaterial;
    alive: boolean;
}

interface FlashState {
    cells: number[];
    timer: number;
    duration: number;
    eliminate: boolean;
}

interface RefillCell {
    idx: number;
    colorIdx: number;
}

interface RefillState {
    cells: RefillCell[]; // new cells to pop in
    timer: number;
    duration: number;    // frames for scale 0->1
    afterGameOverCheck: boolean;
}

const enum GamePhase {
    Playing,
    Refilling,
    GameOver
}

// ---------------------------------------------------------------------------
export class VoxTTGame {

    private m_rscene: IRendererScene = null;
    private m_running = false;
    private m_materialCtx: DebugMaterialContext = new DebugMaterialContext();
    private m_grid: GridCell[] = [];
    private m_score = 0;
    private m_flash: FlashState | null = null;
    private m_refill: RefillState | null = null;
    private m_phase: GamePhase = GamePhase.Playing;
    private m_baseMat: LambertLightMaterial = null;

    constructor() {}

    initialize(): void {
        console.log("VoxTTGame::initialize() .....");

        (globalThis as any).VoxVerify = { isEnabled: () => true };

        TTMock.install();
        const tt = (globalThis as any).tt;

        const sysInfo = tt.getSystemInfoSync();
        const canvas = tt.createCanvas();
        const isMock = (tt._isMock === true);

        RendererDevice.SHADERCODE_TRACE_ENABLED = false;
        RendererDevice.VERT_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = true;

        const rparam = new RendererParam();
        rparam.autoSyncRenderBufferAndWindowSize = false;
        rparam.autoAttachingHtmlDoc = false;
        rparam.sysEvtReceived = false;
        rparam.syncBgColor = false;
        rparam.hideWindowFrame = false;
        // Use physical pixel dimensions for divW/divH to match touch coordinate space.
        // TTMock screenWidth/Height = Math.round(innerWidth/Height * dpr) = physical pixels.
        // Simulator screenWidth/Height are also physical pixels.
        rparam.divW = sysInfo.screenWidth;
        rparam.divH = sysInfo.screenHeight;
        rparam.maxWebGLVersion = 1;
        rparam.setCamProject(45.0, 10.0, 9000.0);
        rparam.setCamPosition(0.0, 600.0, 900.0);
        rparam.setCamLookAtPos(0.0, 0.0, 0.0);
        rparam.injectCanvas(canvas, sysInfo.pixelRatio);

        const rscene = new RendererScene();
        rscene.initialize(rparam).setAutoRunning(false);
        rscene.updateCamera();
        rscene.enableMouseEvent(false);
        this.m_rscene = rscene;

        // Touch events → stage3D
        const stage = rscene.getStage3D() as any;
        const dpr = sysInfo.pixelRatio;
        // Both TTMock and simulator: use screenHeight (physical px) for Y-flip.
        // TTMock touch clientX/Y are CSS px → multiply by dpr to get physical.
        // Simulator touch clientX/Y are already physical px.
        const stageH = sysInfo.screenHeight;
        console.log("[VoxTTGame] stageH:", stageH, "isMock:", isMock, "divW:", rparam.divW, "divH:", rparam.divH);

        const registerTouch = () => {
            tt.onTouchStart((res: any) => {
                const t = res.touches[0];
                if (!t) return;
                const px = isMock ? (0 | (dpr * t.clientX)) : (0 | t.clientX);
                const py = isMock ? (0 | (dpr * t.clientY)) : (0 | t.clientY);
                stage.mouseX = px;
                stage.mouseY = stageH - py;
                stage.mouseViewX = px;
                stage.mouseViewY = py;
                stage.mouseDown(1);
            });
            tt.onTouchMove((res: any) => {
                const t = res.touches[0];
                if (!t) return;
                const px = isMock ? (0 | (dpr * t.clientX)) : (0 | t.clientX);
                const py = isMock ? (0 | (dpr * t.clientY)) : (0 | t.clientY);
                stage.mouseX = px;
                stage.mouseY = stageH - py;
                stage.mouseViewX = px;
                stage.mouseViewY = py;
                stage.mouseMove();
            });
            tt.onTouchEnd((res: any) => {
                stage.mouseUp(1);
                stage.mouseClick();
            });
        };

        if (typeof tt.onShow === 'function') {
            tt.onShow(() => { registerTouch(); });
        }
        registerTouch();

        // Lambert lighting
        const mcParam = new MaterialContextParam();
        mcParam.pointLightsTotal = 1;
        mcParam.directionLightsTotal = 1;
        mcParam.spotLightsTotal = 0;
        mcParam.vsmEnabled = false;
        this.m_materialCtx.initialize(rscene, mcParam);

        const pointLight: PointLight = this.m_materialCtx.lightModule.getPointLightAt(0);
        if (pointLight != null) {
            pointLight.position.setXYZ(0.0, 400.0, 400.0);
            pointLight.color.setRGB3f(1.0, 1.0, 1.0);
        }
        const direcLight: DirectionLight = this.m_materialCtx.lightModule.getDirectionLightAt(0);
        if (direcLight != null) {
            direcLight.direction.setXYZ(0.3, -1.0, 0.6);
            direcLight.color.setRGB3f(0.6, 0.6, 0.6);
        }
        this.m_materialCtx.lightModule.update();

        // Base material template
        const baseMat = new LambertLightMaterial();
        baseMat.setMaterialPipeline(this.m_materialCtx.pipeline);
        baseMat.shadowReceiveEnabled = false;
        baseMat.fogEnabled = false;
        baseMat.lightEnabled = true;
        baseMat.specularMode = SpecularMode.FragColor;
        baseMat.initializeLocalData();
        baseMat.setSpecularIntensity(32.0);
        baseMat.setLightBlendFactor(0.6, 0.4);
        baseMat.setBlendFactor(0.2, 0.8);
        baseMat.setSpecularColor(new Color4(1.5, 1.5, 1.5));
        baseMat.setColor(new Color4(1.0, 1.0, 1.0, 1.0), new Color4(0.3, 0.3, 0.3));
        this.m_baseMat = baseMat;

        // Build 4x4 grid
        const totalW = (COLS - 1) * CELL_SPACING;
        const totalH = (ROWS - 1) * CELL_SPACING;
        const startX = -totalW * 0.5;
        const startZ = -totalH * 0.5;

        for (let row = 0; row < ROWS; row++) {
            for (let col = 0; col < COLS; col++) {
                const idx = row * COLS + col;
                const colorIdx = Math.floor(Math.random() * COLORS.length);

                const mat = new LambertLightMaterial();
                mat.copyFrom(baseMat);
                mat.setColor(COLORS[colorIdx], new Color4(0.3, 0.3, 0.3));

                let entity: Box3DEntity | Sphere3DEntity;
                if (idx % 2 === 0) {
                    const box = new Box3DEntity();
                    box.setMaterial(mat);
                    box.initializeCube(80);
                    entity = box;
                } else {
                    const sph = new Sphere3DEntity();
                    sph.setMaterial(mat);
                    sph.initialize(40, 12, 12);
                    entity = sph;
                }

                const px = startX + col * CELL_SPACING;
                const pz = startZ + row * CELL_SPACING;
                entity.setXYZ(px, 0, pz);
                entity.update();

                // Bind per-entity click event
                const capturedIdx = idx;
                const dispatcher = new MouseEvt3DDispatcher();
                dispatcher.addEventListener(MouseEvent.MOUSE_DOWN, this, (evt: any) => {
                    this.onCellClick(capturedIdx);
                });
                entity.setEvtDispatcher(dispatcher);
                entity.mouseEnabled = true;

                rscene.addEntity(entity);

                this.m_grid.push({ colorIdx, entity, material: mat, alive: true });
            }
        }

        console.log("[VoxTTGame] grid built, cells:", this.m_grid.length);

        // Render loop
        const raf: (cb: FrameRequestCallback) => void =
            typeof (globalThis as any).requestAnimationFrame === 'function'
                ? (cb) => (globalThis as any).requestAnimationFrame(cb)
                : (cb) => tt.requestAnimationFrame(cb);

        this.m_running = true;
        const loop = (): void => {
            if (!this.m_running) return;
            this.tick();
            raf(loop);
        };
        raf(loop);

        console.log("[VoxTTGame] initialize() done.");
    }

    // -----------------------------------------------------------------------
    // Game logic
    // -----------------------------------------------------------------------

    private onCellClick(idx: number): void {
        if (this.m_flash || this.m_refill || this.m_phase !== GamePhase.Playing) return;

        const cell = this.m_grid[idx];
        if (!cell || !cell.alive) return;

        const connected = this.floodFill(idx, cell.colorIdx);
        if (connected.length < 2) {
            this.m_flash = { cells: connected, timer: 0, duration: 45, eliminate: false };
            return;
        }
        this.m_flash = { cells: connected, timer: 0, duration: 75, eliminate: true };
    }

    private floodFill(startIdx: number, colorIdx: number): number[] {
        const visited: boolean[] = new Array(COLS * ROWS).fill(false);
        const result: number[] = [];
        const stack: number[] = [startIdx];

        while (stack.length > 0) {
            const idx = stack.pop();
            if (visited[idx]) continue;
            visited[idx] = true;

            const cell = this.m_grid[idx];
            if (!cell.alive || cell.colorIdx !== colorIdx) continue;

            result.push(idx);

            const row = Math.floor(idx / COLS);
            const col = idx % COLS;

            // 4-directional neighbors
            const neighbors: number[] = [];
            if (row > 0)        neighbors.push((row - 1) * COLS + col);
            if (row < ROWS - 1) neighbors.push((row + 1) * COLS + col);
            if (col > 0)        neighbors.push(row * COLS + (col - 1));
            if (col < COLS - 1) neighbors.push(row * COLS + (col + 1));

            for (const n of neighbors) {
                if (!visited[n]) stack.push(n);
            }
        }

        return result;
    }

    private tick(): void {
        if (!this.m_rscene) return;
        this.tickFlash();
        this.tickRefill();
        this.m_rscene.run();
    }

    private tickFlash(): void {
        const f = this.m_flash;
        if (!f) return;

        f.timer++;
        const t = f.timer / f.duration;
        const brightness = 0.5 + 0.5 * Math.sin(t * Math.PI * 3);
        const flashColor = new Color4(brightness, brightness, brightness, 1.0);

        for (const i of f.cells) {
            const cell = this.m_grid[i];
            const base = COLORS[cell.colorIdx];
            const r = base.r + (flashColor.r - base.r) * brightness;
            const g = base.g + (flashColor.g - base.g) * brightness;
            const b = base.b + (flashColor.b - base.b) * brightness;
            cell.material.setColor(new Color4(r, g, b, 1.0), new Color4(0.3, 0.3, 0.3));
        }

        if (f.timer >= f.duration) {
            if (f.eliminate) {
                for (const i of f.cells) {
                    this.m_grid[i].alive = false;
                    this.m_grid[i].entity.setVisible(false);
                    this.m_grid[i].entity.setScaleXYZ(1, 1, 1); // reset scale
                }
                this.m_score += f.cells.length;
                console.log("[VoxTTGame] eliminated:", f.cells.length, "score:", this.m_score);
                // After every elimination, check if moves remain
                this.checkMovesOrRefill();
            } else {
                for (const i of f.cells) {
                    const cell = this.m_grid[i];
                    cell.entity.setScaleXYZ(1, 1, 1);
                    cell.material.setColor(COLORS[cell.colorIdx], new Color4(0.3, 0.3, 0.3));
                }
            }
            this.m_flash = null;
        }
    }

    // After each elimination: if no moves left, start refill animation.
    private checkMovesOrRefill(): void {
        if (this.hasAnyMove()) return; // still playable, do nothing
        // No moves left — refill entire grid with scale-in animation
        this.startRefill(true);
    }

    private hasAnyMove(): boolean {
        const total = COLS * ROWS;
        for (let i = 0; i < total; i++) {
            const cell = this.m_grid[i];
            if (!cell.alive) continue;
            if (this.floodFill(i, cell.colorIdx).length >= 2) return true;
        }
        return false;
    }

    // -----------------------------------------------------------------------
    // Refill: assign new random colors to ALL cells, animate scale 0->1.
    // -----------------------------------------------------------------------
    private startRefill(afterGameOverCheck: boolean): void {
        this.m_phase = GamePhase.Refilling;
        const newCells: RefillCell[] = [];
        for (let i = 0; i < COLS * ROWS; i++) {
            const colorIdx = Math.floor(Math.random() * COLORS.length);
            newCells.push({ idx: i, colorIdx });
        }
        // Apply new colors immediately but start invisible (scale=0)
        for (const c of newCells) {
            const cell = this.m_grid[c.idx];
            cell.colorIdx = c.colorIdx;
            cell.alive = true;
            cell.entity.setVisible(true);
            cell.entity.setScaleXYZ(0, 0, 0);
            cell.material.setColor(COLORS[c.colorIdx], new Color4(0.3, 0.3, 0.3));
        }
        this.m_refill = { cells: newCells, timer: 0, duration: 40, afterGameOverCheck };
        console.log("[VoxTTGame] refill started.");
    }

    private tickRefill(): void {
        const r = this.m_refill;
        if (!r) return;

        r.timer++;
        // Ease-out: scale goes from 0 to 1 with overshoot
        const t = r.timer / r.duration;
        const s = t < 1 ? (1.1 * Math.sin(t * Math.PI * 0.5)) : 1.0; // slight overshoot at t=0.9
        const scale = Math.min(s, 1.0);

        for (const c of r.cells) {
            this.m_grid[c.idx].entity.setScaleXYZ(scale, scale, scale);
        }

        if (r.timer >= r.duration) {
            // Ensure final scale = 1
            for (const c of r.cells) {
                this.m_grid[c.idx].entity.setScaleXYZ(1, 1, 1);
            }
            this.m_refill = null;
            this.m_phase = GamePhase.Playing;
            console.log("[VoxTTGame] refill done.");

            if (r.afterGameOverCheck && !this.hasAnyMove()) {
                // Still no moves after refill — truly game over
                this.m_phase = GamePhase.GameOver;
                console.log("[VoxTTGame] GAME OVER! Final score:", this.m_score);
                // Flash all cells as game-over signal
                const all = this.m_grid.map((_, i) => i).filter(i => this.m_grid[i].alive);
                this.m_flash = { cells: all, timer: 0, duration: 90, eliminate: false };
            }
        }
    }

    run(): void {}

    destroy(): void {
        this.m_running = false;
        this.m_rscene = null;
        this.m_grid = [];
    }
}

export default VoxTTGame;

// Auto-start
if (typeof (globalThis as any).tt !== "undefined") {
    const _game = new VoxTTGame();
    _game.initialize();
}
