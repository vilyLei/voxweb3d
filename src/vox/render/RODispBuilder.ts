
/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import * as RendererDevieceT from "../../vox/render/RendererDeviece";
import * as RenderConstT from "../../vox/render/RenderConst";
import * as IRODisplayT from "../../vox/display/IRODisplay";
import * as IBufferBuilderT from "../../vox/render/IBufferBuilder";
import * as RenderProxyT from "../../vox/render/RenderProxy";
import * as UniformConstT from "../../vox/material/UniformConst";
import * as ShdProgramT from "../../vox/material/ShdProgram";
import * as TextureProxyT from '../../vox/texture/TextureProxy';
import * as TextureRenderObjT from '../../vox/texture/TextureRenderObj';
import * as ShdUniformToolT from '../../vox/material/ShdUniformTool';
import * as MaterialBaseT from '../../vox/material/MaterialBase';
import * as MaterialShaderT from '../../vox/material/MaterialShader';

import * as RPOUnitT from "../../vox/render/RPOUnit";
import * as RPOUnitBuilderT from "../../vox/render/RPOUnitBuilder";
import * as RenderProcessT from "../../vox/render/RenderProcess";
import * as RenderProcessBuiderT from "../../vox/render/RenderProcessBuider";
import * as ROTransPoolT from "../../vox/render/ROTransPool";
import * as ROVertexResourceT from "../../vox/render/ROVertexResource";
import * as ROTextureResourceT from "../../vox/render/ROTextureResource";
import * as IROMaterialUpdaterT from "../../vox/render/IROMaterialUpdater";

import RendererDeviece = RendererDevieceT.vox.render.RendererDeviece;
import DisplayRenderSign = RenderConstT.vox.render.DisplayRenderSign;
import IRODisplay = IRODisplayT.vox.display.IRODisplay;
import IBufferBuilder = IBufferBuilderT.vox.render.IBufferBuilder;
import RenderProxy = RenderProxyT.vox.render.RenderProxy;
import UniformConst = UniformConstT.vox.material.UniformConst;
import ShdProgram = ShdProgramT.vox.material.ShdProgram;
import TextureProxy = TextureProxyT.vox.texture.TextureProxy;
import TextureRenderObj = TextureRenderObjT.vox.texture.TextureRenderObj;
import EmptyTexRenderObj = TextureRenderObjT.vox.texture.EmptyTexRenderObj;
import ShdUniformTool = ShdUniformToolT.vox.material.ShdUniformTool;
import MaterialBase = MaterialBaseT.vox.material.MaterialBase;
import MaterialShader = MaterialShaderT.vox.material.MaterialShader;

import RPOUnit = RPOUnitT.vox.render.RPOUnit;
import RPOUnitBuilder = RPOUnitBuilderT.vox.render.RPOUnitBuilder;
import RenderProcess = RenderProcessT.vox.render.RenderProcess;
import RenderProcessBuider = RenderProcessBuiderT.vox.render.RenderProcessBuider;
import ROTransPool = ROTransPoolT.vox.render.ROTransPool;
import ROVertexResource = ROVertexResourceT.vox.render.ROVertexResource;
import GpuVtxObect = ROVertexResourceT.vox.render.GpuVtxObect;
import ROTextureResource = ROTextureResourceT.vox.render.ROTextureResource;
import IROMaterialUpdater = IROMaterialUpdaterT.vox.render.IROMaterialUpdater;

export namespace vox
{
    export namespace render
    {
        /**
         * 本类实现了将 系统内存数据 合成为 渲染运行时系统所需的资源(包括: 渲染运行时管理数据和显存数据)
         */
        export class RODispBuilder implements IROMaterialUpdater
        {
            private m_disps:IRODisplay[] = [];
            private m_processUidList:number[] = [];
            // 当前 renderer context 范围内的所有 material shader 管理
            
            private m_emptyTRO:EmptyTexRenderObj = null;
            private m_shader:MaterialShader = null;
            private m_rpoUnitBuilder:RPOUnitBuilder = null;
            private m_processBuider:RenderProcessBuider = null;

            private m_rc:RenderProxy = null;
            constructor()
            {
            }
            initialize(rc:RenderProxy, rpoUnitBuilder:RPOUnitBuilder, processBuider:RenderProcessBuider):void
            {
                if(this.m_shader == null)
                {
                    this.m_rc = rc;
                    this.m_shader = new MaterialShader();
                    this.m_rpoUnitBuilder = rpoUnitBuilder;
                    this.m_processBuider = processBuider;
                    this.m_emptyTRO = new EmptyTexRenderObj(rc.Texture);
                }
            }
            getMaterialShader():MaterialShader
            {
                return this.m_shader;
            }
            /**
             * update texture system memory data to gpu memory data in runtime.
             */
            updateDispTRO(texRes:ROTextureResource,disp:IRODisplay):void
            {
                if(disp != null && disp.__$ruid > -1)
                {
                    let material:MaterialBase = disp.getMaterial();
                    if(material != null)
                    {
                        let runit:RPOUnit = this.m_rpoUnitBuilder.getNodeByUid(disp.__$ruid) as RPOUnit;
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
            addDispToProcess(rc:RenderProxy, disp:IRODisplay, processUid:number,deferred:boolean = true):void
            {
                if(disp != null && processUid >= 0)
                {
                    if(deferred)
                    {
                        this.m_disps.push(disp);
                        this.m_processUidList.push(processUid);
                    }
                    else
                    {
                        this.buildGpuDisp(rc, disp, processUid);
                    }
                }
            }
            updateDispMaterial(rc:RenderProxy,runit:RPOUnit,disp:IRODisplay):ShdProgram
            {
                let shdp:ShdProgram = null;
                if(disp.__$ruid >= 0)
                {
                    let material:MaterialBase = disp.getMaterial();
                    if(material != null)
                    {
                        if(material.getShaderData() == null)
                        {
                            let texList:TextureProxy[] = material.getTextureList();
                            let texEnabled:boolean = ((texList != null && texList != null) && texList.length > 0);
                            material.initializeByCodeBuf(texEnabled);
                        }
                        shdp = this.m_shader.create(material.getShaderData());
                        
                        shdp.upload( rc.RContext );
                        runit.shdUid = shdp.getUid();
                        
                        let tro:TextureRenderObj = null;
                        if(shdp.getTexTotal() > 0)
                        {
                            tro = TextureRenderObj.Create(rc.Texture, material.getTextureList(),shdp.getTexTotal());
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
                            this.m_shader.setSharedUniformByShd(shdp, ShdUniformTool.BuildShared(material.createSharedUniform(rc),rc, shdp));
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
                        console.log("Error RODispBuilder::updateDispMaterial(), material is null !!!");
                    }
                }
                return shdp;
            }
            /**
             * update vertex system memory data to gpu memory data
             */
            updateDispVbuf(rc:IBufferBuilder,vtxRes:ROVertexResource,disp:IRODisplay):void
            {
                if(disp != null && disp.vbuf != null && disp.__$ruid > -1)
                {
                    let runit:RPOUnit = this.m_rpoUnitBuilder.getNodeByUid(disp.__$ruid) as RPOUnit;
                    if(runit != null)
                    {
                        let oldResUid:number = runit.vtxUid;
                        if(oldResUid != disp.vbuf.getUid())
                        {
                            if(vtxRes.hasVertexRes(oldResUid))
                            {
                                vtxRes.__$detachRes(oldResUid);
                            }
                            runit.vro.__$detachThis();
                            
                            let shdp:ShdProgram = this.m_shader.findShdProgramByUid(runit.shdUid);
                            // build vtx gpu data
                            this.buildVtxRes(rc,vtxRes,disp,runit,shdp);
                            if(runit.__$rprouid >= 0)this.m_processBuider.rejoinRunitForVro(runit);
                        }
                    }
                }
            }
            // build vtx gpu data
            private buildVtxRes(rc:IBufferBuilder,vtxRes:ROVertexResource,disp:IRODisplay,runit:RPOUnit, shdp:ShdProgram):void
            {
                if(disp.vbuf != null)
                {
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
                    //let vtxRes:ROVertexResource = rc.Vertex;
                    let resUid:number = disp.vbuf.getUid();
                    let vtx:GpuVtxObect;
                    let needBuild:boolean = true;
                    if(vtxRes.hasVertexRes(resUid))
                    {
                        vtx = vtxRes.getVertexRes(resUid);
                        needBuild = vtx.version != disp.vbuf.version;
                        console.log("GpuVtxObect instance repeat to be used,needBuild: "+needBuild,vtx.getAttachCount());
                        if(needBuild)
                        {
                            vtx.destroy(rc);
                            vtx.rcuid = rc.getUid();
                            vtx.resUid = resUid;
                        }
                    }
                    else
                    {
                        vtx = new GpuVtxObect();
                        vtx.rcuid = vtxRes.getRCUid();
                        vtx.resUid = resUid;
                        vtxRes.addVertexRes(vtx);
                        console.log("GpuVtxObect instance create new: ",vtx.resUid);
                    }
                    if(needBuild)
                    {
                        vtx.indices.ibufStep = disp.vbuf.getIBufStep();
                        vtx.indices.initialize(rc,disp.vbuf);
                        vtx.vertex.initialize(rc,shdp,disp.vbuf);
                        vtx.version = disp.vbuf.version;
                    }
                    vtxRes.__$attachRes(resUid);
                    runit.vro = vtx.createVRO(rc, shdp, true);
                    runit.vro.__$attachThis();

                    runit.vtxUid = disp.vbuf.getUid();
                    
                    runit.ibufStep = runit.vro.ibufStep;
                    runit.ibufType = runit.ibufStep != 4?this.m_rc.UNSIGNED_SHORT:this.m_rc.UNSIGNED_INT;
                }
            }
            private buildGpuDisp(rc:RenderProxy,disp:IRODisplay,processUid:number):void
            {
                if(disp.__$ruid < 0)
                {
                    let material:MaterialBase = disp.getMaterial();
                    if(material != null)
                    {
                        disp.__$$rsign = DisplayRenderSign.LIVE_IN_WORLD;
                        
                        let runit:RPOUnit = this.m_rpoUnitBuilder.create() as RPOUnit;
                        disp.__$ruid = runit.uid;
                        disp.__$$runit = runit;
                        
                        let shdp:ShdProgram = this.updateDispMaterial(rc,runit,disp);
                        // build vtx gpu data
                        this.buildVtxRes(rc,rc.Vertex,disp,runit,shdp);
                        /*
                        if(disp.vbuf != null)
                        {
                            // build vertex gpu resoure 
                            let vtxRes:ROVertexResource = rc.Vertex;
                            let resUid:number = disp.vbuf.getUid();
                            let vtx:GpuVtxObect;
                            let needBuild:boolean = true;
                            if(vtxRes.hasVertexRes(resUid))
                            {
                                vtx = vtxRes.getVertexRes(resUid);
                                needBuild = vtx.version != disp.vbuf.version;
                                console.log("GpuVtxObect instance repeat to be used,needBuild: "+needBuild,vtx.getAttachCount());
                                if(needBuild)
                                {
                                    vtx.destroy(rc);
                                    vtx.rcuid = rc.getUid();
                                    vtx.resUid = resUid;
                                }
                            }
                            else
                            {
                                vtx = new GpuVtxObect();
                                vtx.rcuid = rc.getUid();
                                vtx.resUid = resUid;
                                vtxRes.addVertexRes(vtx);
                                console.log("GpuVtxObect instance create new: ",vtx.resUid);
                            }
                            if(needBuild)
                            {
                                vtx.indices.ibufStep = disp.vbuf.getIBufStep();
                                vtx.indices.initialize(rc,disp.vbuf);
                                vtx.vertex.initialize(rc,shdp,disp.vbuf);
                                vtx.version = disp.vbuf.version;
                            }
                            vtxRes.__$attachRes(resUid);
                            runit.vro = vtx.createVRO(rc, shdp, true);
                            runit.vro.__$attachThis();

                            runit.vtxUid = disp.vbuf.getUid();
                            
                            runit.ibufStep = runit.vro.ibufStep;
                            runit.ibufType = runit.ibufStep != 4?rc.UNSIGNED_SHORT:rc.UNSIGNED_INT;
                        }
                        //*/
                        //console.log("buildGpuDisp(), runit.ibufType: "+runit.ibufType+", runit.ibufStep: "+runit.ibufStep+", runit.ivsCount: "+runit.ivsCount);
                        (this.m_processBuider.getNodeByUid(processUid) as RenderProcess).addDisp(rc, disp);
                    }
                    else
                    {
                        console.log("Error RODispBuilder::buildGpuDisp(), material is null !!!");
                    }
                }
            }
            private updateDispToProcess(rc:RenderProxy):void
            {
                let len:number = this.m_disps.length;
                let disp:IRODisplay = null;
                let processUid:number = -1;
                while(len > 0)
                {
                    disp = this.m_disps.shift();
                    processUid = this.m_processUidList.shift();
                    if(disp.__$$rsign == DisplayRenderSign.GO_TO_WORLD)
                    {
                        this.buildGpuDisp(rc, disp, processUid);
                    }
                    --len;
                }
            }
            update(rc:RenderProxy)
            {
                this.updateDispToProcess(rc);
            }
            
            updateGlobalMaterial(rc:RenderProxy, material:MaterialBase):void
            {
                if(material != null && rc != null)
                {
                    let gl:any = rc.RContext;
                    let tro:TextureRenderObj = null;
                    let shdp:ShdProgram = null;
                    let texList:TextureProxy[] = null;
                    let texEnabled:boolean = false;
                    if(material.getShaderData() == null)
                    {
                        texList = material.getTextureList();
                        texEnabled = (texList != null && texList.length > 0);
                        material.initializeByCodeBuf( texEnabled );
                    }
                    shdp = this.m_shader.create(material.getShaderData());
                    shdp.upload( rc.RContext );
                    let shdUid:number = shdp.getUid();
                    let texTotal:number = shdp.getTexTotal();
                    if(texEnabled && texTotal > 0)
                    {
                        tro = TextureRenderObj.Create(gl, texList, texTotal);
                    }
                    if(this.m_shader.getSharedUniformByShd(shdp) == null)
                    {
                        this.m_shader.setSharedUniformByShd(shdp, ShdUniformTool.BuildShared(material.createSharedUniform(rc),rc, shdp));
                    }
                    
                    if(material.__$uniform == null)
                    {
                        material.__$uniform = ShdUniformTool.BuildLocalFromData(material.createSelfUniformData(), shdp);
                    }
                    this.m_shader.useShdByUid(rc, shdUid);
                    if(tro != null)
                    {
                        tro.run();
                    }
                }
            }
        }

    }
}