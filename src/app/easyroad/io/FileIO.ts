
class FileIO {

    constructor() { }
    
    downloadBinFile(binData: any, file_name: string, suffix: string = "vrd"): void {
        var downloadBlob: any, downloadURL: any;
        //console.log("downloadBinFile, binData: ", binData);
        downloadBlob = function (data: any, fileName: string, mimeType: any) {
            var blob: Blob, url: string;
            blob = new Blob([data], {
                type: mimeType
            });
            url = window.URL.createObjectURL(blob);
            downloadURL(url, fileName);
            setTimeout(function () {
                return window.URL.revokeObjectURL(url);
            }, 1000);
        };

        downloadURL = function (data: any, fileName: string): void {
            var a: any;
            a = document.createElement('a');
            a.href = data;
            a.download = fileName;
            document.body.appendChild(a);
            a.style = 'display: none';
            a.click();
            a.remove();
        }
        downloadBlob(binData, file_name + '.' + suffix, 'application/octet-stream');
    }

}

export {FileIO};