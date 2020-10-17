/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/
import * as Vector3DT from "../../vox/geom/Vector3";
import * as RendererDevieceT from "../../vox/render/RendererDeviece";
import * as Color4T from "../../vox/material/Color4";
import * as Stage3DT from "../../vox/display/Stage3D";
import * as RendererStateT from "../../vox/render/RendererState";
import * as RendererParamT from "../../vox/scene/RendererParam";
import * as RendererInstanceContextT from "../../vox/scene/RendererInstanceContext";
import * as FBOInstanceT from "../../vox/scene/FBOInstance";
import * as RendererSceneT from "../../vox/scene/RendererScene";
import * as H5FontSysT from "../../vox/text/H5FontSys";

import * as CameraTrackT from "../../vox/view/CameraTrack";
import * as SceneFogSph2T from "../../advancedDemo/depthFog4/scene/SceneFogSph";

import Vector3D = Vector3DT.vox.geom.Vector3D;
import RendererDeviece = RendererDevieceT.vox.render.RendererDeviece;
import Color4 = Color4T.vox.material.Color4;
import Stage3D = Stage3DT.vox.display.Stage3D;
import RendererState = RendererStateT.vox.render.RendererState;
import RendererParam = RendererParamT.vox.scene.RendererParam;
import RendererInstanceContext = RendererInstanceContextT.vox.scene.RendererInstanceContext;
import FBOInstance = FBOInstanceT.vox.scene.FBOInstance;
import RendererScene = RendererSceneT.vox.scene.RendererScene;
import H5FontSystem = H5FontSysT.vox.text.H5FontSystem;

import CameraTrack = CameraTrackT.vox.view.CameraTrack;
import SceneFogSph = SceneFogSph2T.advancedDemo.depthFog4.scene.SceneFogSph;

export namespace advancedDemo
{
    export namespace depthFog4
    {
        export class DemoFogSph
        {
            constructor()
            {
            }

            private m_rc:RendererScene = null;
            private m_rct:RendererInstanceContext = null;
            private m_camTrack:CameraTrack = null;

            private m_middleFBO:FBOInstance = null;
            private m_factorFBO:FBOInstance = null;
            private m_stage3D:Stage3D = null;
            private m_esc:SceneFogSph = new SceneFogSph();
            
            initialize():void
            {
                console.log("depthFog4::DemoFogSph::initialize()......");
                if(this.m_rc == null)
                {
                    H5FontSystem.GetInstance().initialize("fontTex",18, 512,512,false,false);
                    RendererDeviece.SHADERCODE_TRACE_ENABLED = true;

                    let rparam:RendererParam = new RendererParam("glcanvas");
                    rparam.setMatrix4AllocateSize(8192 * 4);
                    rparam.setCamProject(45.0,0.1,5000.0);
                    rparam.setCamPosition(2500.0,2500.0,2500.0);

                    this.m_rc = new RendererScene();
                    this.m_rc.initialize(rparam,6);
                    this.m_rc.setRendererProcessParam(1,true,true);
                    this.m_rc.updateCamera();
                    this.m_rct = this.m_rc.getRendererContext();
                    this.m_camTrack = new CameraTrack();
                    this.m_camTrack.bindCamera(this.m_rc.getCamera());
                    this.m_stage3D = this.m_rct.getStage3D();
                    this.m_esc.initialize(this.m_rc);
                    
                    this.m_middleFBO = this.m_esc.middleFBO;
                    this.m_factorFBO = this.m_esc.factorFBO;
                }
            }
            private m_bgColor:Color4 = new Color4(0.0, 0.0, 0.0,1.0);
            private m_pv:Vector3D = new Vector3D();
            private m_outV:Vector3D = new Vector3D();
            run():void
            {
                let status:number = this.m_esc.getStatus();
                status = 1;
                // logic run
                this.m_esc.run();

                this.m_rc.runBegin();
                this.m_rc.update();
                this.m_rc.synFBOSizeWithViewport();
                // draw middle depth and color
                this.m_middleFBO.unlockRenderState();
                this.m_middleFBO.run();

                /////////////////// 绘制体数据机制 begin
                let k:number = 0.5 * this.m_rct.getCamera().getViewFieldZoom() * (this.m_stage3D.stageHalfWidth - this.m_stage3D.stageHalfHeight);
                k = (this.m_stage3D.stageHalfWidth - k)/this.m_stage3D.stageHalfHeight;
                if(k < 1.0)
                {
                    k = 1.0;
                }
                let outV:Vector3D = this.m_outV;
                let len:number = this.m_esc.posList.length;
                if(len > 0)
                {
                    this.m_factorFBO.unlockMaterial();
                    this.m_factorFBO.unlockRenderState();
                    this.m_factorFBO.setClearColorEnabled(true);
                    this.m_factorFBO.runBegin();
                    // for test: select a displaying mode
                    //fogColors
                    switch(status)
                    {
                        case 0:
                            this.m_esc.fogShowM.setRGB3f(1.0,1.0,1.0);
                            this.m_esc.fogFactorM.setFogDis(this.m_esc.maxRadius * 5.0);
                            break;
                        case 1:
                            this.m_esc.fogFactorM.setFactorRGB3f(1.0,1.0,1.0);
                            this.m_esc.fogShowM.setRGB3f(1.0,1.0,1.0);
                            this.m_esc.fogFactorM.setFogDis(this.m_esc.maxRadius * 1.0);
                        break;
                        case 2:
                            this.m_esc.fogFactorM.setFactorRGB3f(1.0,1.0,1.0);
                            this.m_esc.fogShowM.setRGB3f(0.05,0.1,0.2);
                            this.m_esc.fogFactorM.setFogDis(this.m_esc.maxRadius * 2.0);
                        break;
                        default:
                            this.m_esc.fogShowM.setRGB3f(1.0,1.0,1.0);
                            break;
    
                    }
                }
                for(let i:number = 0; i < len; ++i)
                {
                    this.m_pv.copyFrom(this.m_esc.posList[i]);
                    this.m_pv.w = 1.0;
                    if(this.m_rc.getCamera().visiTestSphere3(this.m_pv,this.m_esc.volumeRadiuss[i],-this.m_esc.volumeRadiuss[i] * 2.0))
                    {
                        this.m_pv.copyFrom(this.m_esc.posList[i]);
                        this.m_rct.getCamera().calcScreenRectByWorldSphere(this.m_pv,this.m_esc.volumeRadiuss[i] + 10.0,outV);

                        //this.m_esc.factorPlane.setRenderState(this.m_esc.volumeStates[i]);
                        this.m_esc.factorPlane.setXYZ(outV.x + outV.z * 0.5,outV.y + outV.w * 0.5,0.0);
                        this.m_esc.factorPlane.setScaleXYZ(outV.z * k, outV.w,1.0);
                        this.m_esc.factorPlane.update();
                        // 将fog factor 写入到目标tex buf
                        this.m_rc.getCamera().getViewMatrix().transformOutVector3(this.m_esc.posList[i], this.m_pv);
                        
                        this.m_esc.fogFactorM.setRadius(this.m_esc.volumeRadiuss[i]);
                        this.m_esc.fogFactorM.setXYZ3f(this.m_pv.x,this.m_pv.y,this.m_pv.z);
                        if(status < 1)
                        {
                            this.m_esc.fogFactorM.setFactorRGBColor(this.m_esc.factorColors[i]);
                        }
                        else if(status == 1)
                        {
                            this.m_esc.fogFactorM.setFogRGBColor(this.m_esc.fogColors[i]);
                        }
                        this.m_factorFBO.runOnlyAt(0);
                    }
                }
                /////////////////// 绘制体数据机制 end
                
                this.m_rc.setClearRGBAColor4f(this.m_bgColor.r,this.m_bgColor.g,this.m_bgColor.b,1.0);
                this.m_rc.setRenderToBackBuffer();
                this.m_rct.unlockMaterial();
                // 绘制最终输出图像的平面
                this.m_rc.runAt(this.m_esc.dstPlaneIndex);

                this.m_rc.runEnd();
                this.m_camTrack.rotationOffsetAngleWorldY(-0.2);
                this.m_esc.runEnd();
            }
        }
    }
}