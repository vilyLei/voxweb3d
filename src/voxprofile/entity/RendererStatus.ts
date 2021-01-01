/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import * as RODrawStateT from "../../vox/render/RODrawState";
import * as RendererStateT from "../../vox/render/RendererState";
import * as DisplayEntityT from "../../vox/entity/DisplayEntity";
import * as MaterialBaseT from '../../vox/material/MaterialBase';
import * as Rect2DMaterialT from "../../vox2d/material/mcase/Rect2DMaterial";
import * as TextureProxyT from "../../vox/texture/TextureProxy";
import * as RORectMeshT from "../../vox/mesh/RORectMesh";
import * as RenderProcessT from "../../vox/render/RenderProcess";
import * as RendererInstanceT from "../../vox/scene/RendererInstance";
import * as Rect2DEntityT from "../../vox2d/entity/Rect2DEntity";
import * as H5FontSysT from "../../vox/text/H5FontSys";
import * as Text2DEntityT from "../../vox2d/text/Text2DEntity";

import RenderStateObject = RODrawStateT.vox.render.RenderStateObject;
import RendererState = RendererStateT.vox.render.RendererState;
import DisplayEntity = DisplayEntityT.vox.entity.DisplayEntity;
import MaterialBase = MaterialBaseT.vox.material.MaterialBase;
import Rect2DMaterial = Rect2DMaterialT.vox2d.material.mcase.Rect2DMaterial;
import TextureProxy = TextureProxyT.vox.texture.TextureProxy;
import RORectMesh = RORectMeshT.vox.mesh.RORectMesh;
import RenderProcess = RenderProcessT.vox.render.RenderProcess;
import RendererInstance = RendererInstanceT.vox.scene.RendererInstance;
import Rect2DEntity = Rect2DEntityT.vox2d.entity.Rect2DEntity;
import H5FontSystem = H5FontSysT.vox.text.H5FontSystem;
import Text2DEntity = Text2DEntityT.vox2d.text.Text2DEntity;

export namespace voxprofile
{
    export namespace entity
    {
        export class FPSInfo
        {
            private m_fps:number = 60;
            private m_lastTime:number = 0;
            private m_times:number = 60;
            private m_dealytime:number = 0;
            constructor()
            {
            }
            getFPS():number{return this.m_fps;};
            getFPSStr():string
            {
                //return this.m_fps;
                if(this.m_fps > 60)
                {
                    return "60";
                }
                else if(this.m_fps < 10)
                {
                    return "0"+this.m_fps;
                }
                return ""+this.m_fps;
            }
            updateFPS():void
            {
                let t:number = Date.now();
                if(this.m_lastTime > 0)
                {
                    --this.m_times;
                    if(this.m_times < 1)
                    {
                        this.m_fps = Math.round((60000.0)/this.m_dealytime);
                        this.m_dealytime = 0;
                        this.m_times = 60;
                    }
                    this.m_dealytime += t - this.m_lastTime;
                    
                }
                this.m_lastTime = t;
            }
        }
        export class RendererStatus
        {
            private m_rprocess:RenderProcess = null;
            private m_renderer:RendererInstance = null;

            private m_fpsInfo:FPSInfo = new FPSInfo();
            private m_textFPSNS:Text2DEntity = null;
            private m_textFPS:Text2DEntity = null;
            private m_fps:number = 60;
            // draw call
            private m_drawCallNS:Text2DEntity = null;
            private m_drawCall:Text2DEntity = null;
            private m_drawCalls:number = 0;
            // draw tris
            private m_drawTrisNS:Text2DEntity = null;
            private m_drawTri:Text2DEntity = null;
            private m_drawTris:number = 0;

            // pov
            private m_povNS:Text2DEntity = null;
            private m_pov:Text2DEntity = null;
            private m_povNumber:number = 0;
            constructor()
            {
            }
            initialize(renderer:RendererInstance,rprocess:RenderProcess):void
            {
                if(this.m_renderer == null)
                {
                    if(!H5FontSystem.GetInstance().isEnabled())
                    {
                        H5FontSystem.GetInstance().initialize("fontTex",18, 512,512,false,false);
                    }
                    this.m_renderer = renderer;
                    this.m_rprocess = rprocess;
                    //addEntityToProcess
                    let hDis:number = 20.0;
                    let py2:number = 2.0;
                    let px2:number = 100.0;
                    let px3:number = px2 - 10.0;
                    let text2D:Text2DEntity = null;
                    text2D = new Text2DEntity();
                    text2D.initialize("FPS:");
                    text2D.setXY(px3 - text2D.getWidth(),py2);
                    this.m_renderer.addEntityToProcess(text2D,this.m_rprocess);
                    this.m_textFPSNS = text2D;
                    let pw:number = text2D.getWidth();
                    text2D = new Text2DEntity();
                    text2D.initialize("60");
                    text2D.setXY(px2, 2.0);
                    this.m_renderer.addEntityToProcess(text2D,this.m_rprocess);
                    this.m_textFPS = text2D;
                    // draw call
                    py2 += hDis;
                    text2D = new Text2DEntity();
                    text2D.initialize("DrawCall:");
                    text2D.setXY(px3 - text2D.getWidth(),py2);
                    this.m_renderer.addEntityToProcess(text2D,this.m_rprocess);
                    this.m_drawCallNS = text2D;
                    pw = text2D.getWidth();
                    text2D = new Text2DEntity();
                    text2D.initialize("00");
                    text2D.setXY(px2, py2);
                    this.m_renderer.addEntityToProcess(text2D,this.m_rprocess);
                    this.m_drawCall = text2D;

                    // draw tris
                    py2 += hDis;
                    text2D = new Text2DEntity();
                    text2D.initialize("DrawTris:");
                    text2D.setXY(px3 - text2D.getWidth(),py2);
                    this.m_renderer.addEntityToProcess(text2D,this.m_rprocess);
                    this.m_drawTrisNS = text2D;
                    pw = text2D.getWidth();
                    text2D = new Text2DEntity();
                    text2D.initialize("00");
                    text2D.setXY(px2, py2);
                    this.m_renderer.addEntityToProcess(text2D,this.m_rprocess);
                    this.m_drawTri = text2D;

                    
                    // pov
                    py2 += hDis;
                    text2D = new Text2DEntity();
                    text2D.initialize("POV:");
                    text2D.setXY(px3 - text2D.getWidth(),py2);
                    this.m_renderer.addEntityToProcess(text2D,this.m_rprocess);
                    this.m_povNS = text2D;
                    pw = text2D.getWidth();
                    text2D = new Text2DEntity();
                    text2D.initialize("00");
                    text2D.setXY(px2, py2);
                    this.m_renderer.addEntityToProcess(text2D,this.m_rprocess);
                    this.m_pov = text2D;
                }
            }
            run():void
            {
                //  if(this.m_renderer != null)
                //  {
                this.m_fpsInfo.updateFPS();
                if(this.m_fps != this.m_fpsInfo.getFPS())
                {
                    this.m_fps = this.m_fpsInfo.getFPS();
                    this.m_textFPS.setText(this.m_fpsInfo.getFPSStr());
                    this.m_textFPS.update();
                }
                if(this.m_drawCalls != RendererState.DrawCallTimes)
                {
                    let drawCallStr:string = (RendererState.DrawCallTimes) + "";
                    this.m_drawCalls = RendererState.DrawCallTimes;
                    this.m_drawCall.setText(drawCallStr);
                    this.m_drawCall.update();
                }
                if(this.m_drawTris != RendererState.DrawTrisNumber)
                {
                    let drawTriStr:string = (RendererState.DrawTrisNumber) + "";
                    this.m_drawTris = RendererState.DrawTrisNumber;
                    this.m_drawTri.setText(drawTriStr);
                    this.m_drawTri.update();
                }
                if(this.m_povNumber != RendererState.POVNumber)
                {
                    let povNumber:string = (RendererState.POVNumber) + "";
                    this.m_povNumber = RendererState.POVNumber;
                    this.m_pov.setText(povNumber);
                    this.m_pov.update();
                }
                //RendererState.POVNumber
            }
            toString():string
            {
                return "[RendererStatus]";
            }
        }
    }
}
