export class DemoLoader {

    constructor() { }

    initialize(): void {
        console.log("DemoLoader::initialize()......");
        let url = location.href + "";
        url = this.parseUrl( url );
        console.log("url: ",url);
        this.initUI();
        this.load( url );
    }
    private load(purl: string): void {
        let codeLoader = new XMLHttpRequest();
        codeLoader.open("GET", purl, true);
        codeLoader.onerror = function (err) {
            console.error("load error: ", err);
        }

        codeLoader.onprogress = (e) => {
            this.showLoadInfo(e, codeLoader);
        };
        codeLoader.onload = () => {
            let scriptEle = document.createElement("script");
            scriptEle.onerror = (e) => {
                console.error("module script onerror, e: ", e);
            }
            scriptEle.innerHTML = codeLoader.response;
            document.head.appendChild(scriptEle);
            this.loadFinish();
        }
        codeLoader.send(null);
    }
    private showLoadInfo(e: ProgressEvent, req: XMLHttpRequest): void {
        this.showLoadProgressInfo(e, req);
    }
    private parseUrl(url: string): string {

        console.log("url: ",url);

        let params = url.split("?");
        if(params.length < 2 || params[0].indexOf("renderCase") < 1) {
            return "";
        }
        let moduleName: string = params[1];
        params = moduleName.split("&");
        if(params.length < 2 || params[0].indexOf("sample") < 0) {
            return "";
        }
        moduleName = params[1];
        params = moduleName.split("=");
        if(params.length < 2 || params[0] != "demo") {
            return "";
        }
        let hurl: string = location.href + "";
        let host = "";
        if(hurl.indexOf("artvily.") > 0) {
            host = "http://www.artvily.com:9090/";
        }
        return host + "static/voxweb3d/demos/"+params[1]+".js";
    }

    private m_bodyDiv: HTMLDivElement = null;
    private m_infoDiv: HTMLDivElement = null;
    private initUI(): void {
        document.body.style.background = "#000000";
        this.m_bodyDiv = document.createElement('div');
        this.m_bodyDiv.style.width = "100vw";
        this.m_bodyDiv.style.height = "100vh";
        this.elementCenter(this.m_bodyDiv);
        document.body.appendChild( this.m_bodyDiv );
        document.body.style.margin = '0';

        this.showInfo("init...");
    }

    private showInfo(str: string): void {

        if (this.m_infoDiv == null) {
            this.m_infoDiv = document.createElement('div');
            this.m_infoDiv.style.backgroundColor = "rgba(255,255,255,0.1)";
            this.m_infoDiv.style.color = "#00ee00";
            this.elementCenter(this.m_infoDiv);
            this.m_bodyDiv.appendChild(this.m_infoDiv);
        }
        this.m_infoDiv.innerHTML = str;
    }
    showLoadProgressInfo(evt: ProgressEvent, req: XMLHttpRequest): void {
        console.log("loading evt: ",evt);
        // let pro = e.total > 0 ? Math.round(100.0 * e.loaded / e.total) + "% " : e.loaded + " bytes ";
        // console.log("progress evt: ", evt);
        // console.log("progress total: ", evt.total, ", loaded: ", evt.loaded);
        let k = 0.0;
        if (evt.total > 0 || evt.lengthComputable) {
            k = Math.min(1.0, (evt.loaded / evt.total));
        } else {
            let content_length: number = parseInt(req.getResponseHeader("content-length"));
            // var encoding = req.getResponseHeader("content-encoding");
            // if (total && encoding && encoding.indexOf("gzip") > -1) {
            if (content_length > 0) {
                // assuming average gzip compression ratio to be 25%
                content_length *= 4; // original size / compressed size
                k = Math.min(1.0, (evt.loaded / content_length));
            } else {
                console.warn("lengthComputable failed");
            }
        }
        let str: string = "loading " + Math.round(k * 100) +"% ";
        this.showInfo(str);
    }

    showLoadStart(): void {
        this.showInfo("loading 0% ");
    }
    showLoaded(): void {
        this.showInfo("100% ");
    }
    loadFinish(): void {
        if (this.m_bodyDiv != null){
            this.m_bodyDiv.parentElement.removeChild(this.m_bodyDiv);
            this.m_bodyDiv = null;
        }
    }
    private elementCenter(ele: HTMLElement,top: string = "50%", left: string = "50%", position: string = "absolute"): void {

        ele.style.textAlign = "center";
        ele.style.display = "flex";
        ele.style.flexDirection = "column";
        ele.style.justifyContent = "center";
        ele.style.alignItems = "center";
        // ele.style.top = top;
        // ele.style.left = left;
        // ele.style.position = position;
        // ele.style.transform = "translate(-50%, -50%)";
    }
}

export default DemoLoader;
