import { BINARY_EXTENSION_CHUNK_TYPES, BINARY_EXTENSION_HEADER_LENGTH, BINARY_EXTENSION_HEADER_MAGIC, EXTENSIONS } from "./Extensions";
import { decodeText } from "../utils/ParserUtils";
import Color4 from "../../../vox/material/Color4";

class GLTFMeshQuantizationExtension {
	name = EXTENSIONS.KHR_MESH_QUANTIZATION;
	constructor() {}
}
export { GLTFMeshQuantizationExtension };
