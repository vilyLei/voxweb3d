import {DsrdShell} from "./DsrdShell";
export class DsrdShellDemo {
	constructor() {}
	initialize(): void {
		console.log("DsrdShellDemo::initialize()......");
		let shell = new DsrdShell();
		shell.initialize();
	}
}
export default DsrdShellDemo;
