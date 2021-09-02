/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import DisplayEntity from "../../../vox/entity/DisplayEntity";

import RendererInstanceContext from "../../../vox/scene/RendererInstanceContext";
import RendererScene from "../../../vox/scene/RendererScene";

import RendererState from "../../../vox/render/RendererState";
import PostOutlinePreMaterial from "../material/PostOutlinePreMaterial";
import { GLStencilFunc, GLStencilOp } from "../../../vox/render/RenderConst";
import DebugFlag from "../../../vox/debug/DebugFlag";
import Color4 from "../../../vox/material/Color4";
import Vector3D from "../../../vox/math/Vector3D";
import FBOInstance from "../../../vox/scene/FBOInstance";
import RTTTextureProxy from "../../../vox/texture/RTTTextureProxy";

export default class PostOutline {
    constructor() { }

    private m_rscene: RendererScene = null;

    private m_target: DisplayEntity = null;
    private m_preMaterial: PostOutlinePreMaterial = null;
    private m_running: boolean = true;
    private m_scaleV: Vector3D = new Vector3D();
    private m_thickness: number = 10.0;
    private m_preColorRTT: RTTTextureProxy = null;
    private m_fboIns: FBOInstance = null;

    initialize(rscene: RendererScene, fboIndex: number = 0): void {

        if (this.m_rscene == null) {

            this.m_rscene = rscene;
            this.m_preMaterial = new PostOutlinePreMaterial();
            this.m_preMaterial.initializeByCodeBuf(false);

            this.m_preColorRTT = this.m_rscene.textureBlock.createRTTTex2D(32, 32);
            
            this.m_fboIns = this.m_rscene.createFBOInstance();
            //this.m_fboIns.asynFBOSizeWithViewport();
            this.m_fboIns.setClearRGBAColor4f(0.0, 0.0, 0.0, 1.0);              // set rtt background clear rgba(r=0.3,g=0.0,b=0.0,a=0.0) color
            this.m_fboIns.createFBOAt(fboIndex, 512, 512, true, false);
            this.m_fboIns.setRenderToTexture(this.m_preColorRTT, 0);            // framebuffer color attachment 0

            this.m_rscene.setRenderToBackBuffer();
        }
    }
    getpreColorRTT(): RTTTextureProxy {
        return this.m_preColorRTT;
    }
    setOutlineThickness(thickness: number): void {
        this.m_thickness = thickness;
    }
    setRGB3f(pr: number, pg: number, pb: number): void {
        //this.m_preMaterial.setRGB3f(pr, pg, pb);
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

            // draw outline line begin
            this.m_rscene.resetUniform();
            this.m_rscene.resetState();
        }
    }
    /**
     * draw outline
     */
    draw(): void {

        let entity: DisplayEntity = this.m_target;
        if (this.m_running && entity != null && entity.isRenderEnabled()) {

            this.m_fboIns.setGlobalMaterial( this.m_preMaterial );
            this.m_fboIns.runBegin();
            this.m_fboIns.drawEntity( entity );
            this.m_fboIns.runEnd();
            this.m_fboIns.unlockMaterial();
        }

    }
    /**
     * draw outline line end
     */
    drawEnd(): void {
    }
}