/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import * as MathConstT from "../../vox/math/MathConst";
import * as VtxBufConstT from "../../vox/mesh/VtxBufConst";
import * as RendererStateT from "../../vox/render/RendererState";
import * as DashedLineMeshT from '../../vox/mesh/DashedLineMesh';
import * as DisplayEntityT from "../../vox/entity/DisplayEntity";
import * as Color4T from '../../vox/material/Color4';
import * as MaterialBaseT from '../../vox/material/MaterialBase';
import * as Rect2DFrameMaterialT from '../../vox2d/material/mcase/Rect2DMaterial';

import MathConst = MathConstT.vox.math.MathConst;
import VtxBufConst = VtxBufConstT.vox.mesh.VtxBufConst;
import RendererState = RendererStateT.vox.render.RendererState;
import DashedLineMesh = DashedLineMeshT.vox.mesh.DashedLineMesh;
import DisplayEntity = DisplayEntityT.vox.entity.DisplayEntity;
import Color4 = Color4T.vox.material.Color4;
import MaterialBase = MaterialBaseT.vox.material.MaterialBase;
import Rect2DMaterial = Rect2DFrameMaterialT.vox2d.material.mcase.Rect2DMaterial;

export namespace vox2d
{
    export namespace entity
    {
        export class FrameLine2D extends DisplayEntity
        {
            constructor()
            {
                super();
            }
            private m_pwidth:number = 0;
            private m_height:number = 0;
            private m_selfMesh:DashedLineMesh = null;
            private m_posarr:number[] = null;
            private m_currMaterial:Rect2DMaterial = null;
            private m_centerAlignEnabled:boolean = false;
            createMaterial():void
            {
                if(this.getMaterial() == null)
                {
                    this.m_currMaterial = new Rect2DMaterial(this.m_centerAlignEnabled);
                    this.setMaterial(this.m_currMaterial);
                }
            }
            protected __activeMesh(material:MaterialBase):void
            {
                if(this.getMesh() == null)
                {
                    this.m_selfMesh = new DashedLineMesh(VtxBufConst.VTX_DYNAMIC_DRAW);
                    this.m_selfMesh.vbWholeDataEnabled = false;
                    this.m_selfMesh.setBufSortFormat( material.getBufSortFormat() );
                    this.m_selfMesh.initialize(this.m_posarr, null);
                    this.setMesh(this.m_selfMesh);
                }
            }
            
            initializeCrossLine(halfSize:number,centerAlignEnabled:boolean = false):void
            {
                this.m_centerAlignEnabled = centerAlignEnabled;
                this.m_posarr = [-halfSize,0.0,0.0, halfSize,0.0,0.0, 0.0,-halfSize,0.0, 0.0,halfSize,0.0];
                this.createMaterial();
                this.activeDisplay();
            }
            initializeLS(px0:number,py0:number,px1:number,py1:number,centerAlignEnabled:boolean = false):void
            {
                this.m_centerAlignEnabled = centerAlignEnabled;
                this.m_posarr = [px0,py0,0.0, px1,py1,0.0];
                this.createMaterial();
                this.activeDisplay();
            }
            initializeRect(px:number,py:number,pw:number,ph:number,centerAlignEnabled:boolean = false):void
            {
                this.m_centerAlignEnabled = centerAlignEnabled;
                this.m_pwidth = pw;
                this.m_height = ph;
                pw += px;
                ph += py;
                //this.m_posarr = [px,py,0.0, pw,py,0.0, pw,ph,0.0, px,ph,0.0];
                
                this.m_posarr = [px,py,0.0, pw,py,0.0,  pw,py,0.0, pw,ph,0.0,  pw,ph,0.0,px,ph,0.0, px,ph,0.0,px,py,0.0];

                this.createMaterial();
                this.activeDisplay();
            }
            initializeCircle(radius:number,segTotal:number = 25):void
            {
                
                //this.m_posarr = [px,py,0.0, pw,py,0.0,  pw,py,0.0, pw,ph,0.0,  pw,ph,0.0,px,ph,0.0, px,ph,0.0,px,py,0.0];
                if(radius < 1.0)
                {
                    radius = 1.0;
                }
                if(segTotal < 10)
                {
                    segTotal = 10.0;
                }
                this.m_posarr = [];
                let px:number = 0.0;
                let py:number = 0.0;
                let rad:number = 0.0;
                let k:number = MathConst.MATH_2PI / segTotal;
                let i:number = 0;
                for(; i < segTotal; ++i)
                {
                    rad = i * k;
                    px = radius * Math.cos(rad);
                    py = radius * Math.sin(rad);
                    this.m_posarr.push(px,py, 0.0);
                    rad = (i+1) * k;
                    px = radius * Math.cos(rad);
                    py = radius * Math.sin(rad);
                    this.m_posarr.push(px,py, 0.0);
                }
                this.createMaterial();
                this.activeDisplay();
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
                return "[FrameLine2D]";
            }
        }
    }
}