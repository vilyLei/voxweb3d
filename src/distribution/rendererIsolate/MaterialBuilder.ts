
import {Vector3D} from "./Vector3D";
import {Color4} from "./Color4";
import {Matrix4} from "./Matrix4";
import {Engine} from "./Engine";

import IShdBuilder from "./IShdBuilder";
import {IShdWrapper} from "./IShdWrapper";

interface ShaderUniformData {
    uniformNameList: string[];
    dataList: Float32Array[];
}

class ShaderCodeWrapper implements IShdWrapper {

    initialize(): void {

    }
    buildThisCode(codeBuilder: IShdBuilder): void {

    }
    getFragShaderCode(codeBuilder: IShdBuilder): string {

        console.log("ShaderCodeWrapper getFragShaderCode()...",codeBuilder);
        codeBuilder.reset();
        codeBuilder.vertMatrixInverseEnabled = true;

        codeBuilder.addTextureSample2D("", true, true, false);

        codeBuilder.addVarying("vec2", "v_uv");
        codeBuilder.addVarying("vec3", "v_nv");
        codeBuilder.addVarying("vec3", "v_viewDir");

        codeBuilder.addVertLayout("vec3", "a_vs");
        codeBuilder.addVertLayout("vec2", "a_uvs");
        codeBuilder.addVertLayout("vec3", "a_nvs");

        codeBuilder.addFragOutput("vec4", "FragColor0");
        codeBuilder.addFragUniform("vec4", "u_color", 0);
        codeBuilder.addFragUniform("vec4", "u_lightParams", 3);

        codeBuilder.useVertSpaceMats(true, true, true);

        codeBuilder.addFragMainCode(
`
vec3 calcLight(vec3 baseColor, vec3 pLightDir, vec3 lightColor, vec3 specColor) {

    vec3 nvs = (v_nv);
	vec3 viewDir = v_viewDir;
    float nDotL = max(dot(nvs, pLightDir), 0.0);
	baseColor = nDotL * baseColor * lightColor;
	viewDir = normalize(pLightDir + viewDir);
	lightColor = specColor * nDotL * pow(max(dot(nvs, viewDir), 0.0), 32.0);
	return (baseColor * 0.3 + lightColor * 0.7);
}

void main()
{
    vec4 color4 = VOX_Texture2D(u_sampler0, v_uv);
    color4.xyz *= u_color.xyz;
    
    vec3 lightDirec = u_lightParams[0].xyz;
    vec3 lightColor = u_lightParams[1].xyz;
    vec3 lightSpecColor = u_lightParams[2].xyz;

    vec3 destColor = calcLight(
        color4.xyz,
        lightDirec,
        lightColor,
        lightSpecColor
    );
    FragColor0 = vec4(destColor * 0.9 + 0.4 * color4.xyz, 1.0);
}
`
        );
        return codeBuilder.buildFragCode();
    }
    getVtxShaderCode(codeBuilder: IShdBuilder): string {

        codeBuilder.addVertMainCode(
`
void main(){

    mat4 viewMat4 = u_viewMat * u_objMat;
    vec4 viewPos = viewMat4 * vec4(a_vs, 1.0);
    gl_Position = u_projMat * viewPos;

    v_viewDir = -normalize(viewPos.xyz);
    v_uv = a_uvs;
    v_nv = normalize(a_nvs * inverse(mat3(viewMat4)));
}
`
        );
        return codeBuilder.buildVertCode();
    }

    createSharedUniforms(): any[] {
        return null;
    }
    getUniqueShaderName(): string {
        return "ShaderCodeWrapperTest01";
    }
}
class MaterialBuilder {

    shaderWrapper: ShaderCodeWrapper = new ShaderCodeWrapper();
    lightUniformDataList: ShaderUniformData[];

    lightData: Float32Array = null;
    lightDir: Vector3D = null;
    lightColor: Color4 = null;
    lightSpecular: Color4 = null;
    tempV: Vector3D = null;
    mat4: Matrix4 = null;

    constructor() {

    }
    updateLightData(viewInvMatrix: Matrix4): void {

        if(this.lightData != null) {

            this.mat4.copyFrom( viewInvMatrix );
            this.mat4.transpose();
            this.mat4.deltaTransformOutVector(this.lightDir, this.tempV);
    
            this.lightData[0] = -this.tempV.x;
            this.lightData[1] = -this.tempV.y;
            this.lightData[2] = -this.tempV.z;
        }
    }

    create(): any {

        if(this.lightUniformDataList == null) {

            this.lightDir = new Engine.Vector3D(-1,-1,-1);
            this.lightColor = new Engine.Color4(1,1,1);
            this.lightSpecular = new Engine.Color4(0.3,0.2,0.8,1.0);
            this.tempV = new Engine.Vector3D(1,1,1);
            this.mat4 = new Engine.Matrix4();    
    
            this.lightData = new Float32Array([
                this.lightDir.x,this.lightDir.y,this.lightDir.z, 1.0
                ,this.lightColor.r,this.lightColor.g,this.lightColor.b, 1.0
                ,this.lightSpecular.r,this.lightSpecular.g,this.lightSpecular.b, 1.0
            ]);
            
            let lightUniformData = new Engine.ShaderUniformData();
            lightUniformData.uniformNameList = ["u_lightParams"];
            lightUniformData.dataList = [this.lightData];
            this.lightUniformDataList = [ lightUniformData ];
        }

        let shaderWrapper: ShaderCodeWrapper = this.shaderWrapper;

        let colorData: Float32Array = new Float32Array([Math.random() * 1.3, Math.random() * 1.3, Math.random() * 1.3, 1.0]);
        let uniformData = new Engine.ShaderUniformData();
        uniformData.uniformNameList = ["u_color"];
        uniformData.dataList = [colorData];
        let material = new Engine.ShaderCodeMaterial();
        material.setShaderCodeWrapper(shaderWrapper);
        material.setSelfUniformData(uniformData);
        material.setSharedUniformsData(this.lightUniformDataList);
        
        return material;
    }
}
export {ShaderUniformData, MaterialBuilder, ShaderCodeWrapper};