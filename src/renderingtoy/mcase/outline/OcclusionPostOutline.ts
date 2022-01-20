/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IRenderEntity from "../../../vox/render/IRenderEntity";
import IRendererScene from "../../../vox/scene/IRendererScene";

import PostOutlinePreMaterial from "../material/PostOutlinePreMaterial";
import OcclusionPostOutlineMaterial from "../material/OcclusionPostOutlineMaterial";
import { OccPostOutLineDecorator } from "../material/OccPostOutLineDecorator";
import { OccPostOutLineScreen } from "../material/OccPostOutLineScreen";
import { OutlinePreDecorator } from "../material/OutlinePreDecorator";
import Vector3D from "../../../vox/math/Vector3D";
import { IFBOInstance } from "../../../vox/scene/IFBOInstance";
// import RTTTextureProxy from "../../../vox/texture/RTTTextureProxy";
// import ScreenAlignPlaneEntity from "../../../vox/entity/ScreenAlignPlaneEntity";
// import ScreenPlaneMaterial from "../../../vox/material/mcase/ScreenPlaneMaterial";
import RendererState from "../../../vox/render/RendererState";
import AABB from "../../../vox/geom/AABB";
// import Box3DEntity from "../../../vox/entity/Box3DEntity";
import Plane from "../../../vox/geom/Plane";
import { IRTTTexture } from "../../../vox/render/texture/IRTTTexture";
import IRenderMaterial from "../../../vox/render/IRenderMaterial";

export default class OcclusionPostOutline {
    constructor() { }

    private m_rscene: IRendererScene = null;

    private m_targets: IRenderEntity[] = null;
    private m_preDecor: OutlinePreDecorator = null;
    private m_preMaterial: IRenderMaterial = null;
    // private m_preMaterial: PostOutlinePreMaterial = null;
    private m_outlineMaterial0: OccPostOutLineDecorator = null;//OcclusionPostOutlineMaterial = null;
    private m_outlineMaterial1: OccPostOutLineDecorator = null;//OcclusionPostOutlineMaterial = null;
    // private m_outlinePlane: ScreenAlignPlaneEntity = null;
    private m_outlinePlane: IRenderEntity = null;
    private m_displayPlane: IRenderEntity = null;
    private m_running: boolean = true;
    private m_runningFlag: boolean = true;
    private m_sizeScaleRatio: number = 0.5;
    private m_preColorRTT: IRTTTexture = null;
    private m_outLineRTT: IRTTTexture = null;
    private m_preColorFboIns: IFBOInstance = null;
    private m_outlineFboIns: IFBOInstance = null;
    private m_boundsOffset: number = 10.0;
    private m_bounds: AABB = new AABB();
    // private m_boundsEntity: Box3DEntity = new Box3DEntity();
    private m_boundsEntity: IRenderEntity;// = new Box3DEntity();

    initialize(rscene: IRendererScene, fboIndex: number = 0, occlusionRProcessIDList: number[] = null): void {

        if (this.m_rscene == null) {

            this.m_rscene = rscene;

            let materialBlock = this.m_rscene.materialBlock;

            // this.m_preMaterial = new PostOutlinePreMaterial();
            // this.m_preMaterial.initializeByCodeBuf(false);
            
            this.m_preDecor = new OutlinePreDecorator();
            this.m_preMaterial = materialBlock.createMaterial( this.m_preDecor );
            this.m_preMaterial.initializeByCodeBuf(false);

            this.m_preColorRTT = this.m_rscene.textureBlock.createRTTTex2D(32, 32, false);
            this.m_outLineRTT = this.m_rscene.textureBlock.createRTTTex2D(32, 32, false);

            this.m_preColorFboIns = this.m_rscene.createFBOInstance();
            //this.m_preColorFboIns.asynFBOSizeWithViewport();
            this.m_preColorFboIns.setFBOSizeFactorWithViewPort(this.m_sizeScaleRatio);
            this.m_preColorFboIns.setClearRGBAColor4f(0.0, 0.0, 0.0, 1.0);
            this.m_preColorFboIns.createFBOAt(fboIndex, 512, 512, true, false, 0);
            this.m_preColorFboIns.setRenderToTexture(this.m_preColorRTT, 0);
            this.m_preColorFboIns.setRProcessIDList(occlusionRProcessIDList);
            
            this.m_preColorFboIns.setGlobalMaterial(this.m_preMaterial, false, true);

            this.m_outlineFboIns = this.m_rscene.createFBOInstance();
            //this.m_outlineFboIns.asynFBOSizeWithViewport();
            this.m_outlineFboIns.setFBOSizeFactorWithViewPort(this.m_sizeScaleRatio);
            this.m_outlineFboIns.setClearRGBAColor4f(0.0, 0.0, 0.0, 0.0);
            this.m_outlineFboIns.createFBOAt(fboIndex, 512, 512, true, false, 0);
            this.m_outlineFboIns.setRenderToTexture(this.m_outLineRTT, 0);
            this.m_outlineFboIns.setRProcessIDList(null);

            this.m_rscene.setRenderToBackBuffer();
            //OccPostOutLineDecorator
            this.m_outlineMaterial0 = new OccPostOutLineDecorator(true, this.m_preColorRTT );
            //let tlM0 = materialBlock.createMaterial( this.m_outlineMaterial0 );
            // this.m_outlineMaterial0 = new OcclusionPostOutlineMaterial();
            this.m_outlineMaterial0.setRGB3f(1.0, 0.0, 0.0);
            this.m_outlineMaterial0.setThickness(1.0);
            this.m_outlineMaterial0.setDensity(1.5);
            // this.m_outlineMaterial0.setTextureList([this.m_preColorRTT]);

            
            this.m_outlineMaterial1 = new OccPostOutLineDecorator(false, this.m_preColorRTT );
            //let tlM1 = materialBlock.createMaterial( this.m_outlineMaterial1 );
            // this.m_outlineMaterial1 = new OcclusionPostOutlineMaterial(false);
            this.m_outlineMaterial1.setRGB3f(1.0, 0.0, 0.0);
            this.m_outlineMaterial1.setThickness(1.0);
            this.m_outlineMaterial1.setDensity(1.5);
            // this.m_outlineMaterial1.setTextureList([this.m_preColorRTT]);

            //this.m_outlinePlane = new ScreenAlignPlaneEntity();
            this.m_outlinePlane = this.m_rscene.entityBlock.createEntity();
            this.m_outlinePlane.copyMeshFrom( this.m_rscene.entityBlock.screenPlane );
            this.m_outlinePlane.setMaterial( materialBlock.createMaterial( this.m_outlineMaterial0 ) );
            // this.m_outlinePlane.initialize(-1, -1, 2, 2);

            this.m_boundsEntity = this.m_rscene.entityBlock.createEntity();
            this.m_boundsEntity.copyMeshFrom( this.m_rscene.entityBlock.unitBox );
            this.m_boundsEntity.setMaterial( materialBlock.createMaterial( this.m_outlineMaterial1 ) );
            // this.m_boundsEntity.initializeCube(1.0);
            // for test
            //  (this.m_boundsEntity.getMaterial() as any).setRGBA4f(1.0,1.0,1.0,0.5);

            // this.m_displayPlane = new ScreenAlignPlaneEntity();
            //let plDecor = new OccPostOutLineScreen();
            let plMaterial = materialBlock.createMaterial( new OccPostOutLineScreen( this.m_outLineRTT ) );
            // let mp = new ScreenPlaneMaterial();
            // mp.setTextureList( [this.m_outLineRTT] );
            this.m_displayPlane = this.m_rscene.entityBlock.createEntity();
            this.m_displayPlane.setMaterial( plMaterial );
            this.m_displayPlane.copyMeshFrom( this.m_outlinePlane );
            this.m_displayPlane.setRenderState(RendererState.BACK_TRANSPARENT_ALWAYS_STATE);
            // this.m_displayPlane.initialize(-1, -1, 2, 2, [this.m_outLineRTT]);

        }
    }

    getPreColorRTT(): IRTTTexture {
        return this.m_preColorRTT;
    }
    setFBOSizeScaleRatio(scaleRatio: number): void {
        this.m_sizeScaleRatio = scaleRatio;
        this.m_preColorFboIns.setFBOSizeFactorWithViewPort(this.m_sizeScaleRatio);
        this.m_outlineFboIns.setFBOSizeFactorWithViewPort(this.m_sizeScaleRatio);
    }
    setOutlineThickness(thickness: number): void {
        this.m_outlineMaterial0.setThickness(thickness);
        this.m_outlineMaterial1.setThickness(thickness);
    }
    setOutlineDensity(density: number): void {
        this.m_outlineMaterial0.setDensity(density);
        this.m_outlineMaterial1.setDensity(density);
    }

    setOcclusionDensity(density: number): void {
        this.m_outlineMaterial0.setOcclusionDensity(density);
        this.m_outlineMaterial1.setOcclusionDensity(density);
    }
    setRGB3f(pr: number, pg: number, pb: number): void {
        this.m_outlineMaterial0.setRGB3f(pr, pg, pb);
        this.m_outlineMaterial1.setRGB3f(pr, pg, pb);
    }
    setPostRenderState(state: number): void {
        this.m_displayPlane.setRenderState(state);
    }
    setTargetList(targets: IRenderEntity[]): void {
        this.m_targets = targets;
    }
    setBoundsOffset(offset: number): void {
        this.m_boundsOffset = offset >= 1.0 ? offset : 1.0;
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

                    // this.m_preMaterial.setRGB3f(1.0, 0.0, 0.0);
                    this.m_preDecor.setRGB3f(1.0, 0.0, 0.0);
                    // this.m_preColorFboIns.setGlobalMaterial(this.m_preMaterial, false, true);
                    this.m_preColorFboIns.runBegin();

                    this.m_bounds.reset();
                    for (let i: number = 0; i < this.m_targets.length; ++i) {
                        if (this.m_targets[i].isRenderEnabled()) {
                            this.m_preColorFboIns.drawEntity(this.m_targets[i], false, true);
                            this.m_bounds.union(this.m_targets[i].getGlobalBounds());
                        }
                    }
                    this.m_bounds.update();
                    let v3 = this.m_bounds.min;
                    v3.x -= this.m_boundsOffset;
                    v3.y -= this.m_boundsOffset;
                    v3.z -= this.m_boundsOffset;
                    v3 = this.m_bounds.max;
                    v3.x += this.m_boundsOffset;
                    v3.y += this.m_boundsOffset;
                    v3.z += this.m_boundsOffset;
                    // this.m_boundsEntity.initialize(this.m_bounds.min, this.m_bounds.max);
                    // this.m_boundsEntity.updateMeshToGpu();
                    let minV = this.m_bounds.min;
                    let maxV = this.m_bounds.max;
                    v3 = this.m_bounds.center;
                    this.m_boundsEntity.setScaleXYZ(maxV.x - minV.x, maxV.y - minV.y, maxV.z - minV.z);
                    this.m_boundsEntity.setXYZ(v3.x, v3.y, v3.z);
                    this.m_boundsEntity.update();

                    this.m_preColorFboIns.lockColorMask(RendererState.COLOR_MASK_ALL_FALSE);
                    this.m_preColorFboIns.clearDepth(1.0);
                    for (let i: number = 0; i < this.m_targets.length; ++i)
                        this.m_targets[i].setVisible(false);

                    this.m_preColorFboIns.run(false, false, false, true);
                    this.m_preColorFboIns.lockColorMask(RendererState.COLOR_MASK_GREEN_TRUE);
                    for (let i: number = 0; i < this.m_targets.length; ++i)
                        this.m_targets[i].setVisible(true);

                    // this.m_preMaterial.setRGB3f(0.0, 1.0, 0.0);
                    this.m_preDecor.setRGB3f(0.0, 1.0, 0.0);
                    this.m_preColorFboIns.updateGlobalMaterialUniform();
                    for (let i: number = 0; i < this.m_targets.length; ++i)
                        this.m_preColorFboIns.drawEntity(this.m_targets[i], false, true);

                    this.m_preColorFboIns.runEnd();
                    this.m_preColorFboIns.unlockRenderColorMask();
                    this.m_preColorFboIns.unlockMaterial();
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

                this.m_outlineFboIns.runBegin();

                let flag = this.m_testPlane.intersectAABB(this.m_bounds.min, this.m_bounds.max);
                if (flag <= 0) {
                    this.m_outlineMaterial0.setTexSize(this.m_preColorFboIns.getFBOWidth(), this.m_preColorFboIns.getFBOHeight());
                    this.m_outlineFboIns.drawEntity(this.m_outlinePlane, false, true);
                }
                else {
                    this.m_outlineMaterial1.setTexSize(this.m_preColorFboIns.getFBOWidth(), this.m_preColorFboIns.getFBOHeight());
                    this.m_outlineFboIns.drawEntity(this.m_boundsEntity, false, true);
                }
                this.m_outlineFboIns.runEnd();
                this.m_rscene.setRenderToBackBuffer();
                this.m_rscene.drawEntity(this.m_displayPlane, true, true);
            }
        }
    }

    drawTest(): void {

        if (this.m_running && this.m_targets != null && this.m_targets.length > 0) {
            if (this.m_targets[0].isRenderEnabled()) {
                this.m_preColorFboIns.runEnd();
                this.m_preColorFboIns.unlockMaterial();
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