import { BINARY_EXTENSION_CHUNK_TYPES, BINARY_EXTENSION_HEADER_LENGTH, BINARY_EXTENSION_HEADER_MAGIC, EXTENSIONS } from "./Extensions";
import { decodeText } from "../utils/ParserUtils";
import Color4 from "../../../vox/material/Color4";

class GLTFMaterialsUnlitExtension {
	name = EXTENSIONS.KHR_MATERIALS_UNLIT;
	constructor() {}

	getMaterialType(): string {
		return "MeshBasicMaterial";
	}

	extendParams(materialParams: any, materialDef: any, parser: any) {
		const pending = [];

		materialParams.color = new Color4(1.0, 1.0, 1.0);
		materialParams.opacity = 1.0;

		const metallicRoughness = materialDef.pbrMetallicRoughness;

		if (metallicRoughness) {
			if (Array.isArray(metallicRoughness.baseColorFactor)) {
				const array = metallicRoughness.baseColorFactor;

				materialParams.color.fromArray(array);
				materialParams.opacity = array[3];
			}

			if (metallicRoughness.baseColorTexture !== undefined) {
				// for test
				const sRGBEncoding = 3001;
				pending.push(parser.assignTexture(materialParams, "map", metallicRoughness.baseColorTexture, sRGBEncoding));
			}
		}

		return Promise.all(pending);
	}
}
export { GLTFMaterialsUnlitExtension };
