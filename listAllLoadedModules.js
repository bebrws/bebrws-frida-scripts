function listLoadedModules() {
    var modules = new Array();
    var tmpmods = Process.enumerateModulesSync();
    for (var i = 0; i < tmpmods.length; i++) {
        console.log('modules in app: ' + tmpmods[i].path + ' name: ' + tmpmods[i].name);
        if (tmpmods[i].path.indexOf(".app") != -1) {
            modules.push(tmpmods[i]);
        }
    }
}

console.log("function listLoadedModules() will list all loaded modules/dylibs")