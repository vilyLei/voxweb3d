/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/
class DivLog
{
    private static s_logStr:string = "";
    private static s_infoDiv:any = null;
    private static s_debugEanbled:boolean = false;
    static SetDebugEnabled(boo:boolean):void
    {
        DivLog.s_debugEanbled = boo;
    }
    static ShowLog(logStr:string):void
    {
        if(DivLog.s_debugEanbled)
        {
            if(DivLog.s_logStr.length > 0)
            {
                DivLog.s_logStr += "<br/>" + logStr;
            }
            else
            {
                DivLog.s_logStr = logStr;
            }
            DivLog.UpdateDivText();
        }
    }
    static GetLog():string
    {
        return DivLog.s_logStr;
    }
    static ShowLogOnce(logStr:string):void
    {
        if(DivLog.s_debugEanbled)
        {
            DivLog.s_logStr = logStr;
            DivLog.UpdateDivText();
        }
    }
    static ClearLog(logStr:string = ""):void
    {
        if(DivLog.s_debugEanbled)
        {
            DivLog.s_logStr = logStr;
            DivLog.UpdateDivText();
        }
    }
    private static UpdateDivText():void
    {
        if(DivLog.s_debugEanbled)
        {
            if(DivLog.s_infoDiv != null)
            {
                DivLog.s_infoDiv.innerHTML = DivLog.s_logStr;
            }
            else
            {
                var pdiv:any = document.createElement('div');
                pdiv.width = 128;
                pdiv.height = 64;
                pdiv.style.backgroundColor = "#aa0033";
                pdiv.style.left = '0px';
                pdiv.style.top = '128px';
                pdiv.style.position = 'absolute';
                document.body.appendChild(pdiv);
                DivLog.s_infoDiv = pdiv;
                pdiv.innerHTML = DivLog.s_logStr;
            }
        }
    }
}
export default DivLog;