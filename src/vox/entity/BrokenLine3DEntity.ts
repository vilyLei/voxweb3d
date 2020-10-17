/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2020 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import * as Vector3DT from '../../vox/geom/Vector3';
import * as DashedLineMeshT from '../../vox/mesh/StripLineMesh';
import * as DisplayEntityT from "../../vox/entity/DisplayEntity";
import * as MaterialBaseT from '../../vox/material/MaterialBase';
import * as Line3DMaterialT from '../../vox/material/mcase/Line3DMaterial';

import Vector3D = Vector3DT.vox.geom.Vector3D;
import StripLineMesh = DashedLineMeshT.vox.mesh.StripLineMesh;
import DisplayEntity = DisplayEntityT.vox.entity.DisplayEntity;
import MaterialBase = MaterialBaseT.vox.material.MaterialBase;
import Line3DMaterial = Line3DMaterialT.vox.material.mcase.Line3DMaterial;

export namespace vox
{
    export namespace entity
    {
        export class BrokenLine3DEntity extends DisplayEntity
        {
            private m_currMaterial:Line3DMaterial = null;
            private m_dynColorBoo:boolean = true;
            constructor(dynColorBoo:boolean = true)
            {
                super();
                this.m_dynColorBoo = dynColorBoo;
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
                    this.m_currMaterial = new Line3DMaterial(this.m_dynColorBoo);
                    this.setMaterial(this.m_currMaterial);
                }
            }
            protected __activeMesh(material:MaterialBase):void
            {
                if(this.getMesh() == null)
                {
                    let mesh:StripLineMesh = new StripLineMesh();
                    mesh.vaoEnabled = true;
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
            initializeQuad(va:Vector3D,vb:Vector3D,vc:Vector3D,vd:Vector3D):void
            {
                this.m_posarr = [va.x,va.y,va.z, vb.x,vb.y,vb.z, vc.x,vc.y,vc.z, vd.x,vd.y,vd.z,va.x,va.y,va.z];
                this.createMaterial();
                this.activeDisplay();

            }
            toString():string
            {
                return "BrokenLine3DEntity(name="+this.name+",uid = "+this.getUid()+", __$wuid = "+this.__$wuid+", __$weid = "+this.__$weid+")";
            }
        }
    }
}