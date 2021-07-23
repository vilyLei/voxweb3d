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
    // 首先要锁定Material才能用这种绘制方式,再者这个entity已经完全加入渲染器了渲染资源已经准备完毕,这种方式比较耗性能，只能用在特殊的地方
    drawEntityByLockMaterial(entity: IRenderEntity): void;
    drawEntity(entity: IRenderEntity, force: boolean): void;
    showInfoAt(index: number): void;
    runAt(index: number): void;
    useCamera(camera: CameraBase, syncCamView: boolean): void;
    useMainCamera(): void;
    updateCamera(): void;
}
export default IRenderer;
