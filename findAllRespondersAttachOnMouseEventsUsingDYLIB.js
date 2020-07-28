Array.prototype.OC = function() { return ObjC.classes.NSArray.alloc().initWithLong_(Array(this));  }
Number.prototype.OC = function() { return ObjC.classes.NSNumber.alloc().initWithLong_(Number(this));  }
String.prototype.OC = function () { return ObjC.classes.NSString.alloc().initWithString_(String(this));  }

function S(s) { return ObjC.classes.NSString.alloc().initWithString_(s); }

var kw = ObjC.classes.NSApplication.sharedApplication().keyWindow()  



// var mouseDownOriginal = ObjC.classes.TTView["- mouseDown:"];

// Interceptor.attach(mouseDownOriginal.implementation, {
//     onEnter: function(args) {
//     // args[0] is self
//     // args[1] is selector (SEL "mouseDown:")
//     // args[2] holds the first function argument, an NSEvent *
//     var event = ObjC.Object(args[2]);
//     console.log("\n[NSView mouseDown:@\"" + event.toString() + "\"] object self: " + args[0]);}
// });


// Module.load('getAllResponderClasses.dylib')
// var m = Module.load('/Users/bbarrows/notes/getAllResponderClasses.dylib')
// var getResponderSubclasses = new NativeFunction(m.findExportByName('getResponderSubclasses'), 'NSArray', []);
// getResponderSubclasses();

var m = Module.load('/Users/bbarrows/notes/getAllResponderClasses.dylib')
var getResponderSubclasses = new NativeFunction(m.findExportByName('getResponderSubclasses'), "pointer", []);
var allRespCsPointer= getResponderSubclasses()
var anobj = new ObjC.Object(ptr(allRespCsPointer)).toString()

var allClassesList = new ObjC.Object(ptr(allRespCsPointer));
// console.log(allClassesList.toString())
var totalClassCount = Number(allClassesList.count())
for (var i=0; i<totalClassCount; i++) {
    var curClass = allClassesList.objectAtIndex_(i);
    var curClassString = curClass.toString()
    var fridaCurClass = ObjC.classes[curClassString]

    var mouseDownOriginal = fridaCurClass["- mouseDown:"];
    Interceptor.attach(mouseDownOriginal.implementation, {
        onEnter: function(args) {
        // args[0] is self
        // args[1] is selector (SEL "mouseDown:")
        // args[2] holds the first function argument, an NSEvent *
        var event = ObjC.Object(args[2]);
        console.log("\n[NSView mouseDown:@\"" + event.toString() + "\"] object self: " + args[0]);
        // TODO: ? Call mouseDownOriginal here with event? and other 2 args? 
    }
        
    });
}


// [nsobj isKindOfClass:ObjC.classes.NSArray] == true // #include <objc/NSObject.h>

// Find all of a type allocated:
// const strings = [];
// ObjC.choose(ObjC.classes.NSString, {
//   onMatch: function (str) {
//     strings.push(str);
//   },
//   onComplete: function () {
//     console.log('Found ' + strings.length + ' strings!');
//   }
// });




// ONE WAY TO DO THIS
// Iterate over ALL classes
// For each class:
//      Go all the way up the superClass linkage.
//      If you hit a NSResponder you should set the mouseDown function
//
//      Now we can select ALL selectable objects!
//
// [Local::PID::6232]-> String(ObjC.classes.TTView.$superClass)
// "TTAccessibleView"
// [Local::PID::6232]-> String(ObjC.classes.TTView.$superClass.$superClass)
// "NSView"
// [Local::PID::6232]-> String(ObjC.classes.TTView.$superClass.$superClass.$superClass)
// "NSResponder"
// [Local::PID::6232]-> String(ObjC.classes.TTView.$superClass.$superClass.$superClass.$superClass)
//