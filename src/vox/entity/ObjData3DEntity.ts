/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import * as DisplayEntityT from "../../vox/entity/DisplayEntity";
import * as MaterialBaseT from '../../vox/material/MaterialBase';
import * as Default3DMaterialT from "../../vox/material/mcase/Default3DMaterial";
import * as TextureProxyT from "../../vox/texture/TextureProxy";
import * as ObjData3DMeshT from "../../vox/mesh/obj/ObjData3DMesh";

import DisplayEntity = DisplayEntityT.vox.entity.DisplayEntity;
import MaterialBase = MaterialBaseT.vox.material.MaterialBase;
import Default3DMaterial = Default3DMaterialT.vox.material.mcase.Default3DMaterial;
import TextureProxy = TextureProxyT.vox.texture.TextureProxy;
import ObjData3DMesh = ObjData3DMeshT.vox.mesh.obj.ObjData3DMesh;

export namespace vox
{
    export namespace entity
    {
        export class ObjData3DEntity extends DisplayEntity
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
                    mesh.vaoEnabled = true;
                    mesh.moduleScale = this.moduleScale;
                    mesh.vbWholeDataEnabled = this.vbWholeDataEnabled;
                    mesh.setBufSortFormat( this.getMaterial().getBufSortFormat() );
                    mesh.initialize(this.m_str,this.dataIsZxy);
                    this.setMesh(mesh);
                }
            }
        }
    }
}