/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import * as RendererStateT from "../../vox/render/RendererState";
import * as DisplayEntityT from "../../vox/entity/DisplayEntity";
import * as MaterialBaseT from '../../vox/material/MaterialBase';
import * as Rect2DMaterialT from "../../vox2d/material/mcase/Rect2DMaterial";
import * as TextureProxyT from "../../vox/texture/TextureProxy";
import * as RORectMeshT from "../../vox/mesh/RectPlaneMesh";
import * as SpaceCullingMasKT from "../../vox/space/SpaceCullingMask";

import RendererState = RendererStateT.vox.render.RendererState;
import DisplayEntity = DisplayEntityT.vox.entity.DisplayEntity;
import MaterialBase = MaterialBaseT.vox.material.MaterialBase;
import Rect2DMaterial = Rect2DMaterialT.vox2d.material.mcase.Rect2DMaterial;
import TextureProxy = TextureProxyT.vox.texture.TextureProxy;
import RectPlaneMesh = RORectMeshT.vox.mesh.RectPlaneMesh;
import SpaceCullingMasK = SpaceCullingMasKT.vox.space.SpaceCullingMasK;

export namespace vox2d
{
    export namespace entity
    {
        export class Rect2DEntity extends DisplayEntity
        {
            private m_startX:number = 0;
            private m_startZ:number = 0;
            private m_pwidth:number = 0;
            private m_height:number = 0;
            private m_flag:number = 0;
            private m_currMaterial:Rect2DMaterial = null;
            flipVerticalUV:boolean = false;
            constructor()
            {
                super();
            }
            createMaterial(texList:TextureProxy[]):void
            {
                if(this.getMaterial() == null)
                {
                    this.m_currMaterial = new Rect2DMaterial();
                    this.m_currMaterial.setTextureList(texList);
                    this.setMaterial(this.m_currMaterial);
                }
                else
                {
                    this.getMaterial().setTextureList(texList);
                }
            }
            protected createBounds():void
            {
            }
            enabledAlpha():void
            {
                this.setRenderState(RendererState.BACK_TRANSPARENT_ALWAYS_STATE);
            }
            disabledAlpha():void
            {
                this.setRenderState(RendererState.BACK_NORMAL_ALWAYS_STATE);
            }
            initialize(startX:number,startY:number,pwidth:number,pheight:number,texList:TextureProxy[] = null):void
            {
                this.m_startX = startX;
                this.m_startZ = startY;
                this.m_pwidth = pwidth;
                this.m_height = pheight;
                this.m_flag = 0;
                this.spaceCullMask = SpaceCullingMasK.NONE;
                this.createMaterial(texList);
                this.activeDisplay();
                this.setRenderState(RendererState.BACK_NORMAL_ALWAYS_STATE);
            }
            protected __activeMesh(material:MaterialBase)
            {
                if(this.getMesh() == null)
                {
                    let mesh:RectPlaneMesh = new RectPlaneMesh();
                    mesh.flipVerticalUV = this.flipVerticalUV;
                    mesh.vbWholeDataEnabled = this.vbWholeDataEnabled;
                    mesh.axisFlag = this.m_flag;
                    mesh.setBufSortFormat( material.getBufSortFormat() );
                    mesh.initialize(this.m_startX,this.m_startZ,this.m_pwidth,this.m_height);
                    this.setMesh(mesh);
                }
            }
            getWidth():number
            {
                return this.m_pwidth * this.m_currMaterial.getScaleX();
            }
            getHeight():number
            {
                return this.m_height * this.m_currMaterial.getScaleY();
            }
            setXYZ(px:number,py:number,pz:number):void
            {
                if(this.m_currMaterial != null)
                {
                    this.m_currMaterial.setXY(px,py);
                }
            }
            setXY(px:number,py:number):void
            {
                if(this.m_currMaterial != null)
                {
                    this.m_currMaterial.setXY(px,py);
                }
            }
            setX(px:number):void
            {
                if(this.m_currMaterial != null)
                {
                    this.m_currMaterial.setX(px);
                }
            }
            setY(py:number):void
            {
                if(this.m_currMaterial != null)
                {
                    this.m_currMaterial.setY(py);
                }
            }
            getX():number
            {
                if(this.m_currMaterial != null)
                {
                    return this.m_currMaterial.getX();
                }
                return 0.0;
            }
            getY():number
            {
                if(this.m_currMaterial != null)
                {
                    return this.m_currMaterial.getY();
                }
                return 0.0;
            }
            setScale(s:number):void
            {
                if(this.m_currMaterial != null)
                {
                    this.m_currMaterial.setScale(s);
                }
            }
            setScaleXY(sx:number,sy:number):void
            {
                if(this.m_currMaterial != null)
                {
                    this.m_currMaterial.setScaleXY(sx,sy);
                }
            }
            setScaleX(sx:number):void
            {
                if(this.m_currMaterial != null)
                {
                    this.m_currMaterial.setScaleX(sx);
                }
            }
            setScaleY(sy:number):void
            {
                if(this.m_currMaterial != null)
                {
                    this.m_currMaterial.setScaleY(sy);
                }
            }
            getScaleX():number
            {
                if(this.m_currMaterial != null)
                {
                    return this.m_currMaterial.getScaleX();
                }
                return 0.0;
            }
            getScaleY():number
            {
                if(this.m_currMaterial != null)
                {
                    return this.m_currMaterial.getScaleY();
                }
                return 0.0;
            }
            setRotation(pr:number):void
            {
                if(this.m_currMaterial != null)
                {
                    this.m_currMaterial.setRotation(pr);
                }
            }
            getRotation():number
            {
                if(this.m_currMaterial != null)
                {
                    return this.m_currMaterial.getRotation();
                }
                return 0.0;
            }
            setRGB3f(pr:number,pg:number,pb:number):void
            {
                if(this.m_currMaterial != null)
                {
                    this.m_currMaterial.setRGB3f(pr,pg,pb);
                }
            }
            setRGBA4f(pr:number,pg:number,pb:number,pa:number):void
            {
                if(this.m_currMaterial != null)
                {
                    this.m_currMaterial.setRGBA4f(pr,pg,pb,pa);
                }
            }
            update():void
            {
            }
            toString():string
            {
                return "[Rect2DEntity]";
            }
        }
    }
}
