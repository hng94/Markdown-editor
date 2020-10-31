"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function resizeElement(element, direction) {
    var separator; // remember mouse down info
    var left = document.getElementById("markdown");
    var right = document.getElementById("html");
    element.onmousedown = onMouseDown;
    function onMouseDown(event) {
        separator = {
            event: event,
            offsetLeft: element.offsetLeft,
            offsetTop: element.offsetTop,
            firstWidth: left.offsetWidth,
            secondWidth: right.offsetWidth
        };
        document.onmousemove = onMouseMove;
        document.onmouseup = function () {
            document.onmousemove = document.onmouseup = null;
        };
    }
    function onMouseMove(event) {
        var delta = { x: event.clientX - separator.event.clientX,
            y: event.clientY - separator.event.clientY };
        if (direction === "H") // Horizontal
         {
            // Prevent negative-sized elements
            delta.x = Math.min(Math.max(delta.x, -separator.firstWidth), separator.secondWidth);
            element.style.left = separator.offsetLeft + delta.x + "px";
            left.style.width = (separator.firstWidth + delta.x) + "px";
            right.style.width = (separator.secondWidth - delta.x) + "px";
        }
    }
}
exports.default = resizeElement;
