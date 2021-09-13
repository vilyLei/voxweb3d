

import JSZip from "jszip";
export default class MeshBufferLoader {
    private m_info: string = "";
    private m_buffer: ArrayBuffer = null;
    private m_loadStatus: number = 0;
    paramSuffix: string = ".pmd";
    multiBuffers: boolean = true;
    zipParseEnabled: boolean = false;
    constructor() {
    }
    load(purl: string, callback: (buf: ArrayBuffer, param: string) => void): void {
        let selfT: MeshBufferLoader = this;

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
                if (this.zipParseEnabled) {
                    this.parseBufferZip(selfT.m_buffer).then(
                        buffer => {                            
                            if (!this.multiBuffers) {
                                selfT.m_info = "0," + buffer.byteLength;
                            }
                            //console.log("parseBufferZip parsed buffer: ", buffer);
                            callback(buffer, selfT.m_info);
                        }
                    );
                }
                else {
                    if (!this.multiBuffers) {
                        selfT.m_info = "0," + selfT.m_buffer.byteLength;
                    }
                    callback(selfT.m_buffer, selfT.m_info);
                }
            }
        };
        const request = new XMLHttpRequest();
        request.open("GET", purl, true);
        request.responseType = "blob";
        request.onload = () => {
            reader.readAsArrayBuffer(request.response);
        };
        request.send();
    }

    private parseBufferZip(buffer: ArrayBuffer): Promise<any> {
        return new Promise((resolve, reject) => {
                ///*
                let objZip: JSZip = new JSZip();
                objZip.loadAsync(buffer).then(file => {
                    let nsList: string[] = [];
                    file.forEach(fileName => {
                        nsList.push(fileName);
                    }
                    );
                    let ns: string = nsList[0];
                    file.file(ns)
                        .async("uint8array")
                        .then(pdata => {
                            resolve(pdata.buffer);
                        }
                        )
                });
                //*/
            }
        );
    }
    private loadParam(purl: string, callback: (buf: ArrayBuffer, param: string) => void): void {
        let selfT: MeshBufferLoader = this;
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