
import { HttpFileLoader } from "../loaders/HttpFileLoader";
import { convertArrayBufferToString, isFbxFormatASCII, getFbxVersion } from "./Utils";
import { GeometryModelDataType } from "../base/GeometryModelDataType";
import { isFbxFormatBinary } from "./Utils";
import { BinaryParser } from "./BinaryParser";
import { TextParser } from "./TextParser";
import { FBXTreeParser } from "./FBXTreeParser";
import { Group } from "./FBXGroup";
import { FBXTree } from "./FBXTree";
import { FBXBufferObject } from "./FBXBufferObject";

class FBXLoader {

	private m_loader: HttpFileLoader = new HttpFileLoader();
    constructor() {
    }
    load(
        url: string,
        onLoad: (model: GeometryModelDataType, url: string) => void,
		onProgress: (evt: ProgressEvent, url: string) => void = null,
		onError: (status: number, url: string) => void = null
        ): void {

        this.m_loader.load(
            url,
            (buf: ArrayBuffer, url: string): void => {
                this.parse(buf, url);
            },
            null,
            (status: number, url: string): void => {
                console.error("load fbx data error, url: ", url);
            }
        );
    }

    private parse( buffer: ArrayBuffer, path: string ): Group {

        console.log("FBXLoader::parse(), isFbxFormatBinary( buffer ): ", isFbxFormatBinary( buffer ));

        let fbxTree: FBXTree;
		if ( isFbxFormatBinary( buffer ) ) {

			fbxTree = new BinaryParser().parse( buffer );

		} else {

			const FBXText = convertArrayBufferToString( buffer );

			if ( ! isFbxFormatASCII( FBXText ) ) {

				throw new Error( 'FBXLoader: Unknown format.' );

			}
			const version = getFbxVersion( FBXText );
			if ( version < 7000 ) {

				alert('FBXLoader: FBX version not supported, FileVersion: ' + version);
				throw new Error( 'FBXLoader: FBX version not supported, FileVersion: ' + version );

			}

			fbxTree = new TextParser().parse( FBXText );

		}

		// console.log( fbxTree );

		// const textureLoader = new TextureLoader( this.manager ).setPath( this.resourcePath || path ).setCrossOrigin( this.crossOrigin );

		// return new FBXTreeParser( textureLoader, this.manager ).parse( fbxTree );

        return new FBXTreeParser(null, null).parse( fbxTree );
	}

    loadGeometryBuffer(
        url: string,
        onLoad: (model: Map<number, GeometryModelDataType>, url: string) => void,
		onProgress: (evt: ProgressEvent, url: string) => void = null,
		onError: (status: number, url: string) => void = null
        ): void {

        this.m_loader.load(
            url,
            (buf: ArrayBuffer, url: string): void => {

                let modelMap: Map<number, GeometryModelDataType> = new Map();

                let bufferMap = this.parseGeometryBuffer(buf, url);
                // console.log("###XXX bufferMap: ", bufferMap);
                for(let [key, value] of bufferMap) {
                    modelMap.set(key, value.toGeometryModel());
                }
                if(onLoad != null) {
                    onLoad(modelMap, url);
                }
            },
            null,
            (status: number, url: string): void => {
                console.error("load fbx data error, url: ", url);
            }
        );
    }

    private parseGeometryBuffer( buffer: ArrayBuffer, path: string ): Map<number, FBXBufferObject> {

        console.log("FBXLoader::parseGeomdtry(), isFbxFormatBinary( buffer ): ", isFbxFormatBinary( buffer ));

        let fbxTree: FBXTree;

		if ( isFbxFormatBinary( buffer ) ) {

			fbxTree = new BinaryParser().parse( buffer );

		} else {

			const FBXText = convertArrayBufferToString( buffer );

			if ( ! isFbxFormatASCII( FBXText ) ) {

				throw new Error( 'FBXLoader: Unknown format.' );

			}

			const version = getFbxVersion( FBXText );
			if ( version < 7000 ) {

				alert('FBXLoader: FBX version not supported, FileVersion: ' + version);
				throw new Error( 'FBXLoader: FBX version not supported, FileVersion: ' + version );

			}

			fbxTree = new TextParser().parse( FBXText );
		}

        return new FBXTreeParser(null, null).parseGeometry( fbxTree );
	}
}

export { FBXLoader }
