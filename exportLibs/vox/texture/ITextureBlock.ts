/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IColor4 from "../../vox/material/IColor4";
import IRunnable from "../../vox/base/IRunnable";

import IRenderTexture from "../../vox/render/texture/IRenderTexture";
import { IRTTTexture } from "../../vox/render/texture/IRTTTexture";
import { IDepthTexture } from "../../vox/render/texture/IDepthTexture";
import { IWrapperTexture } from "../../vox/render/texture/IWrapperTexture";
import { IFloatCubeTexture } from "../../vox/render/texture/IFloatCubeTexture";
import { IBytesCubeTexture } from "../../vox/render/texture/IBytesCubeTexture";
import { IImageTexture } from "../../vox/render/texture/IImageTexture";
import { IImageCubeTexture } from "../../vox/render/texture/IImageCubeTexture";
import { ITexture3D } from "../../vox/render/texture/ITexture3D";
import { IBytesTexture } from "../../vox/render/texture/IBytesTexture";
import { IFloatTexture } from "../../vox/render/texture/IFloatTexture";
import { IUint16Texture } from "../../vox/render/texture/IUint16Texture";

import IRenderProxy from "../../vox/render/IRenderProxy";
import { IRTTTextureStore } from "../../vox/texture/IRTTTextureStore";

/**
 * 本类作为所有基础纹理对象的管理类,只允许在RendererInstance之上的类中使用
 */
interface ITextureBlock {
    
    addTexLoader(texLoader: IRunnable): void
    
    /**
     * 设置当前的渲染器
     * @param renderProxy 当前的渲染器
     */
    setRenderer(renderProxy: IRenderProxy): void
    
    getRTTStrore(): IRTTTextureStore;
    /**
     * @param pw texture width
     * @param ph texture height
     * @param powerof2Boo the default value is false
     */
    createWrapperTex(pw: number, ph: number, powerof2Boo?: boolean): IWrapperTexture;
    /**
     * @param pw texture width
     * @param ph texture height
     * @param powerof2Boo the default value is false
     */
    createRTTTex2D(pw: number, ph: number, powerof2Boo?: boolean): IRTTTexture;
    /**
     * @param pw texture width
     * @param ph texture height
     * @param powerof2Boo the default value is false
     */
    createImageTex2D(pw: number, ph: number, powerof2Boo?: boolean): IImageTexture;

    createHalfFloatTex2D(pw: number, ph: number, powerof2Boo?: boolean): IFloatTexture;
    /**
     * @param pw texture width
     * @param ph texture height
     * @param powerof2Boo the default value is false
     */
    createFloatTex2D(pw: number, ph: number, powerof2Boo?: boolean): IFloatTexture;
    /**
     * @param pw texture width
     * @param ph texture height
     * @param powerof2Boo the default value is false
     */
    createUint16Tex2D(pw: number, ph: number, powerof2Boo?: boolean): IUint16Texture;
    /**
     * @param pw texture width
     * @param ph texture height
     * @param powerof2Boo the default value is false
     */
    createFloatCubeTex(pw: number, ph: number, powerof2Boo?: boolean): IFloatCubeTexture;
    createBytesTex(texW: number, texH: number): IBytesTexture;

    createBytesCubeTex(texW: number, texH: number): IBytesCubeTexture;
    /**
     * @param pw texture width
     * @param ph texture height
     * @param powerof2Boo the default value is false
     */
    createImageCubeTex(texW: number, texH: number): IImageCubeTexture;
    /**
     * 
     * @param texW texture width
     * @param texH texture height
     * @param depth the default value is 1
     */
    createTex3D(texW: number, texH: number, depth?: number): ITexture3D;
    createRGBATex2D(pw: number, ph: number, color: IColor4): IBytesTexture;
    createAlphaTex2D(pw: number, ph: number, alpha: number): IBytesTexture;
    createAlphaTexBytes2D(pw: number, ph: number, bytes: Uint8Array): IBytesTexture;

    /**
     * get a system cube rtt texture
     * @param i rtt texture index in the system
     */
    getCubeRTTTextureAt(i: number): IRTTTexture;
    createCubeRTTTextureAt(i: number, pw: number, ph: number): IRTTTexture;
    getRTTTextureAt(i: number): IRTTTexture;
    createRTTTextureAt(i: number, pw: number, ph: number): IRTTTexture;
    getDepthTextureAt(i: number): IDepthTexture;
    createDepthTextureAt(i: number, pw: number, ph: number): IDepthTexture;
    getRTTFloatTextureAt(i: number): IRTTTexture;
    createRTTFloatTextureAt(i: number, pw: number, ph: number): IRTTTexture;
    run(): void;

}
export { ITextureBlock }