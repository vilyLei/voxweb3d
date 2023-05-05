import { HttpFileLoader } from "../../cospace/modules/loaders/HttpFileLoader";
import { BINARY_EXTENSION_HEADER_MAGIC, EXTENSIONS } from "./extension/Extensions";

import { GLTFBinaryExtension } from "./extension/GLTFBinaryExtension";
import { GLTFMaterialsUnlitExtension } from "./extension/GLTFMaterialsUnlitExtension";
import { GLTFMeshQuantizationExtension } from "./extension/GLTFMeshQuantizationExtension";
import { GLTFMeshoptCompression } from "./extension/GLTFMeshoptCompression";

import { decodeText } from "./utils/ParserUtils";
import { GLTFParser } from "./parse/GLTFParser";

class GLTFLoader {

	onError: (err: Error) => void = null;
	onLoad: (data: any) => void = null;

	resourcePath: string;
	crossOrigin: string;

	/**
	 * @default {}
	 */
   	requestHeader: { [header: string]: string };

	manager: any;
	ktx2Loader: any;
	meshoptDecoder: any;
	pluginCallbacks: any[] = [];

	constructor() {}

	initialize(): void {

		this.register( function ( parser: any ) {
			return new GLTFMeshoptCompression( parser );
		} );

		console.log("GLTFLoader::initialize()......");
		let url = "static/assets/glbs/coffeemat.glb";
		let loader = new HttpFileLoader();
		loader.load(url,(bufData: ArrayBuffer, fileUrl: string):void => {
			console.log("loaded a file url: ",fileUrl);
			this.parse(bufData);
		});

	}

	setMeshoptDecoder( meshoptDecoder: any ): GLTFLoader {

		this.meshoptDecoder = meshoptDecoder;
		return this;

	}

	register( callback: any ): GLTFLoader {

		if ( this.pluginCallbacks.indexOf( callback ) === - 1 ) {

			this.pluginCallbacks.push( callback );

		}

		return this;

	}

	unregister( callback: any ): GLTFLoader {

		if ( this.pluginCallbacks.indexOf( callback ) !== - 1 ) {

			this.pluginCallbacks.splice( this.pluginCallbacks.indexOf( callback ), 1 );

		}

		return this;

	}
	private parse(data: ArrayBuffer | string): void {

		let content;
		const extensions = {} as any;
		const plugins = {} as any;

		if ( typeof data === 'string' ) {

			content = data;

		} else {

			const magic = decodeText( new Uint8Array( data, 0, 4 ) );

			if ( magic === BINARY_EXTENSION_HEADER_MAGIC ) {

				try {

					extensions[ EXTENSIONS.KHR_BINARY_GLTF ] = new GLTFBinaryExtension( data );

				} catch ( error ) {

					if ( this.onError ) this.onError( error );
					return;

				}

				content = extensions[ EXTENSIONS.KHR_BINARY_GLTF ].content;

			} else {

				content = decodeText( new Uint8Array( data ) );

			}

		}

		const json = JSON.parse( content );
		console.log("GLTFLoader::parse(), glb json: ",json);

		if ( json.asset === undefined || json.asset.version[ 0 ] < 2 ) {

			if ( this.onError ) this.onError( new Error( 'GLTFLoader::parse(), Unsupported asset. glTF versions >=2.0 are supported.' ) );
			return;

		}
		let path = "";
		const parser = new GLTFParser( json, {

			path: path || this.resourcePath || '',
			crossOrigin: this.crossOrigin,
			requestHeader: this.requestHeader,
			manager: this.manager,
			ktx2Loader: this.ktx2Loader,
			meshoptDecoder: this.meshoptDecoder
		} );

		// parser.fileLoader.setRequestHeader( this.requestHeader );


		for ( let i = 0; i < this.pluginCallbacks.length; i ++ ) {

			const plugin = this.pluginCallbacks[ i ]( parser );
			plugins[ plugin.name ] = plugin;

			// Workaround to avoid determining as unknown extension
			// in addUnknownExtensionsToUserData().
			// Remove this workaround if we move all the existing
			// extension handlers to plugin system
			extensions[ plugin.name ] = true;
		}

		if ( json.extensionsUsed ) {

			for ( let i = 0; i < json.extensionsUsed.length; ++ i ) {

				const extensionName = json.extensionsUsed[ i ];
				const extensionsRequired = json.extensionsRequired || [];

				switch ( extensionName ) {

					case EXTENSIONS.KHR_MATERIALS_UNLIT:
						extensions[ extensionName ] = new GLTFMaterialsUnlitExtension();
						break;

					// case EXTENSIONS.KHR_MATERIALS_PBR_SPECULAR_GLOSSINESS:
					// 	extensions[ extensionName ] = new GLTFMaterialsPbrSpecularGlossinessExtension();
					// 	break;
					// case EXTENSIONS.KHR_DRACO_MESH_COMPRESSION:
					// 	extensions[ extensionName ] = new GLTFDracoMeshCompressionExtension( json, this.dracoLoader );
					// 	break;
					// case EXTENSIONS.KHR_TEXTURE_TRANSFORM:
					// 	extensions[ extensionName ] = new GLTFTextureTransformExtension();
					// 	break;
					case EXTENSIONS.KHR_MESH_QUANTIZATION:
						extensions[ extensionName ] = new GLTFMeshQuantizationExtension();
						break;

					default:

						if ( extensionsRequired.indexOf( extensionName ) >= 0 && plugins[ extensionName ] === undefined ) {

							console.warn( 'GLTFLoader::parse(), Unknown extension "',extensionName,'".' );

						}

				}

			}

		}

		parser.setExtensions( extensions );
		parser.setPlugins( plugins );
		parser.parse( this.onLoad, this.onError );
	}
}
export { GLTFLoader }
