

import * as TextureConstT from "../../../vox/texture/TextureConst";
import * as TextureProxyT from "../../../vox/texture/TextureProxy";
import * as TexResLoaderT from "../../../vox/texture/TexResLoader";

import TextureConst = TextureConstT.vox.texture.TextureConst;
import TextureProxy = TextureProxyT.vox.texture.TextureProxy;
import TexResLoader = TexResLoaderT.vox.texture.TexResLoader;

export namespace voxvat
{
    export namespace demo
    {
        export namespace scene
        {
            export class TexManager
            {
                private static s_texLoader:TexResLoader = new TexResLoader();
                static CreateTexByUrl(purl:string):TextureProxy
                {
                    let tex:TextureProxy = TexManager.s_texLoader.getTexAndLoadImg(purl);
                    tex.setWrap(TextureConst.WRAP_REPEAT);
                    tex.mipmapEnabled = true;
                    return tex;
                }
                static getImageTexByUrl(purl:string):TextureProxy
                {
                    return TexManager.s_texLoader.getTexAndLoadImg(purl);
                }
            }
        }
    }
}