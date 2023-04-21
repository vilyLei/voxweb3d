
interface IRecordeDataUnit {

	srcType: number;
	target: IRecordeTarget;
	// copyToNode(node: IRecordeNode): void;
}
interface IRecordeTarget {
	applyRecordeNodeData(data: IRecordeDataUnit): void;
}
interface IRecordeNode {

	dataSrcType: number;
	target: IRecordeTarget;
	data: IRecordeDataUnit;
	apply(): void;
}
interface IRecordeNodeFactory {

	createRecordeNode(data: IRecordeDataUnit): IRecordeNode;
}

export { IRecordeNodeFactory, IRecordeNode, IRecordeDataUnit, IRecordeTarget }
