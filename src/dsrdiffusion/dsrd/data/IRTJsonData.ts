interface IRTJsonData {
	/**
	 * @param keyName the sub json node name
	 * @param parentEnabled the default value is true
	 */
	getRTJsonStrByKeyName(keyName: string, parentEnabled?: boolean): string;
	/**
	 * @param keyNames the sub json node names list
	 * @param parentEnabled the default value is true
	 */
	getRTJsonStrByKeyNames(keyNames: string[], parentEnabled?: boolean): string;

	isRTJsonActiveByKeyName(keyName: string): boolean;
}
export { IRTJsonData };
