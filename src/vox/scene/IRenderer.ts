/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/
// 整个渲染器的入口类接口规范

import IRenderStage3D from "../../vox/render/IRenderStage3D";
import CameraBase from "../../vox/view/CameraBase";
import RenderProxy from "../../vox/render/RenderProxy";
import IRenderMaterial from "../../vox/render/IRenderMaterial";
import IRenderEntity from "../../vox/render/IRenderEntity";
import RPONodeBuilder from "../../vox/render/RPONodeBuilder";
import RendererInstanceContext from "../../vox/scene/RendererInstanceContext";

interface IRenderer {
    getUid(): number;
    getRPONodeBuilder(): RPONodeBuilder;
    getRenderProxy(): RenderProxy;
    getRendererContext(): RendererInstanceContext;
    getStage3D(): IRenderStage3D;
    getCamera(): CameraBase;
    addEntity(entity: IRenderEntity, processid: number, deferred: boolean): void;
    removeEntity(entity: IRenderEntity): void;
    updateMaterialUniformToCurrentShd(material: IRenderMaterial): void;
    
    /**
     * 单独绘制可渲染对象, 可能是使用了 global material也可能没有。这种方式比较耗性能,只能用在特殊的地方。
     * @param entity 需要指定绘制的 IRenderEntity 实例
     * @param useGlobalUniform 是否使用当前 global material 所携带的 uniform, default value: false
     * @param forceUpdateUniform 是否强制更新当前 global material 所对应的 shader program 的 uniform, default value: true
     */
    drawEntity(entity: IRenderEntity, useGlobalUniform: boolean,  forceUpdateUniform: boolean): void;
    showInfoAt(index: number): void;
    runAt(index: number): void;
    useCamera(camera: CameraBase, syncCamView: boolean): void;
    useMainCamera(): void;
    updateCamera(): void;
    //  renderBegin(contextBeginEnabled: boolean): void
    //  runBegin(autoCycle: boolean, contextBeginEnabled: boolean): void;
    //  setRayTestEanbled(enabled: boolean): void;
}
export default IRenderer;
