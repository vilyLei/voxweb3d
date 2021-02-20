
/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import * as RendererDevieceT from "../../vox/render/RendererDeviece";
import * as RenderConstT from "../../vox/render/RenderConst";
import * as IRODisplayT from "../../vox/display/IRODisplay";
import * as RenderProxyT from "../../vox/render/RenderProxy";
import * as UniformConstT from "../../vox/material/UniformConst";
import * as ShdProgramT from "../../vox/material/ShdProgram";
import * as TextureProxyT from '../../vox/texture/TextureProxy';
import * as TextureRenderObjT from '../../vox/texture/TextureRenderObj';
import * as ShaderUniformDataT from "../../vox/material/ShaderUniformData";
import * as ShdUniformToolT from '../../vox/material/ShdUniformTool';
import * as MaterialBaseT from '../../vox/material/MaterialBase';
import * as MaterialShaderT from '../../vox/material/MaterialShader';
import * as ROTextureResourceT from '../../vox/render/ROTextureResource';
import * as RPOUnitT from "../../vox/render/RPOUnit";
import * as RPOUnitBuilderT from "../../vox/render/RPOUnitBuilder";
import * as RenderProcessBuiderT from "../../vox/render/RenderProcessBuider";
import * as ROTransPoolT from "../../vox/render/ROTransPool";

import RendererDeviece = RendererDevieceT.vox.render.RendererDeviece;
import DisplayRenderState = RenderConstT.vox.render.DisplayRenderState;
import IRODisplay = IRODisplayT.vox.display.IRODisplay;
import RenderProxy = RenderProxyT.vox.render.RenderProxy;
import UniformConst = UniformConstT.vox.material.UniformConst;
import ShdProgram = ShdProgramT.vox.material.ShdProgram;
import TextureProxy = TextureProxyT.vox.texture.TextureProxy;
import TextureRenderObj = TextureRenderObjT.vox.texture.TextureRenderObj;
import EmptyTexRenderObj = TextureRenderObjT.vox.texture.EmptyTexRenderObj;
import ShdUniformTool = ShdUniformToolT.vox.material.ShdUniformTool;
import EmptyShdUniform = ShdUniformToolT.vox.material.EmptyShdUniform;
import MaterialBase = MaterialBaseT.vox.material.MaterialBase;
import MaterialShader = MaterialShaderT.vox.material.MaterialShader;

import RPOUnit = RPOUnitT.vox.render.RPOUnit;
import RPOUnitBuilder = RPOUnitBuilderT.vox.render.RPOUnitBuilder;
import RenderProcessBuider = RenderProcessBuiderT.vox.render.RenderProcessBuider;
import ShaderUniformData = ShaderUniformDataT.vox.material.ShaderUniformData;
import ROTransPool = ROTransPoolT.vox.render.ROTransPool;

export namespace vox
{
    export namespace render
    {
        export class RODispBuilder
        {
            private static s_emptyTRO:EmptyTexRenderObj = new EmptyTexRenderObj();
            private static s_shaders:MaterialShader[] = [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null];
            private m_disps:IRODisplay[] = [];
            private m_processUidList:number[] = [];
            // 当前 renderer context 范围内的所有 material shader 管理 
            private m_shader:MaterialShader = null;
            constructor(rc:RenderProxy)
            {
                this.m_shader = new MaterialShader();
                RODispBuilder.s_shaders[rc.getUid()] = this.m_shader;
            }
            getMaterialShader():MaterialShader
            {
                return this.m_shader;
            }
            static UpdateDispTRO(rc:RenderProxy,disp:IRODisplay):void
            {
                if(disp != null && disp.__$ruid > -1)
                {
                    let material:MaterialBase = disp.getMaterial();
                    if(material != null)
                    {
                        let runit:RPOUnit = RPOUnitBuilder.GetNodeByUid(disp.__$ruid);
                        let tro:TextureRenderObj = TextureRenderObj.GetByMid(rc.getUid(), material.__$troMid);
                        if(runit.tro != null && (tro == null || runit.tro.getMid() != tro.getMid()))
                        {
                            let shader:MaterialShader = RODispBuilder.s_shaders[rc.getUid()];
                            let shdp:ShdProgram = shader.findShdProgramByShdData(material.getShaderData());
                            if(shdp != null)
                            {
                                if(shdp.getTexTotal() > 0)
                                {
                                    if(tro == null)
                                    {
                                        tro = TextureRenderObj.Create(rc, material.getTextureList(),shdp.getTexTotal());
                                    }

                                    if(runit.tro != tro)
                                    {
                                        if(runit.tro != null)
                                        {
                                            runit.tro.__$detachThis();
                                        }
                                        runit.tro = tro;
                                        runit.texMid = runit.tro.getMid();
                                        RenderProcessBuider.RejoinRunitForTro(runit);
                                        tro.__$attachThis();
                                        material.__$troMid = runit.tro.getMid();
                                    }
                                }
                                else
                                {
                                    if(runit.tro != RODispBuilder.s_emptyTRO)
                                    {
                                        if(runit.tro != null)
                                        {
                                            runit.tro.__$detachThis();
                                        }
                                        runit.tro = RODispBuilder.s_emptyTRO;
                                        runit.texMid = runit.tro.getMid();
                                        RenderProcessBuider.RejoinRunitForTro(runit);
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
            public updateDispMaterial(rc:RenderProxy,runit:RPOUnit,disp:IRODisplay):ShdProgram
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
                            tro = TextureRenderObj.Create(rc, material.getTextureList(),shdp.getTexTotal());
                            if(runit.tro != tro)
                            {
                                if(runit.tro != null)
                                {
                                    runit.tro.__$detachThis();
                                }
                                runit.tro = tro;
                                runit.texMid = runit.tro.getMid();
                                if(runit.__$rprouid >= 0)RenderProcessBuider.RejoinRunitForTro(runit);
                                tro.__$attachThis();
                                material.__$troMid = runit.tro.getMid();
                            }
                        }
                        else
                        {
                            if(runit.tro != RODispBuilder.s_emptyTRO)
                            {
                                if(runit.tro != null)
                                {
                                    runit.tro.__$detachThis();
                                }
                                runit.tro = RODispBuilder.s_emptyTRO;
                                runit.texMid = runit.tro.getMid();
                                if(runit.__$rprouid >= 0)RenderProcessBuider.RejoinRunitForTro(runit);
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
                            let unfdata:ShaderUniformData = material.createSelfUniformData();
                            if(unfdata != null)
                            {
                                material.__$uniform = ShdUniformTool.BuildLocalFromData(unfdata, shdp);
                            }
                            else
                            {
                                material.__$uniform = EmptyShdUniform.EmptyUniform;
                            }
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
            private buildGpuDisp(rc:RenderProxy,disp:IRODisplay,processUid:number):void
            {
                if(disp.__$ruid < 0)
                {
                    let material:MaterialBase = disp.getMaterial();
                    if(material != null)
                    {
                        disp.rsign = DisplayRenderState.LIVE_IN_WORLD;
                        
                        let runit:RPOUnit = RPOUnitBuilder.Create();
                        runit.ivsIndex = disp.ivsIndex;
                        runit.ivsCount = disp.ivsCount;
                        runit.insCount = disp.insCount;
                        runit.visible = disp.visible;
                        runit.drawEnabled = disp.ivsCount > 0 && disp.visible;
                        runit.drawMode = disp.drawMode;
                        runit.renderState = disp.renderState;
                        runit.rcolorMask = disp.rcolorMask;
                        runit.trisNumber = disp.trisNumber;
                        disp.__$ruid = runit.uid;
                        
                        let shdp:ShdProgram = this.updateDispMaterial(rc,runit,disp);
                        // build vtx gpu data
                        if(disp.vbuf != null)
                        {
                            disp.vbuf.upload(rc,shdp);
                            runit.vro = disp.vbuf.createVROBegin(rc, shdp, true);
                            runit.vro.__$attachThis();
                            disp.vbuf.createVROEnd();
                            runit.vtxUid = runit.vro.getVtxUid();
                            
                            runit.ibufType = runit.vro.ibufType;
                            runit.ibufStep = runit.vro.ibufStep;
                        }
                        //console.log("buildGpuDisp(), runit.ibufType: "+runit.ibufType+", runit.ibufStep: "+runit.ibufStep+", runit.ivsCount: "+runit.ivsCount);
                        RenderProcessBuider.GetProcess(processUid).addDisp(rc, disp);
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
                let m_processUid:number = -1;
                while(len > 0)
                {
                    disp = this.m_disps.shift();
                    m_processUid = this.m_processUidList.shift();
                    if(disp.rsign == DisplayRenderState.GO_TO_WORLD)
                    {
                        this.buildGpuDisp(rc, disp, m_processUid);
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
                    let tro:TextureRenderObj = null;
                    let gl:any = rc.RContext;
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
                        let unfdata:ShaderUniformData = material.createSelfUniformData();
                        if(unfdata != null)
                        {
                            material.__$uniform = ShdUniformTool.BuildLocalFromData(unfdata, shdp);
                        }
                        else
                        {
                            material.__$uniform = EmptyShdUniform.EmptyUniform;
                        }
                    }
                    this.m_shader.useShdByUid(rc, shdUid);
                    if(tro != null)
                    {
                        tro.run(rc);
                    }
                }
            }
        }

    }
}