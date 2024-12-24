//Compare
//settings
var getUUID_list = function(elementOfArray){
    if(elementOfArray && elementOfArray.id){
        return elementOfArray.id;
    }
    return null;
}
var getUUID_list_skillData = function(elementOfArray){
    if(elementOfArray && elementOfArray.gaksungLevel){
        return elementOfArray.gaksungLevel;
    }
    return null;
}
// var getUUID_list_skillData_coinList = function(elementOfArray){
//     if(elementOfArray && elementOfArray.gaksungLevel){
//         return elementOfArray.gaksungLevel;
//     }
//     return null;
// }
var getUUID_commands = function(elementOfArray){
    if(elementOfArray && elementOfArray.length>0){
        var aa=elementOfArray[elementOfArray.length-1];
        if(aa.___cmdID)
            aa=aa.___cmdID;
        return aa;
    }
    return null;
}
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
var Compare=function(objb,obja){
    if(Array.isArray(obja)){
        var retValue=[];
        try{
            eval('var getID=getUUID_'+stack.join('_'));
            var objbi=[];
            var objai=[]
            for(var i in objb){
                objbi.push([getID(objb[i]),parseInt(i)])
            }
            for(var i in obja){
                objai.push([getID(obja[i]),parseInt(i)])
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
            for(var i in objbi){
                if(!objaib.find(item=>item[0]==objbi[i][0])){
                    retValue.push([`array.filter(item=>getID(item)=='${objbi[i][0]}');`]);
                    objbi.splice(i,1);
                }
            }
            //order
            //add _ok
            for(var i in objaibM){
                if(objaibM[i][1]==0){
                    retValue.push([`array.unshift(`,obja[0],`);`])
                }else{
                    retValue.push([`array.splice(array.findIndex(item=>getID(item)=='${objai[objaibM[i][1]-1][0]}'),0,`,obja[objaibM[i][1]],`);`]);
                }
            }
            //change _ok
            for(var i in objaib){
                var posB=objbi.find(item=>item[0]==objaib[i][0])[1];
                if(JSON.stringify(objb[posB])!==JSON.stringify(obja[objaib[i][1]])){
                    retValue.push([`Apply(array[array.findIndex(item=>getID(item)=='${objaib[i][0]}')],`,
                        Compare(objb[posB],obja[objaib[i][1]]),
                        `);`
                    ]);
                }
            }
        }catch(e){
            // other
            console.log(e)
            retValue=[];
            retValue.push(["array=",obja,';']);
        }
        return retValue
    }
    var retValue={};
    for(var i in obja){
        if(JSON.stringify(objb[i])!==JSON.stringify(obja[i])){
            if(isObject(obja[i])){
                stack.push(i);
                retValue[i]=Compare(objb[i],obja[i]);
                stack.pop();
            }else{
                retValue[i]=obja[i];
            }
        }
    }
    return retValue;
}
//Apply _ok
var Apply=function(objb,add){
    if(Array.isArray(add)){
        try{
            eval('var getID=getUUID_'+stack.join('_'));
        }catch(e){}
        var array=objb;
        while(add.length!=0){
            var code=add.shift();
            if(code.length==3){
                var run=code[0]+`code[1]`+code[2];
            }else{
                var run=code[0];
            }
            eval(run);
        }
    }
    for(var i in add){
        if(isObject(add[i])){
            stack.push(i);
            Apply(objb[i],add[i]);
            stack.pop();
        }else{
            objb[i]=add[i];
        }
    }
    return objb;
}





var pathBefore='';
var pathAfter='';
var obj={};
// obj[1]=[
//     JSON.parse(fs.readFileSync(String.raw`G:\SteamLibrary\steamapps\common\Note\asset\jsonOld\server\command\data\ws17.json`).toString()),
//     JSON.parse(fs.readFileSync(String.raw`G:\SteamLibrary\steamapps\common\Note\asset\json\server\command\data\ws17.json`).toString())
// ];
obj[1]=[
    JSON.parse(fs.readFileSync(String.raw`D:\SteamLibrary\steamapps\common\Limbus Company\24a.json`).toString()),
    JSON.parse(fs.readFileSync(String.raw`D:\SteamLibrary\steamapps\common\Limbus Company\24.json`).toString())
];
// console.log(JSON.stringify(Compare({a:1,b:{ci:0},c:1},{a:1,b:{ci:1}})))
var comaaaa=Compare(obj[1][0],obj[1][1]);
console.log(JSON.stringify(comaaaa));
fs.writeFileSync('asdadwd__0.json',JSON.stringify(Apply(obj[1][0],comaaaa))) 
fs.writeFileSync('asdadwd__1.json',JSON.stringify(obj[1][1])) 
// for(var i in getAllFiles(pathBefore)){
//     obj[i]=[
//         JSON.parse(fs.readFileSync(pathBefore+'/'+i).toString()),
//         JSON.parse(fs.readFileSync(pathAfter+'/'+i).toString())
//     ];
// }
// var flag=false;
// function getAllFiles(filePath) {
//     let allFilePaths = [];
//     if (fs.existsSync(filePath)) {
//         const files = fs.readdirSync(filePath);
//         for (let i = 0; i < files.length; i++) {
//             let file = files[i];
//             if(!file.toString().endsWith("json")){
//                 console.warn(`${file.toString()}???`);//Ch
//             }
//             let currentFilePath = flag ? file: filePath + '/' + file;
//             let stats = fs.lstatSync(currentFilePath);
//             flag=true;
//             if (stats.isDirectory()) {
//                 allFilePaths = allFilePaths.concat(getAllFiles(currentFilePath));
//             } else {
//                allFilePaths.push(currentFilePath);
//             }
//         }
//     } else {
//         console.warn(`指定的目录${filePath}不存在！`);
//     }
//     return allFilePaths;
// }

// var Obj=fs.readFileSync()




