/*
thanks: https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getActiveUniform

gl.FLOAT
gl.FLOAT_VEC2
gl.FLOAT_VEC3
gl.FLOAT_VEC4
gl.INT
gl.INT_VEC2
gl.INT_VEC3
gl.INT_VEC4
gl.BOOL
gl.BOOL_VEC2
gl.BOOL_VEC3
gl.BOOL_VEC4
gl.FLOAT_MAT2
gl.FLOAT_MAT3
gl.FLOAT_MAT4
gl.SAMPLER_2D
gl.SAMPLER_CUBE
*/
class UniformUnit {
	private mIsTex = false;
	rawName = "";
	type = 0;
	size = 0;
	name = "";
	su = 0;
	textureIndex = 0;
	offset = 0;
	/**
	 * {value:xxx, }
	 */
	param: any;
	useUniform: ((gl: any) => void) | null;
	constructor(){}
	private static initSysParams(gl: any):void{
		if(gl.FLOAT_VEC4FV === undefined) {
			gl.FLOAT_VEC4FV = 3010034;
			gl.FLOAT_VEC3FV = 3010033;
			gl.FLOAT_VEC2FV = 3010032;
		}
	}
	setWebGLActiveInfo(gl: any, su:number, info: any): void {

		UniformUnit.initSysParams(gl);

		if(gl.webGLVer == 2) {
			this.useUniform = this.useUniformV2;
		}else {
			this.useUniform = this.useUniformV1;
		}

		this.su = su;

		this.type = info.type;
		this.size = info.size;
		this.name = info.name;
		this.mIsTex = false;
		if(this.name.indexOf('[') > 0) {
			switch (this.type) {
				case gl.FLOAT_VEC4:
					this.type = gl.FLOAT_VEC4FV;
					break;
				case gl.FLOAT_VEC3:
					this.type = gl.FLOAT_VEC3FV;
					break;
				case gl.FLOAT_VEC2:
					this.type = gl.FLOAT_VEC2FV;
					break;
				case gl.SAMPLER_2D:
					this.mIsTex = true;
					break;
				default:
					break;
			}
		}else {
			switch (this.type) {
				case gl.SAMPLER_2D:
					this.mIsTex = true;
					break;
				default:
					break;
			}
		}
	}
	isTexture(): boolean {
		return this.mIsTex;
	}
    private useUniformV2(gl: any): void {

		const su = this.su;
		const dataSize = this.size;
		const offset = this.offset;
		const value = this.param.value as any;
        // console.log("useUniformV2 A, type:",type,", dataSize: ",dataSize);
        switch (this.type) {
            case gl.FLOAT_MAT4:
                gl.uniformMatrix4fv(su, false, value, offset, dataSize * 16);
                break;
            case gl.FLOAT_MAT3:
                gl.uniformMatrix3fv(su, false, value, 0, dataSize * 9);
                break;
            case gl.FLOAT_VEC4FV:
                // console.log("useUniformV2, value: ",value);
                gl.uniform4fv(su, value, offset, dataSize * 4);
                break;
            case gl.FLOAT_VEC3FV:
                gl.uniform3fv(su, value, offset, dataSize * 3);
                break;
            case gl.FLOAT_VEC4:
                // console.log("useUniformV2, vec4 value.length: ",value.length);
                gl.uniform4f(su, value[0], value[1], value[2], value[3]);
                break;
            case gl.FLOAT_VEC3:
                gl.uniform3f(su, value[0], value[1], value[2]);
                break;
            case gl.FLOAT_VEC2:
                gl.uniform2f(su, value[0], value[1]);
                break;
            case gl.FLOAT:
                gl.uniform1f(su, value);
                break;
            case gl.SAMPLER_2D:
                value.__$$upload(gl);
                value.__$$use(gl,su, this.textureIndex);
                break;
            default:
                break;
        }
    }
    private useUniformV1(gl: any): void {

		const su = this.su;
		const dataSize = this.size;
		const value = this.param.value;
        switch (this.type) {
            case gl.FLOAT_MAT4:
                gl.uniformMatrix4fv(su, false, value);
                break;
            case gl.FLOAT_MAT3:
                gl.uniformMatrix3fv(su, false, value);
                break;
            case gl.FLOAT_VEC4FV:
                gl.uniform4fv(su, value, dataSize * 4);
                break;
            case gl.FLOAT_VEC3FV:
                gl.uniform3fv(su, value, dataSize * 3);
                break;
            case gl.FLOAT_VEC4:
                gl.uniform4f(su, value[0], value[1], value[2], value[3]);
                break;
            case gl.FLOAT_VEC3:
                gl.uniform3f(su, value[0], value[1], value[2]);
                break;
            case gl.FLOAT_VEC2:
                gl.uniform2f(su, value[0], value[1]);
                break;
            case gl.FLOAT:
                gl.uniform1f(su, value);
                break;
            case gl.SAMPLER_2D:
                value.__$$upload(gl);
                value.__$$use(gl,su, this.textureIndex);
                break;
            default:
                break;
        }
    }
	destroy(): void {
		this.useUniform = null;
		this.param = null;
	}

}

export {UniformUnit}
