
import Vector3D from "../../../vox/math/Vector3D";
import Plane3DEntity from "../../../vox/entity/Plane3DEntity";
import RendererScene from "../../../vox/scene/RendererScene";
import FBOInstance from "../../../vox/scene/FBOInstance";
import CameraBase from "../../../vox/view/CameraBase";
import DepthMaterial from "../material/DepthMaterial";
import OccBlurMaterial from "../material/OccBlurMaterial";
import ShadowVSMData from "../material/ShadowVSMData";
import RendererState from "../../../vox/render/RendererState";
import RTTTextureProxy from "../../../vox/texture/RTTTextureProxy";

import PingpongBlur from "../../../renderingtoy/mcase/PingpongBlur";

export class ShadowVSMModule {

    private m_rscene: RendererScene = null;
    private m_vsmData: ShadowVSMData = null;

    private m_direcCamera: CameraBase = null;
    private m_fboDepth: FBOInstance = null;
    private m_fboOccBlur: FBOInstance = null;
    private m_verOccBlurPlane: Plane3DEntity = null;
    private m_horOccBlurPlane: Plane3DEntity = null;
    private m_blurModule: PingpongBlur = null;

    private m_camPos: Vector3D = new Vector3D(600.0, 800.0, -600.0);
    private m_shadowBias: number = -0.0005;
    private m_shadowRadius: number = 2.0;
    private m_shadowIntensity: number = 0.8;
    private m_colorIntensity: number = 0.1;
    private m_shadowMapW: number = 128;
    private m_shadowMapH: number = 128;
    private m_viewWidth: number = 1300;
    private m_viewHeight: number = 1300;
    private m_near: number = 0.01;
    private m_far: number = 3000.0;
    private m_depthRtt: RTTTextureProxy = null;
    private m_occBlurRtt: RTTTextureProxy = null;
    private m_fboIndex: number = 0;
    private m_processIDList: number[] = null;
    private m_rendererStatus: number = -1;
    private m_rendererProcessStatus: number = -1;
    private m_blurEnabled: boolean = false;
    constructor(fboIndex: number) {
        this.m_fboIndex = fboIndex;
    }

    initialize(rscene: RendererScene, processIDList: number[], buildShadowDelay: number = 120, blurEnabled: boolean = false): void {
        if (this.m_rscene == null) {
            this.m_rscene = rscene;
            this.m_buildShadowDelay = buildShadowDelay;
            this.m_processIDList = processIDList.slice(0);
            this.initConfig(processIDList, false);
        }
    }
    /**
     * set shawow rtt texture size
     * @param mapW shadow rtt texture width
     * @param mapH shadow rtt texture height
     */
    setMapSize(mapW: number, mapH: number): void {
        this.m_shadowMapW = mapW;
        this.m_shadowMapH = mapH;
    }
    /**
     * set shadow camera world position 
     * @param pos shadow camera position in world.
     */
    setCameraPosition(pos: Vector3D): void {
        this.m_camPos.copyFrom(pos);
    }
    /**
     * set shadow camera near plane distance 
     * @param near shadow camera near plane distance 
     */
    setCameraNear(near: number): void {
        this.m_near = near;
    }
    /**
     * set shadow camera far plane distance 
     * @param far shadow camera far plane distance 
     */
    setCameraFar(far: number): void {
        this.m_far = far;
    }
    setCameraViewSize(viewW: number, viewH: number): void {
        this.m_viewWidth = viewW;
        this.m_viewHeight = viewH;
    }
    setShadowRadius(radius: number): void {
        this.m_shadowRadius = radius;
    }
    setShadowBias(bias: number): void {
        this.m_shadowBias = bias;
    }
    setShadowIntensity(intensity: number): void {
        this.m_shadowIntensity = intensity;
        if (this.m_vsmData != null) {
            this.m_vsmData.setShadowIntensity(this.m_shadowIntensity);
        }
    }
    setColorIntensity(intensity: number): void {
        this.m_colorIntensity = intensity;
        if (this.m_vsmData != null) {
            this.m_vsmData.setColorIntensity(this.m_colorIntensity);
        }
    }

    getShadowMap(): RTTTextureProxy {
        if (this.m_blurModule != null) {
            return this.m_blurModule.getDstTexture();
        }
        return this.m_depthRtt;
    }
    getVSMData(): ShadowVSMData {
        return this.m_vsmData;
    }
    getCamera(): CameraBase {
        return this.m_direcCamera;
    }
    setRendererProcessIDList(processIDList: number[]): void {
        if (this.m_fboDepth != null) {
            this.m_processIDList = processIDList.slice(0);
            this.m_fboDepth.setRProcessIDList(processIDList);
        }
    }
    private initConfig(processIDList: number[], blurEnabled: boolean = false): void {

        this.m_vsmData = new ShadowVSMData( this.m_rscene.getRenderProxy() );
        this.m_vsmData.initialize();
        this.m_vsmData.setShadowIntensity(this.m_shadowIntensity);

        this.m_fboDepth = this.m_rscene.createFBOInstance();
        this.m_fboDepth.asynFBOSizeWithViewport();
        this.m_fboDepth.setClearRGBAColor4f(1.0, 1.0, 1.0, 1.0);
        this.m_fboDepth.createFBOAt(this.m_fboIndex, this.m_shadowMapW, this.m_shadowMapH, true, false);
        this.m_depthRtt = this.m_fboDepth.setRenderToRGBATexture(null, 0);
        this.m_fboDepth.setRProcessIDList(processIDList);
        this.m_fboDepth.setGlobalRenderState(RendererState.NORMAL_STATE);
        this.m_fboDepth.setGlobalMaterial(new DepthMaterial());

        this.m_fboOccBlur = this.m_rscene.createFBOInstance();
        this.m_fboOccBlur.asynFBOSizeWithViewport();
        this.m_fboOccBlur.setClearRGBAColor4f(1.0, 1.0, 1.0, 1.0);
        this.m_fboOccBlur.createFBOAt(this.m_fboIndex, this.m_shadowMapW, this.m_shadowMapH, true, false);
        this.m_occBlurRtt = this.m_fboOccBlur.setRenderToRGBATexture(null, 0);

        let occMaterial: OccBlurMaterial;
        occMaterial = new OccBlurMaterial(false);
        occMaterial.setShadowRadius(this.m_shadowRadius);
        let verOccBlurPlane: Plane3DEntity = new Plane3DEntity();
        verOccBlurPlane.setMaterial(occMaterial);
        verOccBlurPlane.initializeXOY(-1, -1, 2, 2, [this.m_depthRtt]);
        this.m_verOccBlurPlane = verOccBlurPlane;

        occMaterial = new OccBlurMaterial(true);
        occMaterial.setShadowRadius(this.m_shadowRadius);
        let horOccBlurPlane: Plane3DEntity = new Plane3DEntity();
        horOccBlurPlane.copyMeshFrom(verOccBlurPlane);
        horOccBlurPlane.setMaterial(occMaterial);
        horOccBlurPlane.initializeXOY(-1, -1, 2, 2, [this.m_occBlurRtt]);
        this.m_horOccBlurPlane = horOccBlurPlane;

        this.m_blurEnabled = blurEnabled;
        if (blurEnabled) {
            this.m_blurModule = new PingpongBlur(this.m_rscene.getRenderer());
            this.m_blurModule.setBlurCount(2);
            this.m_blurModule.setSyncViewSizeEnabled(false);
            this.m_blurModule.setFBOSize(this.m_shadowMapW, this.m_shadowMapH);
            this.m_blurModule.setBlurDensity(1.0);
            //this.m_blurModule.bindSrcProcessId(0);
            this.m_blurModule.bindDrawEntity(this.m_verOccBlurPlane);
            this.m_blurModule.setBackbufferVisible(false);
        }

        this.m_direcCamera = new CameraBase();

        // let viewWidth: number = this.m_viewWidth;
        // let viewHeight: number = this.m_viewHeight;

        // this.m_direcCamera.lookAtRH(this.m_camPos, new Vector3D(0.0, 0.0, 0.0), new Vector3D(0.0, 1.0, 0.0));
        // this.m_direcCamera.orthoRH(this.m_near, this.m_far, -0.5 * viewHeight, 0.5 * viewHeight, -0.5 * viewWidth, 0.5 * viewWidth);
        // this.m_direcCamera.setViewXY(0, 0);
        // this.m_direcCamera.setViewSize(viewWidth, viewHeight);
        // this.m_direcCamera.update();

        // this.m_vsmData.updateShadowCamera(this.m_direcCamera);
        // this.m_vsmData.setShadowRadius(this.m_shadowRadius);
        // this.m_vsmData.setShadowBias(this.m_shadowBias);
        // this.m_vsmData.setShadowSize(this.m_shadowMapW, this.m_shadowMapH);
        // this.m_vsmData.update();
        this.m_vsmData.setShadowMap(this.getShadowMap());
        this.updateData();

    }
    private updateData(): void {

        if (this.m_direcCamera != null) {

            let viewWidth: number = this.m_viewWidth;
            let viewHeight: number = this.m_viewHeight;
            this.m_direcCamera.lookAtRH(this.m_camPos, Vector3D.ZERO, Vector3D.Z_AXIS);
            this.m_direcCamera.orthoRH(this.m_near, this.m_far, -0.5 * viewHeight, 0.5 * viewHeight, -0.5 * viewWidth, 0.5 * viewWidth);
            this.m_direcCamera.setViewXY(0, 0);
            this.m_direcCamera.setViewSize(viewWidth, viewHeight);
            this.m_direcCamera.update();
        }
        if (this.m_vsmData != null) {

            this.m_fboDepth.resizeFBO(this.m_shadowMapW, this.m_shadowMapH);
            this.m_fboOccBlur.resizeFBO(this.m_shadowMapW, this.m_shadowMapH);
            if (this.m_blurEnabled) {
                this.m_blurModule.setFBOSize(this.m_shadowMapW, this.m_shadowMapH);
            }

            this.m_vsmData.updateShadowCamera(this.m_direcCamera);
            this.m_vsmData.setShadowRadius(this.m_shadowRadius);
            this.m_vsmData.setShadowBias(this.m_shadowBias);
            this.m_vsmData.setShadowSize(this.m_shadowMapW, this.m_shadowMapH);
            this.m_vsmData.update();
        }
    }
    private m_shadowCamVersion: number = -1;
    private m_buildShadowDelay: number = 120;
    force: boolean = true;

    upate(): void {

        this.m_buildShadowDelay = 32;
        this.m_shadowCamVersion = this.m_direcCamera.version;

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

        // update shadow direc matrix
        if (this.m_direcCamera.version != this.m_shadowCamVersion) {
            this.m_shadowCamVersion = this.m_direcCamera.version;
            this.m_vsmData.updateShadowCamera(this.m_direcCamera);
            this.m_vsmData.update();
        }

        let flag: boolean = this.force;
        if (flag) {
            this.buildShadow();
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
            //let flag: boolean = this.force || this.m_rendererStatus != this.m_rscene.getRendererStatus();
            if (this.m_buildShadowDelay > 0) {
                if (this.m_buildShadowDelay % 15 == 0) {
                    flag = true;
                }
                this.m_buildShadowDelay--;
            }
            if (flag) {
                this.buildShadow();
            }
        }
        this.force = false;
    }
    private buildShadow(): void {

        this.m_fboDepth.useCamera(this.m_direcCamera);
        this.m_fboDepth.run(true, true);
        this.m_fboDepth.useMainCamera();
        // drawing vertical
        this.m_fboOccBlur.setRenderToRGBATexture(this.m_occBlurRtt, 0);
        this.m_fboOccBlur.runBegin();
        this.m_fboOccBlur.drawEntity(this.m_verOccBlurPlane);
        this.m_fboOccBlur.runEnd();
        // drawing horizonal
        this.m_fboOccBlur.setRenderToRGBATexture(this.m_depthRtt, 0);
        this.m_fboOccBlur.runBegin();
        this.m_fboOccBlur.drawEntity(this.m_horOccBlurPlane);
        this.m_fboOccBlur.runEnd();
        // pingpong blur
        if (this.m_blurModule != null) {
            this.m_blurModule.run();
        }
        this.m_fboOccBlur.setRenderToBackBuffer();
    }
}
export default ShadowVSMModule;