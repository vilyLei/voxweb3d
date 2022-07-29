import { CTMStringStream, CTMStream, CTMFileBody, CTMFile } from "./CTMFile";

class CTMGeomDataParser {

    constructor() {
    }
    parserStringData(dataStr: string): CTMFileBody {

        var stream = new CTMStringStream(dataStr);
        stream.offset = 0;

        let ctmFile = new CTMFile(stream);
        if (ctmFile != null) {
            let ctmbody: CTMFileBody = ctmFile.body;
            return ctmbody;
        }
        return null;
    }
    
    parserBinaryData(buffer: ArrayBuffer): CTMFileBody {

        let stream = new CTMStream(new Uint8Array(buffer));
        stream.offset = 0;

        let ctmFile = new CTMFile(stream);
        if (ctmFile != null) {
            let ctmbody: CTMFileBody = ctmFile.body;
            return ctmbody;
        }
        return null;
    }
}

export { CTMGeomDataParser }