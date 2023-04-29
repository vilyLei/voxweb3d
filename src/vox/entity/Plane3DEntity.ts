/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/
import Default3DEntity from "../../vox/entity/Default3DEntity";
import IRenderMaterial from "../../vox/render/IRenderMaterial";
import IRenderTexture from "../../vox/render/texture/IRenderTexture";
import RectPlaneMesh from "../../vox/mesh/RectPlaneMesh";
import IROTransform from "../../vox/display/IROTransform";
import Color4 from "../material/Color4";

export default class Plane3DEntity extends Default3DEntity {

    private m_startX = 0;
    private m_startZ = 0;
    private m_pwidth = 0;
    private m_plong = 0;
    private m_flag = 0;

    readonly color0 = new Color4();
    readonly color1 = new Color4();
    readonly color2 = new Color4();
    readonly color3 = new Color4();

    uvs: Float32Array = null;

    offsetU = 0.0;
    offsetV = 0.0;
    uScale = 1.0;
    vScale = 1.0;

    constructor(transform: IROTransform = null) {
        super(transform);
    }
    
    /**
     * initialize a rectangle fix screen size plane ,and it parallel the 3d space XOY plane
     * @param texList textures list, default value is null.
     */
    initializeFixScreen(texList: IRenderTexture[] = null): void {
        this.initializeXOY(-1.0, -1.0, 2.0, 2.0, texList);
    }
    /**
     * initialize a rectangle fix screen size plane ,and it parallel the 3d space XOY plane
     * @param texList textures list, default value is null.
     */
    initialize(minX: number, minY: number, pwidth: number, pheight: number, texList: IRenderTexture[] = null): void {
        this.initializeXOY(minX, minY, pwidth, pheight, texList);
    }
    /**
     * initialize a rectangle plane ,and it parallel the 3d space XOY plane
     * @param minX the min x axis position of the rectangle plane.
     * @param minZ the min y axis position of the rectangle plane.
     * @param pwidth the width of the rectangle plane.
     * @param height the height of the rectangle plane.
     * @param texList textures list, default value is null.
     */
    initializeXOY(minX: number, minY: number, pwidth: number, pheight: number, texList: IRenderTexture[] = null): void {
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
    initializeXOYSquare(size: number, texList: IRenderTexture[] = null): void {
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
    initializeXOZ(minX: number, minZ: number, pwidth: number, plong: number, texList: IRenderTexture[] = null): void {
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
    initializeYOZ(minY: number, minZ: number, pwidth: number, plong: number, texList: IRenderTexture[] = null): void {
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
    initializeXOZSquare(size: number, texList: IRenderTexture[] = null): void {
        this.m_flag = 1;
        this.m_startX = -0.5 * size;
        this.m_startZ = -0.5 * size;
        this.m_pwidth = size;
        this.m_plong = size;
        this.createMaterial(texList);
        this.activeDisplay();
    }
    protected __activeMesh(material: IRenderMaterial) {
        if (this.getMesh() == null) {
            let mesh: RectPlaneMesh = new RectPlaneMesh();

            mesh.color0.copyFrom(this.color0);
            mesh.color1.copyFrom(this.color1);
            mesh.color2.copyFrom(this.color2);
            mesh.color3.copyFrom(this.color3);
            mesh.setPolyhedral( this.m_polyhedralBoo );
            mesh.setUVS( this.uvs );
            this.uvs = null;

            mesh.uScale = this.uScale;
            mesh.vScale = this.vScale;
            mesh.offsetU = this.offsetU;
            mesh.offsetV = this.offsetV;
            mesh.wireframe = this.wireframe;

            mesh.flipVerticalUV = this.flipVerticalUV;
            mesh.vbWholeDataEnabled = this.vbWholeDataEnabled;
            mesh.axisFlag = this.m_flag;

            mesh.setVtxBufRenderData(material);
            mesh.initialize(this.m_startX, this.m_startZ, this.m_pwidth, this.m_plong);
            this.setMesh(mesh);
        }
    }
    setUVS(uvsLen8: Float32Array): void {
        let mesh = this.getMesh() as RectPlaneMesh;
        if(mesh) {
            mesh.setUVS(uvsLen8);
        }
    }
}
