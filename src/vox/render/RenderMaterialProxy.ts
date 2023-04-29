/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IRenderTexResource from "../../vox/render/IRenderTexResource";
import IRenderMaterial from "../../vox/render/IRenderMaterial";
import RenderShader from "../../vox/render/RenderShader";
import RODataBuilder from "../../vox/render/RODataBuilder";
import DebugFlag from "../debug/DebugFlag";

export default class RenderMaterialProxy {
    private m_dispBuilder: RODataBuilder = null;
    private m_shader: RenderShader = null;
    private m_texRes: IRenderTexResource = null;

    setDispBuilder(builder: RODataBuilder): void {
        if (this.m_dispBuilder == null) {
            this.m_dispBuilder = builder;
            this.m_shader = builder.getRenderShader();
            this.m_texRes = builder.getTextureResource();
        }
    }
    unlockMaterial(): void {
        this.m_shader.unlock();
        this.m_texRes.unlocked = true;
    }
    lockMaterial(): void {
        this.m_shader.lock();
        this.m_texRes.unlocked = false;
    }
    isUnlockMatrial(): boolean {
        return this.m_texRes.unlocked;
    }

    unlockTexture(): void {
        this.m_shader.textureUnlock();
    }
    lockTexture(): void {
        this.m_shader.textureLock();
    }
    renderBegin(): void {
        this.m_shader.renderBegin();
        this.m_texRes.renderBegin();
    }
    resetUniform(): void {
        this.m_shader.resetUniform();
    }
    useGlobalMaterial(material: IRenderMaterial, materialUniformUpdate: boolean = false): void {
        if(material != null) {
            this.m_dispBuilder.updateGlobalMaterial(material, materialUniformUpdate);
        }
    }
    updateMaterialUniform(material: IRenderMaterial): void {
        this.m_shader.updateUniform(material.__$uniform);
    }
}
