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
import Sphere3DMesh from "../../vox/mesh/Sphere3DMesh"
import RendererState from "../render/RendererState";

export default class Sphere3DEntity extends DisplayEntity
{
    constructor(transform:ROTransform = null)
    {
        super(transform);
    }
    doubleTriFaceEnabled:boolean = false;
    wireframe: boolean = false;
    private m_radius:number = 50.0;
    private m_longitudeNumSegments:number = 10;
    private m_latitudeNumSegments:number = 10;

    showBackFace():void
    {
        this.setRenderState(RendererState.NORMAL_STATE);
    }
    showFrontFace():void
    {
        this.setRenderState(RendererState.FRONT_CULLFACE_NORMAL_STATE);
    }
    showDoubleFace(always: boolean = false, doubleFace: boolean = true): void {
        if (always) {
            if (doubleFace) this.setRenderState(RendererState.NONE_CULLFACE_NORMAL_ALWAYS_STATE);
            else this.setRenderState(RendererState.BACK_NORMAL_ALWAYS_STATE);
        }
        else {
            if (doubleFace) this.setRenderState(RendererState.NONE_CULLFACE_NORMAL_STATE);
            else this.setRenderState(RendererState.NORMAL_STATE);
        }
    }
    toTransparentBlend(always: boolean = false, doubleFace: boolean = false): void {
        if (always) {
            if (doubleFace) this.setRenderState(RendererState.NONE_TRANSPARENT_ALWAYS_STATE);
            else this.setRenderState(RendererState.BACK_TRANSPARENT_ALWAYS_STATE);
        }
        else {
            if (doubleFace) this.setRenderState(RendererState.NONE_TRANSPARENT_STATE);
            else this.setRenderState(RendererState.BACK_TRANSPARENT_STATE);
        }
    }
    toBrightnessBlend(always: boolean = false, doubleFace: boolean = false): void {
        if (always) {
            if (doubleFace) this.setRenderState(RendererState.NONE_ADD_ALWAYS_STATE);
            else this.setRenderState(RendererState.BACK_ADD_ALWAYS_STATE);
        }
        else {
            if (doubleFace) this.setRenderState(RendererState.NONE_ADD_BLENDSORT_STATE);
            else this.setRenderState(RendererState.BACK_ADD_BLENDSORT_STATE);
        }
    }
    createMaterial(texList:TextureProxy[]):void
    {
        if(this.getMaterial() == null)
        {
            let cm:Default3DMaterial = new Default3DMaterial();
            cm.setTextureList(texList);
            this.setMaterial(cm);
        }
        else if(texList != null)
        {
            this.getMaterial().setTextureList(texList);
        }
    }
    
    initializeFrom(entity:DisplayEntity,texList:TextureProxy[] = null)
    {
        this.copyMeshFrom(entity);
        this.copyMaterialFrom(entity);
        
        this.createMaterial(texList);
        this.activeDisplay();
    }
    initialize(radius:number, longitudeNumSegments:number, latitudeNumSegments:number,texList:TextureProxy[] = null)
    {
        this.m_radius = radius;
        this.m_longitudeNumSegments = longitudeNumSegments;
        this.m_latitudeNumSegments = latitudeNumSegments;
    
        this.createMaterial(texList);
        this.activeDisplay();
    }

    protected __activeMesh(material:MaterialBase):void
    {
        if(this.getMesh() == null)
        {
            let mesh = new Sphere3DMesh();
            mesh.wireframe = this.wireframe;
            mesh.vbWholeDataEnabled = this.vbWholeDataEnabled;
            mesh.setBufSortFormat( material.getBufSortFormat() );
            mesh.initialize(this.m_radius, this.m_longitudeNumSegments, this.m_latitudeNumSegments,this.doubleTriFaceEnabled);
            this.setMesh(mesh);
        }
    }

    toString():string
    {
        return "[Sphere3DEntity(uid = "+this.getUid()+", rseFlag = "+this.__$rseFlag+")]";
    }
}