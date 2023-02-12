/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IRenderStage3D from "../../vox/render/IRenderStage3D";
import IAABB2D from "../geom/IAABB2D";

interface IRAdapterContext {

    // display 3d view buf size auto sync window size
    autoSyncRenderBufferAndWindowSize: boolean;
    offscreenRenderEnabled: boolean;
    setWebGLMaxVersion(webgl_ver: number): void
    getWebGLVersion(): number
    getDiv(): any
    setDivStyleLeftAndTop(px: number, py: number): void
    setDivStyleSize(pw: number, ph: number): void
    getCanvas(): any
    isDepthTestEnabled(): boolean
    isStencilTestEnabled(): boolean
    /**
     * @returns return gpu context lost status
     */
    isContextLost(): boolean;
    /**
     * @returns return system gpu context
     */
    getRC(): any;
    
    setScissorEnabled(boo: boolean): void;
    setScissorRect(px: number, py: number, pw: number, ph: number): void;

    setResizeCallback(resizeCallbackTarget: any, resizeCallback: () => void): void;
    getDevicePixelRatio(): number;
    resizeBufferSize(pw: number, ph: number): void;
    getStage(): IRenderStage3D;
    getStageWidth(): number;
    getStageHeight(): number;
    getDisplayWidth(): number;
    getDisplayHeight(): number;
    setViewport(px: number, py: number, pw: number, ph: number): void;
    setViewportSize(pw: number, ph: number): void;
    testViewPortChanged(px: number, py: number, pw: number, ph: number): boolean;
    getViewportX(): number;
    getViewportY(): number;
    getViewportWidth(): number;
    getViewportHeight(): number;
    getViewPortSize(): IAABB2D;

    getFBOWidth(): number;
    getFBOHeight(): number;
    getRCanvasWidth(): number;
    getRCanvasHeight(): number;
    updateRenderBufferSize(): void;
}
export { IRAdapterContext };
