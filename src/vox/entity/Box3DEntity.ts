/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import * as Vector3DT from "../../vox/geom/Vector3";
import * as Matrix4T from "../../vox/geom/Matrix4";
import * as ROTransformT from "../../vox/display/ROTransform";
import * as RendererStateT from "../../vox/render/RendererState";
import * as DisplayEntityT from "../../vox/entity/DisplayEntity";
import * as MaterialBaseT from '../../vox/material/MaterialBase';
import * as Default3DMaterialT from "../../vox/material/mcase/Default3DMaterial";
import * as TextureProxyT from "../../vox/texture/TextureProxy";
import * as VtxBufConstT from "../../vox/mesh/VtxBufConst";
import * as Box3DMeshT from "../../vox/mesh/Box3DMesh";

import Vector3D = Vector3DT.vox.geom.Vector3D;
import Matrix4 = Matrix4T.vox.geom.Matrix4;
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
            private m_transMatrix:Matrix4 = null;
            constructor(transform:ROTransform = null)
            {
                super(transform);
            }
            setVtxTransformMatrix(matrix:Matrix4):void
            {
                this.m_transMatrix = matrix;
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
            /**
             * initialize a box geometry data and texture data
             * @param minV the min position of the box
             * @param maxV the max position of the box
             * @param texList  TextureProxy instance list
             */
            initialize(minV:Vector3D, maxV:Vector3D,texList:TextureProxy[] = null):void
            {
                this.m_minV = minV;
                this.m_maxV = maxV;
                this.createMaterial(texList);
                this.activeDisplay();
            }
            /**
             * initialize a box(geometry data and texture data) to a cube with the cube size value
             * @param cubeSize  cube size value
             * @param texList  TextureProxy instance list
             */
            initializeCube(cubeSize:number,texList:TextureProxy[] = null):void
            {
                cubeSize *= 0.5;
                this.m_minV = new Vector3D(-cubeSize,-cubeSize,-cubeSize);
                this.m_maxV = new Vector3D(cubeSize,cubeSize,cubeSize);
                this.createMaterial(texList);
                this.activeDisplay();
            }

            protected __activeMesh(material:MaterialBase):void
            {
                let mesh:Box3DMesh = null;
                if(this.getMesh() == null)
                {
                    mesh = new Box3DMesh();
                }
                else if(this.getMesh().getIVS() == null)
                {
                    mesh = this.getMesh() as Box3DMesh;
                }
                if(mesh != null)
                {
                    if(this.m_transMatrix != null)
                    {
                        mesh.setTransformMatrix(this.m_transMatrix);
                    }
                    mesh.normalType = this.m_normalType;
                    mesh.normalScale = this.normalScale;
                    mesh.vbWholeDataEnabled = this.vbWholeDataEnabled;
                    mesh.setBufSortFormat( material.getBufSortFormat() );
                    mesh.initialize(this.m_minV, this.m_maxV);
                    this.m_minV = null;
                    this.m_maxV = null;
                    this.setMesh(mesh);
                    mesh.setTransformMatrix(null);
                }
                this.m_transMatrix = null;
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
                return "[Box3DEntity(uid = "+this.getUid()+", rseFlag = "+this.__$rseFlag+")";
            }
        }

    }
}