/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import DisplayEntity from "../../vox/entity/DisplayEntity";
import IRenderMaterial from "../../vox/render/IRenderMaterial";
import IROTransform from '../../vox/display/IROTransform';
import Default3DMaterial from "../../vox/material/mcase/Default3DMaterial";
import IRenderTexture from "../../vox/render/texture/IRenderTexture";
import ObjData3DMesh from "../../vox/mesh/obj/ObjData3DMesh";
import RendererState from "../render/RendererState";
import Color4 from "../material/Color4";

export default class ObjData3DEntity extends DisplayEntity {
    moduleScale: number = 1.0;
    dataIsZxy: boolean = false;
    vtxColor: Color4 = null;
    normalEnabled: boolean = false;
    wireframe: boolean = false;
    baseParsering: boolean = false;
    private m_str: string = "";

    constructor(transform: IROTransform = null) {
        super(transform);
    }
    private createMaterial(texList: IRenderTexture[]): void {
        if (this.getMaterial() == null) {
            let cm: Default3DMaterial = new Default3DMaterial();
            cm.normalEnabled = this.normalEnabled;
            cm.vertColorEnabled = this.vtxColor != null;
            cm.setTextureList(texList);
            this.setMaterial(cm);
        }
        else if (texList != null && this.getMaterial().getTextureTotal() < 1) {
            this.getMaterial().setTextureList(texList);
        }
    }
    initialize(objDataStr: string, texList: IRenderTexture[] = null): void {
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
    initializeByObjDataUrl(objDataUrl: string, texList: IRenderTexture[] = null): void {
        this.createMaterial(texList);
        if (this.getMesh() == null) {
            
            let request: XMLHttpRequest = new XMLHttpRequest();
            request.open('GET', objDataUrl, true);

            request.onload = () => {
                // if (request.status <= 206 && request.responseText.indexOf(" OBJ ") > 0) {
                if (request.status <= 206) {
                    this.initialize(request.responseText, texList);
                }
                else {
                    console.error("load obj format module url error: ", objDataUrl);
                }
            };
            request.onerror = e => {
                console.error("load obj format module url error: ", objDataUrl);
            };

            request.send(null);
        }
    }
    protected __activeMesh(material: IRenderMaterial): void {
        if (this.getMesh() == null) {
            let mesh = new ObjData3DMesh();
            mesh.baseParsering = this.baseParsering;
            mesh.moduleScale = this.moduleScale;
            mesh.vbWholeDataEnabled = this.vbWholeDataEnabled;
            mesh.wireframe = this.wireframe;
            mesh.setVtxBufRenderData(material);
            mesh.initialize(this.m_str, this.dataIsZxy);
            console.log("mesh: ", mesh);
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