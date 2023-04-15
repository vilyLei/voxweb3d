interface DemoInfoItem {
    name: string;
    ver: string;
    pay?: string;
}
interface DemoInfoData {
    demos: DemoInfoItem[];
}
class WaitingPhase {
	setInfoCall: (str: string) => void;
	finishCall: () => void;
    item: DemoInfoItem = null;
	private m_t = 0;
	constructor() {
	}
	start(): void {
		this.m_t = Date.now();
		this.autoUpdate();
	}

    private m_gooutId: any = -1;
	private m_flag = 0;
    private autoGo(): void {
		if (this.m_gooutId > -1) {
            clearTimeout(this.m_gooutId);
        }
		this.m_flag ++;
		if(this.m_flag > 2) {
			this.finishCall();
		}else {
			this.m_gooutId = setTimeout(this.autoGo.bind(this), 100);// 10 fps
		}
	}
    private m_timeoutId: any = -1;
    private autoUpdate(): void {
        if (this.m_timeoutId > -1) {
            clearTimeout(this.m_timeoutId);
        }

		let dt = Date.now() - this.m_t;
		let t = dt / 2000.0;
		let flag = false;
		if(t >= 1.0) {
			t = 1.0;
			flag = true;
		}else {
			this.m_timeoutId = setTimeout(this.autoUpdate.bind(this), 50);// 20 fps
		}
		t = 1.0 - t;
		t = Math.round(t * 100.0);
		let headStr = "私人服务带宽小</br>请稍等两秒:&nbsp";
		let endStr = "%</br>付费请联系作者</br>email:&nbspvily313@126.com";
        if(!this.item || !this.item.pay) {
            endStr = "%";
        }
		if(t >= 10) {
			this.setInfoCall(headStr + t+endStr);
		}else {
			this.setInfoCall(headStr + "&nbsp&nbsp"+t+endStr);
		}
		if(flag) {
			this.autoGo();
		}
    }

}
export class DemoLoader {

	private mWP = new WaitingPhase();
    constructor() { }

    initialize(): void {
        console.log("DemoLoader::initialize()......");
        let demoUrl = location.href + "";
        demoUrl = this.parseUrl( demoUrl );
        console.log("demoUrl: ",demoUrl);
        this.initUI();
        // this.loadModule( url );
        let hurl = location.href + "";
        let host = "";
        if(hurl.indexOf("artvily.") > 0) {
            host = "http://www.artvily.com:9090/";
        }
        this.showInfo("loading...");
        this.loadInfo(host + "static/voxweb3d/demos/info.json?vtk=" + Math.random() +"uf8"+ Date.now(), demoUrl);

		// let mp = this.mWP;
		// mp.setInfoCall = (str: string): void => {
		// 	this.showInfo(str);
		// }
		// mp.finishCall = (): void => {
		// 	// this.loadInfo(host + "static/voxweb3d/demos/info.json?vtk=" + Math.random() +"uf8"+ Date.now(), demoUrl);
		// 	console.log("loading main module ...");
		// 	this.showInfo("loading 1% ");
		// }
		// mp.start();
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
            console.log("xxx demo name: ",this.m_name);
            let item: DemoInfoItem = null;
            if(map.has(this.m_name)) {
                item = map.get(this.m_name);
                console.log("item: ", item);
                // this.loadModule( demoUrl + "?dtk="+item.ver );
                demoUrl = demoUrl + "?dtk="+item.ver
            }
            // else {
            //     // this.loadModule( demoUrl );
            // }
		let mp = this.mWP;
        mp.item = item;
		mp.setInfoCall = (str: string): void => {
			this.showInfo(str);
		}
		mp.finishCall = (): void => {
			// this.loadInfo(host + "static/voxweb3d/demos/info.json?vtk=" + Math.random() +"uf8"+ Date.now(), demoUrl);
			console.log("loading main module ...");
			this.showInfo("loading 1% ");
            this.loadModule( demoUrl );

		}
		mp.start();
        }
        codeLoader.send(null);
    }
    private showLoadInfo(e: ProgressEvent, req: XMLHttpRequest): void {
        this.showPro(e, req);
    }
    private m_name = "";
    private parseUrl(url: string): string {

        console.log("parseUrl url: ",url);

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
        // s.alignItems = "center";

        // s.alignItems = "top";
        // s.alignItems = "center";
        // ele.style.top = top;
        // ele.style.left = left;
        // ele.style.position = position;
        // ele.style.transform = "translate(-50%, -50%)";
    }
}

export default DemoLoader;
