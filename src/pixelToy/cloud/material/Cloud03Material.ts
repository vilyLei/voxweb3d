/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import ShaderCodeBuffer from "../../../vox/material/ShaderCodeBuffer";
import ShaderUniformData from "../../../vox/material/ShaderUniformData";
import MaterialBase from "../../../vox/material/MaterialBase";

class Cloud03ShaderBuffer extends ShaderCodeBuffer {
    constructor() {
        super();
    }
    private static s_instance: Cloud03ShaderBuffer = null;
    private m_uniqueName = "";
    private m_hasTex = false;
    mapLodEnabled = false;
	fixScreen = true;
    initialize(texEnabled: boolean): void {
        this.m_uniqueName = "Cloud03Shd";
        this.m_hasTex = texEnabled;
        if (texEnabled) {
            this.m_uniqueName += "_tex";
            if(this.mapLodEnabled) this.m_uniqueName += "Lod";
        }
		if(this.fixScreen) this.m_uniqueName += "FixScreen";
    }

    buildShader(): void {
        let coder = this.m_coder;
        coder.mapLodEnabled = false;
        if (this.m_hasTex) {
            coder.mapLodEnabled = this.mapLodEnabled;
            this.m_uniform.addDiffuseMap();
        }
        coder.addFragUniform("vec4", "u_params", 2);
		if(this.fixScreen) {
			coder.addDefine("VOX_FIX_SCREEN");
			coder.useVertSpaceMats(true, false, false);
		}

let paramCodeStr = `
float iTime = 0.1;
vec4 iResolution = vec4(128, 128, 1.0,1.0);
vec4 iMouse = vec4(128.0, 0.5, 0.0,0.0);
		`;

		this.m_coder.addFragFunction( paramCodeStr );

		// thanks: https://www.shadertoy.com/view/WslGWl
let codeStr = `

#define T VOX_Texture2D(VOX_DIFFUSE_MAP,(s*p.zw+ceil(s*p.x))/2e2).y/(s+=s)*4.
void mainImage(out vec4 O,vec2 x){
    vec4 p,d=vec4(.8,0,x/iResolution.y-.8),c=vec4(.6,.7,d);
    O=c-d.w;
    for(float f,s,t=2e2+sin(dot(x,x));--t>0.;p=.05*t*d)
        p.xz+=iTime,
        s=2.,
        f=p.w+1.-T-T-T-T,
    	f<0.?O+=(O-1.-f*c.zyxw)*f*.4:O;
}
`
		this.m_coder.addFragFunction( codeStr );
        this.m_coder.addFragMainCode(
            `
void main() {
#ifdef VOX_USE_2D_MAP
	iResolution = u_params[0];
	iMouse.xy = u_params[0].zw;
	iTime = u_params[1].w;
	// m3 *= u_params[1].z;
	vec4 color4 = VOX_Texture2D(VOX_DIFFUSE_MAP, v_uv.xy);
	mainImage(color4, v_uv.xy *  iResolution.xy);
	FragColor0 = color4;
#else
    FragColor0 = u_params[0];
#endif
}
`
        );
        this.m_coder.addVertMainCode(
            `
void main() {
#ifndef VOX_FIX_SCREEN
	gl_Position = u_projMat * u_viewMat * u_objMat * vec4(a_vs,1.0);
#else
    gl_Position = u_objMat * vec4(a_vs,1.0);
#endif
#ifdef VOX_USE_2D_MAP
    v_uv = a_uvs.xy;
#endif
}
`
        );
    }

    getUniqueShaderName(): string {
        return this.m_uniqueName;
    }
    static GetInstance(): Cloud03ShaderBuffer {
        if (Cloud03ShaderBuffer.s_instance != null) {
            return Cloud03ShaderBuffer.s_instance;
        }
        Cloud03ShaderBuffer.s_instance = new Cloud03ShaderBuffer();
        return Cloud03ShaderBuffer.s_instance;
    }
}

export default class Cloud03Material extends MaterialBase {
    mapLodEnabled: boolean = false;
	fixScreen = true;
    constructor() {
        super();
    }

    protected buildBuf(): void {
        let buf = Cloud03ShaderBuffer.GetInstance();
		buf.fixScreen = this.fixScreen;
        buf.mapLodEnabled = this.mapLodEnabled;
    }
    getCodeBuf(): ShaderCodeBuffer {
        return  Cloud03ShaderBuffer.GetInstance();
    }
    private m_data: Float32Array = new Float32Array(
        [
            1.0, 1.0, 0.5, 0.5,
			0, 0, 1.5, 0
        ]);
    setSize(pw: number, ph: number): void {
        this.m_data[0] = pw;
        this.m_data[1] = ph;
    }
    setMouseXY(px: number, py: number): void {
        this.m_data[2] = px;
        this.m_data[3] = py;
    }
    setTime(time: number): void {
        this.m_data[7] = time;
    }
    setFactor(f: number): void {
        this.m_data[6] = f;
    }
	dataCopyFrom(dst: Cloud03Material): void {
		this.m_data.set(dst.m_data);
	}
    createSelfUniformData(): ShaderUniformData {
        let oum: ShaderUniformData = new ShaderUniformData();
        oum.uniformNameList = ["u_params"];
        oum.dataList = [this.m_data];
        return oum;
    }
}
