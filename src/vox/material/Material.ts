/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import { ShaderCodeUUID } from "../../vox/material/ShaderCodeUUID";
import MaterialBase from "./MaterialBase";
import ShaderCodeBuffer from "./ShaderCodeBuffer";
import IShaderUniformData from "./IShaderUniformData";
import { IMaterialDecorator } from "./IMaterialDecorator";
import IShaderCodeObject from "./IShaderCodeObject";
import IRenderTexture from "../render/texture/IRenderTexture";
import { IMaterial } from "./IMaterial";

class MaterialShaderBuffer extends ShaderCodeBuffer {

    private m_uniqueName: string = "";
    decorator: IMaterialDecorator = null;
    constructor() {
        super();
    }
    initialize(texEnabled: boolean): void {
        super.initialize( texEnabled );
        console.log("MaterialShaderBuffer::initialize()... texEnabled: " + texEnabled);
        this.m_uniqueName = "MS_";
        // this.m_hasTex = texEnabled;
        if (texEnabled) this.m_uniqueName += "Tex";
    }
    createTextureList(): IRenderTexture[] {
        this.m_texBuilder.reset();
        this.decorator.buildTextureList( this.m_texBuilder );
        return this.m_texBuilder.getTextures();
    }
    buildShader(): void {
        if(this.decorator.vertUniform != null) {
            this.decorator.vertUniform.use(this.m_coder);
        }
        this.decorator.buildShader( this.m_coder );
    }
    getShaderCodeObjectUUID(): ShaderCodeUUID {
        return this.decorator.getShaderCodeObjectUUID() as ShaderCodeUUID;
    }
    getShaderCodeObject(): IShaderCodeObject {
        return this.decorator.getShaderCodeObject();
    }
    getUniqueShaderName(): string {
        let ns = this.m_uniqueName + this.decorator.getUniqueName();
        if(this.decorator.vertUniform != null) {
            ns += this.decorator.vertUniform.getUniqueNSKeyString();
        }
        return ns;
    }
}
class Material extends MaterialBase implements IMaterial {
    private static s_shdBufins: MaterialShaderBuffer = null;
    private m_decorator: IMaterialDecorator = null;
    constructor() {
        super();
        if(Material.s_shdBufins == null) Material.s_shdBufins = new MaterialShaderBuffer();
    }
    protected buildBuf(): void {

        let buf = Material.s_shdBufins;
        let decorator = this.m_decorator;
        buf.decorator = decorator;

        decorator.buildBufParams();

        buf.vertColorEnabled = decorator.vertColorEnabled;
        buf.premultiplyAlpha = decorator.premultiplyAlpha;
        buf.shadowReceiveEnabled = decorator.shadowReceiveEnabled;
        buf.lightEnabled = decorator.lightEnabled;
        buf.fogEnabled = decorator.fogEnabled;
        buf.envAmbientLightEnabled = decorator.envAmbientLightEnabled;
        buf.brightnessOverlayEnabeld = decorator.brightnessOverlayEnabeld;
        buf.glossinessEnabeld = decorator.glossinessEnabeld;

        buf.buildPipelineParams();

        // buf.vertUniform = this.vertUniform;

        let list = buf.createTextureList();
        //if(this.vertUniform != null) this.vertUniform.getTextures(buf.getShaderCodeBuilder(), list);
        let vertUniform = decorator.vertUniform
        if(vertUniform != null) vertUniform.getTextures(buf.getShaderCodeBuilder(), list);
        buf.getTexturesFromPipeline( list );
        console.log(decorator, "texture list: ",list);
        super.setTextureList( list );
        //buf.texturesTotal = list.length;
    }
    getCodeBuf(): ShaderCodeBuffer {
        return Material.s_shdBufins;
    }

    setTextureList(texList: IRenderTexture[]): void {
        // throw Error("Illegal operations !!!");
        console.error("Illegal operations !!!");
    }
    setDecorator(decorator: IMaterialDecorator): void {
        this.m_decorator = decorator;
    }
    getDecorator(): IMaterialDecorator {
        return this.m_decorator;
    }
    createSelfUniformData(): IShaderUniformData {
        let sud = this.m_decorator.createUniformData();
        // if(this.vertUniform != null && sud != null) {
        //     this.vertUniform.buildShaderUniformData(sud);
        // }
        return sud;
    }
    destroy(): void {
        super.destroy();
        this.m_decorator = null;
    }
}
export { Material }
