/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import DisplayEntity from "../../../vox/entity/DisplayEntity";

import RendererInstanceContext from "../../../vox/scene/RendererInstanceContext";
import RendererScene from "../../../vox/scene/RendererScene";

// import RendererState from "../../../vox/render/RendererState";
import { GLStencilFunc, GLStencilOp } from "../../../vox/render/RenderConst";
import Default3DMaterial from "../../../vox/material/mcase/Default3DMaterial";
import DebugFlag from "../../../vox/debug/DebugFlag";
import Color4 from "../../../vox/material/Color4";
import Vector3D from "../../../vox/math/Vector3D";
import { IStencil } from "../../../vox/render/rendering/IStencil";

export default class StencilOutline {
    constructor() { }

    private m_rscene: RendererScene = null;
    private m_rctx: RendererInstanceContext = null;

    private m_target: DisplayEntity = null;
    private m_material: Default3DMaterial = null;
    private m_running: boolean = true;
    private m_scaleV: Vector3D = new Vector3D();
    private m_thickness: number = 10.0;
    private m_stencil: IStencil;
    initialize(rscene: RendererScene): void {

        if (this.m_rscene == null) {
            
            this.m_stencil = this.m_rscene.getRenderProxy().stencil;
            this.m_rscene = rscene;
            this.m_rctx = rscene.getRendererContext();
            this.m_material = new Default3DMaterial();
            this.m_material.initializeByCodeBuf(false);
        }
    }
    setOutlineThickness(thickness: number): void {
        this.m_thickness = thickness;
    }
    setRGB3f(pr: number, pg: number, pb: number): void {
        this.m_material.setRGB3f(pr, pg, pb);
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
            this.m_stencil.setStencilMask(0x0);
            this.m_target.setVisible(false);
        }
    }
    /**
     * draw outline
     */
    draw(): void {

        let entity: DisplayEntity = this.m_target;
        if (this.m_running && entity != null && entity.isRenderEnabled()) {

            this.m_stencil.setStencilOp(GLStencilOp.KEEP, GLStencilOp.KEEP, GLStencilOp.REPLACE);
            this.m_stencil.setStencilFunc(GLStencilFunc.ALWAYS, 1, 0xFF);
            this.m_stencil.setStencilMask(0xFF);
            entity.setVisible(true);
            this.m_rscene.drawEntity(entity);
            this.m_stencil.setStencilFunc(GLStencilFunc.NOTEQUAL, 1, 0xFF);
            this.m_stencil.setStencilMask(0x0);

            entity.getScaleXYZ( this.m_scaleV );
            
            this.m_rctx.unlockMaterial();
            this.m_rctx.useGlobalMaterial(this.m_material);

            let ds: number = 1.0 + this.m_thickness/Math.max(entity.getGlobalBounds().getLong(), entity.getGlobalBounds().getWidth(),entity.getGlobalBounds().getHeight());
            entity.setScaleXYZ(this.m_scaleV.x * ds, this.m_scaleV.y * ds, this.m_scaleV.z * ds);
            //entity.setScaleXYZ(2.1, 2.1, 2.1);
            entity.update();

            this.m_rscene.drawEntity(entity, true, true);

            entity.setScaleXYZ(this.m_scaleV.x, this.m_scaleV.y, this.m_scaleV.z);
            entity.update();
            
            this.m_stencil.setStencilFunc(GLStencilFunc.ALWAYS, 1, 0x0);
            this.m_stencil.setStencilMask(0xFF);

            // draw outline line end
            this.m_rctx.unlockMaterial();
        }

    }
    /**
     * draw outline line end
     */
    drawEnd(): void {
    }
}