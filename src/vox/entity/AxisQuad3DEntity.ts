/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2020 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import * as DashedQuadLineMeshT from '../../vox/mesh/DashedQuadLineMesh';
import * as DisplayEntityT from "../../vox/entity/DisplayEntity";
import * as Color4T from '../../vox/material/Color4';
import * as MaterialBaseT from '../../vox/material/MaterialBase';
import * as QuadLine3DMaterialT from '../../vox/material/mcase/QuadLine3DMaterial';

import DashedQuadLineMesh = DashedQuadLineMeshT.vox.mesh.DashedQuadLineMesh;
import DisplayEntity = DisplayEntityT.vox.entity.DisplayEntity;
import Color4 = Color4T.vox.material.Color4;
import MaterialBase = MaterialBaseT.vox.material.MaterialBase;
import QuadLine3DMaterial = QuadLine3DMaterialT.vox.material.mcase.QuadLine3DMaterial;

export namespace vox
{
    export namespace entity
    {
        export class AxisQuad3DEntity extends DisplayEntity
        {
            constructor()
            {
                super();
            }
            // 用于射线检测
            public pickTestRadius:number = 8.0;
            private m_thickness:number = 2.0;
            colorX:Color4 = new Color4(1.0,0.0,0.0,1.0);
            colorY:Color4 = new Color4(0.0,1.0,0.0,1.0);
            colorZ:Color4 = new Color4(0.0,0.0,1.0,1.0);
            private m_posarr:number[] = [0,0,0, 100.0,0,0, 0,0,0, 0,100.0,0, 0,0,0, 0,0,100.0];
            //private m_posarr:number[] = [0,0,0, 100.0,0,0];
            createMaterial():void
            {
                if(this.getMaterial() == null)
                {
                    let cm:QuadLine3DMaterial = new QuadLine3DMaterial();
                    this.setMaterial(cm);
                }
            }
            protected __activeMesh(material:MaterialBase):void
            {
                if(this.getMesh() == null)
                {
                    let colorarr:number[] = [
                        this.colorX.r,this.colorX.g,this.colorX.b,this.colorX.a
                        , this.colorY.r,this.colorY.g,this.colorY.b,this.colorY.a
                        , this.colorZ.r,this.colorZ.g,this.colorZ.b,this.colorZ.a
                    ];
                    let mesh:DashedQuadLineMesh = new DashedQuadLineMesh();
                    mesh.rayTestRadius = this.pickTestRadius;
                    mesh.vaoEnabled = true;
                    mesh.vbWholeDataEnabled = true;
                    mesh.setBufSortFormat( material.getBufSortFormat() );
                    mesh.initialize(this.m_posarr, colorarr, this.m_thickness);
                    this.setMesh(mesh);
                }
            }
            initialize(size:number = 100.0,thickness:number = 2.0):void
            {
                if(size < 10)
                {
                    size = 10;
                }
                if(thickness < 0.1)
                {
                    thickness = 0.1;
                }
                this.m_thickness = thickness;
                this.m_posarr[3] = size;
                this.m_posarr[10] = size;
                this.m_posarr[17] = size;
                this.createMaterial();
                this.activeDisplay();

            }
            initializeSizeXYZ(sizeX:number,sizeY:number,sizeZ:number,thickness:number = 2.0):void
            {
                this.m_posarr[3] = sizeX;
                this.m_posarr[10] = sizeY;
                this.m_posarr[17] = sizeZ;
                this.createMaterial();
                this.activeDisplay();
            }
            toString():string
            {
                return "AxisQuad3DEntity(name="+this.name+",uid = "+this.getUid()+", __$wuid = "+this.__$wuid+", __$weid = "+this.__$weid+")";
            }
        }
    }
}