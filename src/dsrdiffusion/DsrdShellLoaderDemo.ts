declare var DSRDShell: any;
export class DsrdShellLoaderDemo {
	constructor() {}
	initialize(): void {
		console.log("DsrdShellLoaderDemo::initialize()......");
		// let shell = new DsrdShell();
		// shell.initialize();
		let url = "static/cospace/dsrdiffusion/shell/DSRDShell.umd.js";
		this.loadModule(url);
	}

	private initScene(): void {
		let shell = new DSRDShell.DsrdShell();
		console.log("shell: ", shell);
		shell.initialize();
		// 增加三角面数量的信息显示
		// rscViewer.setForceRotate90(true);
		// this.ui.setRSCViewer( rscViewer );
	}
	private loadModule(purl: string): void {
		let codeLoader = new XMLHttpRequest();
		codeLoader.open("GET", purl, true);
		codeLoader.onerror = function(err) {
			console.error("loadModule error: ", err);
		};
		codeLoader.onprogress = e => {
			// this.showLoadInfo(e, codeLoader);
		};
		codeLoader.onload = () => {
			let scriptEle = document.createElement("script");
			scriptEle.onerror = e => {
				console.error("module script onerror, e: ", e);
			};
			scriptEle.innerHTML = codeLoader.response;
			document.head.appendChild(scriptEle);
			// this.loadFinish();
			this.initScene();
		};
		codeLoader.send(null);
	}
}
export default DsrdShellLoaderDemo;
