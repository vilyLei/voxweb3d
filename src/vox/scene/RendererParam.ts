/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import * as Vector3DT from "../../vox/geom/Vector3";
import Vector3D = Vector3DT.vox.geom.Vector3D;
export namespace vox
{
    export namespace scene
    {
        export class RendererParam
        {
            private m_matrix4AllocateSize:number = 8192;
            private m_glCanvasName:string = "glcanvas";
            private m_glDivName:string = "glcanvasdiv";
            private m_renderContextAttri:any = {
                depth:true
                ,premultipliedAlpha: false
                , alpha: true
                , antialias:false
                ,stencil:false
                ,preserveDrawingBuffer:true
                ,powerPreference:"high-performance"//"default"
            };
            maxWebGLVersion:number = 2;
            cameraPerspectiveEnabled:boolean = true;
            // event flow control enable
            evtFlowEnabled:boolean = false;
            // x: fov, y: near, z: far
            camProjParam:Vector3D = new Vector3D(45.0,10.0,5000.0);
            // x: bottom, y: top, z: left, w: right
            // camOrthoParam:Vector3D = new Vector3D(-300.0,300.0, -400.0,400.0);
            camPosition:Vector3D = new Vector3D(2000.0,2000.0,2000.0);
            camLookAtPos:Vector3D = new Vector3D(0.0,0.0,0.0);
            camUpDirect:Vector3D = new Vector3D(0.0,1.0,0.0);

            batchEnabled:boolean = true;
            processFixedState:boolean = false;
            constructor(glCanvasName:string = "glcanvas",divIdns:string = "")
            {
                if(divIdns != "")
                {
                    this.m_glDivName = divIdns;
                }
                this.m_glCanvasName = glCanvasName;
            }
            getRenderContextAttri():any
            {
                return this.m_renderContextAttri;
            }
            setAttriDepth(boo:boolean):void
            {
                this.m_renderContextAttri.depth = boo;
            }
            setAttriStencil(boo:boolean):void
            {
                this.m_renderContextAttri.stencil = boo;
            }
            setAttriAlpha(boo:boolean):void
            {
                this.m_renderContextAttri.alpha = boo;
            }
            setAttriPremultipliedAlpha(boo:boolean):void
            {
                this.m_renderContextAttri.premultipliedAlpha = boo;
            }
            setAttriAntialias(boo:boolean):void
            {
                this.m_renderContextAttri.antialias = boo;
            }
            setAttripreserveDrawingBuffer(boo:boolean):void
            {
                this.m_renderContextAttri.preserveDrawingBuffer = boo;
            }
            setAttriHightPowerPreference(boo:boolean):void
            {
                this.m_renderContextAttri.powerPreference = boo?"high-performance":"default";
            }
            getGLCanvasName():string
            {
                return this.m_glCanvasName;
            }
            getGLDivName():string
            {
                return this.m_glDivName;
            }
            setMatrix4AllocateSize(total:number):void
            {
                if(total < 1024)
                {
                    total = 1024;
                }
                this.m_matrix4AllocateSize = total;
            }
            getMatrix4AllocateSize():number
            {
                return this.m_matrix4AllocateSize;
            }
            setCamProject(fov_angle_degree:number, near:number, far:number):void
            {
                if(near >= far)
                {
                    throw Error("Error Camera cear > far !!!");
                }
                this.camProjParam.setTo(fov_angle_degree,near,far);
            }
            //  setCamOrthoProject(bottom:number, top:number, left:number, right:number, near:number, far:number):void
            //  {
            //      if(near >= far)
            //      {
            //          throw Error("Error Camera cear > far !!!");
            //      }
            //      this.camProjParam.setTo(0.0,near,far);
            //      this.camOrthoParam.x = bottom;
            //      this.camOrthoParam.y = top;
            //      this.camOrthoParam.z = left;
            //      this.camOrthoParam.w = right;
            //  }
            setCamPosition(px:number, py:number, pz:number):void
            {
                this.camPosition.setTo(px,py,pz);
            }
            setCamLookAtPos(px:number, py:number, pz:number):void
            {
                this.camLookAtPos.setTo(px,py,pz);
            }
            setCamUpDirect(px:number, py:number, pz:number):void
            {
                this.camUpDirect.setTo(px,py,pz);
            }
        }
    }
}