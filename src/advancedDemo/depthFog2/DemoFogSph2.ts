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
import * as SceneFogSph2T from "../../advancedDemo/depthFog2/scene/SceneFogSph2";

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
import SceneFogSph2 = SceneFogSph2T.advancedDemo.depthFog2.scene.SceneFogSph2;

export namespace advancedDemo
{
    export namespace depthFog2
    {
        export class DemoFogSph2
        {
            constructor()
            {
            }

            private m_rc:RendererScene = null;
            private m_rct:RendererInstanceContext = null;
            private m_camTrack:CameraTrack = null;

            private m_middleFBO:FBOInstance = null;
            private m_colorFBO:FBOInstance = null;
            private m_factorFBO:FBOInstance = null;
            private m_volumeFarFBO:FBOInstance = null;
            private m_volumeNearFBO:FBOInstance = null;
            private m_stage3D:Stage3D = null;
            private m_esc:SceneFogSph2 = new SceneFogSph2();
            
            initialize():void
            {
                console.log("DemoFogSph2::initialize()......");
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
                    this.m_colorFBO = this.m_esc.colorFBO;
                    this.m_factorFBO = this.m_esc.factorFBO;
                    this.m_volumeFarFBO = this.m_esc.volumeFarFBO;
                    this.m_volumeNearFBO = this.m_esc.volumeNearFBO;
                }
            }
            private m_bgColor:Color4 = new Color4(0.0, 0.0, 0.0,1.0);
            private m_pv:Vector3D = new Vector3D();
            private m_outV:Vector3D = new Vector3D();
            run():void
            {
                // logic run
                this.m_esc.run();

                this.m_rc.runBegin();
                this.m_rc.update();
                this.m_rc.synFBOSizeWithViewport();
                // draw middle depth
                this.m_middleFBO.useGlobalMaterial(this.m_esc.calcDepthM);
                this.m_middleFBO.unlockRenderState();
                this.m_middleFBO.run();
                // draw color base
                this.m_colorFBO.unlockMaterial();
                this.m_colorFBO.run();


                /////////////////// 绘制体数据机制 begin
                let k:number = 0.5 * this.m_rct.getCamera().getViewFieldZoom() * (this.m_stage3D.stageHalfWidth - this.m_stage3D.stageHalfHeight);
                k = (this.m_stage3D.stageHalfWidth - k)/this.m_stage3D.stageHalfHeight;
                if(k < 1.0)
                {
                    k = 1.0;
                }
                let outV:Vector3D = this.m_outV;
                //let flag:number = 0;
                let len:number = this.m_esc.posList.length;
                if(len > 0)
                {
                    this.m_factorFBO.unlockMaterial();
                    this.m_factorFBO.unlockRenderState();
                    this.m_factorFBO.setClearColorEnabled(true);
                    this.m_factorFBO.runBegin();
                }
                for(let i:number = 0; i < len; ++i)
                {
                    this.m_pv.copyFrom(this.m_esc.posList[i]);
                    this.m_pv.w = 1.0;
                    if(this.m_rc.getCamera().visiTestSphere2(this.m_pv,this.m_esc.volumeRadiuss[i]))
                    {
                        this.m_pv.copyFrom(this.m_esc.posList[i]);
                        this.m_rct.getCamera().calcScreenRectByWorldSphere(this.m_pv,this.m_esc.volumeRadiuss[i] + 10.0,outV);

                        this.m_esc.factorPlane.setXYZ(outV.x + outV.z * 0.5,outV.y + outV.w * 0.5,0.0);
                        this.m_esc.factorPlane.setScaleXYZ(outV.z * k, outV.w,1.0);
                        this.m_esc.factorPlane.update();
                        // 将fog factor 写入到目标tex buf
                        this.m_rc.getCamera().getViewMatrix().transformOutVector3(this.m_esc.posList[i], this.m_pv);
                        
                        this.m_esc.fogFactorM.setRadius(this.m_esc.volumeRadiuss[i]);
                        this.m_esc.fogFactorM.setXYZ3f(this.m_pv.x,this.m_pv.y,this.m_pv.z);
                        this.m_esc.fogFactorM.setRGBColor(this.m_esc.volumeColors[i]);
    
                        //  this.m_factorFBO.setClearColorEnabled(flag < 1);
                        //  this.m_factorFBO.run();
                        //++flag;
                        this.m_factorFBO.runOnlyAt(0);
                    }
                    else
                    {
                        //tpv: [Vector3D(x=3533.8594468662877, y=2500,z=-111.05582663769081,w=0)]
                        /*
                        this.m_pv: [Vector3D(x=-1157.7510464693532, y=159.23125452362797,z=-1468.4669199047005,w=1)]
                        DemoFogSph2.ts:152 this.m_radius: 141.24678418834395
                        */
                        //  let tpv:Vector3D =  this.m_rct.getCamera().getPosition();
                        //  console.log("tpv: "+tpv.toString());
                        //  console.log("this.m_pv: "+this.m_pv.toString());
                        //  console.log("this.m_radius: "+this.m_esc.volumeRadiuss[i]);
                        //  this.m_pv.scaleBy(1.0);
                    }
                }
                /////////////////// 绘制体数据机制 end
                // 再这样做一遍就能记录每个雾体积的颜色
                
                this.m_rct.unlockMaterial();
                this.m_rct.unlockRenderState();
                this.m_rc.setClearRGBAColor4f(this.m_bgColor.r,this.m_bgColor.g,this.m_bgColor.b,1.0);
                this.m_rc.setRenderToBackBuffer();
                // 绘制最终输出图像的平面
                this.m_rc.runAt(this.m_esc.dstPlaneIndex);

                this.m_rc.runEnd();
                this.m_camTrack.rotationOffsetAngleWorldY(-0.2);
                this.m_esc.runEnd();
            }
        }
    }
}