/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import MaterialBase from "./MaterialBase";
import ShaderCodeBuffer from "./ShaderCodeBuffer";
import IShaderUniformData from "./IShaderUniformData";
import { ISimpleMaterialDecorator } from "./ISimpleMaterialDecorator";
import { UniformComp } from "../../vox/material/component/UniformComp";
import IRenderTexture from "../render/texture/IRenderTexture";
import { ISimpleMaterial } from "./ISimpleMaterial";

class MaterialShaderBuffer extends ShaderCodeBuffer {

    private m_uniqueName: string = "";
    decorator: ISimpleMaterialDecorator = null;
    vertUniform: UniformComp = null;
    constructor() {
        super();
    }
    initialize(texEnabled: boolean): void {
        super.initialize( texEnabled );
        console.log("MaterialShaderBuffer::initialize()... texEnabled: " + texEnabled);
        this.m_uniqueName = "SMS_";
        // this.m_hasTex = texEnabled;
        if (texEnabled) this.m_uniqueName += "Tex";
    }
    createTextureList(): IRenderTexture[] {
        this.m_texBulder.reset();
        this.decorator.buildTextureList( this.m_texBulder );
        return this.m_texBulder.getTextures();
    }
    buildShader(): void {
        if(this.vertUniform != null) {
            this.vertUniform.use(this.m_coder);
        }
        this.decorator.buildShader( this.m_coder );
    }
    getUniqueShaderName(): string {
        // return this.m_uniqueName + this.decorator.getUniqueName();
        let ns = this.m_uniqueName + this.decorator.getUniqueName();
        if(this.vertUniform != null) {
            ns += this.vertUniform.getUniqueNSKeyString();
        }
        return ns;
    }
}
class SimpleMaterial extends MaterialBase implements ISimpleMaterial {
    private static s_shdBufins: MaterialShaderBuffer = null;
    private m_decorator: ISimpleMaterialDecorator = null;
    vertUniform: UniformComp = null;
    constructor() {
        super();
        if(SimpleMaterial.s_shdBufins == null) SimpleMaterial.s_shdBufins = new MaterialShaderBuffer();
    }
    protected buildBuf(): void {

        let buf = SimpleMaterial.s_shdBufins;
        let decorator = this.m_decorator;
        buf.decorator = decorator;

        decorator.buildBufParams();

        buf.vertColorEnabled = decorator.vertColorEnabled;
        buf.shadowReceiveEnabled = decorator.premultiplyAlpha;
        buf.fogEnabled = decorator.fogEnabled;

        buf.buildPipelineParams();

        buf.vertUniform = this.vertUniform;

        let list = buf.createTextureList();
        if(this.vertUniform != null) this.vertUniform.getTextures(buf.getShaderCodeBuilder(), list);
        buf.getTexturesFromPipeline( list );
        console.log(decorator, "texture list: ",list);
        super.setTextureList( list );
        //buf.texturesTotal = list.length;
    }
    getCodeBuf(): ShaderCodeBuffer {
        return SimpleMaterial.s_shdBufins;
    }    
    setTextureList(texList: IRenderTexture[]): void {
        // throw Error("Illegal operations !!!");
        console.error("Illegal operations !!!");
    }
    setDecorator(decorator: ISimpleMaterialDecorator): void {
        this.m_decorator = decorator;
    }
    getDecorator(): ISimpleMaterialDecorator {
        return this.m_decorator;
    }
    createSelfUniformData(): IShaderUniformData {

        let sud = this.m_decorator.createUniformData();
        if(this.vertUniform != null && sud != null) {
            this.vertUniform.buildShaderUniformData(sud);
        }
        return sud;
    }
    destroy(): void {
        super.destroy();
        this.m_decorator = null;
        this.vertUniform = null;
    }
}
export { SimpleMaterial }