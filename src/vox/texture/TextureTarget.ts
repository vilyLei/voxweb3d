/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

export default class TextureTarget {
    static readonly TEXTURE_2D: number = 20;
    static readonly TEXTURE_2D_ARRAY: number = 22;
    static readonly TEXTURE_SHADOW_2D: number = 23;
    static readonly TEXTURE_CUBE: number = 25;
    static readonly TEXTURE_3D: number = 30;
    static GetValue(rc: any, param: number): number {
        switch (param) {
            case TextureTarget.TEXTURE_2D:
                return rc.TEXTURE_2D;
                break;
            case TextureTarget.TEXTURE_2D_ARRAY:
                return rc.TEXTURE_2D_ARRAY;
                break;
            case TextureTarget.TEXTURE_CUBE:
                return rc.TEXTURE_CUBE_MAP;
                break;
            case TextureTarget.TEXTURE_3D:
                return rc.TEXTURE_3D;
                break;
            default:
                break;
        }
        return rc.TEXTURE_2D;
    }
}