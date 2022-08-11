
class ModuleLoader {
	private static s_uid: number = 0;
	private m_uid: number = ModuleLoader.s_uid++;

	private m_times: number;
	private m_oneTimes: boolean = true;
	private m_moduleMap: Map<number, ModuleLoader> = null;
	private static loadedMap: Map<string, number> = new Map();
	private static loadingMap: Map<string, ModuleLoader[]> = new Map();
	private m_callback: () => void;

	constructor(times: number, callback: (m?: ModuleLoader) => void = null) {
		this.m_callback = callback;
		this.m_times = times;
	}
	getUid(): number {
		return this.m_uid;
	}
	setCallback(callback: (m?: ModuleLoader) => void): ModuleLoader {
		this.m_callback = callback;
		return this;
	}
	addModuleLoader(m: ModuleLoader): ModuleLoader {
		if (m != null && m != this) {
			if (this.isFinished()) {
				m.use();
			} else {
				if (this.m_moduleMap == null) {
					this.m_moduleMap = new Map();
				}
				let map = this.m_moduleMap;
				if (!map.has(m.getUid())) {
					map.set(m.getUid(), m);
				}
			}
		}
		return this;
	}
	isFinished(): boolean {
		return this.m_times == 0;
	}
	useOnce(): void {
		if (this.m_oneTimes) {
			this.m_oneTimes = false;
			this.use();
		}
	}
	use(): void {
		if (this.m_times > 0) {
			this.m_times--;
			if (this.isFinished()) {
				if (this.m_callback != null) {
					this.m_callback();
					this.m_callback = null;

					if (this.m_moduleMap != null) {
						for (let [key, value] of this.m_moduleMap) {
							value.use();
						}
						this.m_moduleMap = null;
					}
				}
			}
		}
	}
	hasModuleByUrl(url: string): boolean {
		return ModuleLoader.loadedMap.has(url);
	}
	loadModule(url: string, module: string = ""): ModuleLoader {
		if (url == "") {
			return this;
		}
		let loadedMap = ModuleLoader.loadedMap;
		if (loadedMap.has(url)) {
			this.use();
			return;
		}
		let loadingMap = ModuleLoader.loadingMap;
		if (loadingMap.has(url)) {
			let list = loadingMap.get(url);
			for (let i = 0; i < list.length; ++i) {
				if (list[i] == this) {
					return;
				}
			}
			list.push(this);
			return;
		}
		loadingMap.set(url, [this]);

		let codeLoader: XMLHttpRequest = new XMLHttpRequest();
		codeLoader.open("GET", url, true);
		codeLoader.onerror = function (err) {
			console.error("load error: ", err);
		};

		codeLoader.onprogress = e => { };
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
			for (let i = 0; i < list.length; ++i) {
				list[i].use();
			}
			loadingMap.delete(url);
		};
		codeLoader.send(null);
		return this;
	}
	destroy(): void {

	}
}

export { ModuleLoader };
