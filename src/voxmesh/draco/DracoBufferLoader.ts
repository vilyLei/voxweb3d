

export default class DracoBufferLoader {
    private m_info: string = "";
    private m_buffer: ArrayBuffer = null;
    private m_loadStatus: number = 0;
    paramSuffix: string = ".pmd";
    multiBuffers: boolean = true;
    constructor() {
    }
    load(purl: string, callback: (buf: ArrayBuffer, param: string) => void): void {
        let selfT: DracoBufferLoader = this;

        if (this.multiBuffers) {
            let si: number = purl.lastIndexOf(".");
            let infoUrl: string = purl.slice(0, si) + this.paramSuffix;
            this.loadParam(infoUrl, callback);
        }
        else {
            ++selfT.m_loadStatus;
        }
        const reader = new FileReader();
        reader.onload = e => {
            ++selfT.m_loadStatus;
            selfT.m_buffer = <ArrayBuffer>reader.result;
            if (selfT.m_loadStatus > 1) {
                if (!this.multiBuffers) {
                    selfT.m_info = "0," + selfT.m_buffer.byteLength;
                }
                callback(selfT.m_buffer, selfT.m_info);
            }
        };
        const request = new XMLHttpRequest();
        request.open("GET", purl, true);
        request.responseType = "blob";
        request.onload = () => {
            //console.log("request.readyState: ",request.readyState,"request.response: ",request.response);
            reader.readAsArrayBuffer(request.response);
        };
        request.send();
    }

    private loadParam(purl: string, callback: (buf: ArrayBuffer, param: string) => void): void {
        let selfT: DracoBufferLoader = this;
        let pr: any = new XMLHttpRequest();
        pr.open('GET', purl);
        pr.onload = function (p: any): void {
            ++selfT.m_loadStatus;
            selfT.m_info = pr.responseText;
            if (selfT.m_loadStatus > 1) {
                callback(selfT.m_buffer, selfT.m_info);
            }
        }
        pr.send();
    }
}