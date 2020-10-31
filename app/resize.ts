export type Pivot = {
    event : MouseEvent,
    offsetLeft: number,
    offsetTop: number,
    firstWidth: number,
    secondWidth: number
}
export default function resizeElement(element: HTMLElement, direction: string)
{
    let   separator: Pivot; // remember mouse down info
    const left: HTMLElement  = document.getElementById("markdown");
    const right: HTMLElement = document.getElementById("html");

    element.onmousedown = onMouseDown;

    function onMouseDown(event: MouseEvent)
    {
        separator = {
            event,
            offsetLeft:  element.offsetLeft,
            offsetTop:   element.offsetTop,
            firstWidth:  left.offsetWidth,
            secondWidth: right.offsetWidth
        };

        document.onmousemove = onMouseMove;
        document.onmouseup = () => {
            document.onmousemove = document.onmouseup = null;
        }
    }

    function onMouseMove(event: MouseEvent)
    {
        var delta = {x: event.clientX - separator.event.clientX,
                     y: event.clientY - separator.event.clientY};

        if (direction === "H" ) // Horizontal
        {
            // Prevent negative-sized elements
            delta.x = Math.min(Math.max(delta.x, -separator.firstWidth),
                       separator.secondWidth);

            element.style.left = separator.offsetLeft + delta.x + "px";
            left.style.width = (separator.firstWidth + delta.x) + "px";
            right.style.width = (separator.secondWidth - delta.x) + "px";
        }
    }
}