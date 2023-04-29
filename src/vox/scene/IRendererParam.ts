/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IVector3D from "../../vox/math/IVector3D";

interface IRendererParam {

    divW: number;
    divH: number;
	/**
	 * the default value is true
	 */
	autoAttachingHtmlDoc: boolean;
    /**
	 * display 3d view buf size auto sync window size
	 * the default value is true
	 */
    autoSyncRenderBufferAndWindowSize: boolean;
	/**
	 * the default value is false
	 */
	offscreenRenderEnabled: boolean;
	/**
	 * the default value is 2
	 */
    maxWebGLVersion: number;
    cameraPerspectiveEnabled: boolean;
    // event flow control enable
    evtFlowEnabled: boolean;
    // x: fov, y: near, z: far
    readonly camProjParam: IVector3D;

    readonly camPosition: IVector3D;
    readonly camLookAtPos: IVector3D;
    readonly camUpDirect: IVector3D;
	/**
	 * the default value is true
	 */
    syncBgColor: boolean;
    batchEnabled: boolean;
    processFixedState: boolean;

	sysEvtReceived: boolean;
    /**
     * @param   tickUpdateTime default value 50 ms delay
     */
    setTickUpdateTime(tickUpdateTime: number): void;
    getTickUpdateTime(): number;
    setPolygonOffsetEanbled(polygonOffsetEnabled: boolean): void;
    getPolygonOffsetEanbled(): boolean;
	getScissorTestEanbled(): boolean;
    setDitherEanbled(ditherEnabled: boolean): void;
    getDitherEanbled(): boolean;
    getDiv(): HTMLDivElement;
    getRenderContextAttri(): any;
    setAttriDepth(boo: boolean): void;
    setAttriStencil(boo: boolean): void;
    setAttriAlpha(boo: boolean): void;
	getAttriAlpha(): boolean;
    setAttriPremultipliedAlpha(boo: boolean): void;
    setAttriAntialias(boo: boolean): void;
    setAttripreserveDrawingBuffer(boo: boolean): void;
    setAttriHightPowerPreference(boo: boolean): void;
    setMatrix4AllocateSize(total: number): void;
    getMatrix4AllocateSize(): number;
    /**
     * @param fov_angle_degree the default value is 45.0
     * @param near the default value is 10.0
     * @param far the default value is 5000.0
     */
    setCamProject(fov_angle_degree: number, near: number, far: number): void;
    setCamPosition(px: number, py: number, pz: number): void;
    setCamLookAtPos(px: number, py: number, pz: number): void;
    setCamUpDirect(px: number, py: number, pz: number): void;
}

export default IRendererParam;
