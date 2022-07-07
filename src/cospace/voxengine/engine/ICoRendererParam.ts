
interface ICoRendererParam {

    // display 3d view buf size auto sync window size
    autoSyncRenderBufferAndWindowSize: boolean;
    maxWebGLVersion: number;
    cameraPerspectiveEnabled: boolean;
    // event flow control enable
    evtFlowEnabled: boolean;
    batchEnabled: boolean;
    processFixedState: boolean;
	/*
	* @param   tickUpdateTime default value 50 ms delay
	*/
   setTickUpdateTime(tickUpdateTime: number): void;
   getTickUpdateTime(): number;
   setPolygonOffsetEanbled(polygonOffsetEnabled: boolean): void;
   getPolygonOffsetEanbled(): boolean;
   setDitherEanbled(ditherEnabled: boolean): void;
   getDitherEanbled(): boolean;
   getDiv(): HTMLDivElement;
   getRenderContextAttri(): any;
   setAttriDepth(boo: boolean): void;
   setAttriStencil(boo: boolean): void;
   setAttriAlpha(boo: boolean): void;
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

export { ICoRendererParam }
