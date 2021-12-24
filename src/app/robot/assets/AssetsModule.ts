/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import TextureProxy from "../../../vox/texture/TextureProxy";
import { TextureConst } from "../../../vox/texture/TextureConst";
import { MaterialContext } from "../../../materialLab/base/MaterialContext";

export default class AssetsModule {

    private m_materialCtx: MaterialContext = null;
    private static s_ins: AssetsModule = null;

    constructor() {
        if (AssetsModule.s_ins != null) {
            throw Error("AssetsModule is a singleton class.");
        }
        AssetsModule.s_ins = this;
    }

    static GetInstance(): AssetsModule {
        if (AssetsModule.s_ins != null) {
            return AssetsModule.s_ins;
        }
        return new AssetsModule();
    }
    getImageTexByUrl(purl: string, wrapRepeat: boolean = true, mipmapEnabled = true): TextureProxy {
        let ptex: TextureProxy = this.m_materialCtx.getTextureByUrl(purl);
        ptex.mipmapEnabled = mipmapEnabled;
        if (wrapRepeat) ptex.setWrap(TextureConst.WRAP_REPEAT);
        return ptex;
    }
    static GetImageTexByUrl(purl: string, wrapRepeat: boolean = true, mipmapEnabled = true): TextureProxy {
        return AssetsModule.s_ins.getImageTexByUrl(purl, wrapRepeat, mipmapEnabled);
    }
    initialize(materialCtx: MaterialContext): void {
        if (this.m_materialCtx == null) {
            this.m_materialCtx = materialCtx;
        }
    }
    static GetBulTex(type: number): TextureProxy {
        //return AssetsModule.s_ins.getImageTexByUrl("static/assets/flare_core_01.jpg");
        return AssetsModule.s_ins.getImageTexByUrl("static/assets/flare_core_02.jpg");
    }
}