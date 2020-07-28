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

