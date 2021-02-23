/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import * as RendererStateT from "../../vox/render/RendererState";
import * as DisplayEntityT from "../../vox/entity/DisplayEntity";
import * as MaterialBaseT from '../../vox/material/MaterialBase';
import * as ScreenPlaneMaterialT from "../../vox/material/mcase/ScreenPlaneMaterial";
import * as TextureProxyT from "../../vox/texture/TextureProxy";
import * as RORectMeshT from "../../vox/mesh/RORectMesh";
import * as SpaceCullingMasKT from "../../vox/scene/SpaceCullingMask";

import RendererState = RendererStateT.vox.render.RendererState;
import DisplayEntity = DisplayEntityT.vox.entity.DisplayEntity;
import MaterialBase = MaterialBaseT.vox.material.MaterialBase;
import ScreenPlaneMaterial = ScreenPlaneMaterialT.vox.material.mcase.ScreenPlaneMaterial;
import TextureProxy = TextureProxyT.vox.texture.TextureProxy;
import RORectMesh = RORectMeshT.vox.mesh.RORectMesh;
import SpaceCullingMasK = SpaceCullingMasKT.vox.scene.SpaceCullingMasK;

export namespace vox
{
    export namespace entity
    {
        export class ScreenAlignPlaneEntity extends DisplayEntity
        {
            private m_startX:number = 0;
            private m_startZ:number = 0;
            private m_pwidth:number = 0;
            private m_plong:number = 0;
            private m_flag:number = 0;
            private m_currMaterial:ScreenPlaneMaterial = null;
            flipVerticalUV:boolean = false;
            constructor()
            {
                super();
            }
            setRGB3f(pr:number,pg:number,pb:number):void
            {
                this.m_currMaterial.setRGB3f(pr,pg,pb);
            }
            setRGBA4f(pr:number,pg:number,pb:number,pa:number):void
            {
                this.m_currMaterial.setRGBA4f(pr,pg,pb,pa);
            }
            createMaterial(texList:TextureProxy[]):void
            {
                if(this.getMaterial() == null)
                {
                    this.m_currMaterial = new ScreenPlaneMaterial();
                    this.m_currMaterial.setTextureList(texList);
                    this.setMaterial(this.m_currMaterial);
                }
                else
                {
                    this.getMaterial().setTextureList(texList);
                }
            }
            showDoubleFace():void
            {
                this.setRenderState(RendererState.NONE_CULLFACE_NORMAL_STATE);
            }
            initialize(startX:number,startY:number,pwidth:number,pheight:number,texList:TextureProxy[] = null):void
            {
                this.m_startX = startX;
                this.m_startZ = startY;
                this.m_pwidth = pwidth;
                this.m_plong = pheight;
                this.m_flag = 0;
                this.spaceCullMask = SpaceCullingMasK.NONE;
                this.createMaterial(texList);
                this.activeDisplay();
            }
            protected __activeMesh(material:MaterialBase)
            {
                if(this.getMesh() == null)
                {
                    let mesh:RORectMesh = new RORectMesh();
                    mesh.flipVerticalUV = this.flipVerticalUV;
                    mesh.vbWholeDataEnabled = this.vbWholeDataEnabled;
                    mesh.axisFlag = 0;
                    mesh.setBufSortFormat( material.getBufSortFormat() );
                    mesh.initialize(this.m_startX,this.m_startZ,this.m_pwidth,this.m_plong);
                    this.setMesh(mesh);
                }
            }
            
            destroy():void
            {
                super.destroy();
                this.m_currMaterial = null;
            }
            toString():string
            {
                return "[ScreenAlignPlaneEntity]";
            }
        }
    }
}
