libs.tools = {
    removeElementById: function(id) {
        return (elem = document.getElementById(id)).parentNode.removeChild(elem);
    },
    executeFunctionByName: function(functionName, context, args) {
        console.log(args);
        var namespaces = functionName.split(".");
        var func = namespaces.pop();
        for (var i = 0; i < namespaces.length; i++) {
            context = context[namespaces[i]];
        }
        if (args) {
            return context[func].apply(this, args);
        } else {
            return context[func];
        }
    }
};

// Array Remove - By John Resig (MIT Licensed)
Array.prototype.remove = function(from, to) {
    var rest = this.slice((to || from) + 1 || this.length);
    this.length = from < 0 ? this.length + from : from;
    return this.push.apply(this, rest);
};