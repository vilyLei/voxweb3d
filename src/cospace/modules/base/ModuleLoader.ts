
class ModuleLoader {
	private static s_uid: number = 0;
	private m_uid: number = ModuleLoader.s_uid ++;

	private m_times: number;
	private m_oneTimes: boolean = true;
	private static loadedMap: Map<string, number> = new Map();
	private static loadingMap: Map<string, ModuleLoader[]> = new Map();
	private m_callback: () => void = null;

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
	hasModuleByUrl(url: string): boolean {
		return ModuleLoader.loadedMap.has(url);
	}
	loadModule(url: string, module: string = ""): ModuleLoader {
		if(url == "") {
			return this;
		}
		let loadedMap = ModuleLoader.loadedMap;
		if(loadedMap.has(url)) {
			this.use();
			return;
		}
		let loadingMap = ModuleLoader.loadingMap;
		if(loadingMap.has(url)) {
			let list = loadingMap.get(url);
			for(let i = 0; i < list.length; ++i) {
				if(list[i] == this) {
					return;
				}
			}
			list.push( this);
			return;
		}
		loadingMap.set(url, [ this ]);

		let codeLoader: XMLHttpRequest = new XMLHttpRequest();
		codeLoader.open("GET", url, true);
		codeLoader.onerror = function(err) {
			console.error("load error: ", err);
		};

		codeLoader.onprogress = e => {};
		codeLoader.onload = evt => {
			console.log("module js file loaded, url: ", url);
			let scriptEle: HTMLScriptElement = document.createElement("script");
			scriptEle.onerror = evt => {
				console.error("module script onerror, e: ", evt);
			};
			scriptEle.type = "text/javascript";
			scriptEle.innerHTML = codeLoader.response;
			document.head.appendChild(scriptEle);

			loadedMap.set(url, 1);

			let list = loadingMap.get(url);
			for(let i = 0; i < list.length; ++i) {
				list[i].use();
			}
			loadingMap.delete(url);
		};
		codeLoader.send(null);
		return this;
	}
}

export { ModuleLoader };
