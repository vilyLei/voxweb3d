
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
                for(let [key, value] of bufferMap) {
                    modelMap.set(key, value.toGeometryModel());
                }
                if(onLoad != null) {
                    onLoad(modelMap, url);
                }
            },
            onProgress,
            (status: number, url: string): void => {
                console.error("load fbx data error, url: ", url);
                if(onError != null) {
                    onError(status, url);
                }
            }
        );
    }
    
    private parseGeometry( buffer: ArrayBuffer, path: string ): Map<number, FBXBufferObject> {

		// console.log("FBXBufferLoader::parseGeomdtry(), buffer.byteLength: ", buffer.byteLength);
        // console.log("FBXBufferLoader::parseGeomdtry(), isFbxFormatBinary( buffer ): ", isFbxFormatBinary( buffer ));

        let fbxTree: FBXTree;

		if ( isFbxFormatBinary( buffer ) ) {

			fbxTree = new BinaryParser().parse( buffer );

		} else {

			const FBXText = convertArrayBufferToString( buffer );

			if ( ! isFbxFormatASCII( FBXText ) ) {

				throw new Error( 'FBXBufferLoader: Unknown format.' );

			}

			if ( getFbxVersion( FBXText ) < 7000 ) {

				throw new Error( 'FBXBufferLoader: FBX version not supported, FileVersion: ' + getFbxVersion( FBXText ) );

			}

			fbxTree = new TextParser().parse( FBXText );
		}

        return new FBXTreeBufferParser().parse( fbxTree );
	}
}

export { FBXBufferLoader }