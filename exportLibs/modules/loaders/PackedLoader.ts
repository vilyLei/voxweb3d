interface I_PackedLoader {
}
/**
 * 将加载逻辑打包的loader
 */
class PackedLoader {
	private static s_uid: number = 0;
	private m_uid: number = PackedLoader.s_uid++;

	private m_urlChecker: (url: string) => string = null;
	private m_times: number;
	private m_oneTimes: boolean = true;
	private m_loaderMap: Map<number, PackedLoader> = null;
	protected static loadedMap: Map<string, number> = new Map();
	protected static loadingMap: Map<string, PackedLoader[]> = new Map();
	private m_callback: () => void;
	/**
	 * @param times 记录总共需要的完成操作的响应次数。这个次数可能是由load直接产生，也可能是由于别的地方驱动。
	 * @param callback 完成所有响应的之后的回调
	 */
	constructor(times: number, callback: (m?: PackedLoader) => void = null, urlChecker: (url: string) => string = null) {
		this.m_callback = callback;
		this.m_times = times;
		this.m_urlChecker = urlChecker;
	}
	setUrlChecker(urlChecker: (url: string) => string = null): void {
		this.m_urlChecker = urlChecker;
	}
	getUrlChecker(): (url: string) => string {
		return this.m_urlChecker;
	}
	getUid(): number {
		return this.m_uid;
	}
	setCallback(callback: (m?: PackedLoader) => void): PackedLoader {
		this.m_callback = callback;
		return this;
	}
	addLoader(m: PackedLoader): PackedLoader {
		if (m != null && m != this) {
			if (this.isFinished()) {
				m.use();
			} else {
				if (this.m_loaderMap == null) {
					this.m_loaderMap = new Map();
				}
				let map = this.m_loaderMap;
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

					if (this.m_loaderMap != null) {
						for (let [key, value] of this.m_loaderMap) {
							value.use();
						}
						this.m_loaderMap = null;
					}
				}
			}
		}
	}
	hasModuleByUrl(url: string): boolean {
		return PackedLoader.loadedMap.has(url);
	}
	load(url: string): PackedLoader {
		if (url == "") {
			return this;
		}
		if(this.m_urlChecker != null) {
			url = this.m_urlChecker(url);
		}
		let loadedMap = PackedLoader.loadedMap;
		if (loadedMap.has(url)) {
			this.use();
			return;
		}
		let loadingMap = PackedLoader.loadingMap;
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
		this.loadData(url);

		return this;
	}
	/**
	 * subclass need override this function
	 * @param url data url
	 */
	protected loadData(url: string): void {

		let codeLoader: XMLHttpRequest = new XMLHttpRequest();
		codeLoader.open("GET", url, true);
		codeLoader.onerror = function (err) {
			console.error("load error: ", err);
		};

		// codeLoader.onprogress = e => { };
		codeLoader.onload = evt => {
			// this.loadedData(codeLoader.response, url);
			this.loadedUrl(url);
		}
		codeLoader.send(null);
	}
	/**
	 * subclass need override this function
	 * @param data loaded data
	 * @param url data url
	 */
	protected loadedData(data: string | ArrayBuffer, url: string): void {
		console.log("module js file loaded, url: ", url);
		// let scriptEle: HTMLScriptElement = document.createElement("script");
		// scriptEle.onerror = evt => {
		// 	console.error("module script onerror, e: ", evt);
		// };
		// scriptEle.type = "text/javascript";
		// scriptEle.innerHTML = data;
		// document.head.appendChild(scriptEle);
	}
	/**
	 * does not override this function
	 * @param url http req url
	 */
	protected loadedUrl(url: string): void {

		let loadedMap = PackedLoader.loadedMap;
		let loadingMap = PackedLoader.loadingMap;

		loadedMap.set(url, 1);

		let list = loadingMap.get(url);
		for (let i = 0; i < list.length; ++i) {
			list[i].use();
		}
		loadingMap.delete(url);
	}
	getDataByUrl(url: string): string | ArrayBuffer {
		return null;
	}
	clearAllData(): void {
	}
	destroy(): void {
		this.m_urlChecker = null;
	}
}

export { PackedLoader };
