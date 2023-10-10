import Color4 from "../../../vox/material/Color4";
import { RenderableUnit } from "../entity/RenderableUnit";

/**
 * 实时图形渲染器
 */
class Renderer {
	private mGL: any | null = null;
	private mClearMask = 0x0;
	private mRenderableUnits: RenderableUnit[] = [];
	private mGLVer = 0;
	private mCanvas: HTMLCanvasElement | null = null;

	bgColor = new Color4(); // 记录背景RGBA颜色
	constructor() {}
	isWebGL2(): boolean {
		return this.mGLVer === 2;
	}
	isWebGL1(): boolean {
		return this.mGLVer === 1;
	}
	getGL():any | null {
		return this.mGL;
	}
	getCanvas():HTMLCanvasElement {
		return this.mCanvas;
	}
	get width(): number {
		return this.mCanvas.width;
	}
	get height(): number {
		return this.mCanvas.height;
	}
	setSize(width: number, height: number): void {
		const cv = this.mCanvas;
		if(cv) {
			cv.width = width;
			cv.height = height;
		}
	}
	/**
	 * 初始化渲染引器环境配置
	 */
	initialize(canvas: HTMLCanvasElement): void {
		if (this.mGL == null) {
			this.mCanvas = canvas;
			let attributes = {
				depth: true,
				premultipliedAlpha: false,
				alpha: true,
				antialias: true,
				stencil: false,
				preserveDrawingBuffer: true,
				powerPreference: "default"
			};
			this.mGL = canvas.getContext("webgl2", attributes);
			this.mGLVer = 2;
			if (!this.mGL) {
				this.mGL = canvas.getContext("webgl", attributes) || canvas.getContext("experimental-webgl", attributes);
				this.mGLVer = 1;
			}
			if (this.mGL) {
				this.mGL.webGLVer = this.mGLVer;
				this.mClearMask = this.mGL.COLOR_BUFFER_BIT | this.mGL.DEPTH_BUFFER_BIT | this.mGL.STENCIL_BUFFER_BIT;
				this.runBegin();
			} else {
				this.mGLVer = 0;
			}

		}
	}
	addRenderableUnit(unit: RenderableUnit): void {
		if (this.mGL && unit) {
			unit.buildGpuRes(this.mGL);
			this.mRenderableUnits.push(unit);
		}
	}
	runBegin(): void {
		if (this.mGLVer > 0) {
			const gl = this.mGL;
			const bc = this.bgColor;
			gl.viewport(0,0, this.width, this.height);
			gl.clearDepth(1.0);
			gl.clearColor(bc.r, bc.g, bc.b, bc.a);
			gl.clear(this.mClearMask);
		}
	}
	run(): void {
		if (this.mGLVer > 0) {
			// let len = this.mRenderableUnits.length;
			// for (let i = 0; i < len; ++i) {
			// 	this.mRenderableUnits[i].draw(this.mGL);
			// }
			const ts = this.mRenderableUnits;
			let len = ts.length;
			for (let i = 0; i < len; ++i) {
				ts[i].draw(this.mGL);
			}
		}
	}
	runEnd(): void {}
	destroy(): void {
		const ts = this.mRenderableUnits;
		let len = ts.length;
		for (let i = 0; i < len; ++i) {
			ts[i].destroy();
		}
	}
}

export { Renderer };
