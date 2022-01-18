import Vector3D from "../../../vox/math/Vector3D";
import RendererScene from "../../../vox/scene/RendererScene";
import FBOInstance from "../../../vox/scene/FBOInstance";
import CameraBase from "../../../vox/view/CameraBase";

import RTTTextureProxy from "../../../vox/texture/RTTTextureProxy";
import Matrix4 from "../../../vox/math/Matrix4";
import Plane3DEntity from "../../../vox/entity/Plane3DEntity";
import TextureProxy from "../../../vox/texture/TextureProxy";
import WrapperTextureProxy from "../../../vox/texture/WrapperTextureProxy";
import ScreenFixedAlignPlaneEntity from "../../../vox/entity/ScreenFixedAlignPlaneEntity";
import RendererState from "../../../vox/render/RendererState";
import { IRTTTexture } from "../../../vox/render/texture/IRTTTexture";
import { IWrapperTexture } from "../../../vox/render/texture/IWrapperTexture";
import IRenderTexture from "../../../vox/render/texture/IRenderTexture";

class ViewTextureMaker {

    private m_rscene: RendererScene = null;
    private m_direcCamera: CameraBase = null;
    private m_offetMatrix: Matrix4 = null;
    private m_direcMatrix: Matrix4 = null;
    private m_fbo: FBOInstance = null;

    private m_camPos: Vector3D = new Vector3D(0.0, 800.0, 0.0);
    private m_mapWidth: number = 128;
    private m_mapHeight: number = 128;
    private m_viewWidth: number = 1300;
    private m_viewHeight: number = 1300;
    private m_near: number = 10;
    private m_far: number = 2000.0;
    private m_viewRtt: IRTTTexture = null;
    private m_colorRtt: IRTTTexture = null;
    private m_colorMap: IWrapperTexture = null;
    private m_map: IWrapperTexture = null;
    private m_fboIndex: number = 0;
    private m_processIDList: number[] = null;
    private m_rendererStatus: number = -1;
    private m_rendererProcessStatus: number = -1;
    private m_colorPlane: ScreenFixedAlignPlaneEntity;
    private m_clearColorEnabled: boolean = true;    
    private m_savingHistroy: boolean = false;
    histroyUpdating: boolean = false;
    constructor(fboIndex: number, savingHistroy: boolean = false) {
        this.m_fboIndex = fboIndex;
        this.m_savingHistroy = savingHistroy;
    }

    initialize(rscene: RendererScene, processIDList: number[]): void {
        if (this.m_rscene == null) {
            this.m_rscene = rscene;
            this.m_processIDList = processIDList.slice(0);
            this.initConfig(processIDList);
        }
    }
    /**
     * set shawow rtt texture size
     * @param mapW view rtt texture width
     * @param mapH view rtt texture height
     */
    setMapSize(mapW: number, mapH: number): void {
        this.m_mapWidth = mapW;
        this.m_mapHeight = mapH;
    }
    /**
     * set view camera world position 
     * @param pos view camera position in world.
     */
    setCameraPosition(pos: Vector3D): void {
        this.m_camPos.copyFrom(pos);
    }
    /**
     * set view camera near plane distance 
     * @param near view camera near plane distance 
     */
    setCameraNear(near: number): void {
        this.m_near = near;
    }
    /**
     * set view camera far plane distance 
     * @param far view camera far plane distance 
     */
    setCameraFar(far: number): void {
        this.m_far = far;
    }
    setCameraViewSize(viewW: number, viewH: number): void {
        this.m_viewWidth = viewW;
        this.m_viewHeight = viewH;
    }
    
    getMap(): IRenderTexture {
        return this.m_map;
        //return this.m_viewRtt;
    }
    getMatrix(): Matrix4 {
        return this.m_direcMatrix;
    }
    getCamera(): CameraBase {
        return this.m_direcCamera;
    }
    setRendererProcessIDList(processIDList: number[]): void {
        if (this.m_fbo != null) {
            this.m_processIDList = processIDList.slice(0);
            this.m_fbo.setRProcessIDList(processIDList);
        }
    }
    setClearColorEnabled(boo: boolean): void {
        this.m_clearColorEnabled = boo;
        if(this.m_fbo != null) this.m_fbo.setClearColorEnabled(boo);
    }
    private initConfig(processIDList: number[]): void {

        this.m_fbo = this.m_rscene.createFBOInstance();
        this.m_fbo.asynFBOSizeWithViewport();
        this.m_fbo.setClearRGBAColor4f(0.0, 0.0, 0.0, 0.0);
        this.m_fbo.createFBOAt(this.m_fboIndex, this.m_mapWidth, this.m_mapHeight, true, false);
        if(this.m_savingHistroy) {
            this.m_colorRtt = this.m_fbo.setRenderToRGBATexture(null, 0);
            this.m_viewRtt = this.m_fbo.setRenderToRGBATexture(null, 0);

            this.m_colorMap = this.m_rscene.textureBlock.createWrapperTex(64,64);
            this.m_colorMap.attachTex( this.m_colorRtt );
            this.m_fbo.setRenderToRGBATexture( this.m_viewRtt, 0 );

            this.m_colorPlane = new ScreenFixedAlignPlaneEntity();
            this.m_colorPlane.setRenderState(RendererState.BACK_ALPHA_ADD_BLENDSORT_STATE);
            this.m_colorPlane.initialize(-1.0,-1.0,2.0,2.0,[this.m_colorMap]);

            // let pl = new ScreenFixedAlignPlaneEntity();
            // pl.initialize(-1.0,-1.0,0.4,0.4,[this.m_colorRtt]);
            // this.m_rscene.addEntity(pl, 5);
            // pl = new ScreenFixedAlignPlaneEntity();
            // pl.initialize(-1.0,-0.5,0.4,0.4,[this.m_viewRtt]);
            // this.m_rscene.addEntity(pl, 5);

        }else {
            this.m_viewRtt = this.m_fbo.setRenderToRGBATexture(null, 0);
        }
        this.m_map = this.m_rscene.textureBlock.createWrapperTex(64,64);
        this.m_map.attachTex( this.m_viewRtt );

        // let pl3 = new Plane3DEntity();
        // pl3.toTransparentBlend();
        // pl3.initializeXOZSquare(1700, [this.m_viewRtt]);
        // pl3.setXYZ(-500,-160,-300);
        // this.m_rscene.addEntity(pl3, 5);

        this.m_fbo.setRProcessIDList(processIDList);
        this.m_fbo.setClearColorEnabled( this.m_clearColorEnabled );

        this.m_direcCamera = new CameraBase();

        this.m_direcMatrix = new Matrix4();
        this.m_offetMatrix = new Matrix4();
        this.m_offetMatrix.identity();
        this.m_offetMatrix.setScaleXYZ(0.5, 0.5, 0.5);
        this.m_offetMatrix.setTranslationXYZ(0.5, 0.5, 0.5);

        this.updateData();

    }
    private updateData(): void {

        if (this.m_direcCamera != null) {

            this.m_fbo.resizeFBO(this.m_mapWidth, this.m_mapHeight);

            let viewWidth: number = this.m_viewWidth;
            let viewHeight: number = this.m_viewHeight;
            this.m_direcCamera.lookAtRH(this.m_camPos, Vector3D.ZERO, Vector3D.Z_AXIS);
            this.m_direcCamera.orthoRH(this.m_near, this.m_far, -0.5 * viewHeight, 0.5 * viewHeight, -0.5 * viewWidth, 0.5 * viewWidth);
            this.m_direcCamera.setViewXY(0, 0);
            this.m_direcCamera.setViewSize(viewWidth, viewHeight);
            this.m_direcCamera.update();

            this.m_direcMatrix.copyFrom(this.m_direcCamera.getVPMatrix());
            this.m_direcMatrix.append(this.m_offetMatrix);
        }
    }
    private mm_camVersion: number = -1;
    force: boolean = true;

    upate(): void {

        this.mm_camVersion = this.m_direcCamera.version;
        this.updateData();
    }
    private getRendererProcessStatus(): number {
        let status: number = 31;
        for (let i: number = 0; i < this.m_processIDList.length; ++i) {
            status += status * this.m_rscene.getRenderProcessAt(i).getStatus();
        }
        return status;
    }
    run(): void {

        if (this.m_direcCamera.version != this.mm_camVersion) {
            this.mm_camVersion = this.m_direcCamera.version;
        }

        let flag: boolean = this.force;
        if (flag) {
            this.build();
        }
        else {
            if (this.m_rendererStatus != this.m_rscene.getRendererStatus()) {
                let status: number = this.getRendererProcessStatus();
                if (this.m_rendererProcessStatus != status) {
                    this.m_rendererProcessStatus = status;
                    flag = true;
                }
                this.m_rendererStatus = this.m_rscene.getRendererStatus();
            }
            if (flag) {
                this.build();
            }
        }
        this.force = false;
    }
    private build(): void {

        // console.log("this.tex maker build(), begin.");
        // console.log("this.tex maker build(), this.histroyUpdating: ",this.histroyUpdating);
        this.m_fbo.useCamera(this.m_direcCamera);
        this.m_fbo.lockColorMask();
        if(this.m_savingHistroy) {
            if(this.histroyUpdating) {
    
                let color = this.m_colorRtt;
                let rtt = this.m_viewRtt;
                if(this.m_map.getAttachTex() == this.m_viewRtt) {
                    color = this.m_viewRtt;
                    rtt = this.m_colorRtt;
                }
                this.m_colorMap.attachTex( color );
                this.m_map.attachTex( rtt );
                this.m_fbo.setRenderToRGBATexture( rtt, 0 );                
                this.histroyUpdating = false;
            }
            this.m_fbo.runBegin();
            this.m_fbo.drawEntity(this.m_colorPlane);
        }
        this.m_fbo.run();
        this.m_fbo.useMainCamera();
        this.m_fbo.setRenderToBackBuffer();
        // console.log("this.tex maker build(), end.");

    }
}
export { ViewTextureMaker };