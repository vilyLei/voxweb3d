//IGeomModelData
import IGeomModelData from "../../vox/mesh/IGeomModelData";
interface CoGeomDataType extends IGeomModelData {
	// uuid?: string;
	// /**
	//  * vbWhole vtx buffer is whole data, or not, the default value is false
	//  */
	// vbWhole?: boolean;
	// /**
	//  * the default value is 3
	//  */
	// stride?: number;
	// uvsList: Float32Array[];
	// vertices: Float32Array;
	// normals: Float32Array;
	// indices: Uint16Array | Uint32Array;
}
enum CoModuleNS {
	ctmParser = "ctmGeomParser",
	objParser = "objGeomParser",
	dracoParser = "dracoGeomParser",
	pngParser = "pngParser",
	fbxFastParser = "fbxFastParser",

	threadCore = "threadCore",
	coSpaceApp = "coSpaceApp"
}
/**
 * 数据文件类型，例如 ctm, draco
 */
enum CoDataFormat {
	Undefined = "undefined-format",
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
	modelReceiver: (models: CoGeomDataType[], transforms: Float32Array[], index: number, total: number) => void;
	dataType: string;
	dataFormat: CoDataFormat;
	models: CoGeomDataType[];
	transforms: Float32Array[];
}
interface CoGeomDataUnit {
	url: string;
	data: CoGeomDataContainer;
}
interface CoPNGDescriptorType {
    url: string;
    width: number;
    height: number;
}
type HTMLImg = HTMLImageElement | HTMLCanvasElement;

interface CoTextureDataContainer {
	dataType: string;
	dataFormat: CoDataFormat;
	desList: CoPNGDescriptorType[];
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
	
    params?: (string | number)[];
}

export {
	CoPNGDescriptorType,
	CoTextureDataUnit,
	CoModuleFileType,
	CoGeomDataType,
	CoModuleNS,
	CoDataFormat,
	CoGeomDataUnit,
	CoTaskCodeModuleParam,
};
