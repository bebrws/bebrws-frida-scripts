function findModuleForClass() {
    var classNameToFind = arguments.length == 1 ? arguments[0] : undefined;

    var allModules = Process.enumerateModules();

    for (var module in allModules) {
        var m = allModules[module]; // Module has name nad path (among other attrs)
        console.log(JSON.stringify(m))

        function modmapFilter(mod) {
            return mod && mod.name == m.name;
        }

        var modmap = new ModuleMap(modmapFilter)

        var appClassesByModule = ObjC.enumerateLoadedClassesSync({ ownedBy: modmap })
        for (var curModule in appClassesByModule) {
            var classList = appClassesByModule[curModule];
            for (var classNameIndex in classList) {
                var classNameString = classList[classNameIndex]
                if (typeof classNameString == "string") {
                    
                    var classHandle = ObjC.classes[classNameString];
                    if (!classNameToFind || classNameToFind != classNameString) {
                        console.log(m.name + " - " + classNameString)
                    }
                }
            }
        }        
    }
}

console.log("findModuleForClass takes on optional argument. A specific class to search for. Otherwise it will print out all module - classes.");
