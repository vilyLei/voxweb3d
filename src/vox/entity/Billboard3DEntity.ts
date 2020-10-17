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
            setRGBA4f(pr:number,pg:number,pb:number,pa:number):void
            {
                if(this.m_currMaterial != null)
                {
                    this.m_currMaterial.setRGBA4f(pr,pg,pb,pa);
                }
            }
            setRGB3f(pr:number,pg:number,pb:number):void
            {
                if(this.m_currMaterial != null)
                {
                    this.m_currMaterial.setRGB3f(pr,pg,pb);
                }
            }

            setRGBAOffset4f(pr:number,pg:number,pb:number,pa:number):void
            {
                if(this.m_currMaterial != null)
                {
                    this.m_currMaterial.setRGBAOffset4f(pr,pg,pb, pa);
                }
            }
            setRGBOffset3f(pr:number,pg:number,pb:number):void
            {
                if(this.m_currMaterial != null)
                {
                    this.m_currMaterial.setRGBOffset3f(pr,pg,pb);
                }
            }
            
            setAlpha(pa:number):void
            {
                if(this.m_currMaterial != null)
                {
                    this.m_currMaterial.setAlpha(pa);
                }
            }
            getAlpha():number
            {
                return this.m_currMaterial.getAlpha();
            }
            setBrightness(brighness:number):void
            {
                this.m_currMaterial.setBrightness(brighness);
            }
            getBrightness():number
            {
                return this.m_currMaterial.getBrightness();
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
                    this.m_currMaterial = new BillboardMaterial();
                    //this.m_currMaterial.updateData();
                    this.m_currMaterial.setTextureList(texList);
                    this.setMaterial(this.m_currMaterial);
                }
                else
                {
                    this.m_currMaterial = this.getMaterial() as BillboardMaterial;
                    this.m_currMaterial.setTextureList(texList);
                }
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
                    mesh.vaoEnabled = true;
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
                return "[Billboard3DEntity(uid = "+this.getUid()+", __$wuid = "+this.__$wuid+", __$weid = "+this.__$weid+")]";
            }
        }

    }
}
