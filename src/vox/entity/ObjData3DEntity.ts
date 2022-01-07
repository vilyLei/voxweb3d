/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import DisplayEntity from "../../vox/entity/DisplayEntity";
import MaterialBase from '../../vox/material/MaterialBase';
import ROTransform from '../../vox/display/ROTransform';
import Default3DMaterial from "../../vox/material/mcase/Default3DMaterial";
import TextureProxy from "../../vox/texture/TextureProxy";
import ObjData3DMesh from "../../vox/mesh/obj/ObjData3DMesh";
import RendererState from "../render/RendererState";

export default class ObjData3DEntity extends DisplayEntity {
    moduleScale: number = 1.0;
    dataIsZxy: boolean = false;
    constructor(transform: ROTransform = null) {
        super(transform);
    }
    private m_str: string = "";
    private createMaterial(texList: TextureProxy[]) {
        if (this.getMaterial() == null) {
            let cm: Default3DMaterial = new Default3DMaterial();
            cm.setTextureList(texList);
            this.setMaterial(cm);
        }
        else {
            this.getMaterial().setTextureList(texList);
        }
    }
    initialize(objDataStr: string, texList: TextureProxy[] = null): void {
        this.m_str = objDataStr;
        this.activeDisplay();
    }
    showBackFace(): void {
        this.setRenderState(RendererState.BACK_CULLFACE_NORMAL_STATE);
    }
    showFrontFace(): void {
        this.setRenderState(RendererState.FRONT_CULLFACE_NORMAL_STATE);
    }
    showDoubleFace(): void {
        this.setRenderState(RendererState.NONE_CULLFACE_NORMAL_STATE);
    }
    initializeByObjDataUrl(objDataUrl: string, texList: TextureProxy[] = null): void {
        this.createMaterial(texList);
        if (this.getMesh() == null) {
            
            let request: XMLHttpRequest = new XMLHttpRequest();
            request.open('GET', objDataUrl, true);

            request.onload = () => {
                if (request.status <= 206 && request.responseText.indexOf(" OBJ ") > 0) {
                    this.initialize(request.responseText, texList);
                }
                else {
                    console.error("load obj format module url error: ", objDataUrl);
                }
            };
            request.onerror = e => {
                console.error("load obj format module url error: ", objDataUrl);
            };

            request.send();
        }
    }
    protected __activeMesh(material: MaterialBase): void {
        if (this.getMesh() == null) {
            let mesh: ObjData3DMesh = new ObjData3DMesh();
            mesh.moduleScale = this.moduleScale;
            mesh.vbWholeDataEnabled = this.vbWholeDataEnabled;
            mesh.setBufSortFormat(this.getMaterial().getBufSortFormat());
            mesh.initialize(this.m_str, this.dataIsZxy);
            this.setMesh(mesh);
        }
    }
    /**
     * @return 返回true是则表示这是基于三角面的多面体, 返回false则是一个数学方程描述的几何体(例如球体)
     */
    isPolyhedral(): boolean {
        return true;
    }
}