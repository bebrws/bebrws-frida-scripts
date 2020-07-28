Array.prototype.OC = function() { return ObjC.classes.NSArray.alloc().initWithLong_(Array(this));  }
Number.prototype.OC = function() { return ObjC.classes.NSNumber.alloc().initWithLong_(Number(this));  }
String.prototype.OC = function () { return ObjC.classes.NSString.alloc().initWithString_(String(this));  }

function S(s) { return ObjC.classes.NSString.alloc().initWithString_(s); }

var kw = ObjC.classes.NSApplication.sharedApplication().keyWindow()  
// var f = kw.initialFirstResponder()    



var mouseDownOriginal = ObjC.classes.NSView["- mouseDown:"];

    Interceptor.attach(mouseDownOriginal.implementation, {
        onEnter: function(args) {
        // args[0] is self
        // args[1] is selector (SEL "mouseDown:")
        // args[2] holds the first function argument, an NSEvent *
        var event = ObjC.Object(args[2]);
        console.log("\n[NSView mouseDown:@\"" + event.toString() + "\"]");}
    });