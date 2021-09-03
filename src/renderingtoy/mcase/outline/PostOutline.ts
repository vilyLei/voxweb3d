/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import DisplayEntity from "../../../vox/entity/DisplayEntity";
import RendererScene from "../../../vox/scene/RendererScene";

import PostOutlinePreMaterial from "../material/PostOutlinePreMaterial";
import PostOutlineMaterial from "../material/PostOutlineMaterial";
import Vector3D from "../../../vox/math/Vector3D";
import FBOInstance from "../../../vox/scene/FBOInstance";
import RTTTextureProxy from "../../../vox/texture/RTTTextureProxy";
import ScreenAlignPlaneEntity from "../../../vox/entity/ScreenAlignPlaneEntity";
import RendererState from "../../../vox/render/RendererState";

export default class PostOutline {
    constructor() { }

    private m_rscene: RendererScene = null;

    private m_target: DisplayEntity = null;
    private m_preMaterial: PostOutlinePreMaterial = null;
    private m_postMaterial: PostOutlineMaterial = null;
    private m_postPlane: ScreenAlignPlaneEntity = null;
    private m_running: boolean = true;
    private m_sizeScaleRatio: number = 0.5;
    private m_preColorRTT: RTTTextureProxy = null;
    private m_fboIns: FBOInstance = null;

    initialize(rscene: RendererScene, fboIndex: number = 0): void {

        if (this.m_rscene == null) {

            this.m_rscene = rscene;
            this.m_preMaterial = new PostOutlinePreMaterial();
            this.m_preMaterial.initializeByCodeBuf(false);

            this.m_preColorRTT = this.m_rscene.textureBlock.createRTTTex2D(32, 32);
            
            this.m_fboIns = this.m_rscene.createFBOInstance();
            this.m_fboIns.asynFBOSizeWithViewport();
            this.m_fboIns.setFBOSizeFactorWithViewPort(this.m_sizeScaleRatio);
            this.m_fboIns.setClearRGBAColor4f(0.0, 0.0, 0.0, 1.0);              // set rtt background clear rgba(r=0.3,g=0.0,b=0.0,a=0.0) color
            this.m_fboIns.createFBOAt(fboIndex, 512, 512, true, false);
            this.m_fboIns.setRenderToTexture(this.m_preColorRTT, 0);            // framebuffer color attachment 0

            this.m_rscene.setRenderToBackBuffer();

            this.m_postMaterial = new PostOutlineMaterial();
            this.m_postMaterial.setRGB3f(1.0,0.0,0.0);
            this.m_postMaterial.setThickness(1.0);
            this.m_postMaterial.setDensity(1.5);
            
            this.m_postPlane =  new ScreenAlignPlaneEntity();
            this.m_postMaterial.setTexSize(this.m_rscene.getViewWidth() * 0.5, this.m_rscene.getViewHeight() * 0.5);
            this.m_postPlane.setMaterial( this.m_postMaterial );
            this.m_postPlane.setRenderState( RendererState.BACK_TRANSPARENT_ALWAYS_STATE);
            this.m_postPlane.initialize(-1,-1,2,2, [this.m_preColorRTT]);
            //this.m_rscene.addEntity(scrPlane, 2);
        }
    }

    getpreColorRTT(): RTTTextureProxy {
        return this.m_preColorRTT;
    }
    setFBOSizeScaleRatio(scaleRatio: number): void {
        this.m_sizeScaleRatio = scaleRatio;
        this.m_fboIns.setFBOSizeFactorWithViewPort(this.m_sizeScaleRatio);
    }
    setOutlineThickness(thickness: number): void {
        this.m_postMaterial.setThickness(thickness);
    }
    
    setOutlineDensity( density: number ): void {
        this.m_postMaterial.setDensity(density);
    }
    setRGB3f(pr: number, pg: number, pb: number): void {
        this.m_postMaterial.setRGB3f(pr, pg, pb);
    }
    setPostRenderState(state: number): void {
        this.m_postPlane.setRenderState(state);
    }
    setTarget(target: DisplayEntity): void {
        this.m_target = target;
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
        if (this.m_running && this.m_target != null && this.m_target.isRenderEnabled()) {

            this.m_fboIns.setGlobalMaterial( this.m_preMaterial );
            this.m_fboIns.runBegin();
            this.m_fboIns.drawEntity( this.m_target );

        }
    }
    /**
     * draw outline
     */
    draw(): void {

        let entity: DisplayEntity = this.m_target;
        if (this.m_running && entity != null && entity.isRenderEnabled()) {

            this.m_fboIns.runEnd();
            this.m_fboIns.unlockMaterial();
            this.m_rscene.setRenderToBackBuffer();

            this.m_postMaterial.setTexSize(this.m_rscene.getViewWidth() * this.m_sizeScaleRatio, this.m_rscene.getViewHeight() * this.m_sizeScaleRatio);
            this.m_rscene.drawEntity( this.m_postPlane );
        }

    }
    /**
     * draw outline line end
     */
    drawEnd(): void {
    }
}