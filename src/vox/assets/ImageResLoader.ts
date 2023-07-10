/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import URLFilter from "../../cospace/app/utils/URLFilter";
type LoadFunc = (img: HTMLImageElement, imgUrl: string) => void;
class ImgUint {
    private m_listeners: LoadFunc[] = [];
    url: string = "";
    img: HTMLImageElement = null;
    loaded = false;
    constructor() { }
    addListener(listener: LoadFunc): void {
        let ls = this.m_listeners;
        let i = 0;
        for (; i < ls.length; ++i) {
            if (ls[i] == listener) {
                break;
            }
        }
        if (i >= ls.length) {
            ls.push(listener);
        }
    }
    removeListener(listener: LoadFunc): void {

        let ls = this.m_listeners;
        for (let i = 0; i < ls.length; ++i) {
            if (ls[i] == listener) {
                ls.splice(i, 1);
                break;
            }
        }
    }
    dispatch(): void {

        if(this.loaded) {

            let ls = this.m_listeners;
            this.m_listeners = [];
            for (let i = 0; i < ls.length; ++i) {
                ls[i](this.img, this.url);
            }
        }
    }
}
export default class ImageResLoader {
    private m_map: Map<string, ImgUint> = new Map();
    constructor() { }

    load(url: string, onload: LoadFunc): void {

        if (url != "") {

            let initUrl = url;
            let map = this.m_map;

            url = url != "" ? url : "static/assets/box.jpg";
            url = URLFilter.filterUrl(url);

            if (map.has(initUrl)) {
                let punit = map.get(url);
                if (punit.loaded) {
                    onload(punit.img, punit.url);
                } else {
                    punit.addListener(onload);
                }
            }

            let img = new Image();

            let unit = new ImgUint();
            unit.img = img;
            unit.url = initUrl;
            unit.addListener(onload);

            map.set(initUrl, unit);

            const request = new XMLHttpRequest();
            request.open("GET", url, true);
            request.responseType = "blob";
            request.onload = (e) => {
                img.onload = (evt: any): void => {
                    unit.loaded = true;
                    unit.dispatch();
                }
                let pwin: any = window;
                img.src = (pwin.URL || pwin.webkitURL).createObjectURL(request.response);
            };
            request.onerror = e => {
                console.error("load error binary image buffer request.status: ", request.status, "url:", url);
            };
            request.send(null);
        }
    }
}
export {LoadFunc}
