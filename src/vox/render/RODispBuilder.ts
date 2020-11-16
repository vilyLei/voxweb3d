
/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import * as RendererDevieceT from "../../vox/render/RendererDeviece";
import * as RODisplayT from "../../vox/display/RODisplay";
import * as RenderProxyT from "../../vox/render/RenderProxy";
import * as UniformConstT from "../../vox/material/UniformConst";
import * as ShaderProgramT from "../../vox/material/ShaderProgram";
import * as MaterialProgramT from "../../vox/material/MaterialProgram";
import * as TextureProxyT from '../../vox/texture/TextureProxy';
import * as TextureRenderObjT from '../../vox/texture/TextureRenderObj';
import * as MaterialBaseT from '../../vox/material/MaterialBase';
import * as ShaderUniformDataT from "../../vox/material/ShaderUniformData";
import * as ShdUniformToolT from '../../vox/material/ShdUniformTool';
import * as RPOUnitT from "../../vox/render/RPOUnit";
import * as RPOUnitBuiderT from "../../vox/render/RPOUnitBuider";
import * as RenderProcessBuiderT from "../../vox/render/RenderProcessBuider";

import RendererDeviece = RendererDevieceT.vox.render.RendererDeviece;
import RODisplay = RODisplayT.vox.display.RODisplay;
import RenderProxy = RenderProxyT.vox.render.RenderProxy;
import UniformConst = UniformConstT.vox.material.UniformConst;
import ShaderProgram = ShaderProgramT.vox.material.ShaderProgram;
import MaterialProgram = MaterialProgramT.vox.material.MaterialProgram;
import TextureProxy = TextureProxyT.vox.texture.TextureProxy;
import TextureRenderObj = TextureRenderObjT.vox.texture.TextureRenderObj;
import EmptyTexRenderObj = TextureRenderObjT.vox.texture.EmptyTexRenderObj;
import ShdUniformTool = ShdUniformToolT.vox.material.ShdUniformTool;
import EmptyShdUniform = ShdUniformToolT.vox.material.EmptyShdUniform;
import MaterialBase = MaterialBaseT.vox.material.MaterialBase;
import RPOUnit = RPOUnitT.vox.render.RPOUnit;
import RPOUnitBuider = RPOUnitBuiderT.vox.render.RPOUnitBuider;
import RenderProcessBuider = RenderProcessBuiderT.vox.render.RenderProcessBuider;
import ShaderUniformData = ShaderUniformDataT.vox.material.ShaderUniformData;

export namespace vox
{
    export namespace render
    {
        export class RODispBuilder
        {
            private m_disps:RODisplay[] = [];
            private m_processUidList:number[] = [];
            private static s_emptyTRO:EmptyTexRenderObj = new EmptyTexRenderObj();

            static UpdateDispTRO(rc:RenderProxy,disp:RODisplay):void
            {
                if(disp != null && disp.__$ruid > -1)
                {
                    let material:MaterialBase = disp.getMaterial();
                    if(material != null)
                    {
                        let runit:RPOUnit = RPOUnitBuider.GetRPOUnit(disp.__$ruid);
                        if(runit.tro != null)
                        {
                            let shdp:ShaderProgram = material.getShaderProgram();
                            if(shdp != null)
                            {
                                if(shdp.getTexTotal() > 0)
                                {
                                    let tro:TextureRenderObj = TextureRenderObj.Create(rc, material.getTextureList(),shdp.getTexTotal());
                                    //console.log("RODispBuilder::UpdateDispTRO(), runit.tro != tro: "+(runit.tro != tro));
                                    if(runit.tro != tro)
                                    {
                                        if(runit.tro != null)
                                        {
                                            runit.tro.__$detachThis();
                                        }
                                        runit.tro = tro;
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
                                        material.__$troMid = -1;
                                    }
                                }
                            }
                        }
                    }
                }
            }
            addDispToProcess(rc:RenderProxy, disp:RODisplay, processUid:number,deferred:boolean = true):void
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
            public updateDispMaterial(rc:RenderProxy,runit:RPOUnit,disp:RODisplay):ShaderProgram
            {
                let shdp:ShaderProgram = null;
                if(disp.__$ruid >= 0)
                {
                    let material:MaterialBase = disp.getMaterial();
                    if(material != null)
                    {
                        
                        shdp = material.getShaderProgram();
                        if(shdp == null)
                        {
                            let texList:TextureProxy[] = material.getTextureList();
                            let texEnabled:boolean = ((texList != null && texList != null) && texList.length > 0);
                            material.initializeByCodeBuf(texEnabled);
                            shdp = material.getShaderProgram();
                        }
                        //
                        shdp.upload( rc.RContext );
                        runit.shdUid = shdp.getUid();
                        runit.shdp = shdp;
                        //
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
                                material.__$troMid = -1;
                            }
                        }
                        runit.texMid = runit.tro.getMid();
                        if(MaterialProgram.GetSharedUniformByShd(shdp) == null)
                        {
                            // create shared uniform
                            MaterialProgram.SetSharedUniformByShd(shdp, ShdUniformTool.BuildShared(material.createSharedUniform(rc),rc, shdp));
                        }
                        if(material.__$uniform == null)
                        {
                            let unfdata:ShaderUniformData = material.createSelfUniformData();
                            let hasTrans:boolean = shdp.hasUniformByName(UniformConst.LocalTransformMatUNS);
                            if(unfdata != null || hasTrans)
                            {
                                if(RendererDeviece.IsWebGL2())
                                {
                                    material.__$uniform = ShdUniformTool.BuildLocalFromDataV2(unfdata, hasTrans?disp.transform:null, runit.shdp);
                                }
                                else
                                {
                                    material.__$uniform = ShdUniformTool.BuildLocalFromDataV1(unfdata, hasTrans?disp.transform:null, runit.shdp);
                                }
                            }
                            else
                            {
                                material.__$uniform = EmptyShdUniform.EmptyUniform;
                            }
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
            private buildGpuDisp(rc:RenderProxy,disp:RODisplay,processUid:number):void
            {
                if(disp.__$ruid < 0)
                {
                    let material:MaterialBase = disp.getMaterial();
                    if(material != null)
                    {
                        disp.rsign = RODisplay.LIVE_IN_WORLD;
                        
                        let runit:RPOUnit = RPOUnitBuider.Create();
                        runit.ivsIndex = disp.ivsIndex;
                        runit.ivsCount = disp.ivsCount;
                        runit.insCount = disp.insCount;
                        runit.visible = disp.visible;
                        runit.drawEnabled = disp.ivsCount > 0 && disp.visible;
                        runit.drawMode = disp.drawMode;
                        runit.renderState = disp.renderState;
                        runit.rcolorMask = disp.rcolorMask;
                        runit.trisNumber = disp.trisNumber;
                        disp.__$ruid = runit.getUid();
                        //let shdp:ShaderProgram = null;
                        let shdp:ShaderProgram = this.updateDispMaterial(rc,runit,disp);
                        // build vtx gpu data
                        if(disp.vbuf != null)
                        {
                            disp.vbuf.upload(rc,shdp);
                            runit.vro = disp.vbuf.createVROBegin(shdp);
                            runit.vro.__$attachThis();
                            disp.vbuf.createVROEnd();
                            runit.vtxUid = runit.vro.getVtxUid();
                            
                            runit.ibufType = runit.vro.ibufType;
                            runit.ibufStep = runit.vro.ibufStep;
                        }
                        //console.log("runit.ibufType: "+runit.ibufType+", runit.ibufStep: "+runit.ibufStep+", runit.ivsCount: "+runit.ivsCount);
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
                let disp:RODisplay = null;
                let m_processUid:number = -1;
                while(len > 0)
                {
                    disp = this.m_disps.shift();
                    m_processUid = this.m_processUidList.shift();
                    if(disp.rsign == RODisplay.GO_TO_WORLD)
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
                    let shdp:ShaderProgram = material.getShaderProgram();
                    let texList:TextureProxy[] = null;
                    let texEnabled:boolean = false;
                    if(shdp == null)
                    {
                        texList = material.getTextureList();
                        texEnabled = (texList != null && texList.length > 0);
                        material.initializeByCodeBuf( texEnabled );
                        shdp = material.getShaderProgram();
                    }
                    shdp.upload( rc.RContext );
                    let shdUid:number = shdp.getUid();
                    let texTotal:number = shdp.getTexTotal();
                    if(texEnabled && texTotal > 0)
                    {
                        tro = TextureRenderObj.Create(gl, texList, texTotal);
                    }
                    if(MaterialProgram.GetSharedUniformByShd(shdp) == null)
                    {
                        MaterialProgram.SetSharedUniformByShd(shdp, ShdUniformTool.BuildShared(material.createSharedUniform(rc),rc, shdp));
                    }
                    
                    if(material.__$uniform == null)
                    {
                        let unfdata:ShaderUniformData = material.createSelfUniformData();
                        if(unfdata != null || shdp.hasUniformByName(UniformConst.LocalTransformMatUNS))
                        {
                            if(RendererDeviece.IsWebGL2())
                            {
                                material.__$uniform = ShdUniformTool.BuildLocalFromDataV2(unfdata, null, shdp);
                            }
                            else
                            {
                                material.__$uniform = ShdUniformTool.BuildLocalFromDataV1(unfdata, null, shdp);
                            }
                        }
                        else
                        {
                            material.__$uniform = EmptyShdUniform.EmptyUniform;
                        }
                    }
                    MaterialProgram.UseShdByUid(rc, shdUid);
                    if(tro != null)
                    {
                        tro.run(rc);
                    }
                }
            }
        }

    }
}