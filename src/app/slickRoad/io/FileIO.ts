function downloadBinFile(binData: any, fns: string, suffix: string = "bin"): void {

	const downloadURL = function (data: any, pfns: string): void {

		const a = document.createElement('a');
		a.href = data;
		a.download = pfns;
		document.body.appendChild(a);
		(a as any).style = 'display: none';
		a.click();
		a.remove();
	}
	//console.log("downloadBinFile, binData: ", binData);
	const downloadBlob = function (data: any, bfns: string, mimeType: any) {
		const blob = new Blob([data], {
			type: mimeType
		});
		const url = window.URL.createObjectURL(blob);
		downloadURL(url, bfns);
		setTimeout(function () {
			return window.URL.revokeObjectURL(url);
		}, 1000);
	};

	downloadBlob(binData, fns + '.' + suffix, 'application/octet-stream');
}
class FileIO {

    constructor() { }

    downloadBinFile(binData: any, fns: string, suffix: string = "vrd"): void {

		const downloadURL = function (data: any, pfns: string): void {

			const a = document.createElement('a');
			a.href = data;
			a.download = pfns;
			document.body.appendChild(a);
			(a as any).style = 'display: none';
			a.click();
			a.remove();
		}
		const downloadBlob = function (data: any, bfns: string, mimeType: any) {
			const blob = new Blob([data], {
				type: mimeType
			});
			const url = window.URL.createObjectURL(blob);
			downloadURL(url, bfns);
			setTimeout(function () {
				return window.URL.revokeObjectURL(url);
			}, 1000);
		};

		downloadBlob(binData, fns + '.' + suffix, 'application/octet-stream');
	}

}

export {FileIO};
