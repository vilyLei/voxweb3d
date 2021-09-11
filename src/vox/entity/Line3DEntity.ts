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
    private m_posarr:number[] = null;
    private m_colorarr:number[] = null;
    private m_material:Line3DMaterial = null;
    color:Color4 = new Color4(1.0,0.0,0.0,1.0);
    dynColorEnabled: boolean = false;
    setRGB3f(pr:number,pg:number,pb:number):void
    {
        if(this.m_material != null) {
            this.m_material.setRGB3f( pr, pg, pb );
        }
        this.color.setRGB3f(pr,pg,pb);
    }
    createMaterial():void
    {
        if(this.getMaterial() == null)
        {
            this.m_material = new Line3DMaterial(this.dynColorEnabled);
            this.setMaterial(this.m_material);
        }
    }
    protected __activeMesh(material:MaterialBase):void
    {
        if(this.getMesh() == null)
        {

            let mesh:DashedLineMesh = new DashedLineMesh();
            mesh.vbWholeDataEnabled = false;
            mesh.setBufSortFormat( material.getBufSortFormat() );
            mesh.initialize(this.m_posarr, this.m_colorarr);
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
        
        this.m_colorarr = [
            this.color.r,this.color.g,this.color.b, this.color.r,this.color.g,this.color.b                        
        ];
        this.createMaterial();
        this.activeDisplay();

    }
    initializeRectXOY(px:number,py:number,pw:number,ph:number):void
    {
        pw += px;
        ph += py;
        if(!this.dynColorEnabled) {
            this.m_colorarr = [
                this.color.r,this.color.g,this.color.b, this.color.r,this.color.g,this.color.b,
                this.color.r,this.color.g,this.color.b, this.color.r,this.color.g,this.color.b,
                this.color.r,this.color.g,this.color.b, this.color.r,this.color.g,this.color.b,
                this.color.r,this.color.g,this.color.b, this.color.r,this.color.g,this.color.b
            ];
        }
        this.m_posarr = [px,py,0.0, pw,py,0.0,  pw,py,0.0, pw,ph,0.0,  pw,ph,0.0,px,ph,0.0, px,ph,0.0,px,py,0.0];

        this.createMaterial();
        this.activeDisplay();
    }
    toString():string
    {
        return "[Line3DEntity]";
    }
}