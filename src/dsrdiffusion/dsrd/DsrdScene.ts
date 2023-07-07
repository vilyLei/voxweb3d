declare var SceneViewer: any;
class DsrdScene {
	private m_viewerLayer: HTMLDivElement = null;
	constructor() {}
	initialize(viewerLayer: HTMLDivElement): void {
		console.log("DsrdScene::initialize()......");
		this.m_viewerLayer = viewerLayer;

		let url = "static/cospace/dsrdiffusion/scViewer/SceneViewer.umd.js";
		this.loadModule(url);
	}
	private init3DScene(): void {
		let rscViewer = new SceneViewer.SceneViewer();
		console.log("rscViewer: ", rscViewer);
		rscViewer.initialize(this.m_viewerLayer, () => {
		}, true, true);
		// 增加三角面数量的信息显示
		rscViewer.setForceRotate90(true);
	}
    private loadModule(purl: string): void {
        let codeLoader = new XMLHttpRequest();
        codeLoader.open("GET", purl, true);
        codeLoader.onerror = function (err) {
            console.error("loadModule error: ", err);
        }
        codeLoader.onprogress = (e) => {
            // this.showLoadInfo(e, codeLoader);
        };
        codeLoader.onload = () => {
            let scriptEle = document.createElement("script");
            scriptEle.onerror = (e) => {
                console.error("module script onerror, e: ", e);
            }
            scriptEle.innerHTML = codeLoader.response;
            document.head.appendChild(scriptEle);
            // this.loadFinish();
			this.init3DScene();
        }
        codeLoader.send(null);
    }
}
export {DsrdScene}
