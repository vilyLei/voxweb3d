/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import { ShaderCodeUUID } from "../../vox/material/ShaderCodeUUID";
import MaterialBase from "./MaterialBase";
import ShaderCodeBuffer from "./ShaderCodeBuffer";
import ShaderUniformData from "./ShaderUniformData";
import { IMaterialDecorator } from "./IMaterialDecorator";
import { UniformComp } from "../../vox/material/component/UniformComp";
import IShaderCodeObject from "./IShaderCodeObject";
import IRenderTexture from "../render/texture/IRenderTexture";
import { IMaterial } from "./IMaterial";

class MaterialShaderBuffer extends ShaderCodeBuffer {

    private m_uniqueName: string = "";
    // private m_hasTex: boolean = false;
    horizonal: boolean = true;
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
    buildShader(): void {
        this.decorator.buildShader( this.m_coder );
    }
    getShaderCodeObjectUUID(): ShaderCodeUUID {
        return this.decorator.getShaderCodeObjectUUID();
    }
    getShaderCodeObject(): IShaderCodeObject {
        return this.decorator.getShaderCodeObject();
    }
    getUniqueShaderName(): string {
        return this.m_uniqueName;
    }
    toString(): string {
        return "[OccBlurShaderBuffer()]";
    }    
}
class Material extends MaterialBase implements IMaterial {
    private static s_shdBufins: MaterialShaderBuffer = null;
    private m_decorator: IMaterialDecorator = null;
    vertUniform: UniformComp = null;
    constructor() {
        super();
        if(Material.s_shdBufins == null) Material.s_shdBufins = new MaterialShaderBuffer();
    }
    protected buildBuf(): void {

        let buf = Material.s_shdBufins;
        let decorator = this.m_decorator;
        buf.decorator = decorator;

        decorator.buildBufParams();

        buf.lightEnabled = decorator.lightEnabled;
        buf.shadowReceiveEnabled = decorator.shadowReceiveEnabled;
        buf.fogEnabled = decorator.fogEnabled;
        buf.glossinessEnabeld = decorator.glossinessEnabeld;

        buf.buildPipelineParams();

        let list = decorator.createTextureList( buf.getShaderCodeBuilder() );
        if(this.vertUniform != null) this.vertUniform.getTextures(buf.getShaderCodeBuilder(), list);
        buf.getTexturesFromPipeline( list );

        super.setTextureList( list );
        //buf.texturesTotal = list.length;
    }
    getCodeBuf(): ShaderCodeBuffer {
        return Material.s_shdBufins;
    }
    
    setTextureList(texList: IRenderTexture[]): void {
        throw Error("Illegal operations !!!");
    }
    setDecorator(decorator: IMaterialDecorator): void {
        this.m_decorator = decorator;
    }
    getDecorator(): IMaterialDecorator {
        return this.m_decorator;
    }    
    createSelfUniformData(): ShaderUniformData {        
        return this.m_decorator.createUniformData();
    }
}
export { Material }