/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import * as Vector3DT from "../../vox/geom/Vector3";
import * as ROTransformT from "../../vox/display/ROTransform";
import * as RendererStateT from "../../vox/render/RendererState";
import * as DisplayEntityT from "../../vox/entity/DisplayEntity";
import * as MaterialBaseT from '../../vox/material/MaterialBase';
import * as Default3DMaterialT from "../../vox/material/mcase/Default3DMaterial";
import * as TextureProxyT from "../../vox/texture/TextureProxy";
import * as VtxBufConstT from "../../vox/mesh/VtxBufConst";
import * as Box3DMeshT from "../../vox/mesh/Box3DMesh";

import Vector3D = Vector3DT.vox.geom.Vector3D;
import ROTransform = ROTransformT.vox.display.ROTransform;
import RendererState = RendererStateT.vox.render.RendererState;
import DisplayEntity = DisplayEntityT.vox.entity.DisplayEntity;
import MaterialBase = MaterialBaseT.vox.material.MaterialBase;
import Default3DMaterial = Default3DMaterialT.vox.material.mcase.Default3DMaterial;
import TextureProxy = TextureProxyT.vox.texture.TextureProxy;
import VtxNormalType = VtxBufConstT.vox.mesh.VtxNormalType;
import Box3DMesh = Box3DMeshT.vox.mesh.Box3DMesh;

export namespace vox
{
    export namespace entity
    {
        export class Box3DEntity extends DisplayEntity
        {
            normalScale:number = 1.0;
            private m_normalType:number = VtxNormalType.FLAT;
            private m_minV:Vector3D = null;
            private m_maxV:Vector3D = null;
            constructor(transform:ROTransform = null)
            {
                super(transform);
            }
            useFlatNormal():void
            {
                this.m_normalType = VtxNormalType.FLAT;
            }
            useGourandNormal():void
            {
                this.m_normalType = VtxNormalType.GOURAND;
            }
            private createMaterial(texList:TextureProxy[]):void
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
            showBackFace():void
            {
                this.setRenderState(RendererState.FRONT_CULLFACE_NORMAL_STATE);
            }
            showFrontFace():void
            {
                this.setRenderState(RendererState.NORMAL_STATE);
            }
            initialize(minV:Vector3D, maxV:Vector3D,texList:TextureProxy[] = null):void
            {
                this.m_minV = minV;
                this.m_maxV = maxV;
                this.createMaterial(texList);
                this.activeDisplay();
            }

            protected __activeMesh(material:MaterialBase):void
            {
                if(this.getMesh() == null)
                {
                    let mesh:Box3DMesh = new Box3DMesh();
                    mesh.vaoEnabled = true;
                    mesh.m_normalType = this.m_normalType;
                    mesh.normalScale = this.normalScale;
                    mesh.vbWholeDataEnabled = this.vbWholeDataEnabled;
                    mesh.setBufSortFormat( material.getBufSortFormat() );
                    mesh.initialize(this.m_minV, this.m_maxV);
                    this.m_minV = null;
                    this.m_maxV = null;
                    this.setMesh(mesh);
                }
            }

            setFaceUVSAt(uvslen8:Float32Array,i:number):void
            {
                let mesh:Box3DMesh = this.getMesh() as Box3DMesh;
                if(mesh != null)
                {
                    mesh.setFaceUVSAt(uvslen8, i);
                }
            }
            toString():string
            {
                return "[Box3DEntity(uid = "+this.getUid()+", __$wuid = "+this.__$wuid+", __$weid = "+this.__$weid+")]";
            }
        }

    }
}