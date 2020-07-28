function listModuleMapNames() {
    function modmapFilter(mod) {
        console.log("Mod name: " + mod.name)
        return true;
    }
    var modmap = new ModuleMap(modmapFilter)
}


function getAllSubclassesInModuleOf(moduleNameForFilter, subclassString) {
    var cachedClasses = {};
    function modmapFilter(mod) {
        return mod && mod.name == moduleNameForFilter;
    }
    var modmap = new ModuleMap(modmapFilter)
    var appClassesByModule = ObjC.enumerateLoadedClassesSync({ ownedBy: modmap })

    for (var curModule in appClassesByModule) {
        var classList = appClassesByModule[curModule];
        for (var classNameIndex in classList) {
            var classNameString = classList[classNameIndex]
            if (typeof classNameString == "string") {
                
                var handle = ObjC.classes[classNameString]
                if (isClassASubclassOf(handle, subclassString)) {
                    cachedClasses[classNameString] = handle;
                }
            }
        }
    }

    // console.log("cachedClasses: " + Object.keys(cachedClasses));
    return cachedClasses;
}

console.log('function getAllSubclassesInModuleOf("moduleNameString", "NSResponder"); will get all classes that subclass the second argument in the module named 1st argument')


function isClassASubclassOf(handle, subclassString) {
    var isNSObjOrResponder = false;
    var wasResponderChain = false;

    var curList = [];
    for(var candidate = handle; candidate != null && candidate != "0x0" && !isNSObjOrResponder; candidate = ObjC.api.class_getSuperclass(candidate)) {
        var candidateName = ObjC.api.class_getName(candidate).readUtf8String();
        
        if(candidateName == "NSObject" || candidateName == subclassString) {
            isNSObjOrResponder = true;
            wasResponderChain = candidateName == subclassString;

            if (wasResponderChain) {
                
                var handleame = ObjC.api.class_getName(handle).readUtf8String();
                console.log("BRAD: " + candidateName + " " + handleame);
            }

            // Now I just return from here
            if (candidateName == subclassString) {
                return true;
            }
        } else {
            
            curList += [candidateName]
        }
    }

    // Or here:
    return false;
}

function getAllClassSubclassing(subclassString) {
    var cachedClasses = {};

    var numClasses = ObjC.api.objc_getClassList(NULL, 0);

    // It's impossible to unregister classes in ObjC, so if the number of
    // classes hasn't changed, we can assume that the list is up to date.
    var classHandles = Memory.alloc(numClasses * Process.pointerSize);
    numClasses = ObjC.api.objc_getClassList(classHandles, numClasses);
    for (var i = 0; i !== numClasses; i++) {
        var handle = classHandles.add(i * Process.pointerSize).readPointer();
        var name = ObjC.api.class_getName(handle).readUtf8String();
        
        var wasResponderChain = isClassASubclassOf(handle, subclassString);

        if (wasResponderChain) {
            // NOTE: I used to add the whole curList here but you would get duplicates then
            cachedClasses[name] = handle;
        }
    }

    return cachedClasses;
}


// var responderSubclasses = getAllClassSubclassing("NSResponder");
// console.log(Object.keys(responderSubclasses))
console.log("function getAllClassSubclassing(aClassNameString) to return an object with keys of string classnames and values of class handles");
console.log("There are optional arguments. First argument is a function which takes a string being the classname and returns true if it SHOULD NOT instrument that class.");
console.log("The second argument will execute in the MouseDown handler if it is a function. The only argument passed to it is the classname.");


function traceMouseDownEventsInAllClasses() {

    var responderSubclasses = getAllClassSubclassing("NSResponder");

    for (var className in responderSubclasses) {
        var fridaCurClass = ObjC.classes[className]

        if (arguments.length >= 1) {
            if (typeof arguments[0] === "function") {
                if (arguments[0](className)) {
                    continue;
                }
            } else {
                console.log("Incorrect first argument passed to traceMouseDownEventsInAllClasses. Expecting a function to that takes an argument of string type. Being the classname and return true or false determining if the class should NOT be instrumented.");
            }
        }

        console.log("Instrumenting mouseDown for class: " + className);
        function closureWrapper(classString, classHandle) {
            var mouseDownOriginal = fridaCurClass["- mouseDown:"];
            Interceptor.attach(mouseDownOriginal.implementation, {
                onEnter: function(args) {
                    // args[0] is self
                    // args[1] is selector (SEL "mouseDown:")
                    // args[2] holds the first function argument, an NSEvent *
                    if (arguments.length >= 2) {
                        if (typeof arguments[1] === "function") {
                            arguments[1](classString);
                        } else {
                            console.log("Incorrect second argument passed to traceMouseDownEventsInAllClasses. Expecting a function to run on the MouseDown event that takes one argument being classname.");
                        }
                    } else {
                        var event = ObjC.Object(args[2]);
                        console.log("\n" + classString + " mouseDown:@\"" + event.toString() + "\"] object self: " + args[0]);
                        // console.log(classHandle.$methods);
                        if (typeof classHandle.$ownMethods == "object" && classHandle.$ownMethods.length) {
                            console.log("Methods:");
                            console.log(classHandle.$ownMethods.join("\n"));
                        }
                        if (typeof classHandle.$ivars == "object" && classHandle.$ivars.length) {
                            console.log("IVars:");
                            console.log(classHandle.$ivars.join("\n"));
                        }
                    }
                }
            
            });
        }
        closureWrapper(className, fridaCurClass)
    }    
}

console.log("function traceMouseDownEventsInAllClasses() to trace all click events in NSResponders")



function traceMouseDownEventsJustThisModule(moduleNameString) {

    var responderSubclasses = getAllSubclassesInModuleOf(moduleNameString, "NSResponder");

    for (var className in responderSubclasses) {
        var fridaCurClass = ObjC.classes[className]
    
        function closureWrapper(classString, classHandle) {
            var mouseDownOriginal = fridaCurClass["- mouseDown:"];
            Interceptor.attach(mouseDownOriginal.implementation, {
                onEnter: function(args) {
                    // args[0] is self
                    // args[1] is selector (SEL "mouseDown:")
                    // args[2] holds the first function argument, an NSEvent *
                    var event = ObjC.Object(args[2]);
                    console.log("\n" + classString + " mouseDown:@\"" + event.toString() + "\"] object self: " + args[0]);
                    // console.log(classHandle.$methods);
                    if (typeof classHandle.$ownMethods == "object" && classHandle.$ownMethods.length) {
                        console.log("Methods:");
                        console.log(classHandle.$ownMethods.join("\n"));
                    }
                    if (typeof classHandle.$ivars == "object" && classHandle.$ivars.length) {
                        console.log("IVars:");
                        console.log(classHandle.$ivars.join("\n"));
                    }
                }
            
            });
        }
        closureWrapper(className, fridaCurClass)
    }    
}

console.log("function traceMouseDownEventsJustThisModule(moduleNameString) to trace all click events in NSResponders in just a specific module")
traceMouseDownEventsJustThisModule("Spotlight")



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

Array.prototype.OC = function() { return ObjC.classes.NSArray.alloc().initWithLong_(Array(this));  }
Number.prototype.OC = function() { return ObjC.classes.NSNumber.alloc().initWithLong_(Number(this));  }
String.prototype.OC = function () { return ObjC.classes.NSString.alloc().initWithString_(String(this));  }
String.prototype.contains = function (otherString) { return this.indexOf(otherString) === -1 ? false : true;  }

function S(s) { return ObjC.classes.NSString.alloc().initWithString_(s); }
var a = ObjC.classes.NSApplication.sharedApplication()
var kw = ObjC.classes.NSApplication.sharedApplication().keyWindow()  

console.log("Array Number and String all have .OC() functions appended to prototype to convert the Javascript counterpart to an ObjC object");
console.log("function S(string) will create an NSString from a js string")
console.log("var a is the shared application, and var kw is the key window");


function showAlert3(msg, subText) {
    ObjC.schedule(ObjC.mainQueue, function () {
    var alert = ObjC.classes.NSAlert.alertWithMessageText_defaultButton_alternateButton_otherButton_informativeTextWithFormat_(msg, "OK", "Cancel", "Other", subText);
    alert.runModal()
    })
}

// showAlert3("Hey cheesy line here.", "Keep doing stuff.")


function showAlert2(msg, subText) {
    ObjC.schedule(ObjC.mainQueue, function () {
        var alert = ObjC.classes.NSAlert.alloc();
        alert.init();
        alert.setMessageText_(msg);
        alert.setInformativeText_("subText");
        alert.addButtonWithTitle_("Cancel");
        alert.addButtonWithTitle_("Ok");
        alert.runModal();
    })
}


// showAlert2("Hey cheesy line here.", "Keep doing stuff.")



function showAlertText(msg, subText) {
    ObjC.schedule(ObjC.mainQueue, function () {
        var alert = ObjC.classes.NSAlert.alloc();
        alert.init();
        alert.setMessageText_(msg);
        alert.setInformativeText_("subText");
        alert.addButtonWithTitle_("Cancel");
        alert.addButtonWithTitle_("Ok");
        alert.runModal();
    })
}

console.log("function showAlertText(msg, subText) will show an NSAlert")
// showAlertText("Hey cheesy line here.", "Keep doing stuff.")

