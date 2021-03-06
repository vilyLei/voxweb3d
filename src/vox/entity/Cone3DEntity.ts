/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import ROTransform from "../../vox/display/ROTransform";
import DisplayEntity from "../../vox/entity/DisplayEntity";
import MaterialBase from '../../vox/material/MaterialBase';
import Default3DMaterial from "../../vox/material/mcase/Default3DMaterial";
import TextureProxy from "../../vox/texture/TextureProxy";
import Cone3DMesh from "../../vox/mesh/Cone3DMesh";

export default class Cone3DEntity extends DisplayEntity
{
    constructor(transform:ROTransform = null)
    {
        super(transform);
    }
    uScale:number = 1.0;
    vScale:number = 1.0;
    m_radius:number = 50.0;
    m_height:number = 100.0;
    private m_plongitudeNumSegments:number = 10.0;
    private m_uvType:number = 1;
    private m_alignYRatio:number = -0.5;
    createMaterial(texList:TextureProxy[]):void
    {
        if(this.getMaterial() == null)
        {
            let cm:Default3DMaterial = new Default3DMaterial();
            cm.setTextureList(texList);
            this.setMaterial(cm);
        }
        else
        {
            this.getMaterial().setTextureList(texList);
        }
    }
    initialize(radius:number, height:number, longitudeNumSegments:number,texList:TextureProxy[] = null,uvType:number = 1, alignYRatio:number = -0.5):void
    {
        this.m_radius = radius;
        this.m_height = height;
        this.m_plongitudeNumSegments = longitudeNumSegments;
        this.m_uvType = uvType;
        this.m_alignYRatio = alignYRatio;
    
        this.createMaterial(texList);
        this.activeDisplay();
    }

    protected __activeMesh(material:MaterialBase):void
    {
        if(this.getMesh() == null)
        {
            let mesh:Cone3DMesh = new Cone3DMesh();
            mesh.uScale = this.uScale;
            mesh.vScale = this.vScale;
            mesh.vbWholeDataEnabled = this.vbWholeDataEnabled;
            mesh.setBufSortFormat( material.getBufSortFormat() );
            mesh.initialize(this.m_radius, this.m_height, this.m_plongitudeNumSegments, 2, this.m_uvType, this.m_alignYRatio);
            this.setMesh(mesh);
        }
    }

    toString():string
    {
        return "[Cone3DEntity(uid = "+this.getUid()+", rseFlag = "+this.__$rseFlag+")]";
    }
}