/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import * as Vector3DT from "../../vox/math/Vector3D";
import * as RendererStateT from "../../vox/render/RendererState";
import * as DisplayEntityT from "../../vox/entity/DisplayEntity";
import * as MaterialBaseT from '../../vox/material/MaterialBase';
import * as Default3DMaterialT from "../../vox/material/mcase/LightLine3DMaterial";
import * as TextureProxyT from "../../vox/texture/TextureProxy";
import * as RORectMeshT from "../../vox/mesh/LightLine3DMesh";
import * as ROTransformT from "../../vox/display/ROTransform";

import Vector3D = Vector3DT.vox.math.Vector3D;
import RendererState = RendererStateT.vox.render.RendererState;
import DisplayEntity = DisplayEntityT.vox.entity.DisplayEntity;
import MaterialBase = MaterialBaseT.vox.material.MaterialBase;
import LightLine3DMaterial = Default3DMaterialT.vox.material.mcase.LightLine3DMaterial;
import TextureProxy = TextureProxyT.vox.texture.TextureProxy;
import LightLine3DMesh = RORectMeshT.vox.mesh.LightLine3DMesh;
import ROTransform = ROTransformT.vox.display.ROTransform;

export namespace vox
{
    export namespace entity
    {
        export class LightLine3DEntity extends DisplayEntity
        {
            private m_currMaterial:LightLine3DMaterial = null;
            private m_beginPos:Vector3D = new Vector3D();
            private m_endPos:Vector3D = new Vector3D(100.0,0.0,0.0);
            private m_lineW:number = 10.0;
            flipVerticalUV:boolean = false;
            flip90UV:boolean = false;
            constructor(transform:ROTransform = null)
            {
                super(transform);
            }
            createMaterial(texList:TextureProxy[]):void
            {
                if(this.getMaterial() == null)
                {
                    let cm:LightLine3DMaterial = new LightLine3DMaterial();
                    cm.setTextureList(texList);
                    this.setMaterial(cm);
                }
                else
                {
                    this.m_currMaterial = this.getMaterial() as LightLine3DMaterial;
                    this.m_currMaterial.setTextureList(texList);
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
            initialize(beginPos:Vector3D,endPos:Vector3D,lineW:number,texList:TextureProxy[] = null):void
            {
                this.m_beginPos.copyFrom(beginPos);
                this.m_endPos.copyFrom(endPos);
                this.m_lineW = lineW;

                this.createMaterial(texList);
                this.activeDisplay();
            }
            protected __activeMesh(material:MaterialBase)
            {
                if(this.getMesh() == null)
                {
                    let mesh:LightLine3DMesh = new LightLine3DMesh();
                    mesh.flipVerticalUV = this.flipVerticalUV;
                    mesh.vbWholeDataEnabled = this.vbWholeDataEnabled;
                    mesh.flip90UV = this.flip90UV;
                    mesh.setBufSortFormat( material.getBufSortFormat() );
                    mesh.initialize(this.m_beginPos,this.m_endPos,this.m_lineW);
                    this.setMesh(mesh);
                }
            }
            toString():string
            {
                return "[LightLine3DEntity]";
            }
        }
    }
}
