/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import Vector3D from "../../vox/math/Vector3D";
import QuadLineMesh from '../../vox/mesh/QuadLineMesh';
import DisplayEntity from "../../vox/entity/DisplayEntity";
import Color4 from '../../vox/material/Color4';
import IRenderMaterial from "../../vox/render/IRenderMaterial";
import BrokenQuadLine3DMaterial from '../../vox/material/mcase/BrokenQuadLine3DMaterial';

class QuadLine3DEntity extends DisplayEntity
{
    constructor()
    {
        super();
    }
    color:Color4 = new Color4(1.0,1.0,1.0,1.0);
    private m_posarr:number[] = [100.0,0.0,0.0, 0.0,0,0];
    private m_thickness:number = 100.0;
    createMaterial():void
    {
        if(this.getMaterial() == null)
        {
            let cm:BrokenQuadLine3DMaterial = new BrokenQuadLine3DMaterial();
            this.setMaterial(cm);
        }
    }
    protected __activeMesh(material:IRenderMaterial):void
    {
        if(this.getMesh() == null)
        {
            let colorarr:number[] = [
                this.color.r,this.color.g,this.color.b, this.color.a
                , this.color.r,this.color.g,this.color.b, this.color.a
            ];
            let mesh:QuadLineMesh = new QuadLineMesh();
            mesh.vbWholeDataEnabled = true;
            mesh.initialize(this.m_posarr, colorarr, this.m_thickness);
            this.setMesh(mesh);
        }
    }
    initialize(begin:Vector3D,end:Vector3D,thickness:number):void
    {
        this.m_thickness = thickness;
        if(this.m_thickness < 0.1)
        {
            this.m_thickness = 0.1;
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
        return "[QuadLine3DEntity]";
    }
}

class QuadBrokenLine3DEntity extends DisplayEntity
{
    constructor()
    {
        super();
    }
    color:Color4 = new Color4(1.0,1.0,1.0,1.0);
    private m_posarr:number[] = null;
    private m_thickness:number = 100.0;
    createMaterial():void
    {
        if(this.getMaterial() == null)
        {
            let cm:BrokenQuadLine3DMaterial = new BrokenQuadLine3DMaterial();
            this.setMaterial(cm);
        }
    }
    protected __activeMesh(material:IRenderMaterial):void
    {
        if(this.getMesh() == null)
        {
            let tot:number = Math.floor(this.m_posarr.length / 3.0);
            let colorarr:number[] = [];
            colorarr.length = tot * 4;
            let i:number = 0;
            let j:number = 0;
            for(; i < tot; ++i)
            {
                colorarr[j  ] = this.color.r;
                colorarr[j+1] = this.color.g;
                colorarr[j+2] = this.color.b;
                colorarr[j+3] = this.color.a;
                j += 4;
            }
            //  let colorarr:number[] = [
            //      this.color.r,this.color.g,this.color.b, this.color.a
            //      , this.color.r,this.color.g,this.color.b, this.color.a
            //      , this.color.r,this.color.g,this.color.b, this.color.a
            //  ];
            let mesh:QuadLineMesh = new QuadLineMesh();
            mesh.vbWholeDataEnabled = true;
            mesh.initialize(this.m_posarr, colorarr, this.m_thickness);
            this.setMesh(mesh);
        }
    }
    initialize(posarr:number[], thickness:number):void
    {
        //segTotal:number,
        this.m_thickness = thickness;
        this.m_posarr = posarr;

        if(this.m_thickness < 0.1)
        {
            this.m_thickness = 0.1;
        }
        
        this.createMaterial();
        this.activeDisplay();

    }
    
    toString():string
    {
        return "[QuadLine3DEntity]";
    }
}
export default QuadLine3DEntity;
export {QuadLine3DEntity,QuadBrokenLine3DEntity};