Array.prototype.OC = function() { return ObjC.classes.NSArray.alloc().initWithLong_(Array(this));  }
Number.prototype.OC = function() { return ObjC.classes.NSNumber.alloc().initWithLong_(Number(this));  }
String.prototype.OC = function () { return ObjC.classes.NSString.alloc().initWithString_(String(this));  }

function S(s) { return ObjC.classes.NSString.alloc().initWithString_(s); }

var kw = ObjC.classes.NSApplication.sharedApplication().keyWindow()  
var f = kw.initialFirstResponder()    
for (i in kw) {
    try {
        if (!kw.includes("_") && !kw.includes(":")) {
            console.log(String(i) + " - " + typeof kw[i])
        } else {
            consoel.log("args\n")
        }
    } catch (e) {}
}
