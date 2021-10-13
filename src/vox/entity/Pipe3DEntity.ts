/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import Vector3D from "../../vox/math/Vector3D";
import Matrix4 from "../../vox/math/Matrix4";
import ROTransform from "../../vox/display/ROTransform";
import DisplayEntity from "../../vox/entity/DisplayEntity";
import MaterialBase from '../../vox/material/MaterialBase';
import RendererState from "../../vox/render/RendererState";
import Default3DMaterial from "../../vox/material/mcase/Default3DMaterial";
import TextureProxy from "../../vox/texture/TextureProxy";
import Pipe3DMesh from "../../vox/mesh/Pipe3DMesh";

export default class Pipe3DEntity extends DisplayEntity
{
    private m_longitudeNum:number = 10;
    private m_latitudeNum:number = 1;
    private m_uvType:number = 1;
    private m_alignYRatio:number = -0.5;
    private m_transMatrix:Matrix4 = null;
    private m_currMesh:Pipe3DMesh = null;
    
    uScale:number = 1.0;
    vScale:number = 1.0;
    wireframe: boolean = false;
    private m_radius:number = 50.0;
    private m_height:number = 100.0;
    constructor(transform:ROTransform = null)
    {
        super(transform);
    }
    setVtxTransformMatrix(matrix:Matrix4):void
    {
        this.m_transMatrix = matrix;
    }
    createMaterial(texList:TextureProxy[]):void
    {
        if(this.getMaterial() == null)
        {
            let cm:Default3DMaterial = new Default3DMaterial();
            cm.setTextureList(texList);
            this.setMaterial(cm);
        }
        else if (texList != null && this.getMaterial().getTextureTotal() < 1) {
            this.getMaterial().setTextureList(texList);
        }
    }
    showDoubleFace(doubleFace:boolean = true):void
    {
        if(doubleFace)
        {
            this.setRenderState(RendererState.NONE_CULLFACE_NORMAL_STATE);
        }
        else
        {
            this.setRenderState(RendererState.NORMAL_STATE);
        }
    }
    toTransparentBlend(always:boolean = false,doubleFace:boolean = false):void
    {
        if(always)
        {
            if(doubleFace) this.setRenderState(RendererState.NONE_TRANSPARENT_ALWAYS_STATE);
            else this.setRenderState(RendererState.BACK_TRANSPARENT_ALWAYS_STATE);
        }
        else
        {
            if(doubleFace) this.setRenderState(RendererState.NONE_TRANSPARENT_STATE);
            else this.setRenderState(RendererState.BACK_TRANSPARENT_STATE);
        }
    }
    toBrightnessBlend(always:boolean = false,doubleFace:boolean = false):void
    {
        if(always)
        {
            if(doubleFace) this.setRenderState(RendererState.NONE_ADD_ALWAYS_STATE);
            else this.setRenderState(RendererState.BACK_ADD_ALWAYS_STATE);
        }
        else
        {
            if(doubleFace) this.setRenderState(RendererState.NONE_ADD_BLENDSORT_STATE);
            else this.setRenderState(RendererState.BACK_ADD_BLENDSORT_STATE);
        }
    }
    initialize(radius:number, height:number, longitudeNum:number,latitudeNum:number,texList:TextureProxy[] = null,uvType:number = 1, alignYRatio:number = -0.5):void
    {
        this.m_radius = radius;
        this.m_height = height;
        this.m_longitudeNum = longitudeNum;
        this.m_latitudeNum = latitudeNum;
        this.m_uvType = uvType;
        this.m_alignYRatio = alignYRatio;
    
        this.createMaterial(texList);
        this.activeDisplay();
    }

    protected __activeMesh(material:MaterialBase):void
    {
        this.m_currMesh = this.getMesh() as Pipe3DMesh;
        if(this.m_currMesh == null)
        {
            this.m_currMesh = new Pipe3DMesh();
            
            if(this.m_transMatrix != null)
            {
                this.m_currMesh.setTransformMatrix(this.m_transMatrix);
            }
            this.m_currMesh.uScale = this.uScale;
            this.m_currMesh.vScale = this.vScale;
            this.m_currMesh.vbWholeDataEnabled = this.vbWholeDataEnabled;
            this.m_currMesh.wireframe = this.wireframe;
            this.m_currMesh.setBufSortFormat( material.getBufSortFormat() );
            this.m_currMesh.initialize(this.m_radius, this.m_height, this.m_longitudeNum, this.m_latitudeNum, this.m_uvType, this.m_alignYRatio);
            this.setMesh(this.m_currMesh);
            this.m_currMesh.setTransformMatrix(null);
        }
        this.m_transMatrix = null;
    }
    reinitialize():void
    {
        if(this.m_currMesh != null)
        {
            this.m_currMesh.reinitialize();
        }
    }
    getCircleCenterAt(i:number, outV:Vector3D):void
    {
        if(this.m_currMesh != null)
        {
            this.m_currMesh.getCircleCenterAt(i, outV);
        }
    }
    transformCircleAt(i:number, mat4:Matrix4):void
    {
        if(this.m_currMesh != null)
        {
            this.m_currMesh.transformCircleAt(i, mat4);
        }
    }
    toString():string
    {
        return "[Pipe3DEntity(uid = "+this.getUid()+", rseFlag = "+this.__$rseFlag+")]";
    }
}