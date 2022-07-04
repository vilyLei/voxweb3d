
interface CoGeomDataType {
	uvsList: Float32Array[];
	vertices: Float32Array;
	normals: Float32Array;
	indices: Uint16Array | Uint32Array;
}
enum CoModuleNS {
	ctmParser = "ctmGeomParser",
	objParser = "objGeomParser",
	dracoParser = "dracoGeomParser",
	pngParser = "pngParser",
	threadCore = "threadCore",
	coSpaceApp = "coSpaceApp"
}
/**
 * 数据文件类型，例如 ctm, draco
 */
enum CoDataFormat {
	CTM = "ctm",
	Draco = "draco",
	OBJ = "obj",
	FBX = "fbx",
	GLB = "glb",
	Jpg = "jpg",
	Png = "png",
	Gif = "gif"
}
enum CoModuleFileType {
	JS = "js-text",
	Binasy = "binary"
}

interface CoGeomDataContainer {
	dataType: string;
	dataFormat: CoDataFormat;
	models: CoGeomDataType[];
}
interface CoGeomDataUnit {
	url: string;
	data: CoGeomDataContainer;
}
type HTMLImg = HTMLImageElement | HTMLCanvasElement;

interface CoTextureDataContainer {
	dataType: string;
	dataFormat: CoDataFormat;
	images: HTMLImg[];
	imageDatas: Uint8Array[];
}
interface CoTextureDataUnit {
	url: string;
	data: CoTextureDataContainer;
}
interface CoTaskCodeModuleParam {
	/**
	 * task module js file url
	 */
	url: string;
	/**
	 * task module name
	 */
	name: string;
	/**
	 * file data type(js text, binary data)
	 */
	type: CoModuleFileType;
}

export {
	CoTextureDataUnit,
	CoModuleFileType,
	CoGeomDataType,
	CoModuleNS,
	CoDataFormat,
	CoGeomDataUnit,
	CoTaskCodeModuleParam,
};
