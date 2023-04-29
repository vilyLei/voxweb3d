/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import { TextureProxyType } from "../../../vox/texture/TextureProxyType";
import IRenderResource from "../../../vox/render/IRenderResource";
import IRenderBuffer from "../../../vox/render/IRenderBuffer";
import IRenderProxy from "../../../vox/render/IRenderProxy";

interface IRenderTexture extends IRenderBuffer {

    name: string;
    /**
     * sys automatically generate mipmap or not, the default value is false
     */
    mipmapEnabled: boolean;
    srcFormat: number;
    dataType: number;
    minFilter: number;
    magFilter: number;
    internalFormat: number;

    unpackAlignment: number;
    flipY: boolean;
    premultiplyAlpha: boolean;

    setWrap(wrap: number): void;
    isGpuEnabled(): boolean;
    isDataEnough(): boolean;
	dataEnoughListener: () => void;
    isDirect(): boolean;
    getUid(): number;
    getResUid(): number;
    getSampler(): number;
    /**
     * @returns 返回自己的纹理类型(value: TextureProxyType)
     */
    getType(): TextureProxyType;
    getAttachCount(): number;
    getBufWidth(): number;
    getBufHeight(): number;
    getWidth(): number;
    getHeight(): number;
    getTargetType(): number;
    uploadFromFbo(texResource: IRenderResource, fboWidth: number, fboHeight: number): void;
    enableMipmap(): void;
    disableMipmap(): void;
    generateMipmap(texRes: IRenderResource): void;
    /**
     *
     * @param rc the default value is null
     * @param deferred the default value is true
     */
    updateDataToGpu(rc?: IRenderProxy, deferred?: boolean): void;
	/**
     * @returns This textureProxy instance has been destroyed.
     */
   	isDestroyed(): boolean;

    __$setRenderProxy(rc: IRenderProxy): void
    __$attachThis(): void;
    __$detachThis(): void;
    __$$use(res: IRenderResource): void;
    __$$upload(res: IRenderResource): void;
    __$destroy(): void;
    __$$removeFromSlot(): void;
}
export default IRenderTexture;
