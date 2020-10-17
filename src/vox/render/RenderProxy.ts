/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2020 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/
// 真正位于高频运行的渲染管线中的被使用的渲染关键代理对象

import * as RendererDevieceT from "../../vox/render/RendererDeviece";
import * as MathConstT from "../../vox/utils/MathConst";
import * as MaterialConstT from "../../vox/material/MaterialConst";
import * as VtxBufConstT from "../../vox/mesh/VtxBufConst";
import * as Vector3T from "../../vox/geom/Vector3";
import * as Color4T from "../../vox/material/Color4";
import * as CameraBaseT from "../../vox/view/CameraBase";
import * as Stage3DT from "../../vox/display/Stage3D";
import * as RODrawStateT from "../../vox/render/RODrawState";
import * as RAdapterContextT from "../../vox/render/RAdapterContext";
import * as RenderAdapterT from "../../vox/render/RenderAdapter";
import * as RenderFBOProxyT from "../../vox/render/RenderFBOProxy";

import RendererDeviece = RendererDevieceT.vox.render.RendererDeviece;
import MathConst = MathConstT.vox.utils.MathConst;
import MaterialConst = MaterialConstT.vox.material.MaterialConst;
import VtxBufConst = VtxBufConstT.vox.mesh.VtxBufConst;
import Vector3D = Vector3T.vox.geom.Vector3D;
import Color4 = Color4T.vox.material.Color4;
import CameraBase = CameraBaseT.vox.view.CameraBase;
import Stage3D = Stage3DT.vox.display.Stage3D;
import RODrawState = RODrawStateT.vox.render.RODrawState;
import RenderStateObject = RODrawStateT.vox.render.RenderStateObject;
import RenderColorMask = RODrawStateT.vox.render.RenderColorMask;
import RAdapterContext = RAdapterContextT.vox.render.RAdapterContext;
import RenderAdapter = RenderAdapterT.vox.render.RenderAdapter;
import RenderFBOProxy = RenderFBOProxyT.vox.render.RenderFBOProxy;

export namespace vox
{
    export namespace render
    {
        export class RenderProxy
        {
            RGBA:number = 0;
            UNSIGNED_BYTE:number = 0;
            TRIANGLE_STRIP:number = 0;
            TRIANGLE_FAN:number = 0;
            TRIANGLES:number = 0;
            LINES:number = 0;
            LINE_STRIP:number = 0;
            UNSIGNED_SHORT:number = 0;
            private m_camUBO:any = null;
            private m_mainCamera:CameraBase = null;
            private m_adapter:RenderAdapter = new RenderAdapter();

            private m_RAdapterContext:RAdapterContext = new RAdapterContext();

            private m_rc:any = null;
            private m_perspective2Enabled = false;
            private m_perspectiveEnabled = true;

            private m_viewX:number = 0;
            private m_viewY:number = 0;
            private m_viewW:number = 800;
            private m_viewH:number = 600;
            private m_viewSizeEnabled:boolean = false;

            private m_cameraNear:number = 0.1;
            private m_cameraFar:number = 5000.0;
            private m_cameraFov:number = 45.0;
            private m_maxWebGLVersion:number = 2;
            private m_WEBGL_VER:number = 2;

            private m_depthTestEnabled:boolean = true;
            private m_stencilTestEnabled:boolean = true;
            private m_multisampleEnabled:boolean = false;

            // webgl Extension ...
            WEBGL_draw_buffers:any = null;
            OES_vertex_array_object:any = null;
            ANGLE_instanced_arrays:any = null;
            EXT_color_buffer_float:any = null;
            EXT_color_buffer_half_float:any = null;
            OES_texture_float_linear:any = null;
            OES_texture_half_float_linear:any = null;
            OES_texture_float:any = null;
            //
            RContext:any = null;
            // main camera
            private Camera:CameraBase = null;
            private m_camSwitched:boolean = false;
            RState:RODrawState = null;
            // 是否舞台尺寸和view自动同步一致
            private m_autoSynViewAndStage:boolean = true;
            isAutoSynViewAndStage():boolean
            {
                return this.m_autoSynViewAndStage;
            }
            getCamera():CameraBase
            {
                return this.Camera;
            }
            updateCamera():void
            {
                return this.Camera.update();
            }
            createCameraUBO (shdProgram:any):void
            {
                //  if(this.m_camUBO == null)
                //  {
                //      this.m_camUBO = ShaderUBOBuilder.createUBOWithDataFloatsCount("UBlock_Camera", shdProgram, 32);
                //      this.m_camUBO.setSubDataArrAt(0, m_mainCamera.getViewMatrix().getLocalFS32());
                //      this.m_camUBO.setSubDataArrAt(16, m_mainCamera.getProjectMatrix().getLocalFS32());
                //      this.m_camUBO.run();
                //  }
            }
            updateCameraDataFromCamera(camera:CameraBase):void
            {
                if(camera != null)
                {
                    if(this.m_camSwitched || camera != this.m_mainCamera)
                    {
                        this.m_camSwitched = camera != this.m_mainCamera;
                        camera.updateCamMatToUProbe( this.m_mainCamera.matUProbe );
                        if(this.m_camUBO != null)
                        {
                            this.m_camUBO.setSubDataArrAt(0, camera.getViewMatrix().getLocalFS32());
                            this.m_camUBO.setSubDataArrAt(16, camera.getProjectMatrix().getLocalFS32());
                        }
                    }
                }
            }
            useCameraData():void
            {
                if(this.m_camUBO != null)
                {
                    this.m_camUBO.run();
                }
            }
            createVertexArray():any
            {
                let vao:any = null;
                if(this.m_WEBGL_VER == 2)
                {
                    vao = this.m_rc.createVertexArray();
                    //m_rc.bindVertexArray(vao);
                }
                else
                {
                    vao = this.OES_vertex_array_object.createVertexArrayOES();
                    //this.OES_vertex_array_object.bindVertexArrayOES(vao);
                }
                return vao;
            }
            useByLocationV2(ult:any,type:number, f32Arr:Float32Array,dataSize:number = 1,offset:number = 0):void
            {
                switch(type)
                {
                    case MaterialConst.SHADER_MAT4:
                        if(offset > 0)
                        {
                            this.m_rc.uniformMatrix4fv(ult, false, f32Arr,offset,dataSize * 16);
                        }
                        else
                        {
                            this.m_rc.uniformMatrix4fv(ult, false, f32Arr);
                        }
                    break;
                    case MaterialConst.SHADER_MAT3:
                        this.m_rc.uniformMatrix3fv(ult, false, f32Arr,0, dataSize * 9);
                    break;
                    case MaterialConst.SHADER_VEC4FV:
                        this.m_rc.uniform4fv(ult, f32Arr, offset, dataSize * 4);
                    break;
                    case MaterialConst.SHADER_VEC3FV:
                        this.m_rc.uniform3fv(ult, f32Arr, offset, dataSize * 3);
                    break;
                    case MaterialConst.SHADER_VEC4:
	        		    this.m_rc.uniform4f(ult, f32Arr[0], f32Arr[1], f32Arr[2], f32Arr[3]);
                    break;
                    case MaterialConst.SHADER_VEC3:
	        		    this.m_rc.uniform3f(ult, f32Arr[0], f32Arr[1], f32Arr[2]);
                    break;
                    case MaterialConst.SHADER_VEC2:
	        		    this.m_rc.uniform2f(ult, f32Arr[0], f32Arr[1]);
                    break;
                }
            }
            
            useByLocationV1(ult:any,type:number, f32Arr:Float32Array,dataSize:number = 1):void
            {
                switch(type)
                {
                    case MaterialConst.SHADER_MAT4:
                        this.m_rc.uniformMatrix4fv(ult, false, f32Arr);
                    break;
                    case MaterialConst.SHADER_MAT3:
                        this.m_rc.uniformMatrix3fv(ult, false, f32Arr);
                    break;
                    case MaterialConst.SHADER_VEC4FV:
                        this.m_rc.uniform4fv(ult, f32Arr, dataSize * 4);
                    break;
                    case MaterialConst.SHADER_VEC3FV:
                        this.m_rc.uniform3fv(ult, f32Arr, dataSize * 3);
                    break;
                    case MaterialConst.SHADER_VEC4:
	        		    this.m_rc.uniform4f(ult, f32Arr[0], f32Arr[1], f32Arr[2], f32Arr[3]);
                    break;
                    case MaterialConst.SHADER_VEC3:
	        		    this.m_rc.uniform3f(ult, f32Arr[0], f32Arr[1], f32Arr[2]);
                    break;
                    case MaterialConst.SHADER_VEC2:
	        		    this.m_rc.uniform2f(ult, f32Arr[0], f32Arr[1]);
                    break;
                }
            }
            createBuf():any
            {
                return this.m_rc.createBuffer();
            }
            deleteBuf(buf:any):void
            {
                this.m_rc.deleteBuffer(buf);
            }
            bindArrBuf(buf:any):void
            {
                this.m_rc.bindBuffer(this.m_rc.ARRAY_BUFFER, buf);
            }
            bindEleBuf(buf:any):void
            {
                this.m_rc.bindBuffer(this.m_rc.ELEMENT_ARRAY_BUFFER, buf);
            }
            arrBufSubData(float32Arr:Float32Array, offset:number):void
            {
                this.m_rc.bufferSubData(this.m_rc.ARRAY_BUFFER,offset, float32Arr);
            }
            arrBufData(float32Arr:Float32Array, usage:number):void
            {
                this.m_rc.bufferData(this.m_rc.ARRAY_BUFFER, float32Arr, VtxBufConst.ToGL(this.m_rc,usage));
            }
            eleBufSubData(uint16Arr:Uint16Array, offset:number):void
            {
                this.m_rc.bufferSubData(this.m_rc.ELEMENT_ARRAY_BUFFER,offset, uint16Arr);
            }
            eleBufData(uint16Arr:Uint16Array, usage:number):void
            {
                this.m_rc.bufferData(this.m_rc.ELEMENT_ARRAY_BUFFER, uint16Arr, VtxBufConst.ToGL(this.m_rc,usage));
            }
            arrBufDataMem(bytesSize:number, usage:number):void
            {
                this.m_rc.bufferData(this.m_rc.ARRAY_BUFFER, bytesSize, VtxBufConst.ToGL(this.m_rc,usage));
            }
            eleBufDataMem(bytesSize:number, usage:number):void
            {
                this.m_rc.bufferData(this.m_rc.ELEMENT_ARRAY_BUFFER, bytesSize, VtxBufConst.ToGL(this.m_rc,usage));
            }
            //this.m_rc.bufferData(this.m_gl.ELEMENT_ARRAY_BUFFER, this.m_ivs.length * 2, this.m_ivs, VtxBufConst.ToGL(this.m_gl,this.m_ivsStatus));
            useVtxAttrisbPtrTypeFloat(buf:any,registers:number[], wholeOffsetList:number[],registersLen:number,wholeStride:number):void
            {
                this.m_rc.bindBuffer(this.m_rc.ARRAY_BUFFER, buf);
                let i:number = 0;
                let reg:number = 0;
                for(; i < registersLen; ++i)
                {
                    reg = registers[i];
                    this.m_rc.enableVertexAttribArray( reg );
                    //  rc.vertexAttribPointer( reg, this.layoutList[i],rc.FLOAT,false,this.wholeStride,this.wholeOffsetList[i] );
                    this.m_rc.vertexAttribPointerTypeFloat( reg, wholeStride,wholeOffsetList[i] );
                }
                //this.m_rc.bindBuffer(this.m_rc.ELEMENT_ARRAY_BUFFER, buf);
            }
            useVtxAttrisbPtrTypeFloat2(bufs:any[],registers:number[], wholeOffsetList:number[],registersLen:number,wholeStride:number):void
            {
                let i:number = 0;
                let reg:number = 0;
                for(; i < registersLen; ++i)
                {
                    reg = registers[i];
                    this.m_rc
                    this.m_rc.enableVertexAttribArray( reg );
                    this.m_rc.vertexAttribPointerTypeFloat( reg, wholeStride,wholeOffsetList[i] );
                }
            }
            bindVertexArray(vao:any):any
            {
                if(this.m_WEBGL_VER == 2)
                {
                    this.m_rc.bindVertexArray(vao);
                }
                else
                {
                    this.OES_vertex_array_object.bindVertexArrayOES(vao);
                }
                return vao;
            }
            deleteVertexArray(vao:any):void
            {
                if(this.m_WEBGL_VER == 2)
                {
                    this.m_rc.deleteVertexArray(vao);
                }
                else
                {
                    this.OES_vertex_array_object.deleteVertexArrayOES(vao);
                }
            }
            drawInstanced(count:number, offset:number, instanceCount:number):void
            {
                if(this.m_WEBGL_VER == 2)
                {
                    this.m_rc.drawElementsInstanced(this.TRIANGLES,count,this.UNSIGNED_SHORT, offset, instanceCount);
                }
                else
                {
                    this.ANGLE_instanced_arrays.drawElementsInstancedANGLE(this.TRIANGLES,count, offset, instanceCount);
                }
            }
            createUBOBufferByBytesCount(bytesCount:number):any
            {
                let buf:any = this.m_rc.createBuffer();
                this.m_rc.bindBuffer(this.m_rc.UNIFORM_BUFFER, buf);
                this.m_rc.bufferData(this.m_rc.UNIFORM_BUFFER, bytesCount, this.m_rc.DYNAMIC_DRAW);
                //m_rc.bindBuffer(m_rc.UNIFORM_BUFFER, null);
                return buf;
            }
            createUBOBufferByDataArray(dataArray:Float32Array):any
            {
                let buf:any = this.m_rc.createBuffer();
                this.m_rc.bindBuffer(this.m_rc.UNIFORM_BUFFER, buf);
                this.m_rc.bufferData(this.m_rc.UNIFORM_BUFFER, dataArray, this.m_rc.DYNAMIC_DRAW);
                //m_rc.bindBuffer(m_rc.UNIFORM_BUFFER, null);
                return buf;
            }
            bindUBOBuffer(buf:any):void
            {
                this.m_rc.bindBuffer(this.m_rc.UNIFORM_BUFFER, buf);
            }
            deleteUBOBuffer(buf:any):void
            {
                this.m_rc.deleteBuffer(buf);
            }
            bufferDataUBOBuffer(dataArr:Float32Array):void
            {
                this.m_rc.bufferData(this.m_rc.UNIFORM_BUFFER, dataArr, this.m_rc.STATIC_DRAW);
                //m_rc.bufferSubData(m_rc.UNIFORM_BUFFER,0, dataArr, m_rc.STATIC_DRAW);
            }
            bindBufferBaseUBOBuffer(bindingIndex:number,buf:any):void
            {
                this.m_rc.bindBufferBase(this.m_rc.UNIFORM_BUFFER, bindingIndex, buf);
            }
            setWebGLMaxVersion(webgl_ver:number):void
            {
                if(webgl_ver == 1 || webgl_ver == 2)
                {
                    this.m_maxWebGLVersion = webgl_ver;
                }
            }
            getContext():RAdapterContext
            {
                return this.m_RAdapterContext;
            }
            getStage3D():Stage3D
            {
                return this.m_RAdapterContext.getStage();
            }
            getRenderAdapter():RenderAdapter
            {
               return this.m_adapter;
            }
			getActiveAttachmentTotal():number
			{
                return this.m_adapter.getActiveAttachmentTotal();
            }
            setCameraParam(fov:number, near:number, far:number):void
            {
                this.m_cameraFov = fov;
                this.m_cameraNear = near;
                this.m_cameraFar = far;
            }
            setRendererParam(depthTestEnabled:boolean, stencilTestEnabled:boolean, multisampleEnabled:boolean):void
            {
                this.m_depthTestEnabled = depthTestEnabled;
                this.m_stencilTestEnabled = stencilTestEnabled;
                this.m_multisampleEnabled = multisampleEnabled;
            }
            getMouseXYWorldRay(rl_position:Vector3D, rl_tv:Vector3D):void
            {
                let stage:Stage3D = this.m_RAdapterContext.getStage();
                this.m_mainCamera.getWorldPickingRayByScreenXY(stage.mouseX,stage.mouseY,rl_position,rl_tv);
            }
            
            setViewPort(px:number,py:number,pw:number,ph:number):void
            {
                this.m_autoSynViewAndStage = false;
                this.m_viewX = px;
                this.m_viewY = py;
                this.m_viewW = pw;
                this.m_viewH = ph;
                let stage:Stage3D = this.m_RAdapterContext.getStage();
                if(stage != null)
                {
                    stage.setViewPort(pw,py,pw,ph);
                    if(this.m_mainCamera != null)
                    {
                        this.m_mainCamera.setViewXY(this.m_viewX,this.m_viewY);
                        this.m_mainCamera.setViewSize(this.m_viewW,this.m_viewH, this.m_RAdapterContext.getDevicePixelRatio());                    
                    }
                }
                this.setRCViewPort(this.m_viewX,this.m_viewY,this.m_viewW,this.m_viewH);
            }
            setRCViewPort(px:number,py:number,pw:number,ph:number):void
            {
                this.m_autoSynViewAndStage = false;
                this.m_RAdapterContext.setViewport(px,py,pw,ph);
            }
            reseizeRCViewPort():void
            {
                this.m_adapter.reseizeViewPort();
            }
            private resizeCallback():void
            {
                if(this.m_autoSynViewAndStage)
                {
                    let stage:Stage3D = this.m_RAdapterContext.getStage();
                    
                    this.m_viewX = 0;
                    this.m_viewY = 0;
                    this.m_viewW = stage.stageWidth;
                    this.m_viewH = stage.stageHeight;
                    if(this.m_mainCamera == null)
                    {
                        this.createMainCamera();
                    }
                    this.m_RAdapterContext.setViewport(this.m_viewX,this.m_viewY, this.m_viewW,this.m_viewH);
                    this.m_mainCamera.setViewXY(this.m_viewX,this.m_viewY);
                    this.m_mainCamera.setViewSize(this.m_viewW,this.m_viewH,this.m_RAdapterContext.getDevicePixelRatio());
                    //console.log("resizeCallback(), this.m_viewW, this.m_viewH: "+this.m_viewW+", "+this.m_viewH);
                }
            }
            private createMainCamera():void
            {
                let stage:Stage3D = this.m_RAdapterContext.getStage();                
                this.m_mainCamera = new CameraBase(stage.getIndex());
                this.m_mainCamera.uniformEnabled = true;
                
                //
                if(this.m_perspectiveEnabled)
                {
                    this.m_mainCamera.perspectiveRH(MathConst.DegreeToRadian(this.m_cameraFov), this.m_viewW/this.m_viewH, this.m_cameraNear, this.m_cameraFar);
                }
                else
                {
                    this.m_mainCamera.orthoRH(this.m_cameraNear, this.m_cameraFar, -0.5 * this.m_viewH, 0.5 * this.m_viewH, -0.5 * this.m_viewW, 0.5 * this.m_viewW);
                }
                this.m_mainCamera.setViewXY(this.m_viewX,this.m_viewY);
                this.m_mainCamera.setViewSize(this.m_viewW,this.m_viewH,this.m_RAdapterContext.getDevicePixelRatio());
            }
            readPixels(px:number, py:number, width:number, height:number, format:number, dataType:number, pixels:Uint8Array):void
            {
                this.m_adapter.readPixels(px,py,width,height,format,dataType,pixels);
            }
            initialize(glCanvasNS:string,glDivNS:string,posV3:Vector3D = null, lookAtPosV3:Vector3D = null, upV3:Vector3D = null,perspectiveEnabled:boolean = true):void
            {
                if(posV3 == null)
                {
                    posV3 = new Vector3D(500.0, 500.0, 500.0);
                }
                if(lookAtPosV3 == null)
                {
                    lookAtPosV3 = new Vector3D(0.0, 0.0, 0.0);
                }
                if(upV3 == null)
                {
                    upV3 = new Vector3D(0.0, 1.0, 0.0);
                }
                this.m_perspectiveEnabled = perspectiveEnabled;
                this.m_RAdapterContext.depthTestEnabled = this.m_depthTestEnabled;
                this.m_RAdapterContext.stencilTestEnabled = this.m_stencilTestEnabled;
                this.m_RAdapterContext.setResizeCallback(this, this.resizeCallback);
                this.m_RAdapterContext.setWebGLMaxVersion(this.m_maxWebGLVersion);
                this.m_RAdapterContext.initialize(glCanvasNS,glDivNS);
                this.m_WEBGL_VER = this.m_RAdapterContext.getWebGLVersion();
                RendererDeviece.Initialize([this.m_WEBGL_VER]);
                this.m_viewW = this.m_RAdapterContext.getViewportWidth();
                this.m_viewH = this.m_RAdapterContext.getViewportHeight();
                this.m_adapter.initialize(this.m_RAdapterContext);
                
                if(this.m_autoSynViewAndStage)
                {
                    let stage:Stage3D = this.m_RAdapterContext.getStage();
                    if(stage != null)
                    {
                        this.m_viewW = stage.stageWidth;
                        this.m_viewH = stage.stageHeight;
                    }
                }
                if(this.m_mainCamera == null)
                {
                    this.createMainCamera();
                }
                this.m_RAdapterContext.setViewport(this.m_viewX,this.m_viewY, this.m_viewW,this.m_viewH);                
                this.m_mainCamera.lookAtRH(posV3, lookAtPosV3, upV3);
                this.m_mainCamera.update();
                this.m_adapter.bgColor.setRGB3f(0.0,0.0,0.0);

                this.Camera = this.m_mainCamera;
            
                this.m_rc = this.m_RAdapterContext.getRC();
                this.RGBA = this.m_rc.RGBA;
                this.UNSIGNED_BYTE = this.m_rc.UNSIGNED_BYTE;

                this.TRIANGLE_STRIP = this.m_rc.TRIANGLE_STRIP;
                this.TRIANGLE_FAN = this.m_rc.TRIANGLE_FAN;
                this.TRIANGLES = this.m_rc.TRIANGLES;
                this.LINES = this.m_rc.LINES;
                this.LINE_STRIP = this.m_rc.LINE_STRIP;
                this.UNSIGNED_SHORT = this.m_rc.UNSIGNED_SHORT;
                RenderFBOProxy.SetRenderer(this.m_RAdapterContext);
            
                this.RState = this.m_RAdapterContext.getRenderState();
                this.RContext = this.m_rc;

                if(this.m_WEBGL_VER == 1)
                {
                    this.WEBGL_draw_buffers = RenderFBOProxy.GetWebglDrawBufsObj();
                    this.OES_vertex_array_object = this.m_rc.getExtension('OES_vertex_array_object');
                    if(this.OES_vertex_array_object != null)
                    console.log("Use OES_vertex_array_object Extension success!");
                    else
                    console.log("OES_vertex_array_object Extension can not support!");
                    this.ANGLE_instanced_arrays = this.m_rc.getExtension('ANGLE_instanced_arrays');
                    if(this.ANGLE_instanced_arrays != null)
                    console.log("Use ANGLE_instanced_arrays Extension success!");
                    else
                    console.log("ANGLE_instanced_arrays Extension can not support!");
                    this.EXT_color_buffer_float = this.m_rc.getExtension('EXT_color_buffer_float');
                    if(this.EXT_color_buffer_float != null)
                    console.log("Use EXT_color_buffer_float Extension success!");
                    else
                    console.log("EXT_color_buffer_float Extension can not support!");

                    this.EXT_color_buffer_half_float = this.m_rc.getExtension('EXT_color_buffer_half_float');
                    if(this.EXT_color_buffer_half_float != null)
                    console.log("Use EXT_color_buffer_half_float Extension success!");
                    else
                    console.log("EXT_color_buffer_half_float Extension can not support!");
                
                    this.OES_texture_float_linear = this.m_rc.getExtension('OES_texture_float_linear');
                    if(this.OES_texture_float_linear != null)
                    console.log("Use OES_texture_float_linear Extension success!");
                    else
                    console.log("OES_texture_float_linear Extension can not support!");

                    this.OES_texture_half_float_linear = this.m_rc.getExtension('OES_texture_half_float_linear');
                    if(this.OES_texture_half_float_linear != null)
                    console.log("Use OES_texture_half_float_linear Extension success!");
                    else
                    console.log("OES_texture_half_float_linear Extension can not support!");

                    this.OES_texture_float = this.m_rc.getExtension('OES_texture_float');
                    if(this.OES_texture_float != null)
                    console.log("Use OES_texture_float Extension success!");
                    else
                    console.log("OES_texture_float Extension can not support!");
                }
                else
                {
                    
                    this.EXT_color_buffer_half_float = this.m_rc.getExtension('EXT_color_buffer_half_float');
                    if(this.EXT_color_buffer_half_float != null)
                    console.log("Use EXT_color_buffer_half_float Extension success!");
                    else
                    console.log("EXT_color_buffer_half_float Extension can not support!");

                    this.OES_texture_float_linear = this.m_rc.getExtension('OES_texture_float_linear');
                    if(this.OES_texture_float_linear != null)
                    console.log("Use OES_texture_float_linear Extension success!");
                    else
                    console.log("OES_texture_float_linear Extension can not support!");
                    
                    this.OES_texture_half_float_linear = this.m_rc.getExtension('OES_texture_half_float_linear');
                    if(this.OES_texture_half_float_linear != null)
                    console.log("Use OES_texture_half_float_linear Extension success!");
                    else
                    console.log("OES_texture_half_float_linear Extension can not support!");

                    this.EXT_color_buffer_float = this.m_rc.getExtension('EXT_color_buffer_float');
                    if(this.EXT_color_buffer_float != null)
                    console.log("Use EXT_color_buffer_float Extension success!");
                    else
                    console.log("EXT_color_buffer_float Extension can not support!");
                }
            }
            createCamera():CameraBase
            {
                return new CameraBase(this.m_RAdapterContext.getStage().getIndex());
            }
            setClearRGBColor3f(pr:number,pg:number,pb:number)
            {
                this.m_adapter.bgColor.setRGB3f(pr,pg,pb);
            }
            setClearColor(color:Color4):void
            {
                this.m_adapter.bgColor.copyFrom(color);
            }
            setClearRGBAColor4f(pr:number,pg:number,pb:number,pa:number):void
            {
                this.m_adapter.bgColor.setRGBA4f(pr,pg,pb,pa);
            }
            getClearRGBAColor4f(color4:Color4):void
            {
                color4.copyFrom(this.m_adapter.bgColor);
            }
            getViewWidth():number
            {
                return this.m_adapter.getViewWidth();
            }
            getViewHeight():number
            {
                return this.m_adapter.getViewHeight();
            }
            setRenderToBackBuffer():void
            {
                this.m_adapter.setRenderToBackBuffer();
            }
            clearRenderBuffer():void
            {
                this.m_adapter.clear();
            }
            renderBegin()
            {
                this.m_mainCamera.update();
                this.m_adapter.renderBegin();
            }
            renderEnd():void
            {
            }
            useRenderStateByName(stateName:string):void
            {
                RenderStateObject.UseRenderStateByName(stateName);
            }
            setScissorEnabled(boo:boolean):void
            {
                this.m_RAdapterContext.setScissorEnabled(boo);
            }
            setScissorRect(px:number,py:number,pw:number,ph:number):void
            {
                this.m_RAdapterContext.setScissorRect(px,py,pw,ph);
            }
    
            useRenderColorMask(state:number):void
            {
                RenderColorMask.UseRenderState(state);
            }
            unlockRenderColorMask():void
            {
                RenderColorMask.Unlock();
            }
            lockRenderColorMask():void
            {
                RenderColorMask.Lock();
            }
        
            useRenderState(state:number):void
            {
                RenderStateObject.UseRenderState(state);
            }
            unlockRenderState():void
            {
                RenderStateObject.Unlock();
            }
            lockRenderState():void
            {
                RenderStateObject.Lock();
            }

            toString():string
            {
                return "[Object RenderProxy()]";
            }
        }

    }
}
