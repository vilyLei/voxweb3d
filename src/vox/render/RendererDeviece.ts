/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

class RendererDeviece
{
    private static s_inited:boolean = true;
    private static s_WEBGL_VER:number = 2;
    private static s_devicePixelRatio:number = 1.0;
    private static s_mobileWeb:boolean = false;
    private static s_debugEnabled:boolean = true;
    public static GPU_VENDOR:string = "unknown";
    public static GPU_RENDERER:string = "unknown";
    public static MAX_TEXTURE_SIZE:number = 4096;
    public static MAX_RENDERBUFFER_SIZE:number = 4096;
    public static MAX_VIEWPORT_WIDTH:number = 4096;
    public static MAX_VIEWPORT_HEIGHT:number = 4096;
    // for debug
    public static SHOWLOG_ENABLED:boolean = false;
    public static SHADERCODE_TRACE_ENABLED:boolean = false;
    // true: force vertex shader precision to highp
    public static VERT_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED:boolean = true;
    // true: force fragment shader precision to highp
    public static FRAG_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED:boolean = false;
    // worker multi threads enabled yes or no
    private static s_threadEnabled:boolean = true;
    static SetThreadEnabled(boo:boolean):void
    {
        RendererDeviece.s_threadEnabled = boo;
    }
    static GetThreadEnabled():boolean
    {
      return RendererDeviece.s_threadEnabled;
    }
    static GetDebugEnabled():boolean
    {
        return RendererDeviece.s_debugEnabled;
    }
    static SetDebugEnabled(boo:boolean):void
    {
        RendererDeviece.s_debugEnabled = boo;
    }
    static SetDevicePixelRatio(dpr:number):void
    {
        RendererDeviece.s_devicePixelRatio = dpr;
    }
    static GetDevicePixelRatio():number
    {
        return RendererDeviece.s_devicePixelRatio;
    }
    static Initialize = function(infoArr:number[])
    {
        if(RendererDeviece.s_inited)
        {
            RendererDeviece.s_WEBGL_VER = infoArr[0];
            RendererDeviece.s_inited = false;
            
            RendererDeviece.TestMobileWeb();
        }
    }
    static IsWebGL1():boolean{return RendererDeviece.s_WEBGL_VER == 1;}
    static IsWebGL2():boolean{return RendererDeviece.s_WEBGL_VER == 2;}
    static IsMobileWeb():boolean
    {
        return RendererDeviece.s_mobileWeb;
    }
    private static TestMobileWeb()
    {
        if (/mobile/.test(location.href)) RendererDeviece.s_mobileWeb = true;
        if (/Android/i.test(navigator.userAgent)) {            
            if (/Mobile/i.test(navigator.userAgent)) {            
              RendererDeviece.s_mobileWeb = true;
            } else {            
              RendererDeviece.s_mobileWeb = false;
            }            
        } else if (/webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
            RendererDeviece.s_mobileWeb = true;
        }
        RendererDeviece.s_mobileWeb = false;
    }
}

export default RendererDeviece;