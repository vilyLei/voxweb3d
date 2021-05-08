
import {TextureConst,TextureFormat,TextureDataType,TextureTarget} from "../../vox/texture/TextureConst";
import TextureProxy from "../../vox/texture/TextureProxy";
import ImageTextureLoader from "../../vox/texture/ImageTextureLoader";

//import TextureConst = TextureConstT.vox.texture.TextureConst;
//import TextureProxy = TextureProxyT.vox.texture.TextureProxy;
//import TexResLoader = TexResLoaderT.vox.texture.TexResLoader;

export namespace demo
{
    export namespace base
    {
            
        export class TexMana
        {

            private m_texLoader:ImageTextureLoader;
            private m_texList:TextureProxy[] = [];
            constructor()
            {
            }
            getImageTexByUrl(url:string):TextureProxy
            {
                let tex:TextureProxy = this.m_texLoader.getImageTexByUrl(url);
                tex.mipmapEnabled = true;
                tex.setWrap(TextureConst.WRAP_REPEAT);
                return tex;
            }
            getTexAt(i:number):TextureProxy
            {
                return this.m_texList[i];
            }
        }
    }
}