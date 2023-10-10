
import { Shader } from "../engine/material/Shader";
import { RenderableUnit } from "../engine/entity/RenderableUnit";
import { MiniREngine } from "../engine/MiniREngine";
import {ImageTexture} from "../engine/texture/ImageTexture";

let vtxGLSLSrc0: string = `#version 300 es
precision highp float;
layout(location = 0) in vec3 a_vs;
void main(){
    gl_Position = vec4(a_vs,1.0);
}
`;

let fragGLSLSrc0: string = `#version 300 es
precision mediump float;
uniform sampler2D tex01;
uniform vec4 param;
uniform vec4 color;
layout(location = 0) out vec4 FragColor;
void main(){
    vec2 pos = gl_FragCoord.xy/param.zw;
	vec4 tcolor = texture( tex01, pos );
    FragColor = color * tcolor;
}
`;
/**
 * 单纹理功能测试 demo
 */
export class TextureRendering {
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
			console.log("load a img.");
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

export default TextureRendering;
