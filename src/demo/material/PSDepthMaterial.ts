/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import ShaderCodeBuffer from "../../vox/material/ShaderCodeBuffer";
import MaterialBase from "../../vox/material/MaterialBase";

export namespace demo {
    export namespace material {
        export class PSDepthShaderBuffer extends ShaderCodeBuffer {
            constructor() {
                super();
            }
            private static s_instance: PSDepthShaderBuffer = new PSDepthShaderBuffer();
            private m_uniqueName: string = "";
            initialize(texEnabled: boolean): void {
                //console.log("PSDepthShaderBuffer::initialize()...");
                this.m_uniqueName = "PSDepthShd";
            }
            getFragShaderCode(): string {
                let fragCode: string =
                    `#version 300 es
precision mediump float;
layout(location = 0) out vec4 FragColor0;
in vec4 v_depthV;
void main()
{
    FragColor0 = v_depthV;
}`;
                return fragCode;
            }
            getVtxShaderCode(): string {
                let vtxCode: string =
                    `#version 300 es
precision mediump float;
layout(location = 0) in vec3 a_vs;
uniform mat4 u_objMat;
uniform mat4 u_viewMat;
uniform mat4 u_projMat;
uniform vec4 u_frustumParam;
out vec4 v_depthV;
void main(){
    mat4 viewMat4 = u_viewMat * u_objMat;
    vec4 viewPos = viewMat4 * vec4(a_vs, 1.0);
    gl_Position = u_projMat * viewPos;
    v_depthV = vec4(vec3(1.0),length(viewPos.xyz)/u_frustumParam.y);
}
`;
                return vtxCode;
            }
            getUniqueShaderName(): string {
                //console.log("H ########################### this.m_uniqueName: "+this.m_uniqueName);
                return this.m_uniqueName;
            }
            toString(): string {
                return "[PSDepthShaderBuffer()]";
            }

            static GetInstance(): PSDepthShaderBuffer {
                return PSDepthShaderBuffer.s_instance;
            }
        }

        export class PSDepthMaterial extends MaterialBase {
            constructor() {
                super();
            }

            getCodeBuf(): ShaderCodeBuffer {
                return PSDepthShaderBuffer.GetInstance();
            }
        }
    }
}