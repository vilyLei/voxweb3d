import URLFilter from "../cospace/app/utils/URLFilter";

interface DemoItem {
    name: string;
    info: string;
    url?: string;
}
interface DemoData {
    demos: DemoItem[];
}
declare var CURR_PAGE_ST_INFO_LIST: any;
export class EnginePage {

    private m_htmlText = "";
    private m_host = "";
    private m_domin = "";
    constructor() { }

    initialize(): void {
        console.log("EnginePage::initialize()......");
		this.m_domin = URLFilter.getDomain(location.href);
        this.m_host = URLFilter.getHostUrl("9090");
		// for test
        // this.m_host = URLFilter.getHostUrl();

        this.m_demoBodyDiv = document.getElementById("demos") as HTMLDivElement;
        if (this.m_demoBodyDiv == null) {
            this.initUI();
        }
        this.loadData(this.m_host + "static/voxweb3d/demos/demos.json?ver=" + Math.random() + Date.now());
        this.initHeadApp();
    }
    private initHeadApp(): void {

        let appUrl = this.m_host + "static/voxweb3d/demos/camRoaming.js";

        let codeLoader: XMLHttpRequest = new XMLHttpRequest();
		codeLoader.open("GET", appUrl, true);
		codeLoader.onerror = function(err) {
			console.error("load error: ", err);
		}

		codeLoader.onload = evt => {
			console.log("module js file loaded.");
			let scriptEle: HTMLScriptElement = document.createElement("script");
			scriptEle.onerror = evt => {
				console.error("module script onerror, e: ", evt);
			};
			scriptEle.type = "text/javascript";
			scriptEle.innerHTML = codeLoader.response;
			document.head.appendChild(scriptEle);
		};
		codeLoader.send(null);
    }
    private parseData(data: DemoData): void {
        console.log("data: ", data);
        let htmlText: string = "";
        htmlText += "<center/>";
        htmlText += '<hr style="height:3px;border:1px solid #444444;"/>';
        htmlText += "<br/>";
        htmlText += "ENGINE DEMOS";
        this.m_htmlText = htmlText;

        let po: DemoItem;
        let list: DemoItem[] = data.demos;
        for (let i: number = 0; i < list.length; ++i) {
            po = list[i];
            this.addLinkHtmlLine(po.name, po.info, po.url);
        }
        htmlText = ""
        if(typeof CURR_PAGE_ST_INFO_LIST !== undefined) {
            let ls = CURR_PAGE_ST_INFO_LIST as any;
            htmlText = "<br/><br/>";
            htmlText += '<hr style="height:3px;border:1px solid #444444;"/>';
            htmlText += `<font size=3>`+ls[0] + " · " + ls[1] + `</font>`
        }
        this.m_demoBodyDiv.innerHTML = this.m_htmlText + htmlText;

        let divBody = document.getElementById("divBody") as HTMLDivElement;
        if (divBody != null) {
            let body = document.body, html = document.documentElement;
            let height = Math.max(body.scrollHeight, body.offsetHeight,
                html.clientHeight, html.scrollHeight, html.offsetHeight);
            divBody.style.height = (height + 10) + "px";
        }
    }
    private addLinkHtmlLine(demoName: string, info: string, url?: string): void {
        this.m_htmlText += "<br/>";
        if(url !== undefined && url != "") {
        }else {
            url = this.m_domin + `/renderCase?sample=demoLoader&demo=${demoName}`;
        }
		console.log("addLinkHtmlLine(), url: ", url);
        this.m_htmlText += `<a id="link_demo" href="${url}" target="_blank">${info}</a>`;
    }

    private loadData(purl: string): void {
        let codeLoader = new XMLHttpRequest();
        codeLoader.open("GET", purl, true);
        codeLoader.onerror = function (err) {
            console.error("load error: ", err);
        }

        codeLoader.onprogress = (e) => {
        };
        codeLoader.onload = () => {
            let info = codeLoader.response as string;
            let data = JSON.parse(info) as DemoData;
            this.parseData(data);
        }
        codeLoader.send(null);
    }
    private showLoadInfo(e: any): void {
        this.showLoadProgressInfo(e);
    }
    private m_demoBodyDiv: HTMLDivElement = null;
    private m_infoDiv: HTMLDivElement = null;
    private initUI(): void {
        // document.body.style.background = "#ffffff";
        this.m_demoBodyDiv = document.createElement('div');
        this.m_demoBodyDiv.style.width = "100vw";
        this.m_demoBodyDiv.style.height = "100vh";
        //this.elementCenter(this.m_demoBodyDiv);
        document.body.appendChild(this.m_demoBodyDiv);
        document.body.style.margin = '0';

        this.showInfo("init...");
    }

    private showInfo(str: string): void {

        if (this.m_infoDiv == null) {
            this.m_infoDiv = document.createElement('div');
            this.m_infoDiv.style.backgroundColor = "rgba(255,255,255,0.1)";
            this.m_infoDiv.style.color = "#00ee00";
            this.elementCenter(this.m_infoDiv);
            this.m_demoBodyDiv.appendChild(this.m_infoDiv);
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
        if (this.m_demoBodyDiv != null) {
            this.m_demoBodyDiv.parentElement.removeChild(this.m_demoBodyDiv);
            this.m_demoBodyDiv = null;
        }
    }
    private elementCenter(ele: HTMLElement, top: string = "50%", left: string = "50%", position: string = "absolute"): void {

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

export default EnginePage;
