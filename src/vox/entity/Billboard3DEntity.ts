/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import * as ROTransformT from "../../vox/display/ROTransform";
import * as RendererStateT from "../../vox/render/RendererState";
import * as DisplayEntityT from "../../vox/entity/DisplayEntity";
import * as MaterialBaseT from '../../vox/material/MaterialBase';
import * as BillboardMaterialT from "../../vox/material/mcase/BillboardMaterial";
import * as TextureProxyT from "../../vox/texture/TextureProxy";
import * as BillboardPlaneMeshT from "../../vox/mesh/BillboardPlaneMesh";

import ROTransform = ROTransformT.vox.display.ROTransform;
import RendererState = RendererStateT.vox.render.RendererState;
import DisplayEntity = DisplayEntityT.vox.entity.DisplayEntity;
import MaterialBase = MaterialBaseT.vox.material.MaterialBase;
import BillboardMaterial = BillboardMaterialT.vox.material.mcase.BillboardMaterial;
import TextureProxy = TextureProxyT.vox.texture.TextureProxy;
import BillboardPlaneMesh = BillboardPlaneMeshT.vox.mesh.BillboardPlaneMesh;

export namespace vox
{
    export namespace entity
    {

        export class Billboard3DEntity extends DisplayEntity
        {
            private m_brightnessEnabled:boolean = true;
            private m_alphaEnabled:boolean = false;
            constructor(transform:ROTransform = null)
            {
                super(transform);
                this.setRenderState(RendererState.BACK_ADD_BLENDSORT_STATE);
            }
            flipVerticalUV:boolean = false;
            private m_bw:number = 0;
            private m_bh:number = 0;
            private m_currMaterial:BillboardMaterial = null;
            private m_billMesh:BillboardPlaneMesh = null;
            setRGB3f(pr:number,pg:number,pb:number):void
            {
                if(this.m_currMaterial != null)
                {
                    this.m_currMaterial.setRGB3f(pr,pg,pb);
                }
            }
            setRGBOffset3f(pr:number,pg:number,pb:number):void
            {
                if(this.m_currMaterial != null)
                {
                    this.m_currMaterial.setRGBOffset3f(pr,pg,pb);
                }
            }
            
            setFadeFactor(pa:number):void
            {
                if(this.m_currMaterial != null)
                {
                    this.m_currMaterial.setFadeFactor(pa);
                }
            }
            getFadeFactor():number
            {
                return this.m_currMaterial.getFadeFactor();
            }
            getRotationZ():number{return this.m_currMaterial.getRotationZ();};
            setRotationZ(degrees:number):void
            {
                this.m_currMaterial.setRotationZ(degrees);
            }
            getScaleX():number{return this.m_currMaterial.getScaleX();}
            getScaleY():number{return this.m_currMaterial.getScaleY();}
            setScaleX(p:number):void{this.m_currMaterial.setScaleX(p);}
            setScaleY(p:number):void{this.m_currMaterial.setScaleY(p);}
            setScaleXY(sx:number,sy:number):void
            {
                this.m_currMaterial.setScaleXY( sx,sy );
            }
            createMaterial(texList:TextureProxy[]):void
            {
                if(this.getMaterial() == null)
                {
                    this.m_currMaterial = new BillboardMaterial(this.m_brightnessEnabled,this.m_alphaEnabled);
                    this.m_currMaterial.setTextureList(texList);
                    this.setMaterial(this.m_currMaterial);
                }
                else
                {
                    this.m_currMaterial = this.getMaterial() as BillboardMaterial;
                    this.m_currMaterial.setTextureList(texList);
                }
            }
            toTransparentBlend(always:boolean = false):void
            {
                this.m_brightnessEnabled = false;
                this.m_alphaEnabled = true;
                if(always)
                {
                    this.setRenderState(RendererState.BACK_TRANSPARENT_STATE);
                }
                else
                {
                    this.setRenderState(RendererState.BACK_TRANSPARENT_ALWAYS_STATE);
                }
            }
            toBrightnessBlend(always:boolean = false):void
            {
                this.m_brightnessEnabled = true;
                this.m_alphaEnabled = false;
                if(always)
                {
                    this.setRenderState(RendererState.BACK_ADD_BLENDSORT_STATE);
                }
                else
                {
                    this.setRenderState(RendererState.BACK_ADD_BLENDSORT_STATE);
                }
            }
            initializeSquare(size:number,texList:TextureProxy[]):void
            {
                this.m_bw = size;
                this.m_bh = size;
                this.createMaterial(texList);
                this.activeDisplay();
            }
            initialize(bw:number, bh:number,texList:TextureProxy[]):void
            {
                this.m_bw = bw;
                this.m_bh = bh;
                this.createMaterial(texList);
                this.activeDisplay();
            }
            protected createBounds():void
            {
            }
            protected __activeMesh(material:MaterialBase):void
            {
                if(this.getMesh() == null)
                {
                    let mesh:BillboardPlaneMesh = new BillboardPlaneMesh();
                    mesh.vbWholeDataEnabled = this.vbWholeDataEnabled;
                    mesh.flipVerticalUV = this.flipVerticalUV;
                    mesh.setBufSortFormat( material.getBufSortFormat() );
                    mesh.initialize(this.m_bw, this.m_bh);
                    this.setMesh(mesh);
                    this.m_billMesh = mesh;
                }
            }
            
            setUV(pu:number,pv:number,du:number,dv:number):void
            {
                if(this.m_billMesh != null)
                {
                    this.m_billMesh.setUV(pu,pv,du,dv);
                }
            }
            update():void
            {
                this.m_transfrom.update();
            }
            destroy():void
            {
                this.m_currMaterial = null;
                this.m_billMesh = null;
                super.destroy();
            }
            toString():string
            {
                return "Billboard3DEntity(uid = "+this.getUid()+", rseFlag = "+this.__$rseFlag+")";
            }
        }

    }
}
