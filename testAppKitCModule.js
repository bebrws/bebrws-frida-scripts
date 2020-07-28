// Use dlopen if needed - And why that over load module?


var source = ['void hello(void) { NSAlert *alert = [NSAlert alertWithMessageText:@"Alert" defaultButton:@"Ok" alternateButton:@"Cancel" otherButton:nil informativeTextWithFormat:@"Alert pop up displayed"];',
'[alert runModal]; }'].join('\n')

var cm = new CModule(source);

console.log(JSON.stringify(cm));
var hello = new NativeFunction(cm.hello, 'void', []);
hello();
