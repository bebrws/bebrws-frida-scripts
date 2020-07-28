// var f = kw.initialFirstResponder()    
function scanHeapFor(objcclass) {
    const allViews = [];
    ObjC.choose(objcclass, {
    onMatch: function (str) {
        allViews.push(str);
    },
    onComplete: function () {
    console.log('Found ' + allViews.length + ' ' + objcclass.$className);
    }
    });
}

console.log("function scanHeapFor(ObjC.classes handle) will return a list of all objects in memory of a class type");