/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/
// 整个渲染器的入口类接口规范

import * as Stage3DT from "../../vox/display/Stage3D";
import * as CameraBaseT from "../../vox/view/CameraBase";
import * as RenderProxyT from "../../vox/render/RenderProxy";
import * as IRenderMaterialT from "../../vox/render/IRenderMaterial";
import * as IRenderEntityT from "../../vox/render/IRenderEntity";
import * as RPONodeBuilderT from "../../vox/render/RPONodeBuilder";
import * as RendererInstanceContextT from "../../vox/scene/RendererInstanceContext";

import Stage3D = Stage3DT.vox.display.Stage3D;
import CameraBase = CameraBaseT.vox.view.CameraBase;
import RenderProxy = RenderProxyT.vox.render.RenderProxy;
import IRenderMaterial = IRenderMaterialT.vox.render.IRenderMaterial;
import IRenderEntity = IRenderEntityT.vox.render.IRenderEntity;
import RPONodeBuilder = RPONodeBuilderT.vox.render.RPONodeBuilder;
import RendererInstanceContext = RendererInstanceContextT.vox.scene.RendererInstanceContext;

export namespace vox
{
    export namespace scene
    {
        export interface IRenderer
        {
            getUid():number;
            getRPONodeBuilder():RPONodeBuilder;
            getRenderProxy():RenderProxy;
            getRendererContext():RendererInstanceContext;
            getStage3D():Stage3D;
            getCamera():CameraBase;
            addEntity(entity:IRenderEntity,processid:number,deferred:boolean):void;
            removeEntity(entity:IRenderEntity):void;
            updateMaterialUniformToCurrentShd(material:IRenderMaterial):void;
            // 首先要锁定Material才能用这种绘制方式,再者这个entity已经完全加入渲染器了渲染资源已经准备完毕,这种方式比较耗性能，只能用在特殊的地方
            drawEntityByLockMaterial(entity:IRenderEntity):void;
            showInfoAt(index:number):void;
            runAt(index:number):void;
            updateCamera():void;
        }
    }
}