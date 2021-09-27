import sys;
import os;
import re;
import math;
from xml.dom.minidom import Document;

m_srcKeys = [];
m_dstKeys = [];
for k in range(65,91):
	#print("chr: "+chr(k));
	m_srcKeys.append(chr(k));
	m_dstKeys.append(chr(k));
	#
for k in range(97,123):
	#print("chr: "+chr(k));
	m_srcKeys.append(chr(k));
	m_dstKeys.append(chr(k));
	#
for k in range(0,9):
	#print("chr: "+chr(k));
	m_dstKeys.append(str(k));
	#

print("srcKeys: "+str(m_srcKeys));
print("dstKeys: "+str(m_dstKeys));

#m_srcKeys = ["a","b","c","d","e"];
#m_dstKeys = ["a","b","0","1"];
rn = len(m_srcKeys);
cn = len(m_dstKeys);

m_index = 0;
i = 0;
len2 = rn + rn * cn;

def getMinStr():
	global m_index;
	t = m_index;
	m_index += 1;
	if t < rn:
		i = t+1;
		return m_srcKeys[ t ];
	
	elif t < len2:
		i = t - rn;
		r = math.floor(i/cn);
		c = i%cn;
		return m_srcKeys[r] + m_dstKeys[c];
	#
	return "$"+str(t);
##########################################

def testMinStr():
	for k in range(0,100):
		keyStr = getMinStr();
		if keyStr.find("$") >= 0:
			break;
		print("keyStr: "+keyStr);

#testMinStr();

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
cmdParams = sys.argv;
dirName = "";
saveFileName = "";
if len(cmdParams) > 1:
	print("cmdParams: "+cmdParams[1]);
	saveFileName = cmdParams[1];
	dirName = cmdParams[1] + "/";

currDir = os.path.abspath(os.path.join(os.path.dirname('packageJS.py'),os.path.pardir));
filePath = currDir+"/dist/"+dirName+"VoxApp.umd.min.js";
fileSavePath = currDir+"/dist/"+dirName+saveFileName+".js";
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
					ns = getMinStr();#"$"+str(nameIndex);
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

print("currDir: "+currDir);
print("run finish...");