/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2020 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import * as Vector3DT from '../..//vox/math/Vector3D';
import * as DashedLineMeshT from '../../vox/mesh/DashedLineMesh';
import * as DisplayEntityT from "../../vox/entity/DisplayEntity";
import * as MaterialBaseT from '../../vox/material/MaterialBase';
import * as Line3DMaterialT from '../../vox/material/mcase/Line3DMaterial';

import Vector3D = Vector3DT.vox.math.Vector3D;
import DashedLineMesh = DashedLineMeshT.vox.mesh.DashedLineMesh;
import DisplayEntity = DisplayEntityT.vox.entity.DisplayEntity;
import MaterialBase = MaterialBaseT.vox.material.MaterialBase;
import Line3DMaterial = Line3DMaterialT.vox.material.mcase.Line3DMaterial;

export namespace vox
{
    export namespace entity
    {
        export class DashedLine3DEntity extends DisplayEntity
        {
            private m_currMaterial:Line3DMaterial = null;
            constructor()
            {
                super();
            }
            private m_posarr:number[] = null;

            setRGB3f(pr:number,pg:number,pb:number)
            {
                this.m_currMaterial.setRGB3f(pr,pg,pb);
            }
            createMaterial():void
            {
                if(this.getMaterial() == null)
                {
                    this.m_currMaterial = new Line3DMaterial(true);
                    this.setMaterial(this.m_currMaterial);
                }
            }
            protected __activeMesh(material:MaterialBase):void
            {
                if(this.getMesh() == null)
                {
                    let mesh:DashedLineMesh = new DashedLineMesh();
                    mesh.vbWholeDataEnabled = false;
                    mesh.setBufSortFormat( material.getBufSortFormat() );
                    mesh.initialize(this.m_posarr, null);
                    this.setMesh(mesh);
                }
            }
            initializeLS(va:Vector3D,vb:Vector3D):void
            {
                this.m_posarr = [va.x,va.y,va.z, vb.x,vb.y,vb.z];
                
                this.createMaterial();
                this.activeDisplay();

            }
            
            initializeDashedLine(pvList:Vector3D[]):void
            {
                //this.m_posarr = [va.x,va.y,va.z, vb.x,vb.y,vb.z];
                this.m_posarr = [];
                let i:number = 0;
                let len:number = pvList.length;
                for(; i < len; i+=2)
                {
                    this.m_posarr.push(pvList[i].x,pvList[i].y,pvList[i].z);
                    this.m_posarr.push(pvList[i+1].x,pvList[i+1].y,pvList[i+1].z);
                }
                this.createMaterial();
                this.activeDisplay();

            }
            toString():string
            {
                return "DashedLine3DEntity(name="+this.name+",uid = "+this.getUid()+", rseFlag = "+this.__$rseFlag+")";
            }
        }
    }
}