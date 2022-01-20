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
import Vector3D from "../../../vox/math/Vector3D";
import { IFBOInstance } from "../../../vox/scene/IFBOInstance";
import RendererState from "../../../vox/render/RendererState";
import AABB from "../../../vox/geom/AABB";
import Plane from "../../../vox/geom/Plane";
import { IRTTTexture } from "../../../vox/render/texture/IRTTTexture";
import IRenderMaterial from "../../../vox/render/IRenderMaterial";

export default class OcclusionPostOutline {
    constructor() { }

    private m_rscene: IRendererScene = null;

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
    
    private m_bounds: AABB = new AABB();
    private m_expandBias: Vector3D = new Vector3D(10.0, 10.0, 10.0);
    private m_boundsEntity: IRenderEntity;

    initialize(rscene: IRendererScene, fboIndex: number = 0, occlusionRProcessIDList: number[] = null): void {

        if (this.m_rscene == null) {

            this.m_rscene = rscene;

            let materialBlock = this.m_rscene.materialBlock;

            this.m_preDecor = new OutlinePreDecorator();
            this.m_preMaterial = materialBlock.createSimpleMaterial( this.m_preDecor );
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

            this.m_screenDecor = new OccPostOutLineDecorator(true, this.m_preColorRTT );
            this.m_screenDecor.setRGB3f(1.0, 0.0, 0.0);
            this.m_screenDecor.setThickness(1.0);
            this.m_screenDecor.setDensity(1.5);
            
            this.m_boundsDecor = new OccPostOutLineDecorator(false, this.m_preColorRTT );
            this.m_boundsDecor.setRGB3f(1.0, 0.0, 0.0);
            this.m_boundsDecor.setThickness(1.0);
            this.m_boundsDecor.setDensity(1.5);

            this.m_outlinePlane = this.m_rscene.entityBlock.createEntity();
            this.m_outlinePlane.copyMeshFrom( this.m_rscene.entityBlock.screenPlane );
            this.m_outlinePlane.setMaterial( materialBlock.createSimpleMaterial( this.m_screenDecor ) );

            this.m_boundsEntity = this.m_rscene.entityBlock.createEntity();
            this.m_boundsEntity.copyMeshFrom( this.m_rscene.entityBlock.unitBox );
            this.m_boundsEntity.setMaterial( materialBlock.createSimpleMaterial( this.m_boundsDecor ) );
            
            let plMaterial = materialBlock.createSimpleMaterial( new OccPostOutLineScreen( this.m_outLineRTT ) );
            this.m_displayPlane = this.m_rscene.entityBlock.createEntity();
            this.m_displayPlane.setMaterial( plMaterial );
            this.m_displayPlane.copyMeshFrom( this.m_outlinePlane );
            this.m_displayPlane.setRenderState(RendererState.BACK_TRANSPARENT_ALWAYS_STATE);

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
    setBoundsOffset(offset: number): void {
        if(offset < 1.0) offset = 1.0;
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
     * draw outline line begin
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

                    this.m_preDecor.setRGB3f(1.0, 0.0, 0.0);
                    this.m_colorFBO.runBegin();

                    this.m_bounds.reset();
                    for (let i: number = 0; i < this.m_targets.length; ++i) {
                        if (this.m_targets[i].isRenderEnabled()) {
                            this.m_colorFBO.drawEntity(this.m_targets[i], false, true);
                            this.m_bounds.union(this.m_targets[i].getGlobalBounds());
                        }
                    }

                    this.m_bounds.expand( this.m_expandBias );
                    this.m_bounds.updateFast();
                    
                    let minV = this.m_bounds.min;
                    let maxV = this.m_bounds.max;
                    let v3 = this.m_bounds.center;
                    this.m_boundsEntity.setScaleXYZ(maxV.x - minV.x, maxV.y - minV.y, maxV.z - minV.z);
                    this.m_boundsEntity.setXYZ(v3.x, v3.y, v3.z);
                    this.m_boundsEntity.update();

                    this.m_colorFBO.lockColorMask(RendererState.COLOR_MASK_ALL_FALSE);
                    this.m_colorFBO.clearDepth(1.0);
                    for (let i: number = 0; i < this.m_targets.length; ++i)
                        this.m_targets[i].setVisible(false);

                    this.m_colorFBO.run(false, false, false, true);
                    this.m_colorFBO.lockColorMask(RendererState.COLOR_MASK_GREEN_TRUE);
                    for (let i: number = 0; i < this.m_targets.length; ++i)
                        this.m_targets[i].setVisible(true);

                    this.m_preDecor.setRGB3f(0.0, 1.0, 0.0);
                    this.m_colorFBO.updateGlobalMaterialUniform();
                    for (let i: number = 0; i < this.m_targets.length; ++i)
                        this.m_colorFBO.drawEntity(this.m_targets[i], false, true);

                    this.m_colorFBO.runEnd();
                    this.m_colorFBO.unlockRenderColorMask();
                    this.m_colorFBO.unlockMaterial();
                }
            }
        }
    }
    private m_testPlane: Plane = new Plane();
    /**
     * draw outline
     */
    draw(): void {

        if (this.m_runningFlag && this.m_targets != null && this.m_targets.length > 0) {
            if (this.m_targets[0].isRenderEnabled()) {

                // 计算场景摄像机近平面世界坐标空间位置
                let camera = this.m_rscene.getCamera();
                let pv: Vector3D = camera.getNV();
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
     * draw outline line end
     */
    drawEnd(): void {
    }
}