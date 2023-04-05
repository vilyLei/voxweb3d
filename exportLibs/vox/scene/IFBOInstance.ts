/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IRenderStage3D from "../../vox/render/IRenderStage3D";
import { IRenderCamera } from "../../vox/render/IRenderCamera";
import IRenderTexture from "../../vox/render/texture/IRenderTexture";

import IRenderMaterial from "../../vox/render/IRenderMaterial";
import IRenderEntity from "../../vox/render/IRenderEntity";
import IRenderProcess from "../../vox/render/IRenderProcess";
import IRenderNode from "./IRenderNode";

interface IFBOInstance extends IRenderNode {

    /**
     * unique name string
     */
    uns: string;

    /**
     * @returns 获取当前FBOInstance所持有的 FBO 对象的 unique id (也就是序号)
     */
    getFBOUid(): number
    /**
     * 设置当前 FBO控制的渲染过程中所需要的 renderer process 序号(id)列表
     * @param processIDlist 当前渲染器场景中渲染process的序号列表
     * @param processShared 是否共享process，默认值为true，则表示fbo和renderer scene都会执行这些渲染过程。如果为false，则仅仅被FBOInstance执行渲染过程
     */
    setRProcessIDList(processIDlist: number[], processShared?: boolean): void;
    /**
     * 设置当前 FBO控制的渲染过程中所需要的 renderer process 序号(id)列表
     */
    setRProcessList(list: IRenderProcess[]): void;
    getRProcessIDAt(i: number): number;
    getStage3D(): IRenderStage3D;
    getCamera(): IRenderCamera;
    lockViewport(): void;
    unlockViewport(): void;
    updateCamera(): void;
    updateCameraDataFromCamera(cam: IRenderCamera): void;
    ////////////////////////////////////////////////////// render state conctrl
    useGlobalRenderState(state: number): void;
    useGlobalRenderStateByName(stateNS: string): void;
    setGlobalRenderState(state: number): void;
    setGlobalRenderStateByName(stateNS: string): void;
    lockRenderState(state: number): void;
    unlockRenderState(): void;
    ////////////////////////////////////////////////////// render color mask conctrl
    useGlobalRenderColorMask(colorMask: number): void;
    useGlobalRenderColorMaskByName(colorMaskNS: string): void;
    setGlobalRenderColorMask(colorMask: number): void;
    setGlobalRenderColorMaskByName(colorMaskNS: string): void;
    /**
     *
     * @param colorMask the default value is false
     */
    lockColorMask(colorMask?: number): void;
    unlockRenderColorMask(): void;

    ////////////////////////////////////////////////////// material conctrl
    /**
     * @param m IRenderMaterial instance
     * @param texUnlock the default value is false
     * @param materialUniformUpdate the default value is false
     */
    useGlobalMaterial(m: IRenderMaterial, texUnlock?: boolean, materialUniformUpdate?: boolean): void;
    /**
     * @param material MaterialBase 子类的实例
     * @param texUnlock 是否锁定并使用 material 自身所带的纹理数据,the default value is false
     * @param materialUniformUpdate the default value is false
     */
    setGlobalMaterial(material?: IRenderMaterial, texUnlock?: boolean, materialUniformUpdate?: boolean): void;
    lockMaterial(): void;
    unlockMaterial(): void;

    updateGlobalMaterialUniform(): void;
    /**
     *
     * @param clearDepth the default value is 1.0
     */
    clearDepth(clearDepth: number): void;

    synFBOSizeWithViewport(): void;
    asynFBOSizeWithViewport(): void;
    // if synFBOSizeWithViewport is true, fbo size = factor * view port size;
    setFBOSizeFactorWithViewPort(factor: number): void;
    /**
     *
     * @param fboIndex the default value is 0
     * @param enableDepth the default value is false
     * @param enableStencil the default value is false
     * @param multisampleLevel the default value is 0
     */
    createViewportSizeFBOAt(fboIndex: number, enableDepth?: boolean, enableStencil?: boolean, multisampleLevel?: number): void;

    /**
     * 创建一个指定序号的 FBO(FrameBufferObject) 渲染运行时管理对象,
     * renderer中一个序号只会对应一个唯一的 FBO 对象实例
     * @param fboIndex FBO 对象的序号, the default value is 0
     * @param enableDepth FBO 对象的depth读写是否开启, the default value is false
     * @param enableStencil FBO 对象的stencil读写是否开启, the default value is false
     * @param multisampleLevel FBO 对象的multisample level, the default value is 0
     */
    createAutoSizeFBOAt(fboIndex: number, enableDepth?: boolean, enableStencil?: boolean, multisampleLevel?: number): void;
    /**
     * 创建一个指定序号的 FBO(FrameBufferObject) 渲染运行时管理对象,
     * renderer中一个序号只会对应一个唯一的 FBO 对象实例
     * @param fboIndex FBO 对象的序号, the default value is 0
     * @param width FBO 对象的viewport width, if width < 1, viewport width is stage width;
     * @param height FBO 对象的viewport height, if height < 1, viewport width is stage height;
     * @param enableDepth FBO 对象的depth读写是否开启, the default value is true
     * @param enableStencil FBO 对象的stencil读写是否开启, the default value is false
     * @param multisampleLevel FBO 对象的multisample level, the default value is 0
     */
    createFBOAt(fboIndex: number, width: number, height: number, enableDepth?: boolean, enableStencil?: boolean, multisampleLevel?: number): void;

    /**
     * 创建一个指定序号的 read FBO(FrameBufferObject) 渲染运行时管理对象,
     * renderer中一个序号只会对应一个唯一的 FBO 对象实例
     * @param fboIndex FBO 对象的序号, the default value is 0
     * @param width FBO 对象的viewport width, if width < 1, viewport width is stage width;
     * @param height FBO 对象的viewport height, if height < 1, viewport width is stage height;
     * @param enableDepth FBO 对象的depth读写是否开启, the default value is true
     * @param enableStencil FBO 对象的stencil读写是否开启, the default value is false
     * @param multisampleLevel FBO 对象的multisample level, the default value is 0
     */
    createReadFBOAt(fboIndex: number, width: number, height: number, enableDepth?: boolean, enableStencil?: boolean, multisampleLevel?: number): void;
    /**
     * 创建一个指定序号的 draw FBO(FrameBufferObject) 渲染运行时管理对象,
     * renderer中一个序号只会对应一个唯一的 FBO 对象实例
     * @param fboIndex FBO 对象的序号, the default value is 0
     * @param width FBO 对象的viewport width, if width < 1, viewport width is stage width;
     * @param height FBO 对象的viewport height, if height < 1, viewport width is stage height;
     * @param enableDepth FBO 对象的depth读写是否开启, the default value is true
     * @param enableStencil FBO 对象的stencil读写是否开启, the default value is false
     * @param multisampleLevel FBO 对象的multisample level, the default value is 0
     */
    createDrawFBOAt(fboIndex: number, width: number, height: number, enableDepth?: boolean, enableStencil?: boolean, multisampleLevel?: number): void;

    resizeFBO(fboBufferWidth: number, fboBufferHeight: number): void
    /**
     * @returns get framebuffer output attachment texture by attachment index
     */
    getRTTAt(i: number): IRenderTexture;
    enableMipmapRTTAt(i: number): void;
    generateMipmapTextureAt(i: number): void;
    /**
     * 设置渲染到纹理的目标纹理对象(可由用自行创建)和framebuffer output attachment index
     * @param rttTexProxy 作为渲染到目标的目标纹理对象
     * @param outputIndex framebuffer output attachment index, the default value is 0
     */
    setRenderToTexture(texture: IRenderTexture, outputIndex?: number): IRenderTexture;

    /**
     * 设置渲染到纹理的目标纹理对象(普通 RTT 纹理类型的目标纹理)和framebuffer output attachment index
     * @param systemRTTTexIndex 作为渲染到目标的目标纹理对象在系统普通rtt 纹理中的序号(0 -> 15)
     * @param outputIndex framebuffer output attachment index, the default value is 0
     */
    setRenderToRTTTextureAt(systemRTTTexIndex: number, outputIndex?: number): void;
    /**
     * 设置渲染到纹理的目标纹理对象(cube RTT 纹理类型的目标纹理)和framebuffer output attachment index
     * @param systemCubeRTTTexIndex 作为渲染到目标的目标纹理对象在系统cube rtt 纹理中的序号(0 -> 15)
     * @param outputIndex framebuffer output attachment index, the default value is 0
     */
    setRenderToCubeRTTTextureAt(systemCubeRTTTexIndex: number, outputIndex?: number): void;
    /**
     * 设置渲染到纹理的目标纹理对象(Float RTT 纹理类型的目标纹理)和framebuffer output attachment index
     * @param systemFloatRTTTexIndex 作为渲染到目标的目标纹理对象在系统float rtt 纹理中的序号(0 -> 15)
     * @param outputIndex framebuffer output attachment index, the default value is 0
     */
    setRenderToFloatTextureAt(systemFloatRTTTexIndex: number, outputIndex?: number): void;
    /**
     * 设置渲染到纹理的目标纹理对象(half Float RTT 纹理类型的目标纹理)和framebuffer output attachment index
     * @param systemFloatRTTTexIndex 作为渲染到目标的目标纹理对象在系统float rtt 纹理中的序号(0 -> 15)
     * @param outputIndex framebuffer output attachment index, the default value is 0
     */
    setRenderToHalfFloatTexture(texture: IRenderTexture, outputIndex?: number): IRenderTexture;
    /**
     * 设置渲染到纹理的目标纹理对象(RGBA RTT 纹理类型的目标纹理)和framebuffer output attachment index
     * @param systemFloatRTTTexIndex 作为渲染到目标的目标纹理对象在系统float rtt 纹理中的序号(0 -> 15)
     * @param outputIndex framebuffer output attachment index, the default value is 0
     */
    setRenderToRGBATexture(texture: IRenderTexture, outputIndex?: number): IRenderTexture;
    /**
     * 设置渲染到纹理的目标纹理对象(depth RTT 纹理类型的目标纹理)和framebuffer output attachment index
     * @param systemDepthRTTTexIndex 作为渲染到目标的目标纹理对象在系统depth rtt 纹理中的序号(0 -> 15)
     * @param outputIndex framebuffer output attachment index, the default value is 0
     */
    setRenderToDepthTextureAt(systemDepthRTTTexIndex: number, outputIndex?: number): IRenderTexture;
    createRGBATexture(): IRenderTexture;
    /**
     *
     * @param clearColorBoo the default value is true
     * @param clearDepthBoo the default value is true
     * @param clearStencilBoo the default value is false
     */
    setClearState(clearColorBoo?: boolean, clearDepthBoo?: boolean, clearStencilBoo?: boolean): void;
    setRenderToBackBuffer(): void;

    setClearDepth(depth: number): void;
    getClearDepth(): number;
    getViewportX(): number;
    getViewportY(): number;
    getViewportWidth(): number;
    getViewportHeight(): number;
    getFBOWidth(): number;
    getFBOHeight(): number;

    resetAttachmentMask(boo: boolean): void;
    setAttachmentMaskAt(index: number, boo: boolean): void;

    setClearRGBColor3f(pr: number, pg: number, pb: number): void;
    setClearColorEnabled(boo: boolean): void;
    setClearDepthEnabled(boo: boolean): void;
    setClearStencilEnabled(boo: boolean): void;
    /**
     * @param colorUint24 uint24 number rgb color value, example: 0xff0000, it is red rolor
     * @param alpha the default value is 1.0
     */
    setClearUint24Color(colorUint24: number, alpha: number): void;
    setClearRGBAColor4f(pr: number, pg: number, pb: number, pa: number): void;
    /**
     * @param fboIns IFBOInstance instance
     * @param mask_bitfiled the defualt value is RenderMaskBitfield.COLOR_BUFFER_BIT
     * @param filter the defualt value is RenderFilter.NEAREST
     * @param clearType it is IRenderProxy.COLOR or IRenderProxy.DEPTH or IRenderProxy.STENCIL or IRenderProxy.DEPTH_STENCIL, the default value is -1
     * @param clearIndex the defualt value is 0
     * @param dataArr the defualt value is null
     */
    blitFrom(fboIns: IFBOInstance, mask_bitfiled?: number, filter?: number, clearType?: number, clearIndex?: number, dataArr?: number[]): void;
    /**
     * @param fboIns IFBOInstance instance
     * @param mask_bitfiled the defualt value is RenderMaskBitfield.COLOR_BUFFER_BIT
     * @param filter the defualt value is RenderFilter.NEAREST
     * @param clearType it is IRenderProxy.COLOR or IRenderProxy.DEPTH or IRenderProxy.STENCIL or IRenderProxy.DEPTH_STENCIL, the default value is -1
     * @param clearIndex the defualt value is 0
     * @param dataArr the defualt value is null
     */
    blitColorFrom(fboIns: IFBOInstance, filter?: number, clearType?: number, clearIndex?: number, dataArr?: number[]): void;
    /**
     * @param fboIns IFBOInstance instance
     * @param mask_bitfiled the defualt value is RenderMaskBitfield.COLOR_BUFFER_BIT
     * @param filter the defualt value is RenderFilter.NEAREST
     * @param clearType it is IRenderProxy.COLOR or IRenderProxy.DEPTH or IRenderProxy.STENCIL or IRenderProxy.DEPTH_STENCIL, the default value is -1
     * @param clearIndex the defualt value is 0
     * @param dataArr the defualt value is null
     */
    blitDepthFrom(fboIns: IFBOInstance, filter?: number, clearType?: number, clearIndex?: number, dataArr?: number[]): void;
    /**
     * @param fboIns IFBOInstance instance
     * @param mask_bitfiled the defualt value is RenderMaskBitfield.COLOR_BUFFER_BIT
     * @param filter the defualt value is RenderFilter.NEAREST
     * @param clearType it is IRenderProxy.COLOR or IRenderProxy.DEPTH or IRenderProxy.STENCIL or IRenderProxy.DEPTH_STENCIL, the default value is -1
     * @param clearIndex the defualt value is 0
     * @param dataArr the defualt value is null
     */
    blitColorAndDepthFrom(fboIns: IFBOInstance, filter?: number, clearType?: number, clearIndex?: number, dataArr?: number[]): void;
    /**
     * @param fboIns IFBOInstance instance
     * @param mask_bitfiled the defualt value is RenderMaskBitfield.COLOR_BUFFER_BIT
     * @param filter the defualt value is RenderFilter.NEAREST
     * @param clearType it is IRenderProxy.COLOR or IRenderProxy.DEPTH or IRenderProxy.STENCIL or IRenderProxy.DEPTH_STENCIL, the default value is -1
     * @param clearIndex the defualt value is 0
     * @param dataArr the defualt value is null
     */
    blitStencilFrom(fboIns: IFBOInstance, filter?: number, clearType?: number, clearIndex?: number, dataArr?: number[]): void;
    /**
     *
     * @param i framebuffer object output attachment index
     * @param attachmentIndex the default value is 0
     */
    renderToTextureAt(i: number, attachmentIndex?: number): void;
    /**
     *
     * @param lockRenderState the defualt value is false
     * @param lockMaterial the defualt value is false
     * @param autoEnd the defualt value is true
     * @param autoRunBegin the defualt value is true
     */
    run(lockRenderState?: boolean, lockMaterial?: boolean, autoEnd?: boolean, autoRunBegin?: boolean): void;
    /**
     *
     * @param index
     * @param autoRunBegin the defualt value is true
     */
    runAt(index: number, autoRunBegin?: boolean): void;
    /**
     * 单独绘制可渲染对象, 可能是使用了 global material也可能没有。这种方式比较耗性能,只能用在特殊的地方。
     * @param entity 需要指定绘制的 IRenderEntity 实例
     * @param useGlobalUniform 是否使用当前 global material 所携带的 uniform, the default value is false
     * @param forceUpdateUniform 是否强制更新当前 global material 所对应的 shader program 的 uniform, default value is true
     */
    drawEntity(entity: IRenderEntity, useGlobalUniform?: boolean, forceUpdateUniform?: boolean): void;
    runBegin(): void;
    runEnd(): void;
    /**
     *
     * @param camera
     * @param syncCamView the default value is false
     */
    useCamera(camera: IRenderCamera, syncCamView?: boolean): void;
    useMainCamera(): void;
    reset(): void;

    clone(): IFBOInstance;
    /**
     * @param lockRenderState the default value is false
     * @param lockMaterial the default value is false
     * @param autoEnd the default value is true
     * @param autoRunBegin the default value is true
     */
    setRenderingState(lockRenderState?: boolean, lockMaterial?: boolean, autoEnd?: boolean, autoRunBegin?: boolean): void;
	render(): void;
    /**
	 * @param auto enable auto runnning this instance
	 * @param prepend perpend this into the renderer rendering process or append, the default value is true
	 * @returns instance self
	 */
	setAutoRunning(auto: boolean, prepend?: boolean): IFBOInstance;
	isAutoRunning(): boolean;
}
export { IFBOInstance }
