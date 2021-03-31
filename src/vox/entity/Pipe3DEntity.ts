/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import * as Matrix4T from "../../vox/math/Matrix4";
import * as ROTransformT from "../../vox/display/ROTransform";
import * as DisplayEntityT from "../../vox/entity/DisplayEntity";
import * as MaterialBaseT from '../../vox/material/MaterialBase';
import * as RendererStateT from "../../vox/render/RendererState";
import * as Default3DMaterialT from "../../vox/material/mcase/Default3DMaterial";
import * as TextureProxyT from "../../vox/texture/TextureProxy";
import * as Pipe3DMeshT from "../../vox/mesh/Pipe3DMesh";

import Matrix4 = Matrix4T.vox.math.Matrix4;
import ROTransform = ROTransformT.vox.display.ROTransform;
import DisplayEntity = DisplayEntityT.vox.entity.DisplayEntity;
import MaterialBase = MaterialBaseT.vox.material.MaterialBase;
import RendererState = RendererStateT.vox.render.RendererState;
import Default3DMaterial = Default3DMaterialT.vox.material.mcase.Default3DMaterial;
import TextureProxy = TextureProxyT.vox.texture.TextureProxy;
import Pipe3DMesh = Pipe3DMeshT.vox.mesh.Pipe3DMesh;

export namespace vox
{
    export namespace entity
    {
        export class Pipe3DEntity extends DisplayEntity
        {
            private m_plongitudeNumSegments:number = 10.0;
            private m_uvType:number = 1;
            private m_alignYRatio:number = -0.5;
            private m_transMatrix:Matrix4 = null;
            uScale:number = 1.0;
            vScale:number = 1.0;
            m_radius:number = 50.0;
            m_height:number = 100.0;
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
                else
                {
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
                    let mesh:Pipe3DMesh = new Pipe3DMesh();
                    
                    if(this.m_transMatrix != null)
                    {
                        mesh.setTransformMatrix(this.m_transMatrix);
                    }
                    mesh.uScale = this.uScale;
                    mesh.vScale = this.vScale;
                    mesh.vbWholeDataEnabled = this.vbWholeDataEnabled;
                    mesh.setBufSortFormat( material.getBufSortFormat() );
                    mesh.initialize(this.m_radius, this.m_height, this.m_plongitudeNumSegments, 2, this.m_uvType, this.m_alignYRatio);
                    this.setMesh(mesh);
                    mesh.setTransformMatrix(null);
                }
                this.m_transMatrix = null;
            }

            toString():string
            {
                return "[Pipe3DEntity(uid = "+this.getUid()+", rseFlag = "+this.__$rseFlag+")]";
            }
        }
    }
}
