import { HttpFileLoader } from "../../../cospace/modules/loaders/HttpFileLoader";
import { BINARY_EXTENSION_HEADER_MAGIC, EXTENSIONS } from "../extension/Extensions";
import { GLTFBinaryExtension } from "../extension/GLTFBinaryExtension";
import { decodeText } from "../utils/ParserUtils";

/* GLTFREGISTRY */

class GLTFRegistry {
	objects: any = {};
	constructor() {}
	get(key: string): any {
		return this.objects[key];
	}

	add(key: string, object: any) {
		this.objects[key] = object;
	}
	remove(key: string) {
		delete this.objects[key];
	}
	removeAll() {
		this.objects = {};
	}
}
class GLTFParser {
	json: any;
	extensions: any;
	plugins: any;
	options: any;

	// loader object cache
	cache: any; // = new GLTFRegistry();

	// associations between Three.js objects and glTF elements
	associations = new Map();

	// BufferGeometry caching
	primitiveCache: any = {};

	// Object3D instance caches
	meshCache: any; // = { refs: {}, uses: {} };
	cameraCache: any; // = { refs: {}, uses: {} };
	lightCache: any; // = { refs: {}, uses: {} };

	sourceCache: any; // = {};
	textureCache: any; // = {};

	// Track node names, to ensure no duplicates
	nodeNamesUsed: any; // = {};
	fileLoader: any; // = {};

	constructor(json: any = {}, options = {}) {
		this.json = json;
		this.extensions = {};
		this.plugins = {};
		this.options = options;

		// loader object cache
		this.cache = new GLTFRegistry();

		// associations between rendering objects and glTF elements
		this.associations = new Map();

		// BufferGeometry caching
		this.primitiveCache = {};

		// Object3D instance caches
		this.meshCache = { refs: {}, uses: {} };
		this.cameraCache = { refs: {}, uses: {} };
		this.lightCache = { refs: {}, uses: {} };

		this.sourceCache = {};
		this.textureCache = {};

		// Track node names, to ensure no duplicates
		this.nodeNamesUsed = {};

		// Use an ImageBitmapLoader if imageBitmaps are supported. Moves much of the
		// expensive work of uploading a texture to the GPU off the main thread.

		const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent) === true;
		const isFirefox = navigator.userAgent.indexOf("Firefox") > -1;
		const firefoxVersion = isFirefox ? navigator.userAgent.match(/Firefox\/([0-9]+)\./)[1] : -1;
		/*
		if (typeof createImageBitmap === "undefined" || isSafari || (isFirefox && firefoxVersion < 98)) {
			this.textureLoader = new TextureLoader(this.options.manager);
		} else {
			this.textureLoader = new ImageBitmapLoader(this.options.manager);
		}

		this.textureLoader.setCrossOrigin(this.options.crossOrigin);
		this.textureLoader.setRequestHeader(this.options.requestHeader);

		this.fileLoader = new FileLoader(this.options.manager);
		this.fileLoader.setResponseType("arraybuffer");

		if (this.options.crossOrigin === "use-credentials") {
			this.fileLoader.setWithCredentials(true);
		}
		//*/
	}

	setExtensions(extensions: any) {
		this.extensions = extensions;
	}

	setPlugins(plugins: any) {
		this.plugins = plugins;
	}

	parse(onLoad: (data: any) => void, onError: (err: Error) => void) {

	}
}
export { GLTFParser };
