/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/
import {TextureProxyType} from "../../vox/texture/TextureConst";
import TextureProxy from "../../vox/texture/TextureProxy";

/**
 * 本类作基础纹理对象的对象池
 */
export class TexturePool
{
    private m_imgTexList:TextureProxy[] = [];
    private m_bytesTexList:TextureProxy[] = [];
    private m_floatTexList:TextureProxy[] = [];
    private m_wrapperTexList:TextureProxy[] = [];
    constructor()
    {
    }
    addTexture(texture:TextureProxy):void
    {
        switch(texture.getType())
        {
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
    getTexture(type:TextureProxyType):TextureProxy
    {
        switch(type)
        {
            case TextureProxyType.Image:
                if(this.m_imgTexList.length > 0)
                {
                    return this.m_imgTexList.pop();
                }
            break;
            case TextureProxyType.Bytes:
                if(this.m_bytesTexList.length > 0)
                {
                    return this.m_bytesTexList.pop();
                }
            break;
            case TextureProxyType.Float:
                if(this.m_floatTexList.length > 0)return this.m_floatTexList.pop();
            break;
            case TextureProxyType.Wrapper:
                if(this.m_wrapperTexList.length > 0)return this.m_wrapperTexList.pop();
            break;
            default:
            break;
        }
        return null;
    }
}
export default TexturePool;