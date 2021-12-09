/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import DisplayEntity from "../../../vox/entity/DisplayEntity";
import RendererScene from "../../../vox/scene/RendererScene";

import PostOutlinePreMaterial from "../material/PostOutlinePreMaterial";
import OcclusionPostOutlineMaterial from "../material/OcclusionPostOutlineMaterial";
import Vector3D from "../../../vox/math/Vector3D";
import FBOInstance from "../../../vox/scene/FBOInstance";
import RTTTextureProxy from "../../../vox/texture/RTTTextureProxy";
import ScreenAlignPlaneEntity from "../../../vox/entity/ScreenAlignPlaneEntity";
import RendererState from "../../../vox/render/RendererState";
import AABB from "../../../vox/geom/AABB";
import Box3DEntity from "../../../vox/entity/Box3DEntity";

export default class OcclusionPostOutline {
    constructor() { }

    private m_rscene: RendererScene = null;

    private m_targets: DisplayEntity[] = null;
    private m_preMaterial: PostOutlinePreMaterial = null;
    private m_outlineMaterial: OcclusionPostOutlineMaterial = null;
    private m_outlinePlane: ScreenAlignPlaneEntity = null;
    private m_displayPlane: ScreenAlignPlaneEntity = null;
    private m_running: boolean = true;
    private m_sizeScaleRatio: number = 0.5;
    private m_preColorRTT: RTTTextureProxy = null;
    private m_outLineRTT: RTTTextureProxy = null;
    private m_preColorFboIns: FBOInstance = null;
    private m_outlineFboIns: FBOInstance = null;

    private m_bounds: AABB = new AABB();
    private m_boundsEntity: Box3DEntity = new Box3DEntity();

    initialize(rscene: RendererScene, fboIndex: number = 0, occlusionRProcessIDList: number[] = null): void {

        if (this.m_rscene == null) {

            this.m_rscene = rscene;
            this.m_preMaterial = new PostOutlinePreMaterial();
            this.m_preMaterial.initializeByCodeBuf(false);

            this.m_preColorRTT = this.m_rscene.textureBlock.createRTTTex2D(32, 32);
            this.m_outLineRTT = this.m_rscene.textureBlock.createRTTTex2D(32, 32);

            this.m_preColorFboIns = this.m_rscene.createFBOInstance();
            //this.m_preColorFboIns.asynFBOSizeWithViewport();
            this.m_preColorFboIns.setFBOSizeFactorWithViewPort(this.m_sizeScaleRatio);
            this.m_preColorFboIns.setClearRGBAColor4f(0.0, 0.0, 0.0, 1.0);
            this.m_preColorFboIns.createFBOAt(fboIndex, 512, 512, true, false);
            this.m_preColorFboIns.setRenderToTexture(this.m_preColorRTT, 0);
            this.m_preColorFboIns.setRProcessIDList(occlusionRProcessIDList);

            this.m_outlineFboIns = this.m_rscene.createFBOInstance();
            //this.m_outlineFboIns.asynFBOSizeWithViewport();
            this.m_outlineFboIns.setFBOSizeFactorWithViewPort(this.m_sizeScaleRatio);
            this.m_outlineFboIns.setClearRGBAColor4f(0.0, 0.0, 0.0, 0.0);
            this.m_outlineFboIns.createFBOAt(fboIndex, 512, 512, true, false);
            this.m_outlineFboIns.setRenderToTexture(this.m_outLineRTT, 0);
            this.m_outlineFboIns.setRProcessIDList(null);

            this.m_rscene.setRenderToBackBuffer();

            this.m_outlineMaterial = new OcclusionPostOutlineMaterial();
            this.m_outlineMaterial.setRGB3f(1.0, 0.0, 0.0);
            this.m_outlineMaterial.setThickness(1.0);
            this.m_outlineMaterial.setDensity(1.5);

            this.m_outlinePlane = new ScreenAlignPlaneEntity();
            this.m_outlineMaterial.setTexSize(this.m_rscene.getViewWidth() * 0.5, this.m_rscene.getViewHeight() * 0.5);
            this.m_outlinePlane.setMaterial(this.m_outlineMaterial);
            this.m_outlinePlane.initialize(-1, -1, 2, 2, [this.m_preColorRTT]);
            
            this.m_displayPlane = new ScreenAlignPlaneEntity();
            //this.m_displayPlane.copyMeshFrom( this.m_outlinePlane );
            this.m_displayPlane.setRenderState(RendererState.BACK_TRANSPARENT_ALWAYS_STATE);
            this.m_displayPlane.initialize(-1, -1, 2, 2, [this.m_outLineRTT]);

            
            this.m_boundsEntity.initializeCube(10);
            //this.m_boundsEntity.setRenderState(RendererState.NONE_TRANSPARENT_ALWAYS_STATE);
            this.m_boundsEntity.setRenderState(RendererState.BACK_TRANSPARENT_ALWAYS_STATE);
            // for test
            (this.m_boundsEntity.getMaterial() as any).setRGBA4f(1.0,1.0,1.0,0.5);
        }
    }

    getpreColorRTT(): RTTTextureProxy {
        return this.m_preColorRTT;
    }
    setFBOSizeScaleRatio(scaleRatio: number): void {
        this.m_sizeScaleRatio = scaleRatio;
        this.m_preColorFboIns.setFBOSizeFactorWithViewPort(this.m_sizeScaleRatio);
        this.m_outlineFboIns.setFBOSizeFactorWithViewPort(this.m_sizeScaleRatio);
    }
    setOutlineThickness(thickness: number): void {
        this.m_outlineMaterial.setThickness(thickness);
    }
    setOutlineDensity(density: number): void {
        this.m_outlineMaterial.setDensity(density);
    }

    setOcclusionDensity(density: number): void {
        this.m_outlineMaterial.setOcclusionDensity(density);
    }
    setRGB3f(pr: number, pg: number, pb: number): void {
        this.m_outlineMaterial.setRGB3f(pr, pg, pb);
    }
    setPostRenderState(state: number): void {
        this.m_displayPlane.setRenderState(state);
    }
    setTargetList(targets: DisplayEntity[]): void {
        this.m_targets = targets;
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
        
        if(this.m_running && this.m_targets != null && this.m_targets.length > 0) {
            if (this.m_targets[0].isRenderEnabled()) {

                this.m_preMaterial.setRGB3f(1.0, 0.0, 0.0);
                this.m_preColorFboIns.setGlobalMaterial(this.m_preMaterial, false, true);
                this.m_preColorFboIns.runBegin();

                this.m_bounds.reset();
                for(let i: number = 0; i < this.m_targets.length; ++i) {
                    this.m_preColorFboIns.drawEntity(this.m_targets[i]);
                    this.m_bounds.union(this.m_targets[i].getGlobalBounds());
                }
                let v3 = this.m_bounds.min;
                v3.x -= 10.0;
                v3.y -= 10.0;
                v3.z -= 10.0;
                v3 = this.m_bounds.max;
                v3.x += 10.0;
                v3.y += 10.0;
                v3.z += 10.0;
                this.m_boundsEntity.initialize(this.m_bounds.min, this.m_bounds.max);
                this.m_boundsEntity.updateMeshToGpu();

                this.m_preColorFboIns.lockColorMask(RendererState.COLOR_MASK_ALL_FALSE);
                this.m_preColorFboIns.clearDepth(1.0);
                for(let i: number = 0; i < this.m_targets.length; ++i)
                    this.m_targets[i].setVisible(false);

                this.m_preColorFboIns.run(false, false, false);
                this.m_preColorFboIns.lockColorMask(RendererState.COLOR_MASK_GREEN_TRUE);
                for(let i: number = 0; i < this.m_targets.length; ++i)
                    this.m_targets[i].setVisible(true);

                this.m_preMaterial.setRGB3f(0.0, 1.0, 0.0);
                this.m_preColorFboIns.updateGlobalMaterialUniform();
                for(let i: number = 0; i < this.m_targets.length; ++i)
                    this.m_preColorFboIns.drawEntity(this.m_targets[i]);

                this.m_preColorFboIns.runEnd();                
                this.m_preColorFboIns.unlockRenderColorMask();
                this.m_preColorFboIns.unlockMaterial();
            }
        }
    }
    /**
     * draw outline
     */
    draw(): void {

        if(this.m_running && this.m_targets != null && this.m_targets.length > 0) {
            if (this.m_targets[0].isRenderEnabled()) {

                // this.m_rscene.setRenderToBackBuffer();
                // this.m_outlineMaterial.setTexSize(this.m_rscene.getViewWidth() * this.m_sizeScaleRatio, this.m_rscene.getViewHeight() * this.m_sizeScaleRatio);
                // this.m_rscene.drawEntity(this.m_outlinePlane);
                // //  this.m_rscene.drawEntity(this.m_boundsEntity);

                this.m_outlineMaterial.setTexSize(this.m_preColorFboIns.getFBOWidth(), this.m_preColorFboIns.getFBOHeight());
                this.m_outlineFboIns.runBegin();
                this.m_outlineFboIns.drawEntity(this.m_outlinePlane);
                // //for test
                // this.m_outlineFboIns.drawEntity(this.m_boundsEntity);
                this.m_outlineFboIns.runEnd();
                this.m_rscene.setRenderToBackBuffer();
                this.m_rscene.drawEntity(this.m_displayPlane, true, true);
            }
        }
    }

    drawTest(): void {

        if(this.m_running && this.m_targets != null && this.m_targets.length > 0) {
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