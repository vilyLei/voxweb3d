export class BytesDataLoader {
    private m_dataType: string = "arrayBuffer";
    private m_data: any = null;
    constructor() {
    }
    public getData(): any {
        return this.m_data;
    }
    loadArraybuffer(purl: string): void {
        this.m_data = null;
        let selfT: any = this;
        let xhr = new XMLHttpRequest();
        xhr.open("GET", purl, true);
        xhr.responseType = "arraybuffer";
        xhr.onload = function () {
            selfT.m_data = xhr.response;
        };
        xhr.send(null);
    }
}