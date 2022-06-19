
import { FileLoader } from "../loaders/FileLoader";
import { convertArrayBufferToString, isFbxFormatASCII, getFbxVersion } from "./Utils";
import { GeometryModelDataType } from "../base/GeometryModelDataType";
import { isFbxFormatBinary } from "./Utils";
import { BinaryParser } from "./BinaryParser";
import { FBXTree } from "./FBXTree";
import { TextParser } from "./TextParser";
import { FBXTreeBufferParser } from "./FBXTreeBufferParser";
import { FBXBufferObject } from "./FBXBufferObject";

class FBXBufferLoader {

    private m_loader: FileLoader = new FileLoader();
    constructor() {
    }
    load(
        url: string,
        onLoad: (model: Map<number, GeometryModelDataType>, url: string) => void,
        onProgress: (evt: ProgressEvent, url: string) => void = null,
        onError: (status: number, url: string) => void = null
    ): void {

        this.m_loader.load(
            url,
            (buf: ArrayBuffer, url: string): void => {

                let modelMap: Map<number, GeometryModelDataType> = new Map();

                let bufferMap = this.parseGeometry(buf, url);
                // console.log("###XXX bufferMap: ", bufferMap);
                for (let [key, value] of bufferMap) {
                    modelMap.set(key, value.toGeometryModel());
                }
                if (onLoad != null) {
                    onLoad(modelMap, url);
                }
            },
            onProgress,
            (status: number, url: string): void => {
                console.error("load fbx data error, url: ", url);
                if (onError != null) {
                    onError(status, url);
                }
            }
        );
    }

    private parseGeometry(buffer: ArrayBuffer, path: string): Map<number, FBXBufferObject> {

        // console.log("FBXBufferLoader::parseGeomdtry(), buffer.byteLength: ", buffer.byteLength);
        // console.log("FBXBufferLoader::parseGeomdtry(), isFbxFormatBinary( buffer ): ", isFbxFormatBinary( buffer ));

        let fbxTree: FBXTree;

        if (isFbxFormatBinary(buffer)) {

            fbxTree = new BinaryParser().parse(buffer);

        } else {

            const FBXText = convertArrayBufferToString(buffer);

            if (!isFbxFormatASCII(FBXText)) {

                throw new Error('FBXBufferLoader: Unknown format.');

            }

            if (getFbxVersion(FBXText) < 7000) {

                throw new Error('FBXBufferLoader: FBX version not supported, FileVersion: ' + getFbxVersion(FBXText));

            }

            fbxTree = new TextParser().parse(FBXText);
        }

        return new FBXTreeBufferParser().parse(fbxTree);
    }

    private m_parseOnLoad: (model: GeometryModelDataType, id: number, index: number, total: number, url: string) => void = null;
    private m_binParser: BinaryParser;
    private m_fbxTreeBufParser: FBXTreeBufferParser;
    private m_parseIndex: number = 0;
    private m_url: string = "";
    loadBySteps(
        url: string,
        onLoad: (model: GeometryModelDataType, id: number, index: number, total: number, url: string) => void,
        onProgress: (evt: ProgressEvent, url: string) => void = null,
        onError: (status: number, url: string) => void = null
    ): void {
        if (this.m_fbxTreeBufParser == null) {
            this.m_loader.load(
                url,
                (buf: ArrayBuffer, url: string): void => {

                    this.m_parseOnLoad = onLoad;
                    this.m_parseIndex = 0;
                    this.m_url = url;
                    this.parseGeometryBySteps(buf, url);
                    // if (this.m_fbxTreeBufParser != null) {
                    //     this.m_parseOnLoad = onLoad;
                    //     this.m_parseIndex = 0;
                    //     this.m_url = url;                        
                    //     this.m_tidGeom = setTimeout(this.updateGeomParse.bind(this), 30);
                    // }
                },
                onProgress,
                (status: number, url: string): void => {
                    console.error("load fbx data error, url: ", url);
                    if (onError != null) {
                        onError(status, url);
                    }
                }
            );
        }else {
            console.error("正在解析中，请稍后");
        }
    }

    private m_tidGeom: any = -1;
    private updateGeomParse(): void {
        let delay: number = 40;      // 25 fps
        if (this.m_tidGeom > -1) {
            clearTimeout(this.m_tidGeom);
        }
        if(this.m_fbxTreeBufParser != null && this.m_fbxTreeBufParser.isParseing()) {

            let id = this.m_fbxTreeBufParser.getGeomBufId();
            let model = this.m_fbxTreeBufParser.parseGeomBufNext();
            this.m_parseOnLoad(model.toGeometryModel(), id, this.m_parseIndex, this.m_fbxTreeBufParser.getParseTotal(), this.m_url)
            this.m_parseIndex++;
            if(this.m_parseIndex < this.m_fbxTreeBufParser.getParseTotal()) {
                this.m_tidGeom = setTimeout(this.updateGeomParse.bind(this), delay);
            } else {
                this.m_parseOnLoad = null;
            }
        }
    }
    
    private m_tidBin: any = -1;
    private updateBinParse(): void {
        if (this.m_tidBin > -1) {
            clearTimeout(this.m_tidBin);
        }
        let delay: number = 18;      // 25 fps
        if(this.m_binParser != null && this.m_binParser.isParseing()) {
            this.m_binParser.parseNext();
            // console.log("##$$$ ############ parse bin...");
            if(this.m_binParser.isParseing()) {
                this.m_tidBin = setTimeout(this.updateBinParse.bind(this), delay);
            }else{
                this.m_fbxTreeBufParser.parseBegin(this.m_binParser.getFBXTree());
                if (this.m_fbxTreeBufParser != null) {
                    this.m_tidGeom = setTimeout(this.updateGeomParse.bind(this), 30);
                }
            }
        }
    }

    private parseGeometryBySteps(buffer: ArrayBuffer, path: string): void {

        // console.log("FBXBufferLoader::parseGeomdtry(), buffer.byteLength: ", buffer.byteLength);
        // console.log("FBXBufferLoader::parseGeomdtry(), isFbxFormatBinary( buffer ): ", isFbxFormatBinary( buffer ));

        let fbxTree: FBXTree;

        if (isFbxFormatBinary(buffer)) {

            // let time: number = Date.now();
            // this.m_binParser = new BinaryParser();
            // fbxTree = this.m_binParser.parse(buffer);
            // console.log("### 0 FBXBufferLoader::parseGeometryBySteps(), loss time: ", (Date.now() - time));
            // this.m_fbxTreeBufParser = new FBXTreeBufferParser();
            // this.m_fbxTreeBufParser.parseBegin(fbxTree);

            this.m_binParser = new BinaryParser();
            this.m_binParser.parseBegin(buffer);

            this.m_tidBin = setTimeout(this.updateBinParse.bind(this), 18);
            this.m_fbxTreeBufParser = new FBXTreeBufferParser();

        } else {

            const FBXText = convertArrayBufferToString(buffer);

            if (!isFbxFormatASCII(FBXText)) {

                throw new Error('FBXBufferLoader: Unknown format.');

            }

            if (getFbxVersion(FBXText) < 7000) {

                throw new Error('FBXBufferLoader: FBX version not supported, FileVersion: ' + getFbxVersion(FBXText));

            }

            fbxTree = new TextParser().parse(FBXText);
            this.m_fbxTreeBufParser = new FBXTreeBufferParser();
            this.m_fbxTreeBufParser.parseBegin(fbxTree);
        }
    }
}

export { FBXBufferLoader }