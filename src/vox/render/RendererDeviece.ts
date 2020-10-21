/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/
export namespace vox
{
    export namespace render
    {
        export class RendererDeviece
        {
            private static s_inited:boolean = true;
            private static s_WEBGL_VER:number = 2;
            public static SHADERCODE_TRACE_ENABLED:boolean = false;
            // true: force vertex shader precision to highp
            public static VERT_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED:boolean = true;
            // true: force fragment shader precision to highp
            public static FRAG_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED:boolean = false;
            static Initialize = function(infoArr:number[])
            {
                if(RendererDeviece.s_inited)
                {
                    RendererDeviece.s_WEBGL_VER = infoArr[0];
                    RendererDeviece.s_inited = false;
                }
            }
            static IsWebGL1():boolean{return RendererDeviece.s_WEBGL_VER == 1;}
            static IsWebGL2():boolean{return RendererDeviece.s_WEBGL_VER == 2;}
            static IsMobileWeb()
            {

                if (/mobile/.test(location.href)) return true;            
                if (/Android/i.test(navigator.userAgent)) {            
                    if (/Mobile/i.test(navigator.userAgent)) {            
                      return true;
                    } else {            
                      return false;            
                    }            
                } else if (/webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
                    return true;            
                }
                return false;
            }
        }
    }
}