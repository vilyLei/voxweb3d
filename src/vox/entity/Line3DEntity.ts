/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2020 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import Vector3D from "../../vox/math/Vector3D";
import DashedLineMesh from '../../vox/mesh/DashedLineMesh';
import DisplayEntity from "../../vox/entity/DisplayEntity";
import Color4 from '../../vox/material/Color4';
import MaterialBase from '../../vox/material/MaterialBase';
import Line3DMaterial from '../../vox/material/mcase/Line3DMaterial';

export default class Line3DEntity extends DisplayEntity
{
    constructor()
    {
        super();
    }
    color:Color4 = new Color4(1.0,0.0,0.0,1.0);
    private m_posarr:number[] = null;//[100.0,0.0,0.0, 0.0,0,0];
    setRGB3f(pr:number,pg:number,pb:number):void
    {
        this.color.setRGB3f(pr,pg,pb);
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
                this.color.r,this.color.g,this.color.b, this.color.r,this.color.g,this.color.b                        
            ];
            let mesh:DashedLineMesh = new DashedLineMesh();
            mesh.vbWholeDataEnabled = false;
            mesh.setBufSortFormat( material.getBufSortFormat() );
            mesh.initialize(this.m_posarr, colorarr);
            this.setMesh(mesh);
        }
    }
    initialize(begin:Vector3D,end:Vector3D = null):void
    {
        if(this.m_posarr == null)
        {
            this.m_posarr = [100.0,0.0,0.0, 0.0,0,0];
        }
        this.m_posarr[0] = begin.x;
        this.m_posarr[1] = begin.y;
        this.m_posarr[2] = begin.z;
        if(end == null)
        {
            this.m_posarr[3] = 0;
            this.m_posarr[4] = 0;
            this.m_posarr[5] = 0;
        }
        else
        {
            this.m_posarr[3] = end.x;
            this.m_posarr[4] = end.y;
            this.m_posarr[5] = end.z;
        }
        this.createMaterial();
        this.activeDisplay();

    }
    toString():string
    {
        return "[Line3DEntity]";
    }
}