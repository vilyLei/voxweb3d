
import { Shader } from "../engine/material/Shader";
import { RenderableUnit } from "../engine/entity/RenderableUnit";
import { MiniREngine } from "../engine/MiniREngine";
import {ImageTexture} from "../engine/texture/ImageTexture";

import vtxGLSLSrc0 from './shaders/glsl1test.vert.glsl';
import fragGLSLSrc0 from './shaders/glsl1test.frag.glsl';

/**
 * 单纹理功能测试 demo
 */
export class GLSL1Test {
	private engine = new MiniREngine();
	private materialParams: any = {
		param: {
			value: [1.0, 1.0, 800.0, 600.0] // 色彩强度
		},
		color: {
			value: [0.5, 3.0, 1.0, 1.0] // 色彩强度
		},
		tex01: null
	};
	constructor() {}

	initialize(): void {

		this.engine.initialize();

		let tex = new ImageTexture(this.engine.renderer.getGL());
		tex.flipY = true;
		let img = new Image();
        img.onload = (): void => {
			console.log("loaded an img.");
			tex.setDataFromImage(img);
		}
        img.src = "static/assets/default.jpg";
		this.materialParams.tex01 = {value: tex};

		let unit = new RenderableUnit();

		unit.material.params = this.materialParams;
		unit.material.initialize(new Shader(vtxGLSLSrc0, fragGLSLSrc0));

		unit.geometryBuffer.setVertexs(new Float32Array([-1, -1, 0, 1, -1, 0, 1, 1, 0, -1, 1, 0]));

		this.engine.addRenderableUnit(unit);
	}
	run(): void {
		this.engine.run();
	}
}

export default GLSL1Test;
