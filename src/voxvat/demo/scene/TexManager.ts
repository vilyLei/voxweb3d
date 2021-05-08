

import { TextureConst } from "../../../vox/texture/TextureConst";
import TextureProxy from "../../../vox/texture/TextureProxy";
import ImageTextureLoader from "../../../vox/texture/ImageTextureLoader";

export namespace voxvat
{
    export namespace demo
    {
        export namespace scene
        {
            export class TexManager
            {
                static TexLoader:ImageTextureLoader = null;
                static CreateTexByUrl(purl:string):TextureProxy
                {
                    let tex:TextureProxy = TexManager.TexLoader.getImageTexByUrl(purl);
                    tex.setWrap(TextureConst.WRAP_REPEAT);
                    tex.mipmapEnabled = true;
                    return tex;
                }
                static getImageTexByUrl(purl:string):TextureProxy
                {
                    return TexManager.TexLoader.getTexByUrl(purl);
                }
            }
        }
    }
}