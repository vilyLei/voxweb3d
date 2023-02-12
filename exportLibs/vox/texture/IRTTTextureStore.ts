/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import { IRTTTexture } from "../../vox/render/texture/IRTTTexture";
import { IDepthTexture } from "../../vox/render/texture/IDepthTexture";
import { IWrapperTexture } from "../../vox/render/texture/IWrapperTexture";

import IRenderProxy from "../../vox/render/IRenderProxy";

/**
 * 本类作为所有RTT纹理对象的管理类
 */
interface IRTTTextureStore {
    
    getRenderProxy(): IRenderProxy;
    /**
     * @param pw texture width
     * @param ph texture height
     * @param powerof2Boo the default value is false
     */
    createWrapperTex(pw: number, ph: number, powerof2Boo: boolean): IWrapperTexture;
    /**
     * @param pw texture width
     * @param ph texture height
     * @param powerof2Boo the default value is false
     */
    createRTTTex2D(pw: number, ph: number, powerof2Boo: boolean): IRTTTexture;
    /**
     * @param pw texture width
     * @param ph texture height
     * @param powerof2Boo the default value is false
     */
    createDepthTex2D(pw: number, ph: number, powerof2Boo: boolean): IDepthTexture;
    
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
}

export { IRTTTextureStore }