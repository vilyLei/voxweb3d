/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import RendererState from "../../vox/render/RendererState";
import IRenderProcess from "../../vox/render/IRenderProcess";
import IRendererInstance from "../../vox/scene/IRendererInstance";
import H5FontSystem from "../../vox/text/H5FontSys";
import Text2DEntity from "../../vox2d/text/Text2DEntity";
import IRenderProxy from "../../vox/render/IRenderProxy";
import RendererDevice from "../../vox/render/RendererDevice";
class FPSInfo {
    private m_fps: number = 60;
    private m_lastTime: number = 0;
    private m_times: number = 60;
    private m_dealytime: number = 0;
    constructor() {
    }
    getFPS(): number { return this.m_fps; };
    getFPSStr(): string {
        //return this.m_fps;
        if (this.m_fps > 60) {
            return "60";
        }
        else if (this.m_fps < 10) {
            return "0" + this.m_fps;
        }
        return "" + this.m_fps;
    }
    updateFPS(): void {
        let t: number = Date.now();
        if (this.m_lastTime > 0) {
            --this.m_times;
            if (this.m_times < 1) {
                this.m_fps = Math.round((60000.0) / this.m_dealytime);
                this.m_dealytime = 0;
                this.m_times = 60;
            }
            this.m_dealytime += t - this.m_lastTime;

        }
        this.m_lastTime = t;
    }
}
export default class RendererStatus {
    private m_rprocess: IRenderProcess;
    private m_renderer: IRendererInstance;
    private m_renderProxy: IRenderProxy;
    private m_fpsInfo: FPSInfo = new FPSInfo();
    private m_textFPSNS: Text2DEntity = null;
    private m_textFPS: Text2DEntity = null;
    private m_fps: number = 60;
    // draw call
    private m_drawCallNS: Text2DEntity = null;
    private m_drawCall: Text2DEntity = null;
    private m_drawCalls: number = 0;
    // draw tris
    private m_drawTrisNS: Text2DEntity = null;
    private m_drawTri: Text2DEntity = null;
    private m_drawTris: number = 0;

    // pov
    private m_povNS: Text2DEntity = null;
    private m_pov: Text2DEntity = null;
    private m_povNumber: number = 0;
    constructor() {
    }
    initialize(renderer: IRendererInstance, rprocess: IRenderProcess): void {
        if (this.m_renderer == null) {
            let fontSize: number = 18;
            if (!H5FontSystem.GetInstance().isEnabled()) {
                H5FontSystem.GetInstance().setRenderProxy(renderer.getRenderProxy());
                H5FontSystem.GetInstance().initialize("fontTex", fontSize, 512, 512, false, false);
            }
            this.m_renderProxy = renderer.getRenderProxy();
            this.m_renderer = renderer;
            this.m_rprocess = rprocess;
            
            let hDis: number = H5FontSystem.GetInstance().getFontSize() + 2;
            let py2: number = 2.0;
            let px2: number = 100.0;
            if(RendererDevice.IsMobileWeb()) {
                px2 *= H5FontSystem.GetInstance().getFontSize() / fontSize;
            }
            let px3: number = px2 - 10.0;
            let text2D: Text2DEntity = null;
            text2D = new Text2DEntity();
            text2D.initialize("FPS:");
            text2D.setXY(px3 - text2D.getWidth(), py2);
            this.m_renderer.addEntityToProcess(text2D, this.m_rprocess);
            this.m_textFPSNS = text2D;
            let pw: number = text2D.getWidth();
            text2D = new Text2DEntity();
            text2D.__$setRenderProxy(renderer.getRenderProxy());
            text2D.initialize("600");
            text2D.setXY(px2, 2.0);
            this.m_renderer.addEntityToProcess(text2D, this.m_rprocess);
            this.m_textFPS = text2D;
            // draw call
            py2 += hDis;
            text2D = new Text2DEntity();
            text2D.initialize("DrawCall:");
            text2D.setXY(px3 - text2D.getWidth(), py2);
            this.m_renderer.addEntityToProcess(text2D, this.m_rprocess);
            this.m_drawCallNS = text2D;
            pw = text2D.getWidth();
            text2D = new Text2DEntity();
            text2D.__$setRenderProxy(renderer.getRenderProxy());
            text2D.initialize("00000000");
            text2D.setXY(px2, py2);
            this.m_renderer.addEntityToProcess(text2D, this.m_rprocess);
            this.m_drawCall = text2D;

            // draw tris
            py2 += hDis;
            text2D = new Text2DEntity();
            text2D.initialize("DrawTris:");
            text2D.setXY(px3 - text2D.getWidth(), py2);
            this.m_renderer.addEntityToProcess(text2D, this.m_rprocess);
            this.m_drawTrisNS = text2D;
            pw = text2D.getWidth();
            text2D = new Text2DEntity();
            text2D.__$setRenderProxy(renderer.getRenderProxy());
            text2D.initialize("00000000000");
            text2D.setXY(px2, py2);
            this.m_renderer.addEntityToProcess(text2D, this.m_rprocess);
            this.m_drawTri = text2D;


            // pov
            py2 += hDis;
            text2D = new Text2DEntity();
            text2D.initialize("POV:");
            text2D.setXY(px3 - text2D.getWidth(), py2);
            this.m_renderer.addEntityToProcess(text2D, this.m_rprocess);
            this.m_povNS = text2D;
            pw = text2D.getWidth();
            text2D = new Text2DEntity();
            text2D.__$setRenderProxy(renderer.getRenderProxy());
            text2D.initialize("000");
            text2D.setXY(px2, py2);
            this.m_renderer.addEntityToProcess(text2D, this.m_rprocess);
            this.m_pov = text2D;
        }
    }
    
    getFPS(): number {
        return this.m_fpsInfo.getFPS();
    }
    run(syncStageSize: boolean): void {
        this.m_fpsInfo.updateFPS();
        const st = this.m_renderProxy.status;
        if (this.m_fps != this.m_fpsInfo.getFPS()) {
            this.m_fps = this.m_fpsInfo.getFPS();
            this.m_textFPS.setText(this.m_fpsInfo.getFPSStr());
            this.m_textFPS.updateMeshToGpu();
            this.m_textFPS.update();
        }
        // console.log("st.drawCallTimes: ", st.drawCallTimes);
        if (this.m_drawCalls != st.drawCallTimes) {
            let drawCallStr = (st.drawCallTimes) + "";
            this.m_drawCalls = st.drawCallTimes;
            this.m_drawCall.setText(drawCallStr);
            this.m_drawCall.updateMeshToGpu();
            this.m_drawCall.update();
        }
        if (this.m_drawTris != st.drawTrisNumber) {
            let drawTriStr = (st.drawTrisNumber) + "";
            this.m_drawTris = st.drawTrisNumber;
            this.m_drawTri.setText(drawTriStr);
            this.m_drawTri.updateMeshToGpu();
            this.m_drawTri.update();
        }
        if (this.m_povNumber != st.povNumber) {
            let povNumber = (st.povNumber) + "";
            this.m_povNumber = st.povNumber;
            this.m_pov.setText(povNumber);
            this.m_pov.updateMeshToGpu();
            this.m_pov.update();
        }
        if (syncStageSize) {
            this.m_renderer.getRenderProxy().setViewPort(0, 0, this.m_renderer.getViewWidth(), this.m_renderer.getViewHeight());
        }
    }
}