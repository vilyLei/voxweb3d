
import { FileLoader } from "../loaders/FileLoader";
import { LoaderUtils } from "../loaders/LoaderUtils";
import { GeometryModelDataType } from "../base/GeometryModelDataType";
class FBXLoader {

	private m_loader: FileLoader = new FileLoader();
    constructor() {
    }
    loadGeometry(
        url: string,
        onLoad: (model: GeometryModelDataType, url: string) => void,
		onProgress: (evt: ProgressEvent, url: string) => void = null,
		onError: (status: number, url: string) => void = null
        ): void {
        
        this.m_loader.load(
            url,
            (buf: ArrayBuffer, url: string): void => {
                
            },
            null,
            (status: number, url: string): void => {
                console.error("loaded ctm mesh data error, url: ", url);
            }
        );
    }
    private convertArrayBufferToString( buffer: ArrayBuffer, from: number, to: number ) {

        if ( from === undefined ) from = 0;
        if ( to === undefined ) to = buffer.byteLength;
    
        return LoaderUtils.decodeText( new Uint8Array( buffer, from, to ) );
    
    }
    private isFbxFormatBinary( buffer: ArrayBuffer ) {

        const CORRECT = 'Kaydara\u0020FBX\u0020Binary\u0020\u0020\0';
    
        return buffer.byteLength >= CORRECT.length && CORRECT === this.convertArrayBufferToString( buffer, 0, CORRECT.length );
    
    }
    private parse( buffer: ArrayBuffer, path: string ) {

		if ( this.isFbxFormatBinary( buffer ) ) {

			fbxTree = new BinaryParser().parse( buffer );

		} else {

			const FBXText = convertArrayBufferToString( buffer );

			if ( ! isFbxFormatASCII( FBXText ) ) {

				throw new Error( 'THREE.FBXLoader: Unknown format.' );

			}

			if ( getFbxVersion( FBXText ) < 7000 ) {

				throw new Error( 'THREE.FBXLoader: FBX version not supported, FileVersion: ' + getFbxVersion( FBXText ) );

			}

			fbxTree = new TextParser().parse( FBXText );

		}

		// console.log( fbxTree );

		const textureLoader = new TextureLoader( this.manager ).setPath( this.resourcePath || path ).setCrossOrigin( this.crossOrigin );

		return new FBXTreeParser( textureLoader, this.manager ).parse( fbxTree );

	}
}

export { FBXLoader }