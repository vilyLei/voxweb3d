import { UniformUnit } from "./UniformUnit";
class UUIDPool {
	private mMap: Map<string, number> = new Map();
	programMap: Map<string, any> = new Map();

	attach(uuid: string): void {
		const map = this.mMap;
		if (map.has(uuid)) {
			if (map.get(uuid) < 0) {
				map.set(uuid, 1);
			} else {
				map.set(uuid, map.get(uuid) + 1);
			}
		} else {
			map.set(uuid, 1);
		}
	}
	detach(uuid: string): void {
		const map = this.mMap;
		if (map.has(uuid)) {
			map.set(uuid, map.get(uuid) - 1);
		}
	}

	isExist(uuid: string): boolean {
		const map = this.mMap;
		if (map.has(uuid)) {
			return map.get(uuid) > 0;
		}
		return false;
	}
}

class Shader {
	private mVtxGLSL: string = `#version 300 es
precision highp float;
layout(location = 0) in vec3 a_vs;
void main(){
    gl_Position = vec4(a_vs,1.0);
}
`;
	private mFragGLSL: string = `#version 300 es
precision mediump float;
uniform vec4 color;
layout(location = 0) out vec4 FragColor;
void main(){
    FragColor = color;
}
`;
	private static sPool = new UUIDPool();
	private mGL: any = null;
	private mParam: any = null;
	private mFrgShd: any = null;
	private mVtxShd: any = null;
	private mProgram: any = null;
	private mUniforms: UniformUnit[] | null = null;
	private mProgUUID = "";
	private mDirty = true;

	constructor(vtxGLSL: string = "", fragGLSL: string = "", uuid: string = "", params: any = null) {
		this.mVtxGLSL = vtxGLSL;
		this.mFragGLSL = fragGLSL;
		this.mProgUUID = uuid;
		this.mParam = params;
	}

	private loadShader(type: number, source: string): any {
		const gl = this.mGL;
		let shader = gl.createShader(type);
		gl.shaderSource(shader, source);
		gl.compileShader(shader);
		if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
			console.error("An error occurred compiling the shaders: " + gl.getShaderInfoLog(shader));
			gl.deleteShader(shader);
			return null;
		}
		return shader;
	}
	get uuid(): string {
		return this.mProgUUID;
	}
	initialize(vtxGLSL: string, fragGLSL: string, uuid: string = "", params: any = null): void {
		this.mVtxGLSL = vtxGLSL;
		this.mFragGLSL = fragGLSL;
		this.mDirty = this.mProgUUID != uuid;
		this.mParam = params;
	}
	buildGpuRes(gl: any, params: any = null): void {
		params = params ? params : this.mParam;
		if (this.mDirty && params) {
			this.mDirty = false;

			this.mParam = params;
			this.mGL = gl;
			this.mUniforms = [];

			// 先检查 对应uuid的 program 是否存在, 如果存在，则直接使用

			const pool = Shader.sPool;
			const uuid = this.mProgUUID;

			let shdp: any = null;
			if (pool.isExist(uuid)) {
				pool.attach(uuid);

				const obj = pool.programMap.get(uuid);
				shdp = obj.program;
				this.mFrgShd = obj.frgShd;
				this.mVtxShd = obj.vtxShd;
			} else {
				this.mFrgShd = this.loadShader(gl.FRAGMENT_SHADER, this.mFragGLSL);
				this.mVtxShd = this.loadShader(gl.VERTEX_SHADER, this.mVtxGLSL);
				shdp = gl.createProgram();
				gl.attachShader(shdp, this.mFrgShd);
				gl.attachShader(shdp, this.mVtxShd);
				gl.linkProgram(shdp);

				if (!gl.getProgramParameter(shdp, gl.LINK_STATUS)) {
					console.error("Unable to initialize the shader mProgram: " + gl.getProgramInfoLog(shdp));
				}
				pool.programMap.set(uuid, { program: shdp, frgShd: this.mFrgShd, vtxShd: this.mVtxShd });
			}
			pool.attach(uuid);
			this.mProgram = shdp;

			let ti = gl.TEXTURE0;
			const itot = gl.getProgramParameter(shdp, gl.ACTIVE_UNIFORMS);

			for (let i = 0; i < itot; ++i) {
				const info = gl.getActiveUniform(shdp, i);

				let ns = info.name as string;
				const k = ns.indexOf("[");
				if (k > 0) {
					ns = ns.slice(0, k);
				}
				const param = params[ns];
				if (param && param.value) {
					const su = gl.getUniformLocation(shdp, info.name);
					const unit = new UniformUnit();
					unit.rawName = ns;
					unit.param = param;
					unit.textureIndex = ti;
					unit.setWebGLActiveInfo(gl, su, info);

					if (param.offset !== undefined && !Number.isNaN(param.offset)) {
						unit.offset = param.offset;
					}
					// console.log("	xxx UniformUnit instance: ", unit);
					this.mUniforms.push(unit);
					if (unit.isTexture()) {
						ti++;
					}
				}
			}
		}
	}

	use(gl: any): void {
		if (this.mGL === gl && gl) {
			if (this.mDirty) {
				this.buildGpuRes(gl);
			}
			gl.useProgram(this.mProgram);
			const us = this.mUniforms;
			if (us) {
				for (let i = 0, ln = us.length; i < ln; ++i) {
					us[i].useUniform(gl);
				}
			}
		}
	}

	destroy(): void {
		if (this.mGL) {
			const gl = this.mGL;
			if (this.mProgram) {
				const uuid = this.mProgUUID;
				const pool = Shader.sPool;
				pool.detach(uuid);

				if (!pool.isExist(uuid)) {
					if (!gl.isContextLost()) {
						gl.deleteShader(this.mVtxShd);
						gl.deleteShader(this.mFrgShd);
						gl.deleteProgram(this.mProgram);
					}
					pool.programMap.delete(uuid);
				}
				this.mVtxShd = null;
				this.mFrgShd = null;
				this.mProgram = null;
			}
			this.mGL = null;
		}
		this.mDirty = true;
		this.mParam = null;
	}
}

export { Shader };
