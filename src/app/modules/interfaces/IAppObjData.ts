
import IObjGeomDataParser from "../../../vox/mesh/obj/IObjGeomDataParser";

interface IAppObjData {

    /**
     * the default value is 1.0
     */
    moduleScale: number;
    /**
     * the default value is false
     */
    baseParsering: boolean;
    createParser(): IObjGeomDataParser;
    /**
     * 
     * @param objDataUrl data src url
     * @param callback callback function
     * @param dataIsZxy the default value is false
     */
    load(objDataUrl: string, callback: (parser: IObjGeomDataParser) => void, dataIsZxy?: boolean): void;

}
export { IAppObjData }
