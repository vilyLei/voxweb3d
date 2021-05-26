/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import ILoaderListerner from "../assets/ILoaderListerner";

export default class BinaryLoader {
    uuid: string = "BinaryLoader";
    constructor() {
    }

    async load(url: string, target: ILoaderListerner, headRange: string = "") {
        console.log("loadBinBuffer, headRange != '': ", headRange != "");
        const reader = new FileReader();
        reader.onload = e => {
            target.loaded(<ArrayBuffer>reader.result, this.uuid);
        };
        const request = new XMLHttpRequest();
        request.open("GET", url, true);
        if (headRange != "") {
            request.setRequestHeader('Range', headRange);
        }
        request.responseType = "blob";
        request.onload = (e) => {
            console.log("loaded binary buffer request.status: ", request.status);
            if (request.status <= 206) {
                reader.readAsArrayBuffer(request.response);
            }
            else {
                target.loadError(request.status, this.uuid);
            }
        };
        request.onerror = e => {
            console.log("load error binary buffer request.status: ", request.status);
            target.loadError(request.status, this.uuid);
        };
        request.send();
    }
}