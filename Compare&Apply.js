//Compare
//settings
//084
// global['getUUID_list_[]'] = function(elementOfArray,array){
//     if(elementOfArray && elementOfArray.id){
//         return elementOfArray.id;
//     }
//     return null;
// }
// global['getUUID_list_[]_skillData_[]'] = function(elementOfArray,array){
//     if(elementOfArray && elementOfArray.gaksungLevel){
//         return elementOfArray.gaksungLevel;
//     }
//     return null;
// }
// global['getUUID_list_[]_skillData_[]_coinList_[]'] = function(elementOfArray,array){
//     if(elementOfArray && array.includes(elementOfArray)){
//         return array.findIndex(elementOfArray);
//     }
//     return null;
// }
// global['getUUID_list_[]_skillData_[]_abilityScriptList_[]'] = function(elementOfArray,array){
//     if(elementOfArray && array.includes(elementOfArray)){
//         return array.findIndex(elementOfArray);
//     }
//     return null;
// }
// global['getUUID_list_[]_skillData_[]_coinList_[]_abilityScriptList_[]'] = function(elementOfArray,array){
//     if(elementOfArray && array.includes(elementOfArray)){
//         return array.findIndex(elementOfArray);
//     }
//     return null;
// }
//gc
//??? really use this?
global['getUUID_commands'] = function(cmdParam,array){
    if (!cmdParam)
        return null;
    var cmdType = cmdParam[0];
    if (cmdType < 10000) {
        var idInfo = cmdParam[cmdParam.length - 1];
        if (idInfo && typeof idInfo == "object" && idInfo.___cmdID) {
            return idInfo.___cmdID;
        }
    }
    else {
        return cmdParam[2];
    }
}
global['getUUID_commands_[]'] = function(elementOfArray,array){
    if(array.includes(elementOfArray)){
        return array.findIndex(item=>item===elementOfArray);
    }
    return null;
}

//settings obj2array






//end

//code
var fs = require('fs');
var stack=[];
var isPlainObject = obj => Object.prototype.toString.call(obj) === '[object Object]';
var isObject = obj => obj !== null && typeof obj === 'object';
if (!Array.isArray) {
    Array.isArray = function(arg) {
      return Object.prototype.toString.call(arg) === '[object Array]';
    };
}
// console.log(isObject([]));true
// console.log(global['getUUID_list']);
var ObjIsEmpty=function(obj){
    if(isObject(obj)){
        if(Array.isArray(obj)){
            for(var i in obj){
                if(!ObjIsEmpty(obj[i]) && !(obj[i]=='rep' && i=='0')){
                    return false;
                }
            }
            return true;
        }
        if(Object.prototype.toString.call(obj)==='[object String]'){
            return false;
        }
        for(var i in obj){
            if(!ObjIsEmpty(obj[i])){
                return false;
            }
        }
        return true;
    }else{
        if(obj){
            return false;
        }
        return true;
    }
}
var Compare=function(objb,obja){
    if(Array.isArray(obja)){
        // if(stack.length!=0){
        //     console.log('getUUID_'+stack.join('_'))
        // }
        var retValue=[];
            // eval('var getID=getUUID_'+stack.join('_'));
        var getID=global['getUUID_'+stack.join('_')];
        if(getID!=undefined){
            var objbi=[];
            var objai=[]
            for(var i in objb){
                objbi.push([getID(objb[i],objb),parseInt(i)])
            }
            for(var i in obja){
                objai.push([getID(obja[i],obja),parseInt(i)])
            }
            var objaib=[...objai];
            var objaibM=[];
            for(var i=0;i<objaib.length;){
                if(!objbi.find(item=>item[0]==objaib[i][0])){
                    objaibM.push(objaib[i]);
                    objaib.splice(i,1);
                }else{
                    i++;
                }
            }
            //delete _ok
            for(var i in objbi){
                if(!objaib.find(item=>item[0]==objbi[i][0])){
                    retValue.push(['del',objbi[i][0]]);
                    objbi.splice(i,1);
                }
            }
            //order _ok
            /*
            'ord'
            [id0,id1,id2]
            [2,0,1]
            */
           if(objbi.length!==objaib.length){
                console.log('fatal error when ordering:  '+objbi.length+' '+objaib.length)
           }
           var idLS=[];
           var posLS=[];
           for(var i=0;i<objbi.length;i++){
            if(objbi[i][0]!=objaib[i][0]){
                idLS.push(objbi[i][0]);
                posLS.push(objaib.findIndex(item=>item[0]==objbi[i][0]));
            }
           }
           if(idLS.length!=0){
            retValue.push([
                'ord',
                idLS,
                posLS
            ]);
           }
            //add _ok
            for(var i in objaibM){
                if(objaibM[i][1]==0){
                    retValue.push(['add',obja[0]])
                }else{
                    retValue.push(['add',objai[objaibM[i][1]-1][0],obja[objaibM[i][1]]]);
                }
            }
            //change _ok
            for(var i in objaib){
                var posB=objbi.find(item=>item[0]==objaib[i][0])[1];
                if(JSON.stringify(objb[posB])!==JSON.stringify(obja[objaib[i][1]])){
                    objaib[i][0]==null && console.log('fatal error: pos_null');
                    stack.push('[]');
                    retValue.push([
                        'obj',
                        objaib[i][0],
                        Compare(objb[posB],obja[objaib[i][1]])
                    ]);
                    stack.pop();
                }
            }
        }else{
            // other
            retValue=[['rep',obja]];
        }
        return retValue;
    }
    if(Object.prototype.toString.call(obja)==='[object String]' || !isObject(obja)||!isObject(objb)){
        return obja;
    }
    var retValue={};
    for(var i in obja){
        if(JSON.stringify(objb[i])!==JSON.stringify(obja[i])){
            stack.push(i);
            retValue[i]=Compare(objb[i],obja[i]);
            stack.pop();
        }
    }
    return retValue;
}
//Apply _ok
var Apply=function(objb,add){
    if(Array.isArray(add)){
        // console.trace('')
        var getID=global['getUUID_'+stack.join('_')];
        var array=objb;
        while(add.length!=0){
            var code=add.shift();
            if(code[0]==='del'){
                // array.filter(item=>getID(item,array)==code[1]).length===0 && console.log(`op_ERROR: del  info:${code[1]}, ${stack.join('_')}, ${debugInfo_fileOnUse}`)
                array.splice(array.findIndex(item=>getID(item,array)==code[1]),1).length===0 && console.log(`op_ERROR: del  info:${code[1]}, ${stack.join('_')}, ${debugInfo_fileOnUse}`)
            }else if(code[0]==='add'){
                if(code[2]){
                    var pos=array.findIndex(item=>getID(item,array)==code[1]);
                    pos==-1 && console.log(`op_ERROR: add  info:${code[1]}, ${stack.join('_')}, ${debugInfo_fileOnUse}`)
                    array.splice(pos+1,0,code[2]);
                }else{
                    array.unshift(code[1]);
                }
            }else if(code[0]==='obj'){
                var pos=array.findIndex(item=>getID(item,array)==code[1]);
                pos==-1&&console.log('op_ERROR: obj')
                if(Object.prototype.toString.call(code[2])==='[object String]' || !isObject(code[2])||!isObject(objb)){//Note  going2change
                    array[pos]=code[2];
                }else{
                    stack.push('[]');
                    Apply(array[pos],code[2]);
                    stack.pop();
                }
            }else if(code[0]==='rep'){
                var temp=[...code[1]];
                temp.unshift(0,array.length);
                Array.prototype.splice.apply(array,temp);
            }else if(code[0]==='ord'){
                var notOrderedSArray=[];
                for(var i in code[1]){
                    var pos=array.findIndex(item=>getID(item,array)==code[1][i]);
                    notOrderedSArray.push([pos,array[pos]]);
                }
                for(var i in code[2]){
                    array[notOrderedSArray[i][0]]=notOrderedSArray[code[2][i]][1];
                }
            }else{
                console.log('error-'+code[0]);
            }
        }
    }else{
        for(var i in add){
            if(Array.isArray(add[i])&&!objb){
                objb[i]=[];
            }
            if(isObject(add[i])&&isObject(objb[i])&&Object.prototype.toString.call(add[i])!=='[object String]'){//Note  going2change
                stack.push(i);
                console.log(i)
                Apply(objb[i],add[i]);
                stack.pop();
            }else{
                objb[i]=add[i];
            }
        }
    }
    return objb;
}





var pathBefore=String.raw`G:\SteamLibrary\steamapps\common\Note\asset\jsonOld`.replaceAll('\\','/');
var pathAfter=String.raw`G:\SteamLibrary\steamapps\common\Note\asset\json`.replaceAll('\\','/');
var pathOut=String.raw`G:\SteamLibrary\steamapps\common\Note\asset\jsonC`.replaceAll('\\','/');
var pathBAOut=String.raw`G:\SteamLibrary\steamapps\common\Note\asset\jsonBeforeAdd`.replaceAll('\\','/');

// var obj={};
// obj[1]=[
//     JSON.parse(fs.readFileSync(String.raw`G:\SteamLibrary\steamapps\common\Note\asset\jsonOld\server\command\data\ws9.json`).toString()),
//     JSON.parse(fs.readFileSync(String.raw`G:\SteamLibrary\steamapps\common\Note\asset\json\server\command\data\ws9.json`).toString())
// ];
// var comaaaa=Compare(obj[1][0],obj[1][1]);
// console.log(JSON.stringify(comaaaa));
// console.log(JSON.stringify(Apply(obj[1][0],comaaaa))==JSON.stringify(obj[1][1]))
// fs.writeFileSync('asdadwd__0.json',JSON.stringify(obj[1][0],null,'    '))
// fs.writeFileSync('asdadwd__1.json',JSON.stringify(obj[1][1],null,'    '))

// console.log(ObjIsEmpty(comaaaa))
// obj[1]=[
//     JSON.parse(fs.readFileSync(String.raw`D:\SteamLibrary\steamapps\common\Limbus Company\24a.json`).toString()),
//     JSON.parse(fs.readFileSync(String.raw`D:\SteamLibrary\steamapps\common\Limbus Company\24.json`).toString())
// ];
// console.log(JSON.stringify(Compare({a:1,b:{ci:0},c:1},{a:1,b:{ci:1}})))
// fs.writeFileSync('asdadwd__0.json',JSON.stringify(Apply(obj[1][0],comaaaa)))
// fs.writeFileSync('asdadwd__1.json',JSON.stringify(obj[1][1]))


var pathLS=getAllFiles(pathBefore);
for(var i in pathLS){
    pathLS[i]=pathLS[i].slice(pathBefore.length)
}

for(var i in pathLS){
    debugInfo_fileOnUse=pathLS[i];
    if(stack.length!=0){
        console.log('stack_fatal-error:  '+stack.join('_'))
    }
    try{
        var com=
            Compare(
                JSON.parse(fs.readFileSync(pathBefore+'/'+pathLS[i]).toString()),
                JSON.parse(fs.readFileSync(pathAfter+'/'+pathLS[i]).toString())
            )
        if(ObjIsEmpty(com)){
            continue;
        }
        var b=pathLS[i].split('/');
        for(var ii=0;ii<b.length-1;ii++){
            try{
               fs.mkdirSync(pathOut+'/'+add(b,ii),function(err){});
            }catch(err){}
        }
        fs.writeFileSync(pathOut+'/'+pathLS[i],JSON.stringify(com,null,'    '))
    }catch(e){
        console.log(e)
    }
}

var debugInfo_fileOnUse=''

for(var i in pathLS){
    debugInfo_fileOnUse=pathLS[i];
    if(stack.length!=0){
        console.log('stack_fatal-error:  '+stack.join('_'))
    }
    try{
        if(!fs.existsSync(pathOut+'/'+pathLS[i])){
            continue;
        }
        var app=
            Apply(
                JSON.parse(fs.readFileSync(pathBefore+'/'+pathLS[i]).toString()),
                JSON.parse(fs.readFileSync(pathOut+'/'+pathLS[i]).toString())
            )
        var b=pathLS[i].split('/');
        for(var ii=0;ii<b.length-1;ii++){
            try{
               fs.mkdirSync(pathBAOut+'/'+add(b,ii),function(err){});
            }catch(err){}
        }
        fs.writeFileSync(pathBAOut+'/'+pathLS[i],JSON.stringify(app,null,'    '))
    }catch(e){
        console.log(e)
        console.log(pathLS[i])
    }
}


function add(b,ii){
    if(b.length==0){return;}
    r=b[0];
    for(var j=0;j<ii;j++){
        r+='/'+b[j+1]
    }
    return r;
}
function getAllFiles(filePath) {
    let allFilePaths = [];
    if (fs.existsSync(filePath)) {
        const files = fs.readdirSync(filePath);
        for (let i = 0; i < files.length; i++) {
            let file = files[i];
            let currentFilePath = filePath + '/' + file;
            let stats = fs.lstatSync(currentFilePath);
            if (stats.isDirectory()) {
                allFilePaths = allFilePaths.concat(getAllFiles(currentFilePath));
            } else {
                if(!file.toString().endsWith("json")){
                    console.warn(`${file.toString()}???`);//Ch
                }
               allFilePaths.push(currentFilePath);
            }
        }
    } else {
        console.warn(`指定的目录${filePath}不存在！`);
    }
    return allFilePaths;
}