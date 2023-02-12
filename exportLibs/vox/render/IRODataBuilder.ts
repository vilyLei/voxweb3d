
/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IRODisplay from "../../vox/display/IRODisplay";
import IRenderProxy from "../../vox/render/IRenderProxy";
import IRenderMaterial from '../../vox/render/IRenderMaterial';
import IRenderShader from '../../vox/render/IRenderShader';

import IROTextureResource from "../../vox/render/IRenderTexResource";
import IRenderBuffer from "../../vox/render/IRenderBuffer";
import IROMaterialUpdater from "../../vox/render/IROMaterialUpdater";
import IROVertexBufUpdater from "../../vox/render/IROVertexBufUpdater";

/**
 * 本类实现了将 系统内存数据 合成为 渲染运行时系统所需的数据资源(包括: 渲染运行时管理数据和显存数据)
 */
export default interface IRODataBuilder extends IROMaterialUpdater, IROVertexBufUpdater {
    
    getRenderProxy(): IRenderProxy;
    getRenderShader(): IRenderShader;
    getTextureResource(): IROTextureResource;
    /**
     * update single texture self system memory data to gpu memory data
     */
    updateTextureData(textureProxy: IRenderBuffer, deferred: boolean): void;
    /**
     * update display entity texture list  system memory data to gpu memory data
     */
    updateDispTRO(disp: IRODisplay, deferred: boolean): void;
    updateVtxDataToGpuByUid(vtxUid: number, deferred: boolean): void;
    /**
     * update vertex system memory data to gpu memory data
     */
    updateDispVbuf(disp: IRODisplay, deferred: boolean): void;
    
    buildGpuDisp(disp: IRODisplay): boolean;
    update(): void;
    updateGlobalMaterial(material: IRenderMaterial, materialUniformUpdate?: boolean): void;
    reset(): void;
}
