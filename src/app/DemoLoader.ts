interface DemoInfoItem {
    name: string;
    ver: string;
}
interface DemoInfoData {
    demos: DemoInfoItem[];
}
export class DemoLoader {

    constructor() { }

    initialize(): void {
        console.log("DemoLoader::initialize()......");
        let url = location.href + "";
        url = this.parseUrl( url );
        console.log("url: ",url);
        this.initUI();
        // this.loadModule( url );
        let hurl = location.href + "";
        let host = "";
        if(hurl.indexOf("artvily.") > 0) {
            host = "http://www.artvily.com:9090/";
        }
        this.loadInfo(host + "static/voxweb3d/demos/info.json?vtk=" + Math.random() +"uf8"+ Date.now(), url);
        this.showInfo("loading 1% ");
    }
    private loadModule(purl: string): void {
        let codeLoader = new XMLHttpRequest();
        codeLoader.open("GET", purl, true);
        codeLoader.onerror = function (err) {
            console.error("loadModule error: ", err);
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
    
    private loadInfo(purl: string, demoUrl: string): void {
        let codeLoader = new XMLHttpRequest();
        codeLoader.open("GET", purl, true);
        codeLoader.onerror = function (err) {
            console.error("loadInfo error: ", err);
        }
        codeLoader.onprogress = (e) => {
            
        };
        codeLoader.onload = () => {
            let jsonStr = codeLoader.response;
            
            let data: DemoInfoData = JSON.parse(jsonStr) as DemoInfoData;
            let map: Map<string, DemoInfoItem> = new Map();
            let ls = data.demos;
            for(let i = 0; i < ls.length; ++i) {
                map.set(ls[i].name, ls[i]);
            }
            if(map.has(this.m_name)) {
                let item = map.get(this.m_name);
                this.loadModule( demoUrl + "?dtk="+item.ver+"&uuid="+ Math.random() +"f90.1"+ Date.now() );
            }else {
                this.loadModule( demoUrl );
            }
            // let scriptEle = document.createElement("script");
            // scriptEle.onerror = (e) => {
            //     console.error("module script onerror, e: ", e);
            // }
            // scriptEle.innerHTML = codeLoader.response;
            // document.head.appendChild(scriptEle);
            // this.loadFinish();
        }
        codeLoader.send(null);
    }
    private showLoadInfo(e: ProgressEvent, req: XMLHttpRequest): void {
        this.showPro(e, req);
    }
    private m_name = "";
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
        let hurl = location.href + "";
        let host = "";
        if(hurl.indexOf("artvily.") > 0) {
            host = "http://www.artvily.com:9090/";
        }
        this.m_name = params[1];
        return host + "static/voxweb3d/demos/"+params[1]+".js";
    }

    private mBDV: HTMLDivElement = null;
    private mIDV: HTMLDivElement = null;
    private initUI(): void {
        let db = document.body;
        db.style.background = "#000000";
        
        let b = this.mBDV;
        b = document.createElement('div');
        b.style.width = "100vw";
        b.style.height = "100vh";
        this.elementCenter(b);
        db.appendChild( b );
        db.style.margin = '0';
        this.mBDV = b;
        this.showInfo("init...");
    }

    private showInfo(str: string): void {

        let div = this.mIDV;
        if (div == null) {
            div = document.createElement('div');
            div.style.backgroundColor = "rgba(255,255,255,0.1)";
            div.style.color = "#00ee00";
            this.elementCenter(div);
            this.mBDV.appendChild(div);
        }
        div.innerHTML = str;
        this.mIDV = div;
    }
    showPro(evt: ProgressEvent, req: XMLHttpRequest): void {
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
        this.showInfo( "loading " + Math.round(k * 100) +"% " );
    }

    showLoadStart(): void {
        this.showInfo("loading 1% ");
    }
    showLoaded(): void {
        this.showInfo("100% ");
    }
    loadFinish(): void {
        let b = this.mBDV;
        if (b){
            b.parentElement.removeChild(b);
            this.mBDV = null;
        }
    }
    private elementCenter(ele: HTMLElement,top: string = "50%", left: string = "50%", position: string = "absolute"): void {

        const s = ele.style;
        s.textAlign = "center";
        s.display = "flex";
        s.flexDirection = "column";
        s.justifyContent = "center";
        s.alignItems = "center";
        // ele.style.top = top;
        // ele.style.left = left;
        // ele.style.position = position;
        // ele.style.transform = "translate(-50%, -50%)";
    }
}

export default DemoLoader;
