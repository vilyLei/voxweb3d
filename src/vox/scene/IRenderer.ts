/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IRenderStage3D from "../../vox/render/IRenderStage3D";
import { IRenderCamera } from "../../vox/render/IRenderCamera";
import IRenderProxy from "../../vox/render/IRenderProxy";
import IRenderMaterial from "../../vox/render/IRenderMaterial";
import IRenderEntity from "../../vox/render/IRenderEntity";
import IRPONodeBuilder from "../../vox/render/IRPONodeBuilder";
import { IRendererInstanceContext } from "../../vox/scene/IRendererInstanceContext";
import IRenderProcess from "../render/IRenderProcess";
import IRenderNode from "../../vox/scene/IRenderNode";
import { ITextureBlock } from "../texture/ITextureBlock";
/**
 * define the renderer instance behaviours;
 */
interface IRenderer {
  
	readonly textureBlock: ITextureBlock;
  getUid(): number;
  getRPONodeBuilder(): IRPONodeBuilder;
  getRenderProxy(): IRenderProxy;
  getRendererContext(): IRendererInstanceContext;
  getStage3D(): IRenderStage3D;
  getCamera(): IRenderCamera;

  getViewWidth(): number;
  getViewHeight(): number;
  getRenderProcessAt(id: number): IRenderProcess;
	setProcessEnabledAt(i: number, enabled: boolean): void;
  /**
   * 在任意阶段绘制一个指定的 entity,只要其资源数据准备完整
   * @param entity IRenderEntity instance
   * @param useGlobalUniform the default value is false
   * @param forceUpdateUniform the default value is true
   */
  drawEntity(entity: IRenderEntity, useGlobalUniform?: boolean, forceUpdateUniform?: boolean): void;
  /**
   * add an entity to the renderer process of the renderer instance
   * @param entity IRenderEntity instance(for example: DisplayEntity class instance)
   * @param processid this destination renderer process id, the default value is 0
   * @param deferred if the value is true,the entity will not to be immediately add to the renderer process by its id, the defaule value is true
   */
  addEntity(entity: IRenderEntity, processid?: number, deferred?: boolean): void;
  /**
   * remove an entity from the renderer instance
   * @param entity IRenderEntity instance(for example: DisplayEntity class instance)
   */
  removeEntity(entity: IRenderEntity): void;
  /**
   * add an entity container from the renderer process of the renderer instance
   * @param container a DisplayEntityContainer instance
   * @param processid this destination renderer process id
   */
  updateMaterialUniformToCurrentShd(material: IRenderMaterial): void;

  /**
   * 单独绘制可渲染对象, 可能是使用了 global material也可能没有。这种方式比较耗性能,只能用在特殊的地方。
   * @param entity 需要指定绘制的 IRenderEntity 实例
   * @param useGlobalUniform 是否使用当前 global material 所携带的 uniform, default value: false
   * @param forceUpdateUniform 是否强制更新当前 global material 所对应的 shader program 的 uniform, default value: true
   */
  drawEntity(entity: IRenderEntity, useGlobalUniform?: boolean, forceUpdateUniform?: boolean): void;
  showInfoAt(index: number): void;
  runAt(index: number): void;
  /**
   * @param camera IRenderCamera instance
   * @param syncCamView the default value is false
   */
  useCamera(camera: IRenderCamera, syncCamView?: boolean): void;
  useMainCamera(): void;
  updateCamera(): void;
  
  prependRenderNode(node: IRenderNode): void;
  appendRenderNode(node: IRenderNode): void;
  removeRenderNode(node: IRenderNode): void;
}
export default IRenderer;
