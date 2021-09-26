
import os;
import re;
from xml.dom.minidom import Document;
def isNumLeters(s):
    s = str(s)
    if s == '':
        return False
    if len(s) < 2:
        if re.match('^[0-9a-zA-Z]+$', s[0]):
            return True
        else:
            return False
    else:
        if re.match('^[0-9a-zA-Z]+$', s[0]) and re.match('^[0-9a-zA-Z_-]+$', s[1:]):
            return True
        else:
            return False
#############################################

currDir = os.path.abspath(os.path.join(os.path.dirname('packageJS.py'),os.path.pardir));
filePath = currDir+"/dist/VoxApp.umd.min.js";
fileSavePath = currDir+"/dist/VoxApp.umd.min_py.js";
#filePath = currDir+"/dist/VoxApp.umd.js";
print("filePath: "+filePath);
targetFP = open(filePath,"r+");

fpNameDict = {};

testStr = "ffm_kdffd=cc,m_3";
i = testStr.find("m_",0);
j = testStr.find("=",i+1);
print("i: "+ str(i)+", : "+str(j));
print("substr: "+ testStr[i:j]);

lineTotal = 0;
findTotal = 0;
kIndex = 0;
nameIndex = 0;

fileStr = "";
for line in targetFP.readlines():
	lineStr = line;
	if len(line) >= 3:
		lineTotal += 1;
		i = 0;
		for k in range(0,100000):
			i = lineStr.find("m_",i+1);
			if i > 0:
				j = lineStr.find("=",i+1);
				# 找到当前 m_ 对应的完整单词
				# re.match('^[0-9a-zA-Z]+$', s[0])
				nameStr = lineStr[i:j];
				if isNumLeters(nameStr):
					ns = "$"+str(nameIndex);
					lineStr = lineStr.replace(nameStr,ns);
					nameIndex += 1;
					findTotal += 1;
			else:
				break;
	#
	fileStr += lineStr;

print("findTotal: "+str(findTotal));
print("lineTotal: "+str(lineTotal));
print("nameIndex: "+str(nameIndex));
targetFP.close();

SaveTargetFile = open(fileSavePath,"w");
SaveTargetFile.write(fileStr);
SaveTargetFile.close();

# currDir = os.getcwd();
# TargetFileContent = "";
# TargetName = "voxword";
# TargetName_html = TargetName + ".html";
# currDir =  os.getcwd();

# i = currDir.find("voxEngineV3");
# print i;
# JSRootPath = currDir[0:i] + "voxEngineV3/";
# JSRootPath = JSRootPath.replace("\\","/");
# print "JSRootPath: "+JSRootPath;
# TargetFilePath = currDir + "/" + TargetName_html;
# print "TargetFilePath: "+TargetFilePath;
# def parseCodeFP(fpstr):
# 	linesArr = fpstr.split("\n");
# 	lineTotal = len(linesArr);
# 	content = "";
# 	print "linesArr.length: "+str(lineTotal);
# 	for i in range(0,lineTotal):
# 		lineStr = linesArr[i];
# 		boo = lineStr.find("/*  ")>=0 or lineStr.find("/******************")>=0;
# 		#boo2 = lineStr.find("///*")>=0 or lineStr.find("//*")>=0 or lineStr.find("//*/")>=0;
# 		if (not boo) and len(lineStr) > 0:
# 			content += linesArr[i]+"\n";
# 	return content;
# # load target file raw data
# targetFP = open(TargetFilePath,"r+");
# for line in targetFP.readlines():
# 	if line.find("<script ") >= 0:
# 		ia = line.find('"');
# 		ib = line.find('"',ia + 1);
# 		fpath = JSRootPath + line[ia+1:ib];
# 		#print "js path: "+fpath;
# 		# read this file all str
# 		fp = open(fpath,"r");
# 		fpContent = fp.read();
# 		rstr = parseCodeFP(fpContent);
# 		TargetFileContent += rstr;
# 		fp.close();
    			
# targetFP.close();
# currDir = currDir.replace("\\","/");
# TargetJSFilePath = currDir + "/" + TargetName + ".js";
# TargetFile = open(TargetJSFilePath,"w");
# TargetFile.write(TargetFileContent);
# TargetFile.close();

print("currDir: "+currDir);
#pdir = os.listdir(currDir+"/");
#find_as(currDir+"/");
print("run finish...");