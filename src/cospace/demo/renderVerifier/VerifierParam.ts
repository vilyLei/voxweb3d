class VerifierParam {
	demoName: string = "";
	threadsTotal: number = 0;
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

		let url: string = "static/assets/fbx/"+this.demoName+".fbx";
		// url = "static/assets/fbx/box.fbx";
		// url = "static/private/fbx/box01.fbx";
		// url = "static/private/fbx/sph.fbx";
		// url = "static/private/fbx/cylinder.fbx";
		// url = "static/private/fbx/cylinder0.fbx";
		// url = "static/private/fbx/cylinder1.fbx";
		// url = "static/private/fbx/cylinder2.fbx";
		// url = "static/private/fbx/cylinder3.fbx";
		// url = "static/private/fbx/sph01.fbx";
		// url = "static/private/fbx/sph02.fbx";
		// url = "static/private/fbx/cone0.fbx";

		// url = "static/private/fbx/face2.fbx";
		// url = "static/private/fbx/tri.fbx";
		// url = "static/private/fbx/plane.fbx";
		// url = "static/private/fbx/base2.fbx";
		// url = "static/private/fbx/model_500W.fbx";
		// url = "static/private/fbx/base3.fbx";
		// url = "static/private/fbx/nvxie_zzb.fbx";
		// url = "static/private/fbx/3279.fbx";
		// url = "static/private/fbx/3279_b.fbx";
		// url = "static/private/fbx/model_1000W.fbx";
		// url = "static/private/fbx/model2_1000W.fbx";
		// url = "static/private/fbx/Samba_Dancing.fbx";
		// url = "static/private/fbx/monkey.fbx";
		
		this.m_urls = [url];
	}
	private initCTMDemo(): void {

		// let size = 107375616;
		let ns: string = this.demoName;

		let hostUrl = this.hostUrl;

		let baseUrl: string = hostUrl + "static/private/ctm/";
		let urls: string[] = [];
		for (let i = 0; i <= 26; ++i) {
			urls.push(baseUrl + ns + "/"+ns+"_" + i + ".ctm");
		}
		this.m_urls = urls;
	}
}

export { VerifierParam };
