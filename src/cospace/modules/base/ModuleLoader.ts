
class ModuleLoader {

	private m_callback: () => void = null;
	private m_times: number;
	private m_oneTimes: boolean = true;
	constructor(times: number){
		this.m_times = times;
	}
	setCallback(callback: () => void): ModuleLoader {
		this.m_callback = callback;
		return this;
	}
	useOnce(): void {
		if(this.m_oneTimes) {
			this.m_oneTimes = false;
			this.use();
		}
	}
	use(): void {
		this.m_times --;
		if(this.m_times == 0) {
			if(this.m_callback != null) {
				this.m_callback();
				this.m_callback = null;
			}
		}
	}
	loadModule(purl: string, module: string = ""): ModuleLoader {
		let codeLoader: XMLHttpRequest = new XMLHttpRequest();
		codeLoader.open("GET", purl, true);
		codeLoader.onerror = function(err) {
			console.error("load error: ", err);
		};

		codeLoader.onprogress = e => {};
		codeLoader.onload = evt => {
			console.log("engine module js file loaded.");
			let scriptEle: HTMLScriptElement = document.createElement("script");
			scriptEle.onerror = evt => {
				console.error("module script onerror, e: ", evt);
			};
			scriptEle.type = "text/javascript";
			scriptEle.innerHTML = codeLoader.response;
			document.head.appendChild(scriptEle);

			this.use();
		};
		codeLoader.send(null);
		return this;
	}
}

export { ModuleLoader };
