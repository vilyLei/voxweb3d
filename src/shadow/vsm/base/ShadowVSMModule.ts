
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

export class ShadowVSMModule {
    constructor() { }

    private m_rscene: RendererScene = null;
    private m_vsmData: ShadowVSMData = null;
    
    private m_direcCamera: CameraBase = null;
    private m_fboDepth: FBOInstance = null;
    private m_fboOccBlur: FBOInstance = null;
    private m_verOccBlurPlane: Plane3DEntity = null;
    private m_horOccBlurPlane: Plane3DEntity = null;

    private m_shadowBias: number = -0.0005;
    private m_shadowRadius: number = 2.0;
    private m_shadowIntensity: number = 0.8;
    private m_colorIntensity: number = 0.1;
    private m_shadowMapW: number = 128;
    private m_shadowMapH: number = 128;
    private m_viewWidth: number = 1300;
    private m_viewHeight: number = 1300;
    private m_depthRtt: RTTTextureProxy = null;
    private m_occBlurRtt: RTTTextureProxy = null;


    initialize(rscene: RendererScene, processIDList: number[]): void {
        if (this.m_rscene == null) {
            this.m_rscene = rscene;
            this.initConfig(processIDList);
        }
    }

    setMapSize(mapW: number, mapH: number): void {
        this.m_shadowMapW = mapW;
        this.m_shadowMapH = mapH;
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
        if(this.m_vsmData != null) {
            this.m_vsmData.setShadowIntensity(this.m_shadowIntensity);
        }
    }
    setColorIntensity(intensity: number): void {
        this.m_colorIntensity = intensity;
        if(this.m_vsmData != null) {
            this.m_vsmData.setColorIntensity(this.m_colorIntensity);
        }
    }

    getShadowMap(): RTTTextureProxy {
        return this.m_depthRtt;
    }
    getVSMData(): ShadowVSMData {
        return this.m_vsmData;
    }
    getCamera(): CameraBase {
        return this.m_direcCamera;
    }
    private initConfig(processIDList: number[]): void {

        this.m_vsmData = new ShadowVSMData();
        this.m_vsmData.initialize();
        this.m_vsmData.setShadowIntensity(this.m_shadowIntensity);

        this.m_fboDepth = this.m_rscene.createFBOInstance();
        this.m_fboDepth.asynFBOSizeWithViewport();
        this.m_fboDepth.setClearRGBAColor4f(1.0, 1.0, 1.0, 1.0);
        this.m_fboDepth.createFBOAt(0, this.m_shadowMapW, this.m_shadowMapH, true, false);
        this.m_depthRtt = this.m_fboDepth.setRenderToRGBATexture(null, 0);
        this.m_fboDepth.setRProcessIDList(processIDList);
        this.m_fboDepth.setGlobalRenderState(RendererState.NORMAL_STATE);
        this.m_fboDepth.setGlobalMaterial(new DepthMaterial());

        this.m_fboOccBlur = this.m_rscene.createFBOInstance();
        this.m_fboOccBlur.asynFBOSizeWithViewport();
        this.m_fboOccBlur.setClearRGBAColor4f(1.0, 1.0, 1.0, 1.0);
        this.m_fboOccBlur.createFBOAt(0, this.m_shadowMapW, this.m_shadowMapH, true, false);
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

        let viewWidth: number = this.m_viewWidth;
        let viewHeight: number = this.m_viewHeight;
        this.m_direcCamera = new CameraBase(0);
        this.m_direcCamera.lookAtRH(new Vector3D(600.0, 800.0, -600.0), new Vector3D(0.0, 0.0, 0.0), new Vector3D(0.0, 1.0, 0.0));
        this.m_direcCamera.orthoRH(0.1, 1900.0, -0.5 * viewHeight, 0.5 * viewHeight, -0.5 * viewWidth, 0.5 * viewWidth);
        this.m_direcCamera.setViewXY(0, 0);
        this.m_direcCamera.setViewSize(viewWidth, viewHeight);
        this.m_direcCamera.update();

        this.m_vsmData.updateShadowCamera(this.m_direcCamera);
        this.m_vsmData.setShadowRadius(this.m_shadowRadius);
        this.m_vsmData.setShadowBias(this.m_shadowBias);
        this.m_vsmData.setShadowSize(this.m_shadowMapW, this.m_shadowMapH);
        this.m_vsmData.upadate();

    }
    private m_shadowCamVersion: number = -1;
    private m_buildShadowDelay: number = 120;
    
    upateData(): void {
        this.m_shadowCamVersion = this.m_direcCamera.version;
        this.m_vsmData.upadate();
    }
    run(): void {

        // update shadow direc matrix
        if (this.m_direcCamera.version != this.m_shadowCamVersion) {
            this.m_shadowCamVersion = this.m_direcCamera.version;
            this.m_vsmData.updateShadowCamera(this.m_direcCamera);
            this.m_vsmData.upadate();
        }
        if (this.m_buildShadowDelay > 0) {
            if (this.m_buildShadowDelay % 15 == 0) {
                this.buildShadow();
            }
            this.m_buildShadowDelay--;
        }

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

        this.m_fboOccBlur.setRenderToBackBuffer();
    }
}
export default ShadowVSMModule;