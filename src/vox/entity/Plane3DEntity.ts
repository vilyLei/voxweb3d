/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import * as RendererStateT from "../../vox/render/RendererState";
import * as DisplayEntityT from "../../vox/entity/DisplayEntity";
import * as MaterialBaseT from '../../vox/material/MaterialBase';
import * as Default3DMaterialT from "../../vox/material/mcase/Default3DMaterial";
import * as TextureProxyT from "../../vox/texture/TextureProxy";
import * as RORectMeshT from "../../vox/mesh/RORectMesh";

import RendererState = RendererStateT.vox.render.RendererState;
import DisplayEntity = DisplayEntityT.vox.entity.DisplayEntity;
import MaterialBase = MaterialBaseT.vox.material.MaterialBase;
import Default3DMaterial = Default3DMaterialT.vox.material.mcase.Default3DMaterial;
import TextureProxy = TextureProxyT.vox.texture.TextureProxy;
import RORectMesh = RORectMeshT.vox.mesh.RORectMesh;

export namespace vox
{
    export namespace entity
    {
        export class Plane3DEntity extends DisplayEntity
        {
            private m_startX:number = 0;
            private m_startZ:number = 0;
            private m_pwidth:number = 0;
            private m_plong:number = 0;
            private m_flag:number = 0;
            flipVerticalUV:boolean = false;
            constructor()
            {
                super();
            }
            createMaterial(texList:TextureProxy[]):void
            {
                if(this.getMaterial() == null)
                {
                    let cm:Default3DMaterial = new Default3DMaterial();
                    cm.setTextureList(texList);
                    this.setMaterial(cm);
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
                this.createMaterial(texList);
                this.activeDisplay();
            }
            initializeXOZ(startX:number,startZ:number,pwidth:number,plong:number,texList:TextureProxy[] = null):void
            {
                this.m_flag = 1;
                this.m_startX = startX;
                this.m_startZ = startZ;
                this.m_pwidth = pwidth;
                this.m_plong = plong;
                this.createMaterial(texList);
                this.activeDisplay();
            }
            
            initializeYOZ(startX:number,startZ:number,pwidth:number,plong:number,texList:TextureProxy[] = null):void
            {
                this.m_flag = 2;
                this.m_startX = startX;
                this.m_startZ = startZ;
                this.m_pwidth = pwidth;
                this.m_plong = plong;
                this.createMaterial(texList);
                this.activeDisplay();
            }
            protected __activeMesh(material:MaterialBase)
            {
                if(this.getMesh() == null)
                {
                    let mesh:RORectMesh = new RORectMesh();
                    mesh.vaoEnabled = true;
                    mesh.flipVerticalUV = this.flipVerticalUV;
                    mesh.vbWholeDataEnabled = this.vbWholeDataEnabled;
                    mesh.axisFlag = this.m_flag;
                    mesh.setBufSortFormat( material.getBufSortFormat() );
                    mesh.initialize(this.m_startX,this.m_startZ,this.m_pwidth,this.m_plong);
                    this.setMesh(mesh);
                }
            }
            toString():string
            {
                return "[Plane3DEntity]";
            }
        }
    }
}
