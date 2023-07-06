import {DsrdScene} from "./dsrd/DsrdScene";
import {DsrdUI} from "./dsrd/DsrdUI";
class DsrdShell {
	private m_init = true;
	private m_rscene = new DsrdScene()
	private m_ui = new DsrdUI()
	constructor() {}
	initialize(): void {
		console.log("DsrdShell::initialize()......");
		if (this.m_init) {
			this.m_init = false;

			this.initWorkSpace();
		}
	}
	private m_viewerLayer: HTMLDivElement = null;
	// private m_infoLayer: HTMLDivElement = null;
    private mIDV: HTMLDivElement = null;
    private initViewLayer(): void {
        let body = document.body;
        body.style.background = "#121212";
		// <link rel="prefetch" href="./page_data/data.json">
		// <link rel="preload" href="./important_data/data.json">
        let b = this.m_viewerLayer;
        b = document.createElement('div');
		let style = b.style
        style.width = "100vw";
        style.height = "100vh";
        // style.backgroundImage = `linear-gradient(to right,#85e085 50%,#ff9999 50%)`;
        // style.backgroundImage = `linear-gradient(to right, #e66465, #9198e0)`;
        // style.backgroundImage = `linear-gradient(to bottom right, #555555, #122233)`;
        // style.backgroundImage = `linear-gradient(to right, #1fa2ff, #12d8fa, #a6ffcb)`;
        style.backgroundImage = `linear-gradient(to right bottom, #159957, #155799)`;
        this.elementCenter(b);
        body.appendChild( b );
        body.style.margin = '0';
        this.m_viewerLayer = b;
    }
	private initWorkSpace(): void {
		this.initViewLayer()

        let width = 512
        let height = 512
		let borderWidth = 2;
		let borderHeight = 2;

        let container = this.createDiv(0,0, width * 2 + borderWidth * 2, height + borderHeight * 2)
        let style = container.style
        // style.backgroundColor = "#2b65cb";
        // style.backgroundImage = `linear-gradient(to right bottom, #8ba6d5, #12d8fa, #79a3ef)`;
        style.backgroundImage = `linear-gradient(to right bottom, #5b6f93, #1d91a5, #375283)`;

        let layerLeft = this.createDiv(borderWidth, borderHeight, width,height)
        style = layerLeft.style;
        style.backgroundColor = "#335533";
        container.appendChild( layerLeft )

        let layerRight = this.createDiv(width + borderWidth, borderHeight, width,height, "absolute")
        style = layerRight.style;
        // style.backgroundColor = "#dae3f3";
        style.backgroundColor = "#5b9bd5";
        container.appendChild( layerRight )
        this.m_viewerLayer.appendChild( container )

		this.m_rscene.initialize(layerLeft)
		this.m_ui.initialize(layerRight, width, height)
        // this.showInfo("init...");

	}

    private createDiv(px: number, py: number, pw: number, ph: number, position = ""): HTMLDivElement {
        const div = document.createElement("div");
        let style = div.style
        style.left = px + "px"
        style.top = py + "px"
        style.width = pw + "px";
        style.height = ph + "px";
        style.display = "block";
        style.position = "relative";
        if(position != "") {
            style.position = position;
        }
        // style.position = "absolute";

        // div.style.margin = "0 auto";
        // div.style.backgroundColor = "#222222";
        // 添加样式 二
        // div.style.position = "absolute";
        // div.style.left = "calc(50% - 256px / 2)";
        // div.style.left = "calc(50% - 256px / 2)";

        return div;
    }
    private showInfo(str: string): void {

        let div = this.mIDV;
        if (div == null) {
            div = document.createElement('div');
			let style = div.style;
            style.backgroundColor = "rgba(255,255,255,0.1)";
            style.color = "#00ee00";
			style.zIndex = "9100"
			style.position = "absolute"
            this.elementCenter(div);
            // this.m_infoLayer.appendChild(div);
        }
        div.innerHTML = str;
        this.mIDV = div;
    }
    private elementCenter(ele: HTMLElement,top: string = "50%", left: string = "50%", position: string = "absolute"): void {

        const s = ele.style;
        s.textAlign = "center";
        s.display = "flex";
        s.flexDirection = "column";
        s.justifyContent = "center";
        s.alignItems = "center";
    }
}
export {DsrdShell}
