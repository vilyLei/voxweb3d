/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import ShaderCodeBuffer from "../../../vox/material/ShaderCodeBuffer";
import ShaderUniformData from "../../../vox/material/ShaderUniformData";
import MaterialBase from "../../../vox/material/MaterialBase";
import Color4 from "../../../vox/material/Color4";
import FloatTextureProxy from "../../../vox/texture/FloatTextureProxy";
import { TextureConst } from "../../../vox/texture/TextureConst";
import TextureBlock from "../../../vox/texture/TextureBlock";
import Matrix4 from "../../../vox/math/Matrix4";
import MathConst from "../../../vox/math/MathConst";

class TransFromTexShaderBuffer extends ShaderCodeBuffer {
    constructor() {
        super();
    }
    private static s_instance: TransFromTexShaderBuffer = new TransFromTexShaderBuffer();
    private m_uniqueName: string = "";

    initialize(texEnabled: boolean): void {
        super.initialize(texEnabled);
        this.m_uniqueName = "TransFromTexShd";
        this.adaptationShaderVersion = false;
    }
    private buildThisCode(): void {

        let coder = this.m_coder;
        coder.reset();

        coder.addVertLayout("vec3", "a_vs");
        coder.addVertLayout("vec2", "a_uvs");

        coder.addVarying("vec2", "v_uv");
        //coder.addVarying("vec4", "v_param");

        coder.addFragOutput("vec4", "FragColor0");
        coder.addVertUniform("vec4", "u_params", 2);
        coder.addTextureSample2D();
        coder.addTextureSample2D("", true, false, true);

        coder.useVertSpaceMats(false, true, true);

    }
    getFragShaderCode(): string {

        this.buildThisCode();

        this.m_coder.addFragMainCode(
            `
void main() {
    FragColor0 = VOX_Texture2D(u_sampler0, v_uv.xy);
}
`
        );

        return this.m_coder.buildFragCode();
    }
    getVertShaderCode(): string {

        this.m_coder.addVertMainCode(
            `
void main() {

    vec4 texParam = u_params[0];
    float index = texParam.z;
    float iV = index * 4.0;
    float iU = floor(fract(iV / texParam.x) * texParam.x);
    iV = floor(iV/texParam.x) / texParam.y;
    vec4 matV0 = VOX_Texture2D(u_sampler1, vec2((iU      ) / texParam.x, iV));
    vec4 matV1 = VOX_Texture2D(u_sampler1, vec2((iU + 1.0) / texParam.x, iV));
    vec4 matV2 = VOX_Texture2D(u_sampler1, vec2((iU + 2.0) / texParam.x, iV));
    vec4 matV3 = VOX_Texture2D(u_sampler1, vec2((iU + 3.0) / texParam.x, iV));

    mat4 transMat = mat4(matV0,matV1,matV2,matV3);
    
    vec4 pos = transMat * vec4(a_vs.xyz,1.0);

    gl_Position = u_projMat * u_viewMat * pos;
    v_uv = a_uvs.xy;
}
`
        );
        return this.m_coder.buildVertCode();

    }
    getUniqueShaderName(): string {
        return this.m_uniqueName;
    }
    toString(): string {
        return "[TransFromTexShaderBuffer()]";
    }
    static GetInstance(): TransFromTexShaderBuffer {
        return TransFromTexShaderBuffer.s_instance;
    }
}

export default class TransFromTexMaterial extends MaterialBase {

    private m_params: Float32Array = new Float32Array([
        64.0, 64.0, 0.0, 0.0,
        64.0, 64.0, 1.0, 0.0
    ]);
    constructor() {
        super();
    }

    getCodeBuf(): ShaderCodeBuffer {
        let buf: TransFromTexShaderBuffer = TransFromTexShaderBuffer.GetInstance();
        return buf;
    }
    setTransTexSize(texWidth: number, texHeight: number): void {
        this.m_params[0] = texWidth;
        this.m_params[1] = texHeight;
    }
    setMat4Index(index: number): void {
        this.m_params[2] = index;
    }
    createSelfUniformData(): ShaderUniformData {
        let oum: ShaderUniformData = new ShaderUniformData();
        oum.uniformNameList = ["u_params"];
        oum.dataList = [this.m_params];
        return oum;
    }
}
export class Matrix4Texture {

    private m_tex: FloatTextureProxy = null;
    private m_dataFS32: Float32Array = null;
    constructor() { }

    getWidth(): number {
        return this.m_tex.getWidth();
    }
    getHeight(): number {
        return this.m_tex.getHeight();
    }
    getTexture(): FloatTextureProxy {
        return this.m_tex;
    }
    inittialize(texBlock: TextureBlock, total: number = 64): void {

        if (this.m_tex == null) {

            let size: number = Math.round(Math.sqrt(total) + 1);
            size = MathConst.GetNearestCeilPow2(size);
            console.log("Matrix4Texture size: ", size, "total: ", total);
            size *= 4;
            let width: number = size;
            let height: number = size;
            console.log("Matrix4Texture width: ", width, "height: ", height);

            let dataFS32: Float32Array = new Float32Array(width * height * 4);

            let tex = texBlock.createFloatTex2D(width, width) as FloatTextureProxy;
            tex.mipmapEnabled = false;
            tex.minFilter = TextureConst.NEAREST;
            tex.magFilter = TextureConst.NEAREST;
            tex.setDataFromBytes(dataFS32, 0, width, width, 0,0,false);
            tex.__$attachThis();
            this.m_tex = tex;
            this.m_dataFS32 = dataFS32;
        }
    }
    setMatrix4At(i: number, mat4: Matrix4): void {
        if (this.m_dataFS32 != null) {
            this.m_dataFS32.set(mat4.getLocalFS32(), i * 16);
            //console.log("this.m_dataFS32: ",this.m_dataFS32);
        }
    }
}