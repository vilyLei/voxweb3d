import { IRecordeNodeFactory, IRecordeDataUnit, IRecordeTarget, IRecordeNode } from "../../../voxeditor/data/RecordeNodeImpl";

interface IRecordeNodeTarget extends IRecordeTarget {
	useRecordeNodeData(data: KeyValueNode, imgUrl: string): void;
}
class KeyValueNode {
	key: string;
	value: number | boolean;
	values: (number | boolean)[] = null;
	constructor(key: string, value: number | boolean) {
		this.key = key;
		this.value = value;
	}
	isNumber(): boolean {
		return false;
	}
	isBoolean(): boolean {
		return false;
	}
}
class KeyNumberValueNode extends KeyValueNode {
	constructor(key: string, value: number | boolean) {
		super(key, value);
	}
	isNumber(): boolean {
		return true;
	}
}
class KeyBooleanValueNode extends KeyValueNode {
	constructor(key: string, value: number | boolean) {
		super(key, value);
	}
	isBoolean(): boolean {
		return true;
	}
}
class RecordeNode implements IRecordeNode {

	dataSrcType: number = 0;
	target: IRecordeNodeTarget = null;
	keyValueData: KeyValueNode = null;
	imgUrl = "";
	data: RecordeNodeData = null;
	apply(): void {
		console.log("apply ......");
		this.target.useRecordeNodeData(this.keyValueData, this.imgUrl);
	}
	constructor() { }
}
class RecordeNodeData implements IRecordeDataUnit {

	srcType: number = 0;
	target: IRecordeNodeTarget = null;
	keyValueData: KeyValueNode = null;
	imgUrl = "";

	constructor(target: IRecordeNodeTarget, keyValueData: KeyValueNode, imgUrl: string = "") {
		this.target = target;
		this.keyValueData = keyValueData;
		this.imgUrl = imgUrl;
	}
}
class RecordeNodeFactory implements IRecordeNodeFactory {

	createRecordeNode(data: RecordeNodeData): IRecordeNode {
		let node = new RecordeNode();
		node.dataSrcType = data.srcType;
		node.target = data.target;
		node.keyValueData = data.keyValueData;
		node.imgUrl = data.imgUrl;
		node.data = data;
		return node;
	}
}
export { RecordeNodeFactory, RecordeNode, KeyNumberValueNode, KeyBooleanValueNode, KeyValueNode, RecordeNodeData, IRecordeNodeTarget }
