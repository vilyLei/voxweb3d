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
import * as BillboardFlareMaterialT from "../../vox/material/mcase/BillboardFlareMaterial";
import * as TextureProxyT from "../../vox/texture/TextureProxy";
import * as BillboardPlaneFlareMeshT from "../../vox/mesh/BillboardPlaneFlareMesh";

import ROTransform = ROTransformT.vox.display.ROTransform;
import RendererState = RendererStateT.vox.render.RendererState;
import DisplayEntity = DisplayEntityT.vox.entity.DisplayEntity;
import MaterialBase = MaterialBaseT.vox.material.MaterialBase;
import BillboardFlareMaterial = BillboardFlareMaterialT.vox.material.mcase.BillboardFlareMaterial;
import TextureProxy = TextureProxyT.vox.texture.TextureProxy;
import BillboardPlaneFlareMesh = BillboardPlaneFlareMeshT.vox.mesh.BillboardPlaneFlareMesh;

export namespace vox
{
    export namespace entity
    {
        export class Billboard3DFlareEntity extends DisplayEntity
        {
            constructor(transform:ROTransform = null)
            {
                super(transform);
                this.setRenderState(RendererState.BACK_ADD_BLENDSORT_STATE);
            }
            flipVerticalUV:boolean = false;
            private m_currMaterial:BillboardFlareMaterial = null;
            private m_billMesh:BillboardPlaneFlareMesh = null;
            createGroup(billboardTotal:number):void
            {
                if(billboardTotal > 0 && this.m_billMesh == null && this.getMesh() == null)
                {
                    this.m_billMesh = new BillboardPlaneFlareMesh();
                    this.m_billMesh.createData(billboardTotal);
                }
            }
            setSizeAndScaleAt(i:number, width:number,height:number,minScale:number,maxScale:number):void
            {
                if(this.m_billMesh != null)
                {
                    this.m_billMesh.setSizeAndScaleAt(i, width, height, minScale,maxScale);
                }
            }
            setPositionAt(i:number, x:number,y:number,z:number):void
            {
                if(this.m_billMesh != null)
                {
                    this.m_billMesh.setPositionAt(i,x,y,z);
                }
            }
            setUVRectAt(i:number, u:number,v:number,du:number,dv:number):void
            {
                if(this.m_billMesh != null)
                {
                    this.m_billMesh.setUVRectAt(i,u,v,du,dv);
                }
            }
            setTimeAt(i:number, lifeTime:number,fadeInEndFactor:number,fadeOutBeginFactor:number, timeSpeed:number = 1.0):void
            {
                if(this.m_billMesh != null)
                {
                    this.m_billMesh.setTimeAt(i,lifeTime,fadeInEndFactor,fadeOutBeginFactor,timeSpeed);
                }
            }
            setAlphaAt(i:number, alpha:number):void
            {
                if(this.m_billMesh != null)
                {
                    this.m_billMesh.setAlphaAt(i,alpha);
                }
            }
            setBrightnessAt(i:number, brightness:number):void
            {
                if(this.m_billMesh != null)
                {
                    this.m_billMesh.setBrightnessAt(i,brightness);
                }
            }
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
            getTime():number{return this.m_currMaterial.getTime();};
            setTime(time:number):void
            {
                this.m_currMaterial.setTime(time);
            }
            timeAddOffset(timeOffset:number):void
            {
                this.m_currMaterial.timeAddOffset(timeOffset);
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
                    this.m_currMaterial = new BillboardFlareMaterial();
                    this.m_currMaterial.setTextureList(texList);
                    this.setMaterial(this.m_currMaterial);
                }
                else
                {
                    this.m_currMaterial = this.getMaterial() as BillboardFlareMaterial;
                    this.m_currMaterial.setTextureList(texList);
                }
            }
            toTransparentBlend(always:boolean = false):void
            {
                if(always)
                {
                    this.setRenderState(RendererState.BACK_TRANSPARENT_STATE);
                }
                else
                {
                    this.setRenderState(RendererState.BACK_TRANSPARENT_ALWAYS_STATE);
                }
            }
            toAddBlend(always:boolean = false):void
            {
                if(always)
                {
                    this.setRenderState(RendererState.BACK_ADD_BLENDSORT_STATE);
                }
                else
                {
                    this.setRenderState(RendererState.BACK_ALPHA_ADD_ALWAYS_STATE);
                }
            }
            initialize(texList:TextureProxy[]):void
            {
                if(this.m_billMesh != null)
                {
                    this.createMaterial(texList);
                    this.activeDisplay();
                }
                else
                {
                    console.error("billMesh is null, please call createGroup() function!");
                }
            }
            protected createBounds():void
            {
            }
            protected __activeMesh(material:MaterialBase):void
            {
                if(this.getMesh() == null)
                {
                    let mesh:BillboardPlaneFlareMesh = this.m_billMesh;
                    mesh.vbWholeDataEnabled = this.vbWholeDataEnabled;
                    mesh.flipVerticalUV = this.flipVerticalUV;
                    mesh.setBufSortFormat( material.getBufSortFormat() );
                    mesh.initialize();
                    this.setMesh(mesh);
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
                return "Billboard3DGroupFlareEntity(uid = "+this.getUid()+", rseFlag = "+this.__$rseFlag+")";
            }
        }

    }
}
