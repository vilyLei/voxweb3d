import IVector3D from "../../../vox/math/IVector3D";
import { IFBOInstance } from "../../../vox/scene/IFBOInstance";
import IRendererScene from "../../../vox/scene/IRendererScene";
import { IRenderCamera } from "../../../vox/render/IRenderCamera";

import { OccBlurDecorator } from "../material/OccBlurDecorator";
import { DepthWriteDecorator } from "../material/DepthWriteDecorator";
import ShadowVSMData from "../material/ShadowVSMData";
import IRenderTexture from "../../../vox/render/texture/IRenderTexture";
import IRenderEntity from "../../../vox/render/IRenderEntity";

import IShaderCodeBuilder from "../../../vox/material/code/IShaderCodeBuilder";
import { MaterialPipeType } from "../../../vox/material/pipeline/MaterialPipeType";
import { IMaterialPipe } from "../../../vox/material/pipeline/IMaterialPipe";
import IShaderUniform from "../../../vox/material/IShaderUniform";

// import PingpongBlur from "../../../renderingtoy/mcase/PingpongBlur";
import { IShadowVSMModule } from "./IShadowVSMModule";

export class ShadowVSMModule implements IMaterialPipe, IShadowVSMModule {

    private m_rscene: IRendererScene = null;
    private m_vsmData: ShadowVSMData = null;

    private m_direcCamera: IRenderCamera = null;
    private m_fboDepth: IFBOInstance = null;
    private m_fboOccBlur: IFBOInstance = null;
    private m_verOccBlurPlane: IRenderEntity = null;
    private m_horOccBlurPlane: IRenderEntity = null;
    // private m_blurModule: PingpongBlur = null;
    private m_camPosArr: number[] = [1.0, 800.0, 1.0];
    private m_camPos: IVector3D;
    private m_zero: IVector3D;
    private m_axisZ: IVector3D;
    private m_shadowBias: number = -0.0005;
    private m_shadowRadius: number = 2.0;
    private m_shadowIntensity: number = 0.8;
    private m_colorIntensity: number = 0.1;
    private m_shadowMapW: number = 512;
    private m_shadowMapH: number = 512;
    private m_viewWidth: number = 3000.0;
    private m_viewHeight: number = 3000.0;
    private m_near: number = 10.0;
    private m_far: number = 3000.0;
    private m_depthRtt: IRenderTexture = null;
    private m_occBlurRtt: IRenderTexture = null;
    private m_fboIndex: number = 0;
    private m_processIDList: number[] = null;
    private m_rendererStatus: number = -1;
    private m_rendererProcessStatus: number = -1;
    // private m_blurEnabled: boolean = false;
    /**
     * @param fboIndex the default value is 0
     */
    constructor(fboIndex: number) {
        this.m_fboIndex = fboIndex;
    }

    resetPipe(): void {
    }
    getTextures(shaderBuilder: IShaderCodeBuilder, outList: IRenderTexture[], pipeType: MaterialPipeType): IRenderTexture[] {
        return this.m_vsmData.getTextures(shaderBuilder, outList, pipeType);
    }

    useShaderPipe(shaderBuilder: IShaderCodeBuilder, pipeType: MaterialPipeType): void {
        this.m_vsmData.useShaderPipe(shaderBuilder, pipeType);
    }
    getPipeTypes(): MaterialPipeType[] {
        return this.m_vsmData.getPipeTypes();
    }
    getPipeKey(pipeType: MaterialPipeType): string {
        return this.m_vsmData.getPipeKey(pipeType);
    }

    getGlobalUinform(): IShaderUniform {
        return this.m_vsmData.getGlobalUinform();
    }

    initialize(rscene: IRendererScene, processIDList: number[], buildShadowDelay: number = 120, blurEnabled: boolean = false): void {
        if (this.m_rscene == null) {
            this.m_rscene = rscene;
            this.m_camPos = rscene.createVector3D();
            this.m_camPos.fromArray( this.m_camPosArr );
            this.m_zero = rscene.createVector3D();
            this.m_axisZ = rscene.createVector3D(0.0, 0.0, 1.0);
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
    setCameraPosition(pos: IVector3D): void {
        if(this.m_camPos != null) {
            this.m_camPos.copyFrom(pos);
        }else {
            pos.toArray(this.m_camPosArr);
        }
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

    getShadowMap(): IRenderTexture {
        // if (this.m_blurModule != null) {
        //     return this.m_blurModule.getDstTexture();
        // }
        return this.m_depthRtt;
    }
    getVSMData(): ShadowVSMData {
        return this.m_vsmData;
    }
    getCamera(): IRenderCamera {
        return this.m_direcCamera;
    }
    setRendererProcessIDList(processIDList: number[]): void {
        if (this.m_fboDepth != null) {
            this.m_processIDList = processIDList.slice(0);
            this.m_fboDepth.setRProcessIDList(processIDList);
        }
    }
    private initConfig(processIDList: number[], blurEnabled: boolean = false): void {

        let rscene = this.m_rscene;
        let renderingState = this.m_rscene.getRenderProxy().renderingState;
        this.m_vsmData = new ShadowVSMData(this.m_rscene.getRenderProxy().uniformContext);
        this.m_vsmData.initialize(rscene.createMatrix4(), rscene.createMatrix4());
        this.m_vsmData.setShadowIntensity(this.m_shadowIntensity);

        let depthMaterial = this.m_rscene.materialBlock.createSimpleMaterial(new DepthWriteDecorator());

        this.m_fboDepth = this.m_rscene.createFBOInstance();
        this.m_fboDepth.asynFBOSizeWithViewport();
        this.m_fboDepth.setClearRGBAColor4f(1.0, 1.0, 1.0, 1.0);
        this.m_fboDepth.createFBOAt(this.m_fboIndex, this.m_shadowMapW, this.m_shadowMapH, true, false, 0);
        this.m_depthRtt = this.m_fboDepth.setRenderToRGBATexture(null, 0);
        this.m_fboDepth.setRProcessIDList(processIDList);
        this.m_fboDepth.setGlobalRenderState(renderingState.NORMAL_STATE);
        this.m_fboDepth.setGlobalMaterial(depthMaterial, false, false);

        this.m_fboOccBlur = this.m_rscene.createFBOInstance();
        this.m_fboOccBlur.asynFBOSizeWithViewport();
        this.m_fboOccBlur.setClearRGBAColor4f(1.0, 1.0, 1.0, 1.0);
        this.m_fboOccBlur.createFBOAt(this.m_fboIndex, this.m_shadowMapW, this.m_shadowMapH, true, false, 0);
        this.m_occBlurRtt = this.m_fboOccBlur.setRenderToRGBATexture(null, 0);


        let occDeco = new OccBlurDecorator(false, this.m_depthRtt, this.m_shadowRadius);
        let occMaterial = this.m_rscene.materialBlock.createSimpleMaterial(occDeco);

        let verOccBlurPlane = this.m_rscene.entityBlock.createEntity();
        verOccBlurPlane.copyMeshFrom(this.m_rscene.entityBlock.screenPlane);
        verOccBlurPlane.setMaterial(occMaterial);
        this.m_verOccBlurPlane = verOccBlurPlane;

        occDeco = new OccBlurDecorator(true, this.m_occBlurRtt, this.m_shadowRadius);
        occMaterial = this.m_rscene.materialBlock.createSimpleMaterial(occDeco);

        let horOccBlurPlane = this.m_rscene.entityBlock.createEntity();
        horOccBlurPlane.copyMeshFrom(this.m_rscene.entityBlock.screenPlane);
        horOccBlurPlane.setMaterial(occMaterial);
        this.m_horOccBlurPlane = horOccBlurPlane;

        // this.m_blurEnabled = blurEnabled;
        // if (blurEnabled) {
        //     this.m_blurModule = new PingpongBlur(this.m_rscene.getRenderer());
        //     this.m_blurModule.setBlurCount(2);
        //     this.m_blurModule.setSyncViewSizeEnabled(false);
        //     this.m_blurModule.setFBOSize(this.m_shadowMapW, this.m_shadowMapH);
        //     this.m_blurModule.setBlurDensity(1.0);
        //     //this.m_blurModule.bindSrcProcessId(0);
        //     this.m_blurModule.bindDrawEntity(this.m_verOccBlurPlane);
        //     this.m_blurModule.setBackbufferVisible(false);
        // }

        this.m_direcCamera = this.m_rscene.createCamera();

        this.m_vsmData.setShadowMap(this.getShadowMap());
        this.updateData();

    }
    private updateData(): void {

        if (this.m_direcCamera != null) {

            let viewWidth: number = this.m_viewWidth;
            let viewHeight: number = this.m_viewHeight;

            this.m_direcCamera.lookAtRH(this.m_camPos, this.m_zero, this.m_axisZ);
            this.m_direcCamera.orthoRH(this.m_near, this.m_far, -0.5 * viewHeight, 0.5 * viewHeight, -0.5 * viewWidth, 0.5 * viewWidth);
            this.m_direcCamera.setViewXY(0, 0);
            this.m_direcCamera.setViewSize(viewWidth, viewHeight);
            this.m_direcCamera.update();
        }
        if (this.m_vsmData != null) {

            this.m_fboDepth.resizeFBO(this.m_shadowMapW, this.m_shadowMapH);
            this.m_fboOccBlur.resizeFBO(this.m_shadowMapW, this.m_shadowMapH);
            // if (this.m_blurEnabled) {
            //     this.m_blurModule.setFBOSize(this.m_shadowMapW, this.m_shadowMapH);
            // }

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

        this.m_fboDepth.useCamera(this.m_direcCamera, false);
        this.m_fboDepth.run(true, true, true, true);
        this.m_fboDepth.useMainCamera();
        // drawing vertical
        this.m_fboOccBlur.setRenderToRGBATexture(this.m_occBlurRtt, 0);
        this.m_fboOccBlur.runBegin();
        this.m_fboOccBlur.drawEntity(this.m_verOccBlurPlane, false, true);
        this.m_fboOccBlur.runEnd();
        // drawing horizonal
        this.m_fboOccBlur.setRenderToRGBATexture(this.m_depthRtt, 0);
        this.m_fboOccBlur.runBegin();
        this.m_fboOccBlur.drawEntity(this.m_horOccBlurPlane, false, true);
        this.m_fboOccBlur.runEnd();
        // pingpong blur
        // if (this.m_blurModule != null) {
        //     this.m_blurModule.run();
        // }
        this.m_fboOccBlur.setRenderToBackBuffer();
    }
    destroy(): void {

        this.m_rscene = null;
        this.m_vsmData = null;
        this.m_direcCamera = null;
        this.m_fboDepth = null;
        this.m_fboOccBlur = null;
        this.m_verOccBlurPlane = null;
        this.m_horOccBlurPlane = null;        
    }
}
export default ShadowVSMModule;