/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import TextureProxy from "../../../vox/texture/TextureProxy";
import {TextureConst} from "../../../vox/texture/TextureConst";
import ImageTextureLoader from "../../../vox/texture/ImageTextureLoader";

export default class AssetsModule
{
    
    private m_texLoader:ImageTextureLoader = null;                
    private static s_ins:AssetsModule = null;

    constructor()
    {
        if(AssetsModule.s_ins != null)
        {
            throw Error("AssetsModule is a singleton class.");
        }
        AssetsModule.s_ins = this;
    }

    static GetInstance():AssetsModule
    {
        if(AssetsModule.s_ins != null)
        {
            return AssetsModule.s_ins;
        }
        return new AssetsModule();
    }
    getImageTexByUrl(purl:string,wrapRepeat:boolean = true,mipmapEnabled = true):TextureProxy
    {
        let ptex:TextureProxy = this.m_texLoader.getImageTexByUrl(purl);
        ptex.mipmapEnabled = mipmapEnabled;
        if(wrapRepeat)ptex.setWrap(TextureConst.WRAP_REPEAT);
        return ptex;
    }
    static GetImageTexByUrl(purl:string,wrapRepeat:boolean = true,mipmapEnabled = true):TextureProxy
    {
        return AssetsModule.s_ins.getImageTexByUrl(purl,wrapRepeat,mipmapEnabled);
    }
    initialize(texLoader:ImageTextureLoader):void
    {
        if(this.m_texLoader == null)
        {
            this.m_texLoader = texLoader;
        }
    }
    static GetBulTex(type:number):TextureProxy
    {
        //return AssetsModule.s_ins.getImageTexByUrl("static/assets/flare_core_01.jpg");
        return AssetsModule.s_ins.getImageTexByUrl("static/assets/flare_core_02.jpg");
    }
}