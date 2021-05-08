/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import DisplayEntity from "../../vox/entity/DisplayEntity";
import MaterialBase from '../../vox/material/MaterialBase';
import Default3DMaterial from "../../vox/material/mcase/Default3DMaterial";
import TextureProxy from "../../vox/texture/TextureProxy";
import ObjData3DMesh from "../../vox/mesh/obj/ObjData3DMesh";

export default class ObjData3DEntity extends DisplayEntity
{
    moduleScale = 1.0;
    dataIsZxy = false;
    private m_str:string = "";
    private createMaterial(texList:TextureProxy[])
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
    initialize(objDataStr:string,texList:TextureProxy[] = null):void
    {
        this.m_str = objDataStr;
        this.activeDisplay();        
    }
    initializeByObjDataUrl(objDataUrl:string,texList:TextureProxy[] = null):void
    {
        this.createMaterial(texList);
        if(this.getMesh() == null)
        {
            let t_self:any = this;
            let client:any = new XMLHttpRequest();
            client.open('GET', objDataUrl);
            client.onload = function(p:any):void
            {
                t_self.initialize(client.responseText, texList);
            }
            client.send();
        }
    }    
    protected __activeMesh(material:MaterialBase):void
    {
        if(this.getMesh() == null)
        {
            let mesh = new ObjData3DMesh();
            mesh.moduleScale = this.moduleScale;
            mesh.vbWholeDataEnabled = this.vbWholeDataEnabled;
            mesh.setBufSortFormat( this.getMaterial().getBufSortFormat() );
            mesh.initialize(this.m_str,this.dataIsZxy);
            this.setMesh(mesh);
        }
    }
}