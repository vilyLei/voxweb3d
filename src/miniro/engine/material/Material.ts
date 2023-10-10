import {Shader} from "./Shader";

/**
 * 材质
 */
class Material {
    private mShader: Shader = null;
	params: any = {color: {value: new Float32Array([0.7, 0.1, 1.0, 1.0])}};
    constructor() {}

    initialize(shader: Shader): void {
        if (!this.mShader && shader) {
            this.mShader = shader;
        }
    }
    getShader(): Shader {
        return this.mShader;
    }
	buildGpuRes(gl: any): void {
		// 构建GPU端shader
		const shd = this.mShader;
        if (shd != null) {
            shd.buildGpuRes(gl, this.params);
        }
	}
    use(gl: any): void {
        if (this.mShader) {
			this.mShader.use(gl);
        }
    }
	destroy(force: boolean = true): void {
		if (this.mShader) {
			if(force) {
				this.mShader.destroy();
			}
			this.mShader = null;
		}
	}
}


export { Material };
