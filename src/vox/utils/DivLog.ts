/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import { RGBColorUtil } from "./ColorUtils";

class DivLog {
    private static s_logStr: string = "";
    private static s_infoDiv: HTMLDivElement = null;
    private static s_debugEanbled: boolean = false;
    private static s_textBGColor: string = "#aa0033";
    private static s_textColor: string = "#000000";
    private static s_textBgEnabled: boolean = true;
    private static s_leftX: number = 0;
    private static s_topY: number = 128;
    static SetDebugEnabled(boo: boolean): void {
        DivLog.s_debugEanbled = boo;
    }
    static SetXY(px: number, py: number): void {
        DivLog.s_leftX = px;
        DivLog.s_topY = py;
    }
    /**
     * @param uintRGB24, uint 24bit rgb color, example: 0xff003a
     */
    static SetTextBgColor(uintRGB24: number): void {
        
        DivLog.s_textBGColor = RGBColorUtil.uint24RGBToCSSHeXRGBColor(uintRGB24);
        if(DivLog.s_infoDiv != null) {
            DivLog.s_infoDiv.style.backgroundColor = this.s_textBGColor;
        }
    }
    /**
     * @param uintRGB24, uint 24bit rgb color, example: 0xff003a
     */
    static SetTextColor(uintRGB24: number): void {
        
        DivLog.s_textColor = RGBColorUtil.uint24RGBToCSSHeXRGBColor(uintRGB24);
        if(DivLog.s_infoDiv != null) {
            DivLog.s_infoDiv.style.color = this.s_textColor;
        }
    }
    static SetTextBgEnabled(boo: boolean): void {
        this.s_textBgEnabled = boo
        
        if(DivLog.s_infoDiv != null) {
            let pdiv = DivLog.s_infoDiv;
            if(DivLog.s_textBgEnabled) {
                pdiv.style.backgroundColor = this.s_textBGColor;
            } else {
                pdiv.style.backgroundColor = "";
            }
        }
    }
    static ShowLog(logStr: string): void {
        if (DivLog.s_debugEanbled) {
            if (DivLog.s_logStr.length > 0) {
                DivLog.s_logStr += "<br/>" + logStr;
            }
            else {
                DivLog.s_logStr = logStr;
            }
            DivLog.UpdateDivText();
        }
    }
    static GetLog(): string {
        return DivLog.s_logStr;
    }
    static ShowLogOnce(logStr: string): void {
        if (DivLog.s_debugEanbled) {
            DivLog.s_logStr = logStr;
            DivLog.UpdateDivText();
        }
    }
    static ClearLog(logStr: string = ""): void {
        if (DivLog.s_debugEanbled) {
            DivLog.s_logStr = logStr;
            DivLog.UpdateDivText();
        }
    }
    private static UpdateDivText(): void {
        if (DivLog.s_debugEanbled) {
            if (DivLog.s_infoDiv != null) {
                DivLog.s_infoDiv.innerHTML = DivLog.s_logStr;
            }
            else {
                let div: HTMLDivElement = document.createElement('div');
                div.style.color = ""
                let pdiv: any = div;
                pdiv.width = 128;
                pdiv.height = 64;
                if(DivLog.s_textBgEnabled) {
                    pdiv.style.backgroundColor = this.s_textBGColor;
                } else {
                    pdiv.style.backgroundColor = "";
                }
                pdiv.style.color = this.s_textColor;
                pdiv.style.left = DivLog.s_leftX + 'px';
                pdiv.style.top = DivLog.s_topY + 'px';
                pdiv.style.zIndex = "9999";
                pdiv.style.position = 'absolute';
                document.body.appendChild(pdiv);
                DivLog.s_infoDiv = pdiv;
                pdiv.innerHTML = DivLog.s_logStr;
            }
        }
    }
    static ShowAtTop(): void {
        if(DivLog.s_infoDiv != null) {
            DivLog.s_infoDiv.parentElement.removeChild(DivLog.s_infoDiv);
            document.body.appendChild(DivLog.s_infoDiv);
        }
    }
}
export default DivLog;