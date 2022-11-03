/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IRenderEntity from "../../../vox/render/IRenderEntity";
import IRendererScene from "../../../vox/scene/IRendererScene";
import { OccPostOutLineDecorator } from "../material/OccPostOutLineDecorator";
import { OccPostOutLineScreen } from "../material/OccPostOutLineScreen";
import { OutlinePreDecorator } from "../material/OutlinePreDecorator";
import IVector3D from "../../../vox/math/IVector3D";
import { IFBOInstance } from "../../../vox/scene/IFBOInstance";
import IAABB from "../../../vox/geom/IAABB";
import { IRTTTexture } from "../../../vox/render/texture/IRTTTexture";
import IRenderMaterial from "../../../vox/render/IRenderMaterial";
import IOcclusionPostOutline from "./IOcclusionPostOutline";

const __minPV: number = 1e-6;
const __maxNV: number = -1e-6;
class OCCPlane {
    nv: IVector3D;
    distance: number = 0.0;
    intersectBoo: boolean = false;
    __tV0: IVector3D;
    containsPoint(pos: IVector3D): number {
        let f = this.nv.dot(pos) - this.distance;
        if (f > __minPV) {
            return 1;
        } else if (f < __maxNV) {
            return -1;
        }
        return 0;
    }
    intersectAABB(minV: IVector3D, maxV: IVector3D): number {

        this.intersectBoo = false;

        let pv = this.__tV0;

        pv.setXYZ(maxV.x, minV.y, maxV.z);
        let flag: number = this.containsPoint(pv);
        pv.setXYZ(maxV.x, minV.y, minV.z);
        flag += this.containsPoint(pv);
        pv.setXYZ(minV.x, minV.y, minV.z);
        flag += this.containsPoint(pv);
        pv.setXYZ(minV.x, minV.y, maxV.z);
        flag += this.containsPoint(pv);

        pv.setXYZ(maxV.x, maxV.y, maxV.z);
        flag += this.containsPoint(pv);
        pv.setXYZ(maxV.x, maxV.y, minV.z);
        flag += this.containsPoint(pv);
        pv.setXYZ(minV.x, maxV.y, minV.z);
        flag += this.containsPoint(pv);
        pv.setXYZ(minV.x, maxV.y, maxV.z);
        flag += this.containsPoint(pv);

        this.intersectBoo = flag < 8;
        if (flag < -7) return -1;
        if (flag > 7) return 1;
        return 0;
    }
}
export default class OcclusionPostOutline implements IOcclusionPostOutline {
    constructor() { }

    private m_rscene: IRendererScene = null;
    private m_testPlane: OCCPlane = new OCCPlane();

    private m_targets: IRenderEntity[] = null;
    private m_preDecor: OutlinePreDecorator = null;
    private m_preMaterial: IRenderMaterial = null;
    private m_screenDecor: OccPostOutLineDecorator = null;
    private m_boundsDecor: OccPostOutLineDecorator = null;
    private m_outlinePlane: IRenderEntity = null;
    private m_displayPlane: IRenderEntity = null;
    private m_running: boolean = true;
    private m_runningFlag: boolean = true;
    private m_sizeScaleRatio: number = 0.5;
    private m_preColorRTT: IRTTTexture = null;
    private m_outLineRTT: IRTTTexture = null;
    private m_colorFBO: IFBOInstance = null;
    private m_outlineFBO: IFBOInstance = null;

    private m_bounds: IAABB;
    private m_expandBias: IVector3D;
    private m_boundsEntity: IRenderEntity;

    initialize(rscene: IRendererScene, fboIndex: number = 0, occlusionRProcessIDList: number[] = null): void {

        if (this.m_rscene == null) {

            this.m_rscene = rscene;
            let eb = this.m_rscene.entityBlock;
            this.m_bounds = eb.createAABB();
            this.m_expandBias = eb.createVector3D(10.0, 10.0, 10.0);
            this.m_testPlane.__tV0 = eb.createVector3D();
            this.m_testPlane.nv = eb.createVector3D(0.0, 1.0, 0.0);

            let mb = this.m_rscene.materialBlock;

            this.m_preDecor = new OutlinePreDecorator();
            this.m_preMaterial = mb.createSimpleMaterial(this.m_preDecor);
            this.m_preMaterial.initializeByCodeBuf(false);

            this.m_preColorRTT = this.m_rscene.textureBlock.createRTTTex2D(32, 32, false);
            this.m_outLineRTT = this.m_rscene.textureBlock.createRTTTex2D(32, 32, false);

            this.m_colorFBO = this.m_rscene.createFBOInstance();
            this.m_colorFBO.setFBOSizeFactorWithViewPort(this.m_sizeScaleRatio);
            this.m_colorFBO.setClearRGBAColor4f(0.0, 0.0, 0.0, 1.0);
            this.m_colorFBO.createFBOAt(fboIndex, 512, 512, true, false, 0);
            this.m_colorFBO.setRenderToTexture(this.m_preColorRTT, 0);
            this.m_colorFBO.setRProcessIDList(occlusionRProcessIDList);
            this.m_colorFBO.setGlobalMaterial(this.m_preMaterial, false, true);

            this.m_outlineFBO = this.m_rscene.createFBOInstance();
            this.m_outlineFBO.setFBOSizeFactorWithViewPort(this.m_sizeScaleRatio);
            this.m_outlineFBO.setClearRGBAColor4f(0.0, 0.0, 0.0, 0.0);
            this.m_outlineFBO.createFBOAt(fboIndex, 512, 512, true, false, 0);
            this.m_outlineFBO.setRenderToTexture(this.m_outLineRTT, 0);
            this.m_outlineFBO.setRProcessIDList(null);

            this.m_rscene.setRenderToBackBuffer();

            this.m_screenDecor = new OccPostOutLineDecorator(true, this.m_preColorRTT);
            this.m_screenDecor.setRGB3f(1.0, 0.0, 0.0);
            this.m_screenDecor.setThickness(1.0);
            this.m_screenDecor.setDensity(1.5);

            this.m_boundsDecor = new OccPostOutLineDecorator(false, this.m_preColorRTT);
            this.m_boundsDecor.setRGB3f(1.0, 0.0, 0.0);
            this.m_boundsDecor.setThickness(1.0);
            this.m_boundsDecor.setDensity(1.5);

            this.m_outlinePlane = eb.createEntity();
            this.m_outlinePlane.copyMeshFrom(eb.screenPlane);
            this.m_outlinePlane.setMaterial(mb.createSimpleMaterial(this.m_screenDecor));

            this.m_boundsEntity = eb.createEntity();
            this.m_boundsEntity.copyMeshFrom(eb.unitBox);
            this.m_boundsEntity.setMaterial(mb.createSimpleMaterial(this.m_boundsDecor));

            let renderingState = this.m_rscene.getRenderProxy().renderingState;

            let plMaterial = mb.createSimpleMaterial(new OccPostOutLineScreen(this.m_outLineRTT));
            this.m_displayPlane = eb.createEntity();
            this.m_displayPlane.setMaterial(plMaterial);
            this.m_displayPlane.copyMeshFrom(this.m_outlinePlane);
            this.m_displayPlane.setRenderState(renderingState.BACK_TRANSPARENT_ALWAYS_STATE);

        }
    }

    getPreColorRTT(): IRTTTexture {
        return this.m_preColorRTT;
    }
    setFBOSizeScaleRatio(scaleRatio: number): void {
        this.m_sizeScaleRatio = scaleRatio;
        this.m_colorFBO.setFBOSizeFactorWithViewPort(this.m_sizeScaleRatio);
        this.m_outlineFBO.setFBOSizeFactorWithViewPort(this.m_sizeScaleRatio);
    }
    setOutlineThickness(thickness: number): void {
        this.m_screenDecor.setThickness(thickness);
        this.m_boundsDecor.setThickness(thickness);
    }
    setOutlineDensity(density: number): void {
        this.m_screenDecor.setDensity(density);
        this.m_boundsDecor.setDensity(density);
    }

    setOcclusionDensity(density: number): void {
        this.m_screenDecor.setOcclusionDensity(density);
        this.m_boundsDecor.setOcclusionDensity(density);
    }
    setRGB3f(pr: number, pg: number, pb: number): void {
        this.m_screenDecor.setRGB3f(pr, pg, pb);
        this.m_boundsDecor.setRGB3f(pr, pg, pb);
    }
    setPostRenderState(state: number): void {
        this.m_displayPlane.setRenderState(state);
    }
    setTargetList(targets: IRenderEntity[]): void {
        this.m_targets = targets;
    }
    getTargetList(): IRenderEntity[] {
        return this.m_targets;
    }
    setBoundsOffset(offset: number): void {
        if (offset < 1.0) offset = 1.0;
        this.m_expandBias.setXYZ(offset, offset, offset);
    }
    startup(): void {
        this.m_running = true;
    }
    quit(): void {
        this.m_running = false;
    }
    isRunning(): boolean {
        return this.m_running;
    }
    /**
     * draw outline line effect rendring begin
     */
    drawBegin(): void {

        this.m_runningFlag = this.m_running;
        if (this.m_running && this.m_targets != null && this.m_targets.length > 0) {
            if (this.m_targets[0].isInRendererProcess()) {

                this.m_runningFlag = false;

                for (let i: number = 0; i < this.m_targets.length; ++i) {
                    if (this.m_targets[i].isRenderEnabled()) {
                        this.m_runningFlag = true;
                        break;
                    }
                }

                if (this.m_runningFlag) {

                    let rproxy = this.m_rscene.getRenderProxy();
                    let rst = rproxy.renderingState;
                    rproxy.useRenderState(rst.NORMAL_STATE);

                    let colorMask = rproxy.colorMask;
                    let bounds = this.m_bounds;
                    let colorFBO = this.m_colorFBO;

                    this.m_preDecor.setRGB3f(1.0, 0.0, 0.0);
                    colorFBO.runBegin();
                    // colorFBO.lockRenderState(rst.NONE_CULLFACE_NORMAL_STATE);
                    bounds.reset();

                    for (let i = 0; i < this.m_targets.length; ++i) {
                        if (this.m_targets[i].isRenderEnabled()) {
                            // console.log("this.m_targets[i]: ", this.m_targets[i].setRenderState());
                            colorFBO.drawEntity(this.m_targets[i], false, true);
                            bounds.union(this.m_targets[i].getGlobalBounds());
                        }
                    }

                    bounds.expand(this.m_expandBias);
                    // let v = bounds.min;
                    // v.x -= 15.0;
                    // v.y -= 15.0;
                    // v.z -= 15.0;
                    // v = bounds.max;
                    // v.x += 15.0;
                    // v.y += 15.0;
                    // v.z += 15.0;
                    bounds.updateFast();
                    

                    this.m_boundsEntity.setScaleXYZ(bounds.getWidth(), bounds.getHeight(), bounds.getLong());
                    this.m_boundsEntity.setPosition(this.m_bounds.center);
                    this.m_boundsEntity.update();

                    colorFBO.lockColorMask(colorMask.ALL_FALSE);
                    colorFBO.clearDepth(1.0);
                    for (let i: number = 0; i < this.m_targets.length; ++i)
                        this.m_targets[i].setVisible(false);

                    colorFBO.run(false, false, false, true);
                    colorFBO.lockColorMask(colorMask.GREEN_TRUE);
                    for (let i: number = 0; i < this.m_targets.length; ++i)
                        this.m_targets[i].setVisible(true);

                    this.m_preDecor.setRGB3f(0.0, 1.0, 0.0);
                    colorFBO.updateGlobalMaterialUniform();
                    for (let i: number = 0; i < this.m_targets.length; ++i)
                        colorFBO.drawEntity(this.m_targets[i], false, true);

                    colorFBO.runEnd();
                    colorFBO.unlockRenderColorMask();
                    colorFBO.unlockMaterial();
                    // colorFBO.unlockRenderState();
                }
            }
        } else {
            this.m_runningFlag = false;
        }
    }
    /**
     * draw outline effect rendring
     */
    draw(): void {

        if (this.m_runningFlag) {
            // 计算场景摄像机近平面世界坐标空间位置
            let camera = this.m_rscene.getCamera();
            let pv = camera.getNV();
            pv.scaleBy(camera.getZNear() + 1.0);
            pv.addBy(camera.getPosition());
            this.m_testPlane.distance = this.m_testPlane.nv.dot(pv);
            this.m_testPlane.nv.copyFrom(camera.getNV());

            this.m_outlineFBO.runBegin();

            let flag = this.m_testPlane.intersectAABB(this.m_bounds.min, this.m_bounds.max);
            if (flag <= 0) {
                this.m_screenDecor.setTexSize(this.m_colorFBO.getFBOWidth(), this.m_colorFBO.getFBOHeight());
                this.m_outlineFBO.drawEntity(this.m_outlinePlane, false, true);
            }
            else {
                this.m_boundsDecor.setTexSize(this.m_colorFBO.getFBOWidth(), this.m_colorFBO.getFBOHeight());
                this.m_outlineFBO.drawEntity(this.m_boundsEntity, false, true);
            }
            this.m_outlineFBO.runEnd();
            this.m_rscene.setRenderToBackBuffer();
            this.m_rscene.drawEntity(this.m_displayPlane, true, true);
        }
    }

    drawTest(): void {

        if (this.m_running && this.m_targets != null && this.m_targets.length > 0) {
            if (this.m_targets[0].isRenderEnabled()) {
                this.m_colorFBO.runEnd();
                this.m_colorFBO.unlockMaterial();
                this.m_rscene.setRenderToBackBuffer();
            }
        }
    }
    /**
     * draw outline line effect rendring end
     */
    drawEnd(): void {
    }
}