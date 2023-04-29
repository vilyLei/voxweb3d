/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/
class URLFileInfo {

    name:string = "";           // 完整的文件名,例如: black.png
    suffix:string = "";         // 文件后缀名小写, 例如: png
    constructor(url:string) {

        this.setUrl( url );
    }
    reset(): void {
        this.name = "";
        this.suffix = "";
    }
    setUrl(url:string):void {

        let i: number = url.indexOf("://");
        let j: number = url.indexOf("?",i);
        j = j > i ? j : url.length;
        this.reset();
        this.name = "";
        if (i < 0 || j < 0) {
            return;
        }
        url = url.slice(i + 3, j);
        i = url.lastIndexOf("/");
        // file name
        url = url.slice(i + 1);
        this.name = url;
        // suffix name
        i = url.lastIndexOf(".");
        if (i > 0) {
            this.suffix = (url.slice(i + 1)).toLocaleLowerCase();
        }
    }
}
class URLTool {
    private static s_fileInfo: URLFileInfo = new URLFileInfo("");
    /**
     * 此函数用于获取url中的文件信息
     * @param url 网络请求的url
     * @return 返回 { name: "", suffix: "" } 结构的对象， name表示完整的文件名，suffix表示文件名后缀
     */
    static GetURLFileInfo(url: string): URLFileInfo {
        return new URLFileInfo(url);
    }
    /**
     * 获取 url 中文件名后缀
     * @param url 网络请求的url
     * @return 返回 url file suffix
     */
    static GetURLFileSuffix(url: string): any {
        URLTool.s_fileInfo.setUrl( url );
        return URLTool.s_fileInfo.suffix;
    }
}
export {URLFileInfo, URLTool};
export default URLTool;