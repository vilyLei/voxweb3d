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
		// console.log("FBXTree::add(), key: ", key);
		// if(key == "Objects") {
		// 	console.log("FBXTree::add(), find Objects, val: ",val);
		// }
		this.map[key] = val;
	}
}
export { FBXTreeMap, FBXTree };
