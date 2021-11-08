/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import DivLog from "../utils/DivLog";

class RendererDevice {
    private static s_inited: boolean = true;
    private static s_WEBGL_VER: number = 2;
    private static s_devicePixelRatio: number = 1.0;
    private static s_mobileFlag: number = 0;
    private static s_safariFlag: number = 0;
    private static s_Android_Flag: number = 0;
    private static s_IOS_Flag: number = 0;
    private static s_IPad_Flag: number = 0;
    /**
     * zh-CN, en-US, ect....
     */
    private static s_language: string = "";
    private static s_debugEnabled: boolean = true;
    public static GPU_VENDOR: string = "unknown";
    public static GPU_RENDERER: string = "unknown";
    public static MAX_TEXTURE_SIZE: number = 4096;
    public static MAX_RENDERBUFFER_SIZE: number = 4096;
    public static MAX_VIEWPORT_WIDTH: number = 4096;
    public static MAX_VIEWPORT_HEIGHT: number = 4096;
    // for debug
    public static SHOWLOG_ENABLED: boolean = false;
    public static SHADERCODE_TRACE_ENABLED: boolean = false;
    // true: force vertex shader precision to highp
    public static VERT_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED: boolean = true;
    // true: force fragment shader precision to highp
    public static FRAG_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED: boolean = true;
    // worker multi threads enabled yes or no
    private static s_threadEnabled: boolean = true;
    
    static SetLanguage(language: string): void {
        RendererDevice.s_language = language;
    }
    static GetLanguage(): string {
        if(RendererDevice.s_language != "") {
            return RendererDevice.s_language;
        }
        RendererDevice.s_language = navigator.language;
        return RendererDevice.s_language;
    }
    static SetThreadEnabled(boo: boolean): void {
        RendererDevice.s_threadEnabled = boo;
    }
    static GetThreadEnabled(): boolean {
        return RendererDevice.s_threadEnabled;
    }
    static GetDebugEnabled(): boolean {
        return RendererDevice.s_debugEnabled;
    }
    static SetDebugEnabled(boo: boolean): void {
        RendererDevice.s_debugEnabled = boo;
    }
    static SetDevicePixelRatio(dpr: number): void {
        RendererDevice.s_devicePixelRatio = dpr;
    }
    static GetDevicePixelRatio(): number {
        return RendererDevice.s_devicePixelRatio;
    }
    static Initialize(infoArr: number[]) {
        if (RendererDevice.s_inited) {
            RendererDevice.s_inited = false;

            RendererDevice.s_WEBGL_VER = infoArr[0];
            RendererDevice.TestMobileWeb();
            RendererDevice.s_language = navigator.language + "";
        }
    }
    
    static TestSafariWeb(): boolean {
        //return /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent);
        return /Safari/.test(navigator.userAgent) && /Mac OS/.test(navigator.userAgent);
    }
    static IsWebGL1(): boolean { return RendererDevice.s_WEBGL_VER == 1; }
    static IsWebGL2(): boolean { return RendererDevice.s_WEBGL_VER == 2; }
    static IsMobileWeb(): boolean {
        if(RendererDevice.s_mobileFlag > 0) {
            return RendererDevice.s_mobileFlag == 2;
        }
        return RendererDevice.TestMobileWeb();
    }
    static IsSafariWeb(): boolean {
        if(RendererDevice.s_safariFlag > 0) {
            return RendererDevice.s_safariFlag == 2;
        }
        RendererDevice.s_safariFlag = RendererDevice.TestSafariWeb() ? 2 : 1;
        return RendererDevice.s_safariFlag == 2;
    }
    static IsIOS(): boolean {
        if(RendererDevice.s_IOS_Flag > 0) {
            return RendererDevice.s_IOS_Flag == 2;
        }
        let boo: boolean = false;
        if (/iPad|iPhone|iPod/.test(navigator.platform)) {
            boo = true;
        } else {
            boo = navigator.maxTouchPoints != undefined &&
                navigator.maxTouchPoints > 2 &&
                /MacIntel/.test(navigator.platform);
        }
        RendererDevice.s_IOS_Flag = boo ? 2 : 1;
        return boo;
    }

    static IsIpadOS(): boolean {
        if(RendererDevice.s_IPad_Flag > 0) {
            return RendererDevice.s_IPad_Flag == 2;
        }
        let boo: boolean = navigator.maxTouchPoints > 0 &&
            navigator.maxTouchPoints > 2 &&
            /MacIntel/.test(navigator.platform);
        if (!boo && (/iPod|iPad|iPadPro|iPodPro/i.test(navigator.userAgent))) {
            boo = true;
        }
        RendererDevice.s_IPad_Flag = boo ? 2 : 1;
        return boo;
    }
    
    static IsAndroidOS(): boolean {
        if(RendererDevice.s_Android_Flag > 0) {
            return RendererDevice.s_Android_Flag == 2;
        }
        let boo: boolean = RendererDevice.TestMobileWeb();
        
        if (boo && (/Android|Linux/i.test(navigator.userAgent))) {
            boo = true;
        }
        else {
            boo = false;
        }
        RendererDevice.s_Android_Flag = boo ? 2 : 1;
        return boo;
    }
    private static TestMobileWeb(): boolean {
        if(RendererDevice.s_mobileFlag > 0) {
            return RendererDevice.s_mobileFlag == 2;
        }
        if (/mobile/.test(location.href)) {
            RendererDevice.s_mobileFlag = 2;
            return RendererDevice.s_mobileFlag == 2;
        }
        
        if (/Android/i.test(navigator.userAgent)) {
            if (/Mobile/i.test(navigator.userAgent)) {
                RendererDevice.s_mobileFlag = 2;
                return RendererDevice.s_mobileFlag == 2;
            } else {
                RendererDevice.s_mobileFlag = 1;
                return RendererDevice.s_mobileFlag == 2;
            }
        } else if (/webOS|iPhone|iPod|iPad|iPodPro|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
            RendererDevice.s_mobileFlag = 2;
            return RendererDevice.s_mobileFlag == 2;
        }
        RendererDevice.s_mobileFlag = 1;
        return RendererDevice.s_mobileFlag == 2;
    }
}

export default RendererDevice;