
let htmlBody = document.body;
export class SimpleAward {
    private m_host = "";
    constructor() { }

    initialize(): void {
        console.log("SimpleAward::initialize()......");
        let url: string = location.href + "";
        
        if(url.indexOf("artvily.") > 0) {
            this.m_host = "http://www.artvily.com:9090/";
        }
        this.initUI();
    }
    private createDiv(): HTMLDivElement {
        let div = document.createElement("div");
        const style = div.style;
		style.display = "bolck";
		style.position = "absolute";

		if (style.left == "") {
			style.left = "0px";
			style.top = "0px";
		}
        style.width = "100%";
        style.height = "100%";
        return div;
    }
    private initUI(): void {

        let div = this.createDiv();
        htmlBody.appendChild( div );
        
		var pdocument: any = null;
        var pwindow: any = null;
        if (document) {
			pdocument = document;
			pwindow = window;
			pdocument.onmouseup = (evt: any): void => {
			}
		}
		if(pwindow) {
			pwindow.onresize = (evt: any): void => {
                let rect = div.getBoundingClientRect();
                this.upateLayout( rect );
			}
		}

        let voxImg = new Image();
        voxImg.onload = (evt: any): void => {

        }
        voxImg.src = "static/assets/ui/vox.png";
        div.appendChild(voxImg);
    }
    private upateLayout(rect: any): void {

    }
    private m_demoBodyDiv: HTMLDivElement = null;
    private m_infoDiv: HTMLDivElement = null;
    private initUI2(): void {
        document.body.style.background = "#ffffff";
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

export default SimpleAward;