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
     * 设置当前的渲染器代理
     * @param renderProxy 当前的渲染器代理
     */
    setRenderer(renderProxy: IRenderProxy): void
    
    getRTTStrore(): IRTTTextureStore;
    /**
     * @param w texture width, the default value is 128
     * @param h texture height, the default value is 128
     * @param powerof2Boo the default value is false
     */
    createWrapperTex(w?: number, h?: number, powerof2Boo?: boolean): IWrapperTexture;
    /**
     * @param w texture width, the default value is 128
     * @param h texture height, the default value is 128
     * @param powerof2Boo the default value is false
     */
    createRTTTex2D(w?: number, h?: number, powerof2Boo?: boolean): IRTTTexture;
    /**
     * @param w image texture predefined width, the default value is 64 
     * @param h image texture predefined height, the default value is 64 
     * @param powerof2Boo the default value is false
     */
    createImageTex2D(w?: number, h? : number, powerof2Boo?: boolean): IImageTexture;

    createHalfFloatTex2D(w: number, h: number, powerof2Boo?: boolean): IFloatTexture;
    /**
     * @param w texture width
     * @param h texture height
     * @param powerof2Boo the default value is false
     */
    createFloatTex2D(w: number, h: number, powerof2Boo?: boolean): IFloatTexture;
    /**
     * @param w texture width
     * @param h texture height
     * @param powerof2Boo the default value is false
     */
    createUint16Tex2D(w: number, h: number, powerof2Boo?: boolean): IUint16Texture;
    /**
     * @param w texture width
     * @param h texture height
     * @param powerof2Boo the default value is false
     */
    createFloatCubeTex(w: number, h: number, powerof2Boo?: boolean): IFloatCubeTexture;
    /**
     * @param w texture width
     * @param h texture height
     */
    createBytesTex(w: number, h: number): IBytesTexture;
    /**
     * @param w texture width
     * @param h texture height
     */
    createBytesCubeTex(w: number, h: number): IBytesCubeTexture;
    /**
     * @param w image texture predefined width, the default value is 64 
     * @param h image texture predefined height, the default value is 64
     */
    createImageCubeTex(w?: number, h?: number): IImageCubeTexture;
    /**
     * 
     * @param w texture width
     * @param h texture height
     * @param depth the default value is 1
     */
    createTex3D(w: number, h: number, depth?: number): ITexture3D;
    createRGBATex2D(w: number, h: number, color: IColor4): IBytesTexture;
    createAlphaTex2D(w: number, h: number, alpha: number): IBytesTexture;
    createAlphaTexBytes2D(w: number, h: number, bytes: Uint8Array): IBytesTexture;

    /**
     * get a system cube rtt texture
     * @param i rtt texture index in the system
     */
    getCubeRTTTextureAt(i: number): IRTTTexture;
    createCubeRTTTextureAt(i: number, w: number, h: number): IRTTTexture;
    getRTTTextureAt(i: number): IRTTTexture;
    createRTTTextureAt(i: number, w: number, h: number): IRTTTexture;
    getDepthTextureAt(i: number): IDepthTexture;
    createDepthTextureAt(i: number, w: number, h: number): IDepthTexture;
    getRTTFloatTextureAt(i: number): IRTTTexture;
    createRTTFloatTextureAt(i: number, w: number, h: number): IRTTTexture;
    run(): void;

}
export { ITextureBlock }