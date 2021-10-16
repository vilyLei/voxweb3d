export class Home {

    constructor() { }

    initialize(): void {
        console.log("Home::initialize()......");
        let url: string = location.href + "";
        url = this.parseUrl( url );
        console.log("url: ",url);
        //this.load( url );
        this.initDemoList();
    }
    private initDemoList(): void {
        let div: HTMLDivElement = document.getElementById("demos") as HTMLDivElement;
        if(div == null) {
            this.initUI();
            div = this.m_bodyDiv;
        }
        this.buildLinkTable(div);

    }
    private buildLinkTable(div: HTMLDivElement): void {

        let htmlText: string = "";
        htmlText += "<hr/>";
        htmlText += "<center/>";
        htmlText += "DEMOS";
        htmlText += "<br/>";
        htmlText += '<a id="link_demo" href="http://www.artvily.com/renderCase?sample=demoLoader&demo=cameraFollow2" target="_blank">摄像机跟随(camera follow)</a>';
        htmlText += "<br/>";
        htmlText += '<a id="link_demo" href="http://www.artvily.com/renderCase?sample=demoLoader&demo=cameraWalk" target="_blank">摄像机轨迹控制(camera path control)</a>';
        htmlText += "<br/>";
        htmlText += '<a id="link_demo" href="http://www.artvily.com/renderCase?sample=demoLoader&demo=multiGpu2" target="_blank">多GPU上下文和多scene(multi gpu context and multi scenes)</a>';

        div.innerHTML = htmlText;
    }
    private load(purl: string): void {
        let codeLoader: XMLHttpRequest = new XMLHttpRequest();
        codeLoader.open("GET", purl, true);
        //xhr.responseType = "arraybuffer";
        codeLoader.onerror = function (err) {
            console.error("load error: ", err);
        }

        codeLoader.onprogress = (e) => {
            this.showLoadInfo(e);
        };
        codeLoader.onload = () => {
            let scriptEle: HTMLScriptElement = document.createElement("script");
            scriptEle.onerror = (e) => {
                console.error("module script onerror, e: ", e);
            }
            scriptEle.innerHTML = codeLoader.response;
            document.head.appendChild(scriptEle);
            this.loadFinish();
        }
        codeLoader.send(null);
    }
    private showLoadInfo(e: any): void {
        this.showLoadProgressInfo(e);
    }
    private parseUrl(url: string): string {

        console.log("url: ",url);
        //http://192.168.0.102:9000/renderCase?sample=demoLoader&demo=cameraFollow2
        let params: string[] = url.split("?");
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
        return "static/voxweb3d/demos/"+params[1]+".js";
        /*
        let params: string[] = url.split("?");
        if(params.length < 2 || params[0].indexOf("renderCase") < 1) {
            return "";
        }
        //renderCase?sample=cameraFollow2
        let moduleName: string = params[1];
        params = moduleName.split("=");
        if(params.length < 2 || params[0] != "sample") {
            return "";
        }
        return "static/voxweb3d/demos/"+params[1]+".js";
        //*/
    }

    private m_bodyDiv: HTMLDivElement = null;
    private m_infoDiv: HTMLDivElement = null;
    private initUI(): void {
        document.body.style.background = "#ffffff";
        this.m_bodyDiv = document.createElement('div');
        this.m_bodyDiv.style.width = "100vw";
        this.m_bodyDiv.style.height = "100vh";
        //this.elementCenter(this.m_bodyDiv);
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
    showLoadProgressInfo(e: any): void {
        let str: string = "loading " + Math.round(100.0 * e.loaded / e.total) + "% ";
        this.showInfo(str);
    }
    
    showLoadStart(): void {
        this.showInfo("loading 0%");
    }
    showLoaded(): void {
        this.showInfo("100%");
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

export default Home;