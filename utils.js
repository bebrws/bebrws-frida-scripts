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
