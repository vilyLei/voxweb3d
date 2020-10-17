/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import * as RODrawStateT from "../../vox/render/RODrawState";
import * as DisplayEntityT from "../../vox/entity/DisplayEntity";
import * as MaterialBaseT from '../../vox/material/MaterialBase';
import * as BillboardAlphaTexMaterialT from "../../vox/material/mcase/BillboardAlphaTexMaterial";
import * as TextureProxyT from "../../vox/texture/TextureProxy";
import * as TextRectMeshT from "../../vox/text/TextRectMesh";
import * as H5FontSysT from "../../vox/text/H5FontSys";

import RenderStateObject = RODrawStateT.vox.render.RenderStateObject;
import DisplayEntity = DisplayEntityT.vox.entity.DisplayEntity;
import MaterialBase = MaterialBaseT.vox.material.MaterialBase;
import BillboardAlphaTexMaterial = BillboardAlphaTexMaterialT.vox.material.mcase.BillboardAlphaTexMaterial;
import TextureProxy = TextureProxyT.vox.texture.TextureProxy;
import TextRectMesh = TextRectMeshT.vox.text.TextRectMesh;
import H5FontSystem = H5FontSysT.vox.text.H5FontSystem;

export namespace vox
{
    export namespace text
    {
        export class TextBillboard3DEntity extends DisplayEntity
        {
            private m_dynamicEnbaled:boolean = true;
            private m_billMateiral:BillboardAlphaTexMaterial = null;
            private m_billMesh:TextRectMesh = null;
            private m_charsStr:string = "";
            private m_alignFactorX:number = 0.5;
            private m_alignFactorY:number = 0.5;
            flipVerticalUV:boolean = false;
            constructor(dynamicEnbaled:boolean = true)
            {
                super();
                this.m_dynamicEnbaled = dynamicEnbaled;
            }
            getWidth():number
            {
                if(this.m_billMesh != null)
                {
                    return this.m_billMesh.getWidth();
                }
                return 0.0;
            }
            getHeight():number
            {
                if(this.m_billMesh != null)
                {
                    return this.m_billMesh.getHeight();
                }
                return 0.0;
            }
            setAlignFactor(alignFactorX:number, alignFactorY:number):void
            {
                this.m_alignFactorX = alignFactorX;
                this.m_alignFactorY = alignFactorY;
                if(this.m_billMesh != null)
                {
                    this.m_billMesh.updateCharStr(this.m_charsStr);
                }
            }
            alignLeftTop():void
            {
                this.setAlignFactor(0.0,0.0);
            }
            alignCenter():void
            {
                this.setAlignFactor(0.5,0.5);
            }
            alignLeftCenter():void
            {
                this.setAlignFactor(0.0,0.5);
            }
            setText(charsStr:string):void
            {
                if(this.m_billMesh != null)
                {
                    this.m_charsStr = charsStr;
                    this.m_billMesh.alignFactorX = this.m_alignFactorX;
                    this.m_billMesh.alignFactorY = this.m_alignFactorY;
                    this.m_billMesh.updateCharStr(charsStr);
                    this.update();
                }
            }
            setRGBA4f(pr:number,pg:number,pb:number,pa:number):void
            {
                if(this.m_billMateiral != null)
                {
                    this.m_billMateiral.setRGBA4f(pr,pg,pb,pa);
                }
            }
            setRGB3f(pr:number,pg:number,pb:number):void
            {
                if(this.m_billMateiral != null)
                {
                    this.m_billMateiral.setRGB3f(pr,pg,pb);
                }
            }
            setAlpha(pa:number):void
            {
                this.m_billMateiral.setAlpha(pa);
            }
            getAlpha():number
            {
                return this.m_billMateiral.getAlpha();
            }
            setBrightness(brighness:number):void
            {
                this.m_billMateiral.setBrightness(brighness);
            }
            getBrightness():number
            {
                return this.m_billMateiral.getBrightness();
            }
            getRotationZ():number{return this.m_billMateiral.getRotationZ();};
            setRotationZ(degrees:number):void
            {
                this.m_billMateiral.setRotationZ(degrees);
            }
            getScaleX():number{return this.m_billMateiral.getScaleX();}
            getScaleY():number{return this.m_billMateiral.getScaleY();}
            setScaleX(p:number):void{this.m_billMateiral.setScaleX(p);}
            setScaleY(p:number):void{this.m_billMateiral.setScaleY(p);}
            setScaleXY(sx:number,sy:number):void
            {
                this.m_billMateiral.setScaleXY( sx,sy );
            }
            createMaterial(texList:TextureProxy[]):void
            {
                if(this.getMaterial() == null)
                {
                    this.m_billMateiral = new BillboardAlphaTexMaterial();
                    this.m_billMateiral.setTextureList(texList);
                    this.setMaterial(this.m_billMateiral);
                }
                else
                {
                    this.m_billMateiral.setTextureList(texList);
                }
            }
            initialize(charsStr:string,texList:TextureProxy[] = null):void
            {
                this.m_charsStr = charsStr;
                if(texList == null)
                {
                    this.createMaterial([H5FontSystem.GetInstance().getTextureAt(0)]);
                }
                else
                {
                    this.createMaterial(texList);
                }
                this.activeDisplay();
                this.setRenderState(RenderStateObject.BACK_TRANSPARENT_STATE);
            }
            protected createBounds():void
            {
            }
            protected __activeMesh(material:MaterialBase):void
            {
                if(this.getMesh() == null)
                {
                    let mesh:TextRectMesh = new TextRectMesh();
                    mesh.vaoEnabled = true;
                    mesh.vbWholeDataEnabled = this.vbWholeDataEnabled;
                    mesh.alignFactorX = this.m_alignFactorX;
                    mesh.alignFactorY = this.m_alignFactorY;
                    mesh.setBufSortFormat( material.getBufSortFormat() );
                    mesh.initialize(this.m_charsStr);
                    this.setMesh(mesh);
                    this.m_billMesh = mesh;
                }
            }
            update():void
            {
                if(this.m_dynamicEnbaled && this.m_mesh.isGeomDynamic())
                {
                    this.setIvsParam(0,this.m_mesh.vtCount);
                }
                this.m_transfrom.update();
            }
            toString():string
            {
                return "TextBillboard3DEntity(uid = "+this.getUid()+", __$wuid = "+this.__$wuid+", __$weid = "+this.__$weid+")";
            }
        }

    }
}
