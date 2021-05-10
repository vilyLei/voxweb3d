/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import RendererDeviece from "../../vox/render/RendererDeviece";
import RendererParam from "../../vox/scene/RendererParam";
import MouseEvt3DController from "../../vox/scene/MouseEvt3DController";
import Stage3D from "../../vox/display/Stage3D";
import H5FontSystem from "../../vox/text/H5FontSys";
import IRendererSpace from "../../vox/scene/IRendererSpace";
import {RenderBlendMode,CullFaceMode,DepthTestMode} from "../../vox/render/RenderConst";
import RendererState from "../../vox/render/RendererState";
import RendererScene from "../../vox/scene/RendererScene";
import RendererSubScene from "../../vox/scene/RendererSubScene";
import ProfileInstance from "../../voxprofile/entity/ProfileInstance";

import RaySelector from "../../vox/scene/RaySelector";
import RayGpuSelector from "../../vox/scene/RayGpuSelector";
import * as ParalMap2SceneT from "./scene/ParalMap2Scene";
import * as ParalMap2UISceneT from "./scene/ParalMap2UIScene";

import ParalMap2Scene = ParalMap2SceneT.voxvat.demo.scene.ParalMap2Scene;
import ParalMap2UIScene = ParalMap2UISceneT.voxvat.demo.scene.ParalMap2UIScene;

export namespace voxvat
{
    export namespace demo
    {
        export class VatParallaxMap2
        {
            constructor()
            {
            }
            private m_rsc:RendererScene = null;
            private m_ruisc:RendererSubScene = null;
            private m_stage3D:Stage3D = null;
            private m_mainScene:ParalMap2Scene = new ParalMap2Scene();
            private m_uiScene:ParalMap2UIScene = new ParalMap2UIScene();
            private m_profileInstance:ProfileInstance = null;
            initialize():void
            {
                //console.log("VatParallaxMap2::initialize()......");
                if(this.m_rsc == null)
                {
                    let status_canvas:any = document.getElementById("rstatus");
                    if(status_canvas != null)
                    {
                        status_canvas.style.width = 64 + "px";
                        status_canvas.style.height = 64 + "px";
                    }
                    H5FontSystem.GetInstance().initialize("fontTex",18, 512,512,false,false);
                    H5FontSystem.GetInstance().setStyleSize(128,128);
                    RendererDeviece.SHADERCODE_TRACE_ENABLED = false;

                    let rparam:RendererParam = new RendererParam();
                    rparam.evtFlowEnabled = true;
                    rparam.setMatrix4AllocateSize(8192 * 4);
                    rparam.setCamProject(45.0,50.0,7000.0);
                    rparam.setCamPosition(2500.0,2500.0,2500.0);
                    this.m_rsc = new RendererScene();
                    this.m_rsc.initialize(rparam,5);
                    this.m_rsc.updateCamera();

                    this.m_stage3D = this.m_rsc.getStage3D() as Stage3D;
                    let evtCtr:MouseEvt3DController = null;
                    let rspace:IRendererSpace = null;
                    let mainRaySelector:RayGpuSelector = new RayGpuSelector();
                    mainRaySelector.setRayTestMode(1);
                    rspace = this.m_rsc.getSpace();
                    rspace.setRaySelector(mainRaySelector);
                    //rspace.setRaySelector(new RaySelector());
                    evtCtr = new MouseEvt3DController();
                    this.m_rsc.setEvt3DController(evtCtr);

                    RendererState.CreateRenderState("ADD01",CullFaceMode.BACK,RenderBlendMode.ADD,DepthTestMode.RENDER_BLEND);
                    RendererState.CreateRenderState("ADD02",CullFaceMode.BACK,RenderBlendMode.ADD,DepthTestMode.RENDER_ALWAYS);

                    this.m_ruisc = this.m_rsc.createSubScene();
                    rparam = new RendererParam();
                    rparam.cameraPerspectiveEnabled = false;
                    rparam.setCamProject(45.0,0.1,3000.0);
                    rparam.setCamPosition(0.0,0.0,1500.0);
                    this.m_ruisc.initialize(rparam);
                    // init mouse pick system
                    rspace = this.m_ruisc.getSpace();
                    rspace.setRaySelector(new RaySelector());
                    evtCtr = new MouseEvt3DController();
                    this.m_ruisc.setEvt3DController(evtCtr);
                    // left bottom align, is origin position.
                    let px:number = this.m_stage3D.stageHalfWidth;// * this.m_rsc.getDevicePixelRatio();
                    let py:number = this.m_stage3D.stageHalfHeight;// * this.m_rsc.getDevicePixelRatio();
                    this.m_ruisc.getCamera().translationXYZ(
                        px
                        ,py
                        ,1500.0);
                    this.m_ruisc.getCamera().update();

                    this.m_uiScene.initialize(this.m_rsc,this.m_ruisc);
                    this.m_mainScene.setAxisDragObj(this.m_uiScene.getAxisDragObj());
                    this.m_mainScene.setMaterialUISC(this.m_uiScene.getMaterialUISC());
                    this.m_mainScene.initialize(this.m_rsc,this.m_ruisc);

                    
                    this.m_profileInstance = new ProfileInstance();
                    this.m_profileInstance.initialize(this.m_rsc.getRenderer());
                }
            }
            run():void
            {
                // logic running
                this.m_uiScene.run();
                this.m_mainScene.run();

                // main renderer scene frame render begin
                this.m_rsc.setClearRGBColor3f(0.0, 0.0, 0.0);
                this.m_rsc.runBegin();
                // manual event flow operation
                // startup capture phase
                switch(this.m_ruisc.runMouseTest(1,0))
                {
                    case 0:
                        this.m_rsc.runMouseTest(1,0);
                        // startup event bubble process
                        this.m_ruisc.runMouseTest(2,0);
                    break;
                    case 1:
                        this.m_rsc.runMouseTest(1,1);
                    break;

                }
                // update main scene data
                this.m_rsc.update();
                // main scene rendering
                this.m_rsc.run();

                this.m_mainScene.runCtrl();
                this.m_uiScene.runCtrl();
                // ortho ui renderer scene
                if(this.m_ruisc != null)
                {
                    this.m_ruisc.runBegin();
                    // update sub scene data
                    this.m_ruisc.update();
                    // main sub scene rendering
                    this.m_ruisc.run();
                    this.m_ruisc.runEnd();
                }
                // logic state running
                this.m_mainScene.runEnd();
                this.m_uiScene.runEnd();

                // main renderer scene frame render end
                this.m_rsc.runEnd();

                //let px:number = this.m_stage3D.stageHalfWidth * this.m_rsc.getDevicePixelRatio();
                //let py:number = this.m_stage3D.stageHalfHeight * this.m_rsc.getDevicePixelRatio();
                //this.m_ruisc.getCamera().translationXYZ(
                //    px
                //    ,py
                //    ,1500.0);
                //this.m_ruisc.getCamera().update();
                // show renderer profile
                if(this.m_profileInstance != null)
                {
                    this.m_profileInstance.run();
                }
            }
        }
    }
}