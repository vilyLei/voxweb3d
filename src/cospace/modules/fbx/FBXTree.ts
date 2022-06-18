// FBXTree holds a representation of the FBX data, returned by the TextParser ( FBX ASCII format)
// and BinaryParser( FBX Binary format)
interface FBXTreeMap {
	// 👇️ key      value
	[key: string]: any;
}

class FBXTree implements FBXTreeMap {
	map: FBXTreeMap = {};
	constructor(){}
	add(key: string, val: any) {
		this.map[key] = val;
	}
}
export { FBXTreeMap, FBXTree };
