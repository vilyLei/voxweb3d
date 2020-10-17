/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import * as MathConstT from "../../vox/utils/MathConst";
import * as VtxBufConstT from "../../vox/mesh/VtxBufConst";
import * as DashedLineMeshT from '../../vox/mesh/DashedLineMesh';
import * as DisplayEntityT from "../../vox/entity/DisplayEntity";
import * as Color4T from '../../vox/material/Color4';
import * as MaterialBaseT from '../../vox/material/MaterialBase';
import * as BillboardFrameMaterialT from '../../vox/material/mcase/BillboardFrameMaterial';

import MathConst = MathConstT.vox.utils.MathConst;
import VtxBufConst = VtxBufConstT.vox.mesh.VtxBufConst;
import DashedLineMesh = DashedLineMeshT.vox.mesh.DashedLineMesh;
import DisplayEntity = DisplayEntityT.vox.entity.DisplayEntity;
import Color4 = Color4T.vox.material.Color4;
import MaterialBase = MaterialBaseT.vox.material.MaterialBase;
import BillboardFrameMaterial = BillboardFrameMaterialT.vox.material.mcase.BillboardFrameMaterial;

export namespace vox
{
    export namespace entity
    {
        export class BillboardFrame extends DisplayEntity
        {
            constructor()
            {
                super();
            }
            private m_selfMesh:DashedLineMesh = null;
            private m_posarr:number[] = null;
            private m_currMaterial:BillboardFrameMaterial = null;
            color:Color4 = new Color4(1.0,1.0,1.0,1.0);
            setLineWidth(lineW:number):void
            {
            }
            
            setRGB3f(pr:number,pg:number,pb:number)
            {
                this.m_currMaterial.setRGB3f(pr,pg,pb);
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
            createMaterial():void
            {
                if(this.getMaterial() == null)
                {
                    this.m_currMaterial = new BillboardFrameMaterial();
                    this.setMaterial(this.m_currMaterial);
                }
            }
            protected __activeMesh(material:MaterialBase):void
            {
                if(this.getMesh() == null)
                {
                    let colorarr:number[] = [];
                    let i:number = 0;
                    let len:number = this.m_posarr.length;
                    for(; i < len; ++i)
                    {
                        colorarr.push(this.color.r,this.color.g,this.color.b);
                    }
                    this.m_selfMesh = new DashedLineMesh(VtxBufConst.VTX_DYNAMIC_DRAW);          
                    this.m_selfMesh.vaoEnabled = true;
                    this.m_selfMesh.vbWholeDataEnabled = false;
                    this.m_selfMesh.setBufSortFormat( material.getBufSortFormat() );
                    this.m_selfMesh.initialize(this.m_posarr, colorarr);
                    this.setMesh(this.m_selfMesh);
                }
            }
            initializeRect(px:number,py:number,pw:number,ph:number):void
            {
                pw += px;
                ph += py;
                //this.m_posarr = [px,py,0.0, pw,py,0.0, pw,ph,0.0, px,ph,0.0];
                
                this.m_posarr = [px,py,0.0, pw,py,0.0,  pw,py,0.0, pw,ph,0.0,  pw,ph,0.0,px,ph,0.0, px,ph,0.0,px,py,0.0];

                this.createMaterial();
                this.activeDisplay();
            }
            initializeCircle(radius:number,segTotal:number = 25):void
            {
                if(this.getMesh() == null)
                {
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
                }
                this.createMaterial();
                this.activeDisplay();
            }
            
        }
    }
}