interface DemoItem {
    name: string;
    info: string;
}
interface DemoData {
    demos: DemoItem[];
}

export class Home {

    private m_htmlText: string = "";
    constructor() { }

    initialize(): void {
        console.log("Home::initialize()......");
        let url: string = location.href + "";
        url = this.parseUrl( url );
        console.log("url: ",url);

        this.m_bodyDiv = document.getElementById("demos") as HTMLDivElement;
        if(this.m_bodyDiv == null) {
            this.initUI();
        }

        this.loadData("static/home/demos.json?ver="+Math.random() + Date.now());
    }
    private parseData(data: DemoData): void {
        console.log("data: ",data);
        let htmlText: string = "";
        htmlText += "<center/>";
        htmlText += '<hr style="height:3px;border:1px solid #444444;"/>';
        htmlText += "<br/>";
        htmlText += "ENGINE DEMOS";
        this.m_htmlText = htmlText;

        let po: DemoItem;
        let list: DemoItem[] = data.demos;
        for(let i: number = 0; i < list.length; ++i) {
            po = list[i];
            this.addLinkHtmlLine(po.name,po.info);
        }
        
        this.m_bodyDiv.innerHTML = this.m_htmlText;
    }
    private addLinkHtmlLine(demoName: string, info: string): void {
        this.m_htmlText += "<br/>";
        this.m_htmlText += '<a id="link_demo" href="http://www.artvily.com/renderCase?sample=demoLoader&demo='+demoName+'" target="_blank">'+info+'</a>';        
    }
    
    private loadData(purl: string): void {
        let codeLoader: XMLHttpRequest = new XMLHttpRequest();
        codeLoader.open("GET", purl, true);
        //xhr.responseType = "arraybuffer";
        codeLoader.onerror = function (err) {
            console.error("load error: ", err);
        }

        codeLoader.onprogress = (e) => {
        };
        codeLoader.onload = () => {
            let info: string = codeLoader.response as string;
            let data: DemoData = JSON.parse(info) as DemoData;
            this.parseData( data );
        }
        codeLoader.send(null);
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