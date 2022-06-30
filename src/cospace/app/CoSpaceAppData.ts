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
	Jpg = "jpg",
	Png = "png",
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
	CoModuleFileType,
	CoGeomDataType,
	CoModuleNS,
	CoDataFormat,
	CoGeomDataUnit,
	CoTaskCodeModuleParam,
};
