/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2020 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import * as DashedLineMeshT from '../../vox/mesh/DashedLineMesh';
import * as DisplayEntityT from "../../vox/entity/DisplayEntity";
import * as Color4T from '../../vox/material/Color4';
import * as MaterialBaseT from '../../vox/material/MaterialBase';
import * as Line3DMaterialT from '../../vox/material/mcase/Line3DMaterial';

import DashedLineMesh = DashedLineMeshT.vox.mesh.DashedLineMesh;
import DisplayEntity = DisplayEntityT.vox.entity.DisplayEntity;
import Color4 = Color4T.vox.material.Color4;
import MaterialBase = MaterialBaseT.vox.material.MaterialBase;
import Line3DMaterial = Line3DMaterialT.vox.material.mcase.Line3DMaterial;

export namespace vox
{
    export namespace entity
    {
        export class Axis3DEntity extends DisplayEntity
        {
            constructor()
            {
                super();
            }
            // 用于射线检测
            public rayTestRadius:number = 8.0;
            colorX:Color4 = new Color4(1.0,0.0,0.0,1.0);
            colorY:Color4 = new Color4(0.0,1.0,0.0,1.0);
            colorZ:Color4 = new Color4(0.0,0.0,1.0,1.0);
            private m_posarr:number[] = [0,0,0, 100.0,0,0, 0,0,0, 0,100.0,0, 0,0,0, 0,0,100.0];
            setLineWidth(lineW:number):void
            {
                //if(this.getMesh())
                //{
                //    //this.getMesh().vbuf.lineWidth = lineW;
                //}
            }
            createMaterial():void
            {
                if(this.getMaterial() == null)
                {
                    let cm:Line3DMaterial = new Line3DMaterial();
                    this.setMaterial(cm);
                }
            }
            protected __activeMesh(material:MaterialBase):void
            {
                if(this.getMesh() == null)
                {
                    let colorarr:number[] = [
                        this.colorX.r,this.colorX.g,this.colorX.b, this.colorX.r,this.colorX.g,this.colorX.b
                        , this.colorY.r,this.colorY.g,this.colorY.b, this.colorY.r,this.colorY.g,this.colorY.b
                        , this.colorZ.r,this.colorZ.g,this.colorZ.b, this.colorZ.r,this.colorZ.g,this.colorZ.b
                    ];
                    let mesh:DashedLineMesh = new DashedLineMesh();
                    mesh.rayTestRadius = this.rayTestRadius;
                    mesh.vbWholeDataEnabled = false;
                    mesh.setBufSortFormat( material.getBufSortFormat() );
                    mesh.initialize(this.m_posarr, colorarr);
                    this.setMesh(mesh);
                }
            }
            /**
             * initialize the axis entity mesh and geometry data
             * @param axisSize the X/Y/Z axis length
             */
            initialize(axisSize:number = 100.0):void
            {
                if(axisSize < 2)
                {
                    axisSize = 2;
                }
                this.m_posarr[3] = axisSize;
                this.m_posarr[10] = axisSize;
                this.m_posarr[17] = axisSize;
                this.createMaterial();
                this.activeDisplay();

            }
            /**
             * initialize the axis entity mesh and geometry data
             * @param sizeX the X axis length
             * @param sizeY the Y axis length
             * @param sizeZ the Z axis length
             */
            initializeSizeXYZ(sizeX:number,sizeY:number,sizeZ:number):void
            {
                this.m_posarr[3] = sizeX;
                this.m_posarr[10] = sizeY;
                this.m_posarr[17] = sizeZ;                
                this.createMaterial();
                this.activeDisplay();
            }
            initializeCorssSizeXYZ(sizeX:number,sizeY:number,sizeZ:number):void
            {
                //  this.m_posarr[3] = sizeX;
                //  this.m_posarr[10] = sizeY;
                //  this.m_posarr[17] = sizeZ;
                
                sizeX *= 0.5;
                sizeY *= 0.5;
                sizeZ *= 0.5;
                this.m_posarr[0] = -sizeX;
                this.m_posarr[7] = -sizeY;
                this.m_posarr[14] = -sizeZ;
                this.m_posarr[3] = sizeX;
                this.m_posarr[10] = sizeY;
                this.m_posarr[17] = sizeZ;

                this.createMaterial();
                this.activeDisplay();
            }
            /**
             * initialize the cross axis entity mesh and geometry data
             * @param axisSize the X/Y/Z axis length
             */
            initializeCross(axisSize:number = 100.0):void
            {
                if(axisSize < 2)
                {
                    axisSize = 2;
                }
                axisSize *= 0.5;
                this.m_posarr[0] = -axisSize;
                this.m_posarr[7] = -axisSize;
                this.m_posarr[14] = -axisSize;
                this.m_posarr[3] = axisSize;
                this.m_posarr[10] = axisSize;
                this.m_posarr[17] = axisSize;
                this.createMaterial();
                this.activeDisplay();

            }
            toString():string
            {
                return "Axis3DEntity(name="+this.name+",uid = "+this.getUid()+", rseFlag = "+this.__$rseFlag+")";
            }
        }
    }
}