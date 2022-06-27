class VerifierParam {
	demoName: string = "";
	threadsTotal: number = 3;
	demoType: string = "";
	hostUrl: string = "";
	private m_urls: string[] = null;
	constructor() { }

	initialize(): void {

		let hostUrl = window.location.href;
		let i = hostUrl.indexOf("?");
		if(i > 0) {
			this.hostUrl = hostUrl.slice(0,i);
			let paramStr: string = hostUrl.slice( i+1 );
			this.initParam( paramStr );
			if(this.demoType != "") {
				switch(this.demoType) {
					case "fbx":
						this.iniFBXDemo();
						break;
					case "ctm":
						this.initCTMDemo();
						break;
					default:
						break;
				}
			}
		}
		console.log(i,", verifierParam: ", this);
		console.log("hostUrl: ", hostUrl);	
	}
	getUrls(): string[] {
		return this.m_urls;
	}
	private initParam(paramsStr: string): void {
		if(paramsStr.indexOf("&") > 0) {
			// rvdemo=box&demoType=fbx&thrn=3
			console.log("paramsStr: ",paramsStr);
			let list = paramsStr.split("&");
			for(let i: number = 0; i < list.length; ++i) {
				const subList = list[i].split("=");
				switch(subList[0]) {
					case "rvdemo":
						this.demoName = subList[1];
						break;
					case "thrn":
						let n = parseInt(subList[1]);
						if(isNaN(n)) {
							n = 1;
						}
						if(n < 1) {
							n = 1;
						}else if(n > 3) {
							n = 3
						}
						this.threadsTotal = n;
						break;
					case "demoType":
						this.demoType = subList[1];
						break;
					default:
						break;
				}
			}
		}
	}
	private iniFBXDemo(): void {

		let url: string = "static/private/fbx/"+this.demoName+".fbx";		
		
		this.m_urls = [url];
	}
	private initCTMDemo(): void {

		// let size = 107375616;
		let ns: string = this.demoName;
		let baseUrl: string = "static/private/ctm/";
		let urls: string[] = [];
		for (let i = 0; i <= 26; ++i) {
			urls.push(baseUrl + ns + "/"+ns+"_" + i + ".ctm");
		}
		this.m_urls = urls;
	}
}

export { VerifierParam };
