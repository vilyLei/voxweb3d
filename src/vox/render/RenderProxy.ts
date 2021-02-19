/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2020 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/
// 真正位于高频运行的渲染管线中的被使用的渲染关键代理对象

import * as IVtxShdCtrT from "../../vox/material/IVtxShdCtr";
import * as RenderFilterT from "../../vox/render/RenderFilter";
import * as RenderMaskBitfieldT from "../../vox/render/RenderMaskBitfield";
import * as MathConstT from "../../vox/utils/MathConst";
import * as MaterialConstT from "../../vox/material/MaterialConst";
import * as VtxBufConstT from "../../vox/mesh/VtxBufConst";
import * as Vector3T from "../../vox/geom/Vector3";
import * as Color4T from "../../vox/material/Color4";
import * as CameraBaseT from "../../vox/view/CameraBase";
import * as RendererParamT from "../../vox/scene/RendererParam";
import * as Stage3DT from "../../vox/display/Stage3D";
import * as RODrawStateT from "../../vox/render/RODrawState";
import * as RAdapterContextT from "../../vox/render/RAdapterContext";
import * as RenderAdapterT from "../../vox/render/RenderAdapter";
import * as RenderFBOProxyT from "../../vox/render/RenderFBOProxy";
import * as RCExtensionT from "../../vox/render/RCExtension";

import * as ROTextureResourceT from '../../vox/render/ROTextureResource';
import * as DivLogT from "../../vox/utils/DivLog";

import IVtxShdCtr = IVtxShdCtrT.vox.material.IVtxShdCtr;
import RenderFilter = RenderFilterT.vox.render.RenderFilter;
import RenderMaskBitfield = RenderMaskBitfieldT.vox.render.RenderMaskBitfield;
import MathConst = MathConstT.vox.utils.MathConst;
import MaterialConst = MaterialConstT.vox.material.MaterialConst;
import VtxBufConst = VtxBufConstT.vox.mesh.VtxBufConst;
import Vector3D = Vector3T.vox.geom.Vector3D;
import Color4 = Color4T.vox.material.Color4;
import CameraBase = CameraBaseT.vox.view.CameraBase;
import RendererParam = RendererParamT.vox.scene.RendererParam;
import Stage3D = Stage3DT.vox.display.Stage3D;
import RODrawState = RODrawStateT.vox.render.RODrawState;
import RenderStateObject = RODrawStateT.vox.render.RenderStateObject;
import RenderColorMask = RODrawStateT.vox.render.RenderColorMask;
import RAdapterContext = RAdapterContextT.vox.render.RAdapterContext;
import RenderAdapter = RenderAdapterT.vox.render.RenderAdapter;
import RenderFBOProxy = RenderFBOProxyT.vox.render.RenderFBOProxy;
import RCExtension = RCExtensionT.vox.render.RCExtension;

import ROTextureResource = ROTextureResourceT.vox.render.ROTextureResource;
import DivLog = DivLogT.vox.utils.DivLog;

export namespace vox
{
    export namespace render
    {
        export class RenderProxy
        {

            readonly RGBA:number = 0;
            readonly UNSIGNED_BYTE:number = 0;
            readonly TRIANGLE_STRIP:number = 0;
            readonly TRIANGLE_FAN:number = 0;
            readonly TRIANGLES:number = 0;
            readonly LINES:number = 0;
            readonly LINE_STRIP:number = 0;
            readonly UNSIGNED_SHORT:number = 0;
            readonly UNSIGNED_INT:number = 0;

            readonly COLOR:number = 0;
            readonly DEPTH:number = 0;
            readonly STENCIL:number = 0;
            readonly DEPTH_STENCIL:number = 0;
            
            readonly MAX:number = 0;
            readonly MIN:number = 0;

            readonly RContext:any = null;
            readonly RState:RODrawState = null;
            readonly Texture:ROTextureResource = null;

            private m_uid:number = 0;
            private static s_uid:number = 0;
            private m_camUBO:any = null;
            private m_mainCamera:CameraBase = null;
            private m_adapter:RenderAdapter = null;

            private m_adapterContext:RAdapterContext = new RAdapterContext();

            private m_rc:any = null;
            private m_perspectiveEnabled = true;

            private m_viewX:number = 0;
            private m_viewY:number = 0;
            private m_viewW:number = 800;
            private m_viewH:number = 600;

            private m_cameraNear:number = 0.1;
            private m_cameraFar:number = 5000.0;
            private m_cameraFov:number = 45.0;
            private m_maxWebGLVersion:number = 2;
            private m_WEBGL_VER:number = 2;

            // main camera
            private m_camera:CameraBase = null;
            private m_camSwitched:boolean = false;
            // 是否舞台尺寸和view自动同步一致
            private m_autoSynViewAndStage:boolean = true;

            constructor()
            {
                this.m_uid = RenderProxy.s_uid++;
            }
            getUid():number
            {
                return this.m_uid;
            }
            isAutoSynViewAndStage():boolean
            {
                return this.m_autoSynViewAndStage;
            }
            
			lockViewport():void
			{
				this.m_adapter.lockViewport();
			}
			unlockViewport():void
			{
				this.m_adapter.unlockViewport();
			}
            getDiv():any
            {
                return this.m_adapter.getDiv();
            }
            getCanvas():any
            {
                return this.m_adapter.getCanvas();
            }
            cameraLock():void
            {
                this.m_camera.lock();
            }
            cameraUnlock():void
            {
                this.m_camera.unlock();
            }
            getCamera():CameraBase
            {
                return this.m_camera;
            }
            updateCamera():void
            {
                return this.m_camera.update();
            }
            createCameraUBO (shd:any):void
            {
                //  if(this.m_camUBO == null)
                //  {
                //      this.m_camUBO = ShaderUBOBuilder.createUBOWithDataFloatsCount("UBlock_Camera", shd, 32);
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
                }
                else
                {
                    vao = RCExtension.OES_vertex_array_object.createVertexArrayOES();
                }
                return vao;
            }
            useByLocationV2(ult:any,type:number, f32Arr:Float32Array,dataSize:number,offset:number):void
            {
                switch(type)
                {
                    case MaterialConst.SHADER_MAT4:
                        if(offset < 1)
                        {
                            this.m_rc.uniformMatrix4fv(ult, false, f32Arr);
                        }
                        else
                        {
                            this.m_rc.uniformMatrix4fv(ult, false, f32Arr,offset,dataSize * 16);
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
                    default:
                        break;
                }
            }
            
            useByLocationV1(ult:any,type:number, f32Arr:Float32Array,dataSize:number):void
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
                    default:
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
            eleBufSubData(uintDataArr:Uint16Array|Uint32Array, offset:number):void
            {
                this.m_rc.bufferSubData(this.m_rc.ELEMENT_ARRAY_BUFFER,offset, uintDataArr);
            }
            eleBufData(uintDataArr:Uint16Array|Uint32Array, usage:number):void
            {
                this.m_rc.bufferData(this.m_rc.ELEMENT_ARRAY_BUFFER, uintDataArr, VtxBufConst.ToGL(this.m_rc,usage));
            }
            arrBufDataMem(bytesSize:number, usage:number):void
            {
                this.m_rc.bufferData(this.m_rc.ARRAY_BUFFER, bytesSize, VtxBufConst.ToGL(this.m_rc,usage));
            }
            eleBufDataMem(bytesSize:number, usage:number):void
            {
                this.m_rc.bufferData(this.m_rc.ELEMENT_ARRAY_BUFFER, bytesSize, VtxBufConst.ToGL(this.m_rc,usage));
            }
            useVtxAttrisbPtrTypeFloat(shdp:IVtxShdCtr, buf:any,attribTypes:number[],attribTypesLen:number, wholeOffsetList:number[],wholeStride:number):void
            {
                this.m_rc.bindBuffer(this.m_rc.ARRAY_BUFFER, buf);
                
                for(let i:number = 0; i < attribTypesLen; ++i)
                {
                    shdp.vertexAttribPointerTypeFloat(attribTypes[i],wholeStride, wholeOffsetList[i]);
                }
            }
            useVtxAttrisbPtrTypeFloatMulti(shdp:IVtxShdCtr, bufs:any[],attribTypes:number[],attribTypesLen:number, wholeOffsetList:number[],wholeStride:number):void
            {
                for(let i:number=0; i < attribTypesLen; ++i)
                {
                    this.m_rc.bindBuffer(this.m_rc.ARRAY_BUFFER, bufs[i]);
                    shdp.vertexAttribPointerTypeFloat(attribTypes[i],wholeStride, wholeOffsetList[i]);
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
                    RCExtension.OES_vertex_array_object.bindVertexArrayOES(vao);
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
                    RCExtension.OES_vertex_array_object.deleteVertexArrayOES(vao);
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
                    RCExtension.ANGLE_instanced_arrays.drawElementsInstancedANGLE(this.TRIANGLES,count, offset, instanceCount);
                }
            }
            createUBOBufferByBytesCount(bytesCount:number):any
            {
                let buf:any = this.m_rc.createBuffer();
                this.m_rc.bindBuffer(this.m_rc.UNIFORM_BUFFER, buf);
                this.m_rc.bufferData(this.m_rc.UNIFORM_BUFFER, bytesCount, this.m_rc.DYNAMIC_DRAW);
                return buf;
            }
            createUBOBufferByDataArray(dataArray:Float32Array):any
            {
                let buf:any = this.m_rc.createBuffer();
                this.m_rc.bindBuffer(this.m_rc.UNIFORM_BUFFER, buf);
                this.m_rc.bufferData(this.m_rc.UNIFORM_BUFFER, dataArray, this.m_rc.DYNAMIC_DRAW);
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
                return this.m_adapterContext;
            }
            getStage3D():Stage3D
            {
                return this.m_adapterContext.getStage();
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
            getMouseXYWorldRay(rl_position:Vector3D, rl_tv:Vector3D):void
            {
                let stage:Stage3D = this.m_adapterContext.getStage();
                this.m_mainCamera.getWorldPickingRayByScreenXY(stage.mouseX,stage.mouseY,rl_position,rl_tv);
            }
            
            setViewPort(px:number,py:number,pw:number,ph:number):void
            {
                this.m_autoSynViewAndStage = false;
                this.m_viewX = px;
                this.m_viewY = py;
                this.m_viewW = pw;
                this.m_viewH = ph;
                let stage:Stage3D = this.m_adapterContext.getStage();
                if(stage != null)
                {
                    stage.setViewPort(pw,py,pw,ph);
                    if(this.m_mainCamera != null)
                    {
                        this.m_mainCamera.setViewXY(this.m_viewX,this.m_viewY);
                        this.m_mainCamera.setViewSize(this.m_viewW,this.m_viewH, this.m_adapterContext.getDevicePixelRatio());
                    }
                }
                this.setRCViewPort(this.m_viewX,this.m_viewY,this.m_viewW,this.m_viewH);
            }
            setRCViewPort(px:number,py:number,pw:number,ph:number):void
            {
                this.m_autoSynViewAndStage = false;
                this.m_adapterContext.setViewport(px,py,pw,ph);
            }
            reseizeRCViewPort():void
            {
                this.m_adapter.unlockViewport();
                this.m_adapter.reseizeViewPort();
            }
            private resizeCallback():void
            {
                if(this.m_autoSynViewAndStage)
                {
                    let stage:Stage3D = this.m_adapterContext.getStage();
                    
                    this.m_viewX = 0;
                    this.m_viewY = 0;
                    this.m_viewW = stage.stageWidth;
                    this.m_viewH = stage.stageHeight;
                    if(this.m_mainCamera == null)
                    {
                        this.createMainCamera();
                    }
                    this.m_adapterContext.setViewport(this.m_viewX,this.m_viewY, this.m_viewW,this.m_viewH);
                    this.m_mainCamera.setViewXY(this.m_viewX,this.m_viewY);
                    this.m_mainCamera.setViewSize(this.m_viewW,this.m_viewH,this.m_adapterContext.getDevicePixelRatio());
                    //console.log("resizeCallback(), this.m_viewW, this.m_viewH: "+this.m_viewW+", "+this.m_viewH);
                }
            }
            private createMainCamera():void
            {
                let stage:Stage3D = this.m_adapterContext.getStage();
                this.m_mainCamera = new CameraBase(stage.getIndex());
                this.m_mainCamera.uniformEnabled = true;
                
                if(this.m_perspectiveEnabled)
                {
                    this.m_mainCamera.perspectiveRH(MathConst.DegreeToRadian(this.m_cameraFov), this.m_viewW/this.m_viewH, this.m_cameraNear, this.m_cameraFar);
                }
                else
                {
                    this.m_mainCamera.orthoRH(this.m_cameraNear, this.m_cameraFar, -0.5 * this.m_viewH, 0.5 * this.m_viewH, -0.5 * this.m_viewW, 0.5 * this.m_viewW);
                }
                this.m_mainCamera.setViewXY(this.m_viewX,this.m_viewY);
                this.m_mainCamera.setViewSize(this.m_viewW,this.m_viewH,this.m_adapterContext.getDevicePixelRatio());
            }
            readPixels(px:number, py:number, width:number, height:number, format:number, dataType:number, pixels:Uint8Array):void
            {
                this.m_adapter.readPixels(px,py,width,height,format,dataType,pixels);
            }
            initialize(param:RendererParam):void
            {
                let posV3:Vector3D = param.camPosition;
                let lookAtPosV3:Vector3D = param.camLookAtPos;
                let upV3:Vector3D = param.camUpDirect;
                if(posV3 == null) posV3 = new Vector3D(500.0, 500.0, 500.0);
                if(lookAtPosV3 == null) lookAtPosV3 = new Vector3D(0.0, 0.0, 0.0);                
                if(upV3 == null) upV3 = new Vector3D(0.0, 1.0, 0.0);

                this.m_perspectiveEnabled = param.cameraPerspectiveEnabled;
                this.m_adapterContext.autoSyncRenderBufferAndWindowSize = param.autoSyncRenderBufferAndWindowSize;
                this.m_adapterContext.setResizeCallback(this, this.resizeCallback);
                this.m_adapterContext.setWebGLMaxVersion(this.m_maxWebGLVersion);
                this.m_adapterContext.initialize(param.getDiv(),param.getRenderContextAttri());
                this.m_WEBGL_VER = this.m_adapterContext.getWebGLVersion();
                
                this.m_rc = this.m_adapterContext.getRC();
                let selfT:any = this;
                let gl:any = this.m_rc;
                let texRes:ROTextureResource = new ROTextureResource(this.m_uid,gl);
                selfT.Texture = texRes;

                this.m_viewW = this.m_adapterContext.getViewportWidth();
                this.m_viewH = this.m_adapterContext.getViewportHeight();
                
                this.m_adapter = new RenderAdapter(this.m_uid,texRes);
                this.m_adapter.initialize(this.m_adapterContext);
                
                if(this.m_autoSynViewAndStage)
                {
                    let stage:Stage3D = this.m_adapterContext.getStage();
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
                this.m_adapterContext.setViewport(this.m_viewX,this.m_viewY, this.m_viewW,this.m_viewH);                
                this.m_mainCamera.lookAtRH(posV3, lookAtPosV3, upV3);
                this.m_mainCamera.update();
                this.m_adapter.bgColor.setRGB3f(0.0,0.0,0.0);

                this.m_camera = this.m_mainCamera;


                selfT.RGBA = gl.RGBA;
                selfT.UNSIGNED_BYTE = gl.UNSIGNED_BYTE;
                selfT.TRIANGLE_STRIP = gl.TRIANGLE_STRIP;
                selfT.TRIANGLE_FAN = gl.TRIANGLE_FAN;
                selfT.TRIANGLES = gl.TRIANGLES;
                selfT.LINES = this.m_rc.LINES;
                selfT.LINE_STRIP = gl.LINE_STRIP;
                selfT.UNSIGNED_SHORT = gl.UNSIGNED_SHORT;
                selfT.UNSIGNED_INT = gl.UNSIGNED_INT;

                selfT.COLOR = gl.COLOR;
                selfT.DEPTH = gl.DEPTH;
                selfT.STENCIL = gl.STENCIL;
                selfT.DEPTH_STENCIL = gl.DEPTH_STENCIL;
                if(this.m_WEBGL_VER > 1)
                {
                    selfT.MIN = gl.MIN;
                    selfT.MAX = gl.MAX;
                }
                else
                {
                    selfT.MIN = RCExtension.EXT_blend_minmax.MIN_EXT;
                    selfT.MAX = RCExtension.EXT_blend_minmax.MAX_EXT;
                }
                let classRenderFilter:any = RenderFilter;
                classRenderFilter.NEAREST = gl.NEAREST;
                classRenderFilter.LINEAR = gl.LINEAR;
                classRenderFilter.LINEAR_MIPMAP_LINEAR = gl.LINEAR_MIPMAP_LINEAR;
                classRenderFilter.NEAREST_MIPMAP_NEAREST = gl.NEAREST_MIPMAP_NEAREST;
                classRenderFilter.LINEAR_MIPMAP_NEAREST = gl.LINEAR_MIPMAP_NEAREST;
                classRenderFilter.NEAREST_MIPMAP_LINEAR = gl.NEAREST_MIPMAP_LINEAR;
                let classRenderMaskBitfield:any = RenderMaskBitfield;
			    classRenderMaskBitfield.COLOR_BUFFER_BIT = gl.COLOR_BUFFER_BIT;
			    classRenderMaskBitfield.DEPTH_BUFFER_BIT = gl.DEPTH_BUFFER_BIT;
			    classRenderMaskBitfield.STENCIL_BUFFER_BIT = gl.STENCIL_BUFFER_BIT;

                RenderFBOProxy.SetRenderer(this.m_adapterContext);
                selfT.RState = this.m_adapterContext.getRenderState();
                selfT.RContext = this.m_rc;

            }
            createCamera():CameraBase
            {
                return new CameraBase(this.m_adapterContext.getStage().getIndex());
            }
            setClearRGBColor3f(pr:number,pg:number,pb:number)
            {
                this.m_adapter.bgColor.setRGB3f(pr,pg,pb);
            }
            setClearColor(color:Color4):void
            {
                this.m_adapter.bgColor.copyFrom(color);
            }
            setClearUint24Color(colorUint24:number,alpha:number):void
            {
                this.m_adapter.bgColor.setRGBUint24(colorUint24);
                this.m_adapter.bgColor.a = alpha;
            }
            setClearRGBAColor4f(pr:number,pg:number,pb:number,pa:number):void
            {
                this.m_adapter.bgColor.setRGBA4f(pr,pg,pb,pa);
            }
            getClearRGBAColor4f(color4:Color4):void
            {
                color4.copyFrom(this.m_adapter.bgColor);
            }
            getViewportWidth():number
            {
                return this.m_adapter.getViewportWidth();
            }
            getViewportHeight():number
            {
                return this.m_adapter.getViewportHeight();
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
                this.m_adapterContext.setScissorEnabled(boo);
            }
            setScissorRect(px:number,py:number,pw:number,ph:number):void
            {
                this.m_adapterContext.setScissorRect(px,py,pw,ph);
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
