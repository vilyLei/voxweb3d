
import IObjGeomDataParser from "../../../vox/mesh/obj/IObjGeomDataParser";
import ObjGeomDataParser from "../../../vox/mesh/obj/ObjGeomDataParser";
import { IAppObjData } from "../interfaces/IAppObjData";

class Instance implements IAppObjData {

    moduleScale: number = 1.0;
    baseParsering: boolean = false;
    constructor() {

    }
    load(objDataUrl: string, callback: (parser: IObjGeomDataParser) => void, dataIsZxy: boolean = false): void {

        let request: XMLHttpRequest = new XMLHttpRequest();
        request.open('GET', objDataUrl, true);
        request.onload = () => {
            if (request.status <= 206 && request.responseText.indexOf(" OBJ ") > 0) {

                let parser = new ObjGeomDataParser();
                parser.moduleScale = this.moduleScale;
                parser.baseParsering = this.baseParsering;
                parser.parse(request.responseText, dataIsZxy);
                callback(parser);
            }
            else {
                console.error("load obj format module url error: ", objDataUrl);
            }
        };
        request.onerror = e => {
            console.error("load obj format module url error: ", objDataUrl);
        };

        request.send(null);
    }
    createParser(): IObjGeomDataParser {
        return new ObjGeomDataParser();
    }

}

export { Instance }
