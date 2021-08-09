
export default class DracoWasmLoader {
    wapperStr: string = null;
    wasmBin: any = null;
    private m_loaded_callback: (evt: any) => void = null;
    private m_loaded_callback_target: any = null;
    constructor() {

    }

    load(loaded_callback: (obj: any) => void, loaded_callback_target: any): void {

        this.m_loaded_callback = loaded_callback;
        this.m_loaded_callback_target = loaded_callback_target;

        let wapperUrl: string = "static/extern/draco/w.md";
        let wasmUrl: string = "static/extern/draco/d.md";

        let wapperXHR: XMLHttpRequest = new XMLHttpRequest();
        wapperXHR.open("GET", wapperUrl, true);
        wapperXHR.responseType = "text";
        wapperXHR.onload = () => {
            this.wapperStr = wapperXHR.response;
            console.log("loaded wasm wapper js.");
            this.loadedRes();
        };
        wapperXHR.send(null);

        let wasmXHR: XMLHttpRequest = new XMLHttpRequest();
        wasmXHR.open("GET", wasmUrl, true);
        wasmXHR.responseType = "arraybuffer";
        wasmXHR.onload = () => {
            this.wasmBin = wasmXHR.response;
            console.log("loaded wasm binary.");
            this.loadedRes();
        };
        wasmXHR.send(null);
    }
    private loadedRes(): void {
        if (this.wasmBin != null && this.wapperStr != null) {
            console.log("loaded wasm binary.");
            this.m_loaded_callback.call(this.m_loaded_callback_target, { wapper: this.wapperStr, wasm: this.wasmBin });
        }
    }
}