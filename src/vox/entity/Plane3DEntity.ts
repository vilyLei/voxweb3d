/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import * as RendererStateT from "../../vox/render/RendererState";
import * as DisplayEntityT from "../../vox/entity/DisplayEntity";
import * as MaterialBaseT from '../../vox/material/MaterialBase';
import * as Default3DMaterialT from "../../vox/material/mcase/Default3DMaterial";
import * as ScreenPlaneMaterialT from "../../vox/material/mcase/ScreenPlaneMaterial";
import * as TextureProxyT from "../../vox/texture/TextureProxy";
import * as RORectMeshT from "../../vox/mesh/RectPlaneMesh";
import * as ROTransformT from "../../vox/display/ROTransform";

import RendererState = RendererStateT.vox.render.RendererState;
import DisplayEntity = DisplayEntityT.vox.entity.DisplayEntity;
import MaterialBase = MaterialBaseT.vox.material.MaterialBase;
import Default3DMaterial = Default3DMaterialT.vox.material.mcase.Default3DMaterial;
import ScreenPlaneMaterial = ScreenPlaneMaterialT.vox.material.mcase.ScreenPlaneMaterial;
import TextureProxy = TextureProxyT.vox.texture.TextureProxy;
import RectPlaneMesh = RORectMeshT.vox.mesh.RectPlaneMesh;
import ROTransform = ROTransformT.vox.display.ROTransform;

export namespace vox
{
    export namespace entity
    {
        export class Plane3DEntity extends DisplayEntity
        {
            private m_startX:number = 0;
            private m_startZ:number = 0;
            private m_pwidth:number = 0;
            private m_plong:number = 0;
            private m_flag:number = 0;
            flipVerticalUV:boolean = false;
            private m_screenAlignEnabled:boolean = false;
            constructor(transform:ROTransform = null)
            {
                super(transform);
            }
            // 是否是平铺在屏幕上
            setScreenAlignEnable(enable:boolean):void
            {
                this.m_screenAlignEnabled = enable;
            }
            createMaterial(texList:TextureProxy[]):void
            {
                if(this.getMaterial() == null)
                {
                    //ScreenPlaneMaterial
                    if(this.m_screenAlignEnabled)
                    {
                        let cm:ScreenPlaneMaterial = new ScreenPlaneMaterial();
                        cm.setTextureList(texList);
                        this.setMaterial(cm);
                    }
                    else
                    {
                        let cm:Default3DMaterial = new Default3DMaterial();
                        cm.setTextureList(texList);
                        this.setMaterial(cm);
                    }
                }
                else
                {
                    this.getMaterial().setTextureList(texList);
                }
            }
            showDoubleFace():void
            {
                this.setRenderState(RendererState.NONE_CULLFACE_NORMAL_STATE);
            }
            toTransparentBlend(always:boolean = false):void
            {
                if(always)
                {
                    this.setRenderState(RendererState.BACK_TRANSPARENT_STATE);
                }
                else
                {
                    this.setRenderState(RendererState.BACK_TRANSPARENT_ALWAYS_STATE);
                }
            }
            toBrightnessBlend(always:boolean = false):void
            {
                if(always)
                {
                    this.setRenderState(RendererState.BACK_ADD_BLENDSORT_STATE);
                }
                else
                {
                    this.setRenderState(RendererState.BACK_ALPHA_ADD_ALWAYS_STATE);
                }
            }
            /**
             * initialize a rectangle fix screen size plane ,and it parallel the 3d space XOY plane
             * @param texList textures list, default value is null.
             */
            initializeFixScreen(texList:TextureProxy[] = null):void
            {
                this.initializeXOY(-1.0,-1.0,2.0,2.0,texList);
            }
            /**
             * initialize a rectangle plane ,and it parallel the 3d space XOY plane
             * @param minX the min x axis position of the rectangle plane.
             * @param minZ the min y axis position of the rectangle plane.
             * @param pwidth the width of the rectangle plane.
             * @param height the height of the rectangle plane.
             * @param texList textures list, default value is null.
             */
            initializeXOY(minX:number,minY:number,pwidth:number,pheight:number,texList:TextureProxy[] = null):void
            {
                this.m_startX = minX;
                this.m_startZ = minY;
                this.m_pwidth = pwidth;
                this.m_plong = pheight;
                this.m_flag = 0;
                this.createMaterial(texList);
                this.activeDisplay();
            }
            /**
             * initialize a rectangle plane ,and it parallel the 3d space XOZ plane
             * @param minX the min x axis position of the rectangle plane.
             * @param minZ the min z axis position of the rectangle plane.
             * @param pwidth the width of the rectangle plane.
             * @param plong the long of the rectangle plane.
             * @param texList textures list, default value is null.
             */
            initializeXOZ(minX:number,minZ:number,pwidth:number,plong:number,texList:TextureProxy[] = null):void
            {
                this.m_flag = 1;
                this.m_startX = minX;
                this.m_startZ = minZ;
                this.m_pwidth = pwidth;
                this.m_plong = plong;
                this.createMaterial(texList);
                this.activeDisplay();
            }
            /**
             * initialize a rectangle plane ,and it parallel the 3d space YOZ plane
             * @param minX the min x axis position of the rectangle plane.
             * @param minZ the min z axis position of the rectangle plane.
             * @param pwidth the width of the rectangle plane.
             * @param plong the long of the rectangle plane.
             * @param texList textures list, default value is null.
             */
            initializeYOZ(minY:number,minZ:number,pwidth:number,plong:number,texList:TextureProxy[] = null):void
            {
                this.m_flag = 2;
                this.m_startX = minY;
                this.m_startZ = minZ;
                this.m_pwidth = pwidth;
                this.m_plong = plong;
                this.createMaterial(texList);
                this.activeDisplay();
            }
            protected __activeMesh(material:MaterialBase)
            {
                if(this.getMesh() == null)
                {
                    let mesh:RectPlaneMesh = new RectPlaneMesh();
                    mesh.flipVerticalUV = this.flipVerticalUV;
                    mesh.vbWholeDataEnabled = this.vbWholeDataEnabled;
                    mesh.axisFlag = this.m_flag;
                    mesh.setBufSortFormat( material.getBufSortFormat() );
                    mesh.initialize(this.m_startX,this.m_startZ,this.m_pwidth,this.m_plong);
                    this.setMesh(mesh);
                }
            }
            toString():string
            {
                return "[Plane3DEntity]";
            }
        }
    }
}
