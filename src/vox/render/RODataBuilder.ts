
/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import * as RenderConstT from "../../vox/render/RenderConst";
import * as IRODisplayT from "../../vox/display/IRODisplay";
import * as RenderProxyT from "../../vox/render/RenderProxy";
import * as ROVtxBuilderT from "../../vox/render/ROVtxBuilder";
import * as UniformConstT from "../../vox/material/UniformConst";
import * as ShaderUniformT from "../../vox/material/ShaderUniform";
import * as ShdProgramT from "../../vox/material/ShdProgram";
import * as IRenderTextureT from '../../vox/render/IRenderTexture';
import * as TextureRenderObjT from '../../vox/render/TextureRenderObj';
import * as ShdUniformToolT from '../../vox/material/ShdUniformTool';
import * as IRenderMaterialT from '../../vox/render/IRenderMaterial';
import * as MaterialShaderT from '../../vox/material/MaterialShader';

import * as RPOUnitT from "../../vox/render/RPOUnit";
import * as RPOUnitBuilderT from "../../vox/render/RPOUnitBuilder";
import * as RenderProcessBuiderT from "../../vox/render/RenderProcessBuider";
import * as ROTransPoolT from "../../vox/render/ROTransPool";
import * as ROVertexResourceT from "../../vox/render/ROVertexResource";
import * as ROTextureResourceT from "../../vox/render/ROTextureResource";
import * as IRenderBufferT from "../../vox/render/IRenderBuffer";
import * as IROMaterialUpdaterT from "../../vox/render/IROMaterialUpdater";
import * as IROVertexBufUpdaterT from "../../vox/render/IROVertexBufUpdater";

import DisplayRenderSign = RenderConstT.vox.render.DisplayRenderSign;
import IRODisplay = IRODisplayT.vox.display.IRODisplay;
import RenderProxy = RenderProxyT.vox.render.RenderProxy;
import ROVtxBuilder = ROVtxBuilderT.vox.render.ROVtxBuilder;
import UniformConst = UniformConstT.vox.material.UniformConst;
import ShaderUniform = ShaderUniformT.vox.material.ShaderUniform;
import ShdProgram = ShdProgramT.vox.material.ShdProgram;
import IRenderTexture = IRenderTextureT.vox.render.IRenderTexture;
import TextureRenderObj = TextureRenderObjT.vox.render.TextureRenderObj;
import EmptyTexRenderObj = TextureRenderObjT.vox.render.EmptyTexRenderObj;
import ShdUniformTool = ShdUniformToolT.vox.material.ShdUniformTool;
import IRenderMaterial = IRenderMaterialT.vox.render.IRenderMaterial;
import MaterialShader = MaterialShaderT.vox.material.MaterialShader;

import RPOUnit = RPOUnitT.vox.render.RPOUnit;
import RPOUnitBuilder = RPOUnitBuilderT.vox.render.RPOUnitBuilder;
import RenderProcessBuider = RenderProcessBuiderT.vox.render.RenderProcessBuider;
import ROTransPool = ROTransPoolT.vox.render.ROTransPool;
import ROVertexResource = ROVertexResourceT.vox.render.ROVertexResource;
import GpuVtxObect = ROVertexResourceT.vox.render.GpuVtxObect;
import ROTextureResource = ROTextureResourceT.vox.render.ROTextureResource;
import IRenderBuffer = IRenderBufferT.vox.render.IRenderBuffer;
import IROMaterialUpdater = IROMaterialUpdaterT.vox.render.IROMaterialUpdater;
import IROVertexBufUpdater = IROVertexBufUpdaterT.vox.render.IROVertexBufUpdater;

export namespace vox
{
    export namespace render
    {
        /**
         * 本类实现了将 系统内存数据 合成为 渲染运行时系统所需的数据资源(包括: 渲染运行时管理数据和显存数据)
         */
        export class RODataBuilder implements IROMaterialUpdater,IROVertexBufUpdater
        {
            private m_emptyTRO:EmptyTexRenderObj = null;
            private m_shader:MaterialShader = null;
            private m_rpoUnitBuilder:RPOUnitBuilder = null;
            private m_processBuider:RenderProcessBuider = null;
            private m_roVtxBuild:ROVtxBuilder = null;

            private m_rc:RenderProxy = null;
            private m_vtxRes:ROVertexResource = null;
            private m_texRes:ROTextureResource = null;

            private m_deferredVbufs:IRODisplay[] = [];
            private m_deferredTROs:IRODisplay[] = [];
            private m_deferredTextures:IRenderBuffer[] = [];
            private m_haveDeferredUpdate:boolean = false;
            constructor()
            {
            }
            initialize(rc:RenderProxy, rpoUnitBuilder:RPOUnitBuilder, processBuider:RenderProcessBuider,roVtxBuild:ROVtxBuilder):void
            {
                if(this.m_shader == null)
                {
                    this.m_rc = rc;
                    this.m_vtxRes = rc.Vertex as ROVertexResource;
                    this.m_texRes = rc.Texture as ROTextureResource;
                    this.m_shader = new MaterialShader(rc.getRCUid(),rc.getRC(),rc.getRenderAdapter());
                    this.m_rpoUnitBuilder = rpoUnitBuilder;
                    this.m_processBuider = processBuider;
                    this.m_roVtxBuild = roVtxBuild;
                    this.m_emptyTRO = new EmptyTexRenderObj(this.m_texRes);
                }
            }
            getMaterialShader():MaterialShader
            {
                return this.m_shader;
            }
            getTextureResource():ROTextureResource
            {
                return this.m_texRes;
            }
            /**
             * update single texture self system memory data to gpu memory data
             */
            updateTextureData(textureProxy:IRenderBuffer,deferred:boolean):void
            {
                if(this.m_texRes.hasResUid(textureProxy.getResUid()))
                {
                    if(deferred)
                    {
                        this.m_deferredTextures.push(textureProxy);
                        this.m_haveDeferredUpdate = true;
                    }
                    else
                    {
                        textureProxy.__$updateToGpu(this.m_texRes);
                    }
                }
            }
            /**
             * update display entity texture list  system memory data to gpu memory data
             */
            updateDispTRO(disp:IRODisplay,deferred:boolean):void
            {
                if(disp.__$ruid > -1)
                {
                    if(deferred)
                    {
                        this.m_deferredTROs.push(disp);
                        this.m_haveDeferredUpdate = true;
                    }
                    else
                    {
                        this.updateTextureTRO(disp);
                    }
                }
            }
            private updateTextureTRO(disp:IRODisplay):void
            {
                if(disp.__$ruid > -1)
                {
                    let material:IRenderMaterial = disp.getMaterial();
                    if(material != null)
                    {
                        let texRes:ROTextureResource = this.m_texRes;
                        let runit:RPOUnit = disp.__$$runit as RPOUnit;
                        let tro:TextureRenderObj = TextureRenderObj.GetByMid(texRes.getRCUid(), material.__$troMid);
                        if(runit.tro != null && (tro == null || runit.tro.getMid() != tro.getMid()))
                        {
                            let shdp:ShdProgram = this.m_shader.findShdProgramByShdData(material.getShaderData());
                            if(shdp != null)
                            {
                                if(shdp.getTexTotal() > 0)
                                {
                                    if(tro == null)
                                    {
                                        tro = TextureRenderObj.Create(texRes, material.getTextureList(),shdp.getTexTotal());
                                    }

                                    if(runit.tro != tro)
                                    {
                                        if(runit.tro != null)
                                        {
                                            runit.tro.__$detachThis();
                                        }
                                        runit.tro = tro;
                                        tro.__$attachThis();
                                        runit.texMid = runit.tro.getMid();
                                        this.m_processBuider.rejoinRunitForTro(runit);
                                        material.__$troMid = runit.tro.getMid();
                                    }
                                }
                                else
                                {
                                    if(runit.tro != this.m_emptyTRO)
                                    {
                                        if(runit.tro != null)
                                        {
                                            runit.tro.__$detachThis();
                                        }
                                        runit.tro = this.m_emptyTRO;
                                        runit.texMid = runit.tro.getMid();
                                        this.m_processBuider.rejoinRunitForTro(runit);
                                        material.__$troMid = runit.texMid;
                                    }
                                }
                            }
                        }
                    }
                }
            }
            updateDispMaterial(runit:RPOUnit,disp:IRODisplay):ShdProgram
            {
                let shdp:ShdProgram = null;
                if(disp.__$ruid >= 0)
                {
                    let rc:RenderProxy = this.m_rc;
                    let material:IRenderMaterial = disp.getMaterial();
                    if(material != null)
                    {
                        if(material.getShaderData() == null)
                        {
                            let texList:IRenderTexture[] = material.getTextureList();
                            let texEnabled:boolean = ((texList != null && texList != null) && texList.length > 0);
                            material.initializeByCodeBuf(texEnabled);
                        }
                        shdp = this.m_shader.create(material.getShaderData());
                        
                        shdp.upload( rc.RContext, rc.getUid());
                        runit.shdUid = shdp.getUid();
                        
                        let tro:TextureRenderObj = null;
                        if(shdp.getTexTotal() > 0)
                        {
                            tro = TextureRenderObj.Create(this.m_texRes, material.getTextureList(),shdp.getTexTotal());
                            if(runit.tro != tro)
                            {
                                if(runit.tro != null)
                                {
                                    runit.tro.__$detachThis();
                                }
                                runit.tro = tro;
                                tro.__$attachThis();
                                runit.texMid = runit.tro.getMid();
                                if(runit.__$rprouid >= 0)this.m_processBuider.rejoinRunitForTro(runit);
                                material.__$troMid = runit.tro.getMid();
                            }
                        }
                        else
                        {
                            if(runit.tro != this.m_emptyTRO)
                            {
                                if(runit.tro != null)
                                {
                                    runit.tro.__$detachThis();
                                }
                                runit.tro = this.m_emptyTRO;
                                runit.texMid = runit.tro.getMid();
                                if(runit.__$rprouid >= 0)this.m_processBuider.rejoinRunitForTro(runit);
                                material.__$troMid = runit.texMid;
                            }
                        }
                        if(this.m_shader.getSharedUniformByShd(shdp) == null)
                        {
                            // create shared uniform
                            this.m_shader.setSharedUniformByShd(shdp, ShdUniformTool.BuildShared(material.createSharedUniform() as ShaderUniform,rc, shdp));
                        }
                        let hasTrans:boolean = shdp.hasUniformByName(UniformConst.LocalTransformMatUNS);
                        if(material.__$uniform == null)
                        {
                            material.__$uniform = ShdUniformTool.BuildLocalFromData(material.createSelfUniformData(), shdp);
                        }
                        
                        if(hasTrans)
                        {
                            if(disp.getTransform() != null)
                            {
                                //console.log("disp.getTransform().getUid(): "+disp.getTransform().getUid());
                                runit.transUniform = ROTransPool.GetTransUniform(disp.getTransform());
                                //console.log("updateDispMaterial(), get runit.transUniform: ",runit.transUniform);
                            }
                        }
                        if(runit.transUniform == null)
                        {
                            runit.transUniform = ShdUniformTool.BuildLocalFromTransformV(hasTrans?disp.getMatrixFS32():null, shdp);
                            ROTransPool.SetTransUniform(disp.getTransform(), runit.transUniform);
                            //console.log("create transUniform");
                        }
                        runit.uniform = material.__$uniform;
                        
                    }
                    else
                    {
                        console.log("Error RODataBuilder::updateDispMaterial(), material is null !!!");
                    }
                }
                return shdp;
            }
            updateVtxDataToGpuByUid(vtxUid:number,deferred:boolean):void
            {
                this.m_vtxRes.updateDataToGpu(vtxUid,deferred);
            }
            /**
             * update vertex system memory data to gpu memory data
             */
            updateDispVbuf(disp:IRODisplay,deferred:boolean):void
            {
                if(disp.__$ruid > -1)
                {
                    if(deferred)
                    {
                        this.m_deferredVbufs.push(disp);
                        this.m_haveDeferredUpdate = true;
                    }
                    else
                    {
                        let runit:RPOUnit = disp.__$$runit as RPOUnit;
                        if(runit != null && runit.vtxUid != disp.vbuf.getUid())
                        {
                            let oldResUid:number = runit.vtxUid;
                            let vtxRes:ROVertexResource = this.m_vtxRes;
                            if(vtxRes.hasResUid(oldResUid))
                            {
                                vtxRes.__$detachRes(oldResUid);
                            }
                            runit.vro.__$detachThis();
                            
                            // build vtx gpu data
                            this.buildVtxRes(disp,runit,this.m_shader.findShdProgramByUid(runit.shdUid));
                            if(runit.__$rprouid >= 0)this.m_processBuider.rejoinRunitForVro(runit);
                        }
                    }
                }
            }
            // build vtx gpu data
            private buildVtxRes(disp:IRODisplay,runit:RPOUnit, shdp:ShdProgram):void
            {
                if(disp.vbuf != null)
                {
                    let vtxRes:ROVertexResource = this.m_vtxRes;
                    runit.ivsIndex = disp.ivsIndex;
                    runit.ivsCount = disp.ivsCount;
                    runit.insCount = disp.insCount;
                    runit.visible = disp.visible;
                    runit.drawEnabled = disp.ivsCount > 0 && disp.visible;
                    runit.drawMode = disp.drawMode;
                    runit.renderState = disp.renderState;
                    runit.rcolorMask = disp.rcolorMask;
                    runit.trisNumber = disp.trisNumber;

                    // build vertex gpu resoure 
                    let resUid:number = disp.vbuf.getUid();
                    let vtx:GpuVtxObect;
                    let needBuild:boolean = true;
                    if(vtxRes.hasResUid(resUid))
                    {
                        vtx = vtxRes.getVertexRes(resUid);
                        needBuild = vtx.version != disp.vbuf.version;
                        //console.log("GpuVtxObect instance repeat to be used,needBuild: "+needBuild,vtx.getAttachCount());
                        if(needBuild)
                        {
                            vtxRes.destroyRes(resUid);
                            vtx.rcuid = vtxRes.getRCUid();
                            vtx.resUid = resUid;
                        }
                    }
                    else
                    {
                        vtx = new GpuVtxObect();
                        vtx.rcuid = vtxRes.getRCUid();
                        vtx.resUid = resUid;
                        vtxRes.addVertexRes(vtx);
                        //console.log("GpuVtxObect instance create new: ",vtx.resUid);
                    }
                    if(needBuild)
                    {
                        vtx.indices.ibufStep = disp.vbuf.getIBufStep();
                        vtx.indices.initialize(this.m_roVtxBuild, disp.vbuf);
                        vtx.vertex.initialize(this.m_roVtxBuild, shdp,disp.vbuf);
                        vtx.version = disp.vbuf.version;
                    }
                    vtxRes.__$attachRes(resUid);
                    runit.vro = vtx.createVRO(this.m_roVtxBuild, shdp, true);
                    runit.vro.__$attachThis();

                    runit.vtxUid = disp.vbuf.getUid();
                    
                    runit.ibufStep = runit.vro.ibufStep;
                    runit.ibufType = runit.ibufStep != 4?this.m_rc.UNSIGNED_SHORT:this.m_rc.UNSIGNED_INT;
                }
            }
            buildGpuDisp(disp:IRODisplay):boolean
            {
                if(disp.__$ruid < 0)
                {
                    if(disp.getMaterial() != null)
                    {
                        disp.__$$rsign = DisplayRenderSign.LIVE_IN_WORLD;
                        
                        let runit:RPOUnit = this.m_rpoUnitBuilder.create() as RPOUnit;
                        disp.__$ruid = runit.uid;
                        disp.__$$runit = runit;
                        runit.setDrawFlag(disp.renderState, disp.rcolorMask);
                        
                        this.buildVtxRes(disp,runit,this.updateDispMaterial(runit,disp));
                        return true;
                    }
                    else
                    {
                        console.log("Error RODataBuilder::buildGpuDisp(), material is null !!!");
                    }
                }
                return false;
            }
            update()
            {
                //this.updateDispToProcess();
                if(this.m_haveDeferredUpdate)
                {
                    this.m_haveDeferredUpdate = false;                    
                    let len:number = this.m_deferredVbufs.length;
                    let i:number = 0;
                    if(len > 0)
                    {
                        // deferred update vtx to gpu
                        for(; i<len; ++i)
                        {
                            this.updateDispVbuf(this.m_deferredVbufs[i],false);
                        }
                        this.m_deferredVbufs = [];
                    }
                    len = this.m_deferredTROs.length;
                    if(len > 0)
                    {
                        // deferred update texture list to gpu
                        i = 0;
                        for(; i<len; ++i)
                        {
                            this.updateTextureTRO(this.m_deferredTROs[i]);
                        }
                        this.m_deferredTROs = [];
                    }                
                    len = this.m_deferredTextures.length;
                    if(len > 0)
                    {
                        // deferred update single texture self system memory data to gpu memory data
                        i = 0;
                        for(; i<len; ++i)
                        {
                            this.m_deferredTextures[i].__$updateToGpu(this.m_texRes);
                        }
                        this.m_deferredTextures = [];
                    }
                }
            }
            
            updateGlobalMaterial(material:IRenderMaterial):void
            {
                if(material != null)
                {
                    let rc:RenderProxy = this.m_rc;
                    let gl:any = rc.RContext;
                    let tro:TextureRenderObj = null;
                    let shdp:ShdProgram = null;
                    let texList:IRenderTexture[] = null;
                    let texEnabled:boolean = false;
                    if(material.getShaderData() == null)
                    {
                        texList = material.getTextureList();
                        texEnabled = (texList != null && texList.length > 0);
                        material.initializeByCodeBuf( texEnabled );
                    }
                    shdp = this.m_shader.create(material.getShaderData());
                    shdp.upload( rc.RContext, rc.getUid() );
                    let texTotal:number = shdp.getTexTotal();
                    if(texEnabled && texTotal > 0)
                    {
                        tro = TextureRenderObj.Create(gl, texList, texTotal);
                    }
                    if(this.m_shader.getSharedUniformByShd(shdp) == null)
                    {
                        this.m_shader.setSharedUniformByShd(shdp, ShdUniformTool.BuildShared(material.createSharedUniform() as ShaderUniform,rc, shdp));
                    }
                    
                    if(material.__$uniform == null)
                    {
                        material.__$uniform = ShdUniformTool.BuildLocalFromData(material.createSelfUniformData(), shdp);
                    }
                    this.m_shader.bindToGpu(shdp.getUid());
                    if(tro != null)
                    {
                        tro.run();
                    }
                }
            }
            reset():void
            {
                this.m_deferredVbufs = [];
                this.m_deferredTROs = [];
            }
        }

    }
}