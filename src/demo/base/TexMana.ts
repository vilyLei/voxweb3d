
import * as TextureConstT from "../../vox/texture/TextureConst";
import * as TextureProxyT from "../../vox/texture/TextureProxy";
import * as TexResLoaderT from "../../vox/texture/TexResLoader";

import TextureConst = TextureConstT.vox.texture.TextureConst;
import TextureProxy = TextureProxyT.vox.texture.TextureProxy;
import TexResLoader = TexResLoaderT.vox.texture.TexResLoader;

export namespace demo
{
    export namespace base
    {
            
        export class TexMana
        {

            private m_texLoader:TexResLoader = new TexResLoader();
            private m_texList:TextureProxy[] = [];
            constructor()
            {
            }
            getImageTexByUrl(url:string):TextureProxy
            {
                let tex:TextureProxy = this.m_texLoader.getTexAndLoadImg(url);
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