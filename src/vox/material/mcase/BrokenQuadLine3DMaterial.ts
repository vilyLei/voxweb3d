/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import ShaderUniformData from "../../../vox/material/ShaderUniformData";
import ShaderCodeBuffer from "../../../vox/material/ShaderCodeBuffer";
import MaterialBase from "../../../vox/material/MaterialBase";
import IColorMaterial from "./IColorMaterial";
import Color4 from "../Color4";
class BrokenQuadLine3DShaderBuffer extends ShaderCodeBuffer {
    constructor() {
        super();
    }
    private static s_instance: BrokenQuadLine3DShaderBuffer = null;
    private m_uniqueName: string = "";
    dynColorEnabled: boolean = false;
    initialize(texEnabled: boolean): void {
        //console.log("BrokenQuadLine3DShaderBuffer::initialize()...");
        this.m_uniqueName = "BrokenQuadLine3DShd";
        if (this.dynColorEnabled) {
            this.m_uniqueName += "_dynColor";
        }
    }
    getFragShaderCode(): string {
        let fragCode: string =
            `
precision mediump float;
varying vec4 v_vtxColor;
void main()
{
    gl_FragColor = v_vtxColor;
}
`;
        return fragCode;
    }
    getVertShaderCode(): string {
        let vtxCode: string =
            `
precision mediump float;
attribute vec4 a_vs;
attribute vec4 a_vs2;
`;
        if (this.dynColorEnabled) {
            vtxCode += "\nuniform vec4 u_color;";
        }
        else {
            vtxCode += "\nattribute vec4 a_cvs;";
        }
        vtxCode +=
            `
attribute vec4 a_cvs2;
uniform vec4 u_stageParam;
uniform vec4 u_frustumParam;
uniform mat4 u_objMat;
uniform mat4 u_viewMat;
uniform mat4 u_projMat;
varying vec4 v_vtxColor;
void main()
{
vec4 pc = u_frustumParam;
vec4 ps = u_stageParam;
mat4 voMat4 = u_viewMat * u_objMat;
float nearZ = pc[0];

// cvs2 is prev pos
// vs is curr pos
// vs2 is next pos
// prev pos -> curr pos -> next pos

vec4 prev = voMat4 * vec4(a_cvs2.xyz, 1.0);
vec4 pos = voMat4 * vec4(a_vs.xyz, 1.0);
vec4 pv1b = pos;
vec4 next = voMat4 * vec4(a_vs2.xyz, 1.0);

float f = (pos.z < nearZ) ? 0.0 : 1.0;
vec3 dir = next.xyz - pos.xyz;
vec3 pv3 = ((pos.z - 1.0)/(pos.z - next.z)) * dir;
pv3 = (pos.xyz + pv3) * f;
pos.xyz = pos.xyz * (1.0 - f) + pv3;
float sk = 1.0;//pc[3] / nearZ / ps[2];
// calc screen pos
dir = next.xyz - pos.xyz;
f = abs(pos.z) * sk;
pv3 = normalize(cross(dir, pos.xyz)) * f;

f = (prev.z < nearZ) ? 0.0 : 1.0;
dir = pv1b.xyz - prev.xyz;
vec3 pv3b = ((prev.z - 1.0)/(prev.z - pv1b.z)) * dir;
pv3b = (prev.xyz + pv3b) * f;
prev.xyz = prev.xyz * (1.0 - f) + pv3b;

// calc screen pos
dir = pv1b.xyz - prev.xyz;
f = abs(prev.z) * sk;
pv3b = normalize(cross(dir, prev.xyz)) * f;

pv3 = normalize(pv3);
pv3b = normalize(pv3b);
dir = pv3;
pv3b = normalize(pv3 + pv3b);
f = abs(dot(pv3b, dir));
f = a_vs.w / f;
pv3b *= f;
gl_Position = u_projMat * vec4(pv3b + pos.xyz, 1.0);
`;
        if (this.dynColorEnabled) {
            vtxCode += "\nv_vtxColor = u_color;";
        }
        else {
            vtxCode += "\nv_vtxColor = a_cvs;";
        }
        // vtxCode += "\nv_vtxColor = vec4(abs(dir), 1.0);";
        vtxCode += "\n}";
        return vtxCode;
    }
    getUniqueShaderName(): string {
        //console.log("H ########################### this.m_uniqueName: "+this.m_uniqueName);
        return this.m_uniqueName;
    }
    toString(): string {
        return "[BrokenQuadLine3DShaderBuffer()]";
    }

    static GetInstance(): BrokenQuadLine3DShaderBuffer {
        if (BrokenQuadLine3DShaderBuffer.s_instance != null) {
            return BrokenQuadLine3DShaderBuffer.s_instance;
        }
        BrokenQuadLine3DShaderBuffer.s_instance = new BrokenQuadLine3DShaderBuffer();
        return BrokenQuadLine3DShaderBuffer.s_instance;
    }
}

export default class BrokenQuadLine3DMaterial extends MaterialBase implements IColorMaterial {
    private m_dynColorEnabled: boolean = false;
    private m_data: Float32Array = null;
    
    premultiplyAlpha: boolean = false;
    normalEnabled: boolean = false;
    shadowReceiveEnabled: boolean = false;
    
    constructor(dynColorEnabled: boolean = false) {
        super();
        if (dynColorEnabled) {
            this.m_data = new Float32Array([1.0, 1.0, 1.0, 1.0]);
        }
        this.m_dynColorEnabled = dynColorEnabled;
    }

    getCodeBuf(): ShaderCodeBuffer {
        BrokenQuadLine3DShaderBuffer.GetInstance().dynColorEnabled = this.m_dynColorEnabled;
        return BrokenQuadLine3DShaderBuffer.GetInstance();
    }
    setRGB3f(pr: number, pg: number, pb: number): void {
        this.m_data[0] = pr;
        this.m_data[1] = pg;
        this.m_data[2] = pb;
    }
    getRGB3f(color: Color4): void {
        let ds = this.m_data;
        color.setRGB3f(ds[0], ds[1], ds[2]);
    }
    setRGBA4f(pr: number, pg: number, pb: number, pa: number): void {
        this.m_data[0] = pr;
        this.m_data[1] = pg;
        this.m_data[2] = pb;
        this.m_data[3] = pa;
    }
    getRGBA4f(color: Color4): void {
        color.fromArray(this.m_data);
    }
    setAlpha(pa: number): void {
        this.m_data[3] = pa;
    }
    getAlpha(): number {
        return this.m_data[3];
    }
    setColor(color: Color4): void {
        color.toArray(this.m_data);
    }
    getColor(color: Color4): void {
        color.fromArray(this.m_data);
    }
    createSelfUniformData(): ShaderUniformData {
        if (this.m_dynColorEnabled) {
            let oum: ShaderUniformData = new ShaderUniformData();
            oum.uniformNameList = ["u_color"];
            oum.dataList = [this.m_data];
            return oum;
        }
        return null;
    }
}