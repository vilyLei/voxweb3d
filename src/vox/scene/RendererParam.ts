/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import Vector3D from "../../vox/math/Vector3D";
import IRendererParam from "./IRendererParam";

class RendererParam implements IRendererParam {
    private m_matrix4AllocateSize: number = 8192;
    private m_mainDiv: HTMLDivElement = null;
    private m_renderContextAttri: any = {
        depth: true
        , premultipliedAlpha: false
        , alpha: true
        , antialias: false
        , stencil: false
        , preserveDrawingBuffer: true
        , powerPreference: "high-performance"//"default"
    };
    private m_tickUpdateTime: number = 20;// delay 50 ms
    private m_polygonOffsetEnabled: boolean = false;
    private m_ditherEnabled: boolean = false;
    // display 3d view buf size auto sync window size
    autoSyncRenderBufferAndWindowSize: boolean = true;
    maxWebGLVersion: number = 2;
    cameraPerspectiveEnabled: boolean = true;
    // event flow control enable
    evtFlowEnabled: boolean = false;
    // x: fov, y: near, z: far
    readonly camProjParam: Vector3D = new Vector3D(45.0, 10.0, 5000.0);

    readonly camPosition: Vector3D = new Vector3D(2000.0, 2000.0, 2000.0);
    readonly camLookAtPos: Vector3D = new Vector3D(0.0, 0.0, 0.0);
    readonly camUpDirect: Vector3D = new Vector3D(0.0, 1.0, 0.0);

    batchEnabled: boolean = true;
    processFixedState: boolean = false;
    constructor(div: HTMLDivElement = null) {
        this.m_mainDiv = div;
        this.autoSyncRenderBufferAndWindowSize = div == null;
    }
    /**
     * @param   tickUpdateTime default value 50 ms delay
     */
    setTickUpdateTime(tickUpdateTime: number): void {
        tickUpdateTime = Math.round(tickUpdateTime);
        this.m_tickUpdateTime = tickUpdateTime > 5 ? tickUpdateTime : 5;
    }
    getTickUpdateTime(): number {
        return this.m_tickUpdateTime;
    }
    setPolygonOffsetEanbled(polygonOffsetEnabled: boolean): void {
        this.m_polygonOffsetEnabled = polygonOffsetEnabled;
    }
    getPolygonOffsetEanbled(): boolean {
        return this.m_polygonOffsetEnabled;
    }
    setDitherEanbled(ditherEnabled: boolean): void {
        this.m_ditherEnabled = ditherEnabled;
    }
    getDitherEanbled(): boolean {
        return this.m_ditherEnabled;
    }
    getDiv(): HTMLDivElement {
        return this.m_mainDiv;
    }
    getRenderContextAttri(): any {
        return this.m_renderContextAttri;
    }
    setAttriDepth(boo: boolean): void {
        this.m_renderContextAttri.depth = boo;
    }
    setAttriStencil(boo: boolean): void {
        this.m_renderContextAttri.stencil = boo;
    }
    setAttriAlpha(boo: boolean): void {
        this.m_renderContextAttri.alpha = boo;
    }
    setAttriPremultipliedAlpha(boo: boolean): void {
        this.m_renderContextAttri.premultipliedAlpha = boo;
    }
    setAttriAntialias(boo: boolean): void {
        this.m_renderContextAttri.antialias = boo;
    }
    setAttripreserveDrawingBuffer(boo: boolean): void {
        this.m_renderContextAttri.preserveDrawingBuffer = boo;
    }
    setAttriHightPowerPreference(boo: boolean): void {
        this.m_renderContextAttri.powerPreference = boo ? "high-performance" : "default";
    }
    setMatrix4AllocateSize(total: number): void {
        if (total < 1024) {
            total = 1024;
        }
        this.m_matrix4AllocateSize = total;
    }
    getMatrix4AllocateSize(): number {
        return this.m_matrix4AllocateSize;
    }
    /**
     * @param fov_angle_degree the default value is 45.0
     * @param near the default value is 10.0
     * @param far the default value is 5000.0
     */
    setCamProject(fov_angle_degree: number, near: number, far: number): void {
        if (near >= far) {
            throw Error("Error Camera cear > far !!!");
        }
        this.camProjParam.setTo(fov_angle_degree, near, far);
    }
    //  setCamOrthoProject(bottom:number, top:number, left:number, right:number, near:number, far:number):void
    //  {
    //      if(near >= far)
    //      {
    //          throw Error("Error Camera cear > far !!!");
    //      }
    //      this.camProjParam.setTo(0.0,near,far);
    //      this.camOrthoParam.x = bottom;
    //      this.camOrthoParam.y = top;
    //      this.camOrthoParam.z = left;
    //      this.camOrthoParam.w = right;
    //  }
    setCamPosition(px: number, py: number, pz: number): void {
        this.camPosition.setTo(px, py, pz);
    }
    setCamLookAtPos(px: number, py: number, pz: number): void {
        this.camLookAtPos.setTo(px, py, pz);
    }
    setCamUpDirect(px: number, py: number, pz: number): void {
        this.camUpDirect.setTo(px, py, pz);
    }
}

export default RendererParam;
