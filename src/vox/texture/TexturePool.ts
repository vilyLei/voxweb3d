/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/
import { TextureProxyType } from "../../vox/texture/TextureProxyType";
import IRenderTexture from "../../vox/render/texture/IRenderTexture";

/**
 * 本类作基础纹理对象的对象池
 */
export class TexturePool {
    private m_imgTexList: IRenderTexture[] = [];
    private m_bytesTexList: IRenderTexture[] = [];
    private m_floatTexList: IRenderTexture[] = [];
    private m_wrapperTexList: IRenderTexture[] = [];
    constructor() {
    }
    addTexture(texture: IRenderTexture): void {
        switch (texture.getType()) {
            case TextureProxyType.Image:
                this.m_imgTexList.push(texture);
                break;
            case TextureProxyType.Bytes:
                this.m_bytesTexList.push(texture);
                break;
            case TextureProxyType.Float:
                this.m_floatTexList.push(texture);
                break;
            case TextureProxyType.Wrapper:
                this.m_wrapperTexList.push(texture);
                break;
            default:
                break;
        }
    }
    getTexture(type: TextureProxyType): IRenderTexture {
        switch (type) {
            case TextureProxyType.Image:
                if (this.m_imgTexList.length > 0) {
                    return this.m_imgTexList.pop();
                }
                break;
            case TextureProxyType.Bytes:
                if (this.m_bytesTexList.length > 0) {
                    return this.m_bytesTexList.pop();
                }
                break;
            case TextureProxyType.Float:
                if (this.m_floatTexList.length > 0) return this.m_floatTexList.pop();
                break;
            case TextureProxyType.Wrapper:
                if (this.m_wrapperTexList.length > 0) return this.m_wrapperTexList.pop();
                break;
            default:
                break;
        }
        return null;
    }
}
export default TexturePool;