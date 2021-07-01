/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import RendererState from "../../vox/render/RendererState";
import DisplayEntity from "../../vox/entity/DisplayEntity";
import MaterialBase from '../../vox/material/MaterialBase';
import Default3DMaterial from "../../vox/material/mcase/Default3DMaterial";
import ScreenPlaneMaterial from "../../vox/material/mcase/ScreenPlaneMaterial";
import TextureProxy from "../../vox/texture/TextureProxy";
import RectPlaneMesh from "../../vox/mesh/RectPlaneMesh";
import ROTransform from "../../vox/display/ROTransform";
import Color4 from "../material/Color4";

export default class Plane3DEntity extends DisplayEntity {
    private m_startX: number = 0;
    private m_startZ: number = 0;
    private m_pwidth: number = 0;
    private m_plong: number = 0;
    private m_flag: number = 0;
    private m_screenAlignEnabled: boolean = false;

    readonly color0:Color4 = new Color4();
    readonly color1:Color4 = new Color4();
    readonly color2:Color4 = new Color4();
    readonly color3:Color4 = new Color4();
    
    flipVerticalUV: boolean = false;
    vtxColorEnabled: boolean = false;
    premultiplyAlpha: boolean = false;
    
    constructor(transform: ROTransform = null) {
        super(transform);
    }
    // 是否是平铺在屏幕上
    setScreenAlignEnable(enable: boolean): void {
        this.m_screenAlignEnabled = enable;
    }
    createMaterial(texList: TextureProxy[]): void {
        if (this.getMaterial() == null) {
            //ScreenPlaneMaterial
            if (this.m_screenAlignEnabled) {
                let cm: ScreenPlaneMaterial = new ScreenPlaneMaterial();
                cm.setTextureList(texList);
                this.setMaterial(cm);
            }
            else {
                let cm: Default3DMaterial = new Default3DMaterial();
                cm.vtxColorEnabled = this.vtxColorEnabled;
                cm.premultiplyAlpha = this.premultiplyAlpha;
                cm.setTextureList(texList);
                this.setMaterial(cm);
            }
        }
        else {
            this.getMaterial().setTextureList(texList);
        }
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
    /**
     * initialize a rectangle fix screen size plane ,and it parallel the 3d space XOY plane
     * @param texList textures list, default value is null.
     */
    initializeFixScreen(texList: TextureProxy[] = null): void {
        this.initializeXOY(-1.0, -1.0, 2.0, 2.0, texList);
    }
    /**
     * initialize a rectangle plane ,and it parallel the 3d space XOY plane
     * @param minX the min x axis position of the rectangle plane.
     * @param minZ the min y axis position of the rectangle plane.
     * @param pwidth the width of the rectangle plane.
     * @param height the height of the rectangle plane.
     * @param texList textures list, default value is null.
     */
    initializeXOY(minX: number, minY: number, pwidth: number, pheight: number, texList: TextureProxy[] = null): void {
        this.m_startX = minX;
        this.m_startZ = minY;
        this.m_pwidth = pwidth;
        this.m_plong = pheight;
        this.m_flag = 0;
        this.createMaterial(texList);
        this.activeDisplay();
    }
    /**
     * initialize a square plane ,and it parallel the 3d space XOY plane
     * @param size the width and height of the rectangle plane.
     * @param texList textures list, default value is null.
     */
    initializeXOYSquare(size: number, texList: TextureProxy[] = null): void {
        this.m_startX = -0.5 * size;
        this.m_startZ = -0.5 * size;
        this.m_pwidth = size;
        this.m_plong = size;
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
    initializeXOZ(minX: number, minZ: number, pwidth: number, plong: number, texList: TextureProxy[] = null): void {
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
    initializeYOZ(minY: number, minZ: number, pwidth: number, plong: number, texList: TextureProxy[] = null): void {
        this.m_flag = 2;
        this.m_startX = minY;
        this.m_startZ = minZ;
        this.m_pwidth = pwidth;
        this.m_plong = plong;
        this.createMaterial(texList);
        this.activeDisplay();
    }
    /**
     * initialize a square plane ,and it parallel the 3d space XOZ plane
     * @param size the width and long of the rectangle plane.
     * @param texList textures list, default value is null.
     */
    initializeXOZSquare(size: number, texList: TextureProxy[] = null): void {
        this.m_flag = 1;
        this.m_startX = -0.5 * size;
        this.m_startZ = -0.5 * size;
        this.m_pwidth = size;
        this.m_plong = size;
        this.createMaterial(texList);
        this.activeDisplay();
    }
    protected __activeMesh(material: MaterialBase) {
        if (this.getMesh() == null) {
            let mesh: RectPlaneMesh = new RectPlaneMesh();

            mesh.color0.copyFrom( this.color0 );
            mesh.color1.copyFrom( this.color1 );
            mesh.color2.copyFrom( this.color2 );
            mesh.color3.copyFrom( this.color3 );

            mesh.flipVerticalUV = this.flipVerticalUV;
            mesh.vbWholeDataEnabled = this.vbWholeDataEnabled;
            mesh.axisFlag = this.m_flag;
            mesh.setBufSortFormat(material.getBufSortFormat());
            mesh.initialize(this.m_startX, this.m_startZ, this.m_pwidth, this.m_plong);
            this.setMesh(mesh);
        }
    }
    toString(): string {
        return "[Plane3DEntity]";
    }
}