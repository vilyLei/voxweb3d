
let htmlBody = document.body;
class ImgBtn {
    protected m_img: HTMLImageElement = null;
    protected m_div: HTMLDivElement = null;
    protected m_parent: HTMLDivElement = null;
    protected m_isLoaded = false;
    x = 0;
    y = 0;
    scale = 1.0;

    layoutCallback: () => void = null;
    others: ImgBtn[] = null;
    constructor(parent: HTMLDivElement, layoutCallback: () => void = null) {
        this.m_parent = parent;
        this.layoutCallback = layoutCallback;
    }
    private loaded(): void {
        this.m_isLoaded = true;
        if (this.layoutCallback) {
            this.layoutCallback();
        }
    }
    getRect(): DOMRect {

        let rect = this.m_div.getBoundingClientRect();
        return rect;

    }
    setXY(px: number, py: number): void {

        this.x = px;
        this.y = py;
        this.setDivXY(px, py);
    }

    private setDivXY(px: number, py: number): void {

        let style = this.m_div.style;
        style.cursor = "pointer";
        style.position = "absolute";
        style.left = px + "px";
        style.top = py + "px";
    }
    updateLayout(): void {

    }
    isLoaded(): boolean {
        return this.m_isLoaded;
    }
    createImg(url: string): void {

        let div = this.createDiv(false);
        let img = new Image();
        img.onload = (evt: any): void => {
            this.loaded();
        }
        img.src = url;
        this.m_img = img;
        div.appendChild(img);
        this.m_div = div;

        this.m_parent.appendChild(div);
    }
    createDiv(auto: boolean = true): HTMLDivElement {
        let div = document.createElement("div");
        const style = div.style;
        style.display = "bolck";
        style.position = "absolute";

        if (style.left == "") {
            style.left = "0px";
            style.top = "0px";
        }
        if (auto) {
            style.width = "100%";
            style.height = "100%";
        }
        return div;
    }
}
class VoxImgBtn extends ImgBtn {
    constructor(parent: HTMLDivElement, layoutCallback: () => void = null) {
        super(parent, layoutCallback);
    }

    updateLayout(): void {
        if (this.isLoaded()) {
            let rect = this.getRect();

            let areaRect = this.m_parent.getBoundingClientRect();
            let viewWidth = areaRect.width;
            let viewHeight = areaRect.height;
            let px = viewWidth - rect.width - 20;
            let py = 20;
            this.setXY(px, py);
        }
    }
}
class AwardImgBtn extends ImgBtn {
    constructor(parent: HTMLDivElement, layoutCallback: () => void = null) {
        super(parent, layoutCallback);
    }

    updateLayout(): void {
        if (this.isLoaded()) {
            let rect = this.getRect();
            let areaRect = this.m_parent.getBoundingClientRect();
            let viewWidth = areaRect.width;
            let viewHeight = areaRect.height;
            let px = viewWidth - rect.width - 20;
            let py = 20;
            if (this.others != null && this.others.length > 0) {
                let btn = this.others[0];
                if (btn.isLoaded()) {
                    let btnRect = btn.getRect();
                    px = btnRect.x + 0.5 * btnRect.width - 0.5 * rect.width;
                    py = btnRect.bottom + 20;
                }
            }
            this.setXY(px, py);
        }
    }
}

class BackImgBtn extends ImgBtn {
    constructor(parent: HTMLDivElement, layoutCallback: () => void = null) {
        super(parent, layoutCallback);
    }

    updateLayout(): void {
        if (this.isLoaded()) {
            let px = 20;
            let py = 20;
            this.setXY(px, py);
        }
    }
}
export class SimpleAward {
    private m_host = "";
    constructor() { }

    initialize(): void {
        console.log("SimpleAward::initialize()......");
        let url: string = location.href + "";

        if (url.indexOf("artvily.") > 0) {
            this.m_host = "http://www.artvily.com:9090/";
        }
        this.initUI();
    }
    private m_voxBtn: VoxImgBtn = null;
    private m_awardBtn: AwardImgBtn = null;
    private m_backBtn: BackImgBtn = null;
    private initUI(): void {

        let container = this.createDiv();
        this.m_div = container;
        htmlBody.appendChild(container);

        
        var pdocument: any = null;
        var pwindow: any = null;
        if (document) {
            pdocument = document;
            pwindow = window;
            pdocument.onmouseup = (evt: any): void => {
            }
        }
        if (pwindow) {
            pwindow.onresize = (evt: any): void => {
                this.updateLayoutBtns();
            }
        }
        htmlBody.style.background = "#555555";

        let layoutCall = (): void => {
            this.updateLayoutBtns();
        }
        this.m_voxBtn = new VoxImgBtn(container, layoutCall);
        this.m_awardBtn = new AwardImgBtn(container, layoutCall);
        this.m_awardBtn.others = [this.m_voxBtn];
        this.m_backBtn = new BackImgBtn(container, layoutCall);

        this.m_voxBtn.createImg("static/assets/ui/vox.png");
        this.m_awardBtn.createImg("static/assets/ui/award.png");
        this.m_backBtn.createImg("static/assets/ui/back.png");
    }
    private updateLayoutBtns(): void {
        this.m_voxBtn.updateLayout();
        this.m_awardBtn.updateLayout();
        this.m_backBtn.updateLayout();
    }
    private createDiv(auto: boolean = true): HTMLDivElement {
        let div = document.createElement("div");
        const style = div.style;
        style.display = "bolck";
        style.position = "absolute";

        if (style.left == "") {
            style.left = "0px";
            style.top = "0px";
        }
        if (auto) {
            style.width = "100%";
            style.height = "100%";
        }
        return div;
    }
    private m_div: HTMLDivElement = null;
    private m_voxImg: HTMLImageElement = null;
    private m_awardImg: HTMLImageElement = null;
    private m_backImg: HTMLImageElement = null;
    private initUI3(): void {

        let div = this.createDiv();
        this.m_div = div;
        htmlBody.appendChild(div);

        var pdocument: any = null;
        var pwindow: any = null;
        if (document) {
            pdocument = document;
            pwindow = window;
            pdocument.onmouseup = (evt: any): void => {
            }
        }
        if (pwindow) {
            pwindow.onresize = (evt: any): void => {
                this.upateLayout();
            }
        }
        htmlBody.style.background = "#555555";

        this.m_voxImg = this.createImg("static/assets/ui/vox.png");
        this.m_awardImg = this.createImg("static/assets/ui/award.png");
        this.m_backImg = this.createImg("static/assets/ui/back.png");
    }
    private createImg(url: string): HTMLImageElement {
        let voxImg = new Image();
        voxImg.onload = (evt: any): void => {
            this.upateLayout();
        }
        voxImg.onclick = (evt: any): void => {
            console.log("img click() ...");
        }
        voxImg.src = url;

        this.m_div.appendChild(voxImg);
        return voxImg;
    }
    private upateLayout(): void {
        let rect = this.m_div.getBoundingClientRect();
        let viewWidth = rect.width;
        let viewHeight = rect.height;

        // console.log("rect: ", rect);
        // console.log("viewWidth: ", viewWidth);

        let tx = 0;
        let ty = 0;
        let voxImg = this.m_voxImg;
        if (voxImg) {
            tx = viewWidth - voxImg.width - 20;
            ty = 20;
            this.setImgXY(voxImg, tx, ty);
        }
        if (this.m_awardImg) {
            let img = this.m_awardImg;
            if (voxImg) {
                tx = tx + 0.5 * voxImg.width - 0.5 * img.width;
                ty = 20 + voxImg.height + 20;
            } else {
                tx = viewWidth - img.width - 20;
                ty = 20;
            }
            this.setImgXY(img, tx, ty);
        }
        if (this.m_backImg) {
            tx = 20;
            ty = 20;
            this.setImgXY(this.m_backImg, tx, ty);
        }
    }
    private setImgXY(img: HTMLImageElement, px: number, py: number): void {

        let style = img.style;
        style.cursor = "pointer";
        style.position = "absolute";
        style.left = px + "px";
        style.top = py + "px";
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