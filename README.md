Some helpful scripts for themeing or modding OSX

If you want to figure out what Class/View you need to hook then you could use traceMouseDownEventsJustThisModule("Terminal")

In that example I was running frida against terminal with:

frida -l all.js Terminal

That JS Function will hook the mouseDown on all NSResponder subclasses defined in the Terminal module making it easy to find classes to hook.

If your missing a mouse down even then go nuts with:

traceMouseDownEventsInAllClasses()

It may crash on some mouseDown events for Titlebar or Tab bar though.

I am working on a dylib that might help with this

There are also random functions in there for things like showing alerts.

The all.js file is a "compiled" file for all the "important" js files in this repo and it will console.log out a description of them on load.
