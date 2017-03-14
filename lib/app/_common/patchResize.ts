export function patchResize(element, resizeCallback) {
    element.onmouseover = resizableStart;

    function resizableStart(e) {
        this.originalW = this.clientWidth;
        // this.originalH = this.clientHeight;
        this.onmousemove = resizableCheck;
        this.onmouseup = this.onmouseout = resizableEnd;
    }
    function resizableCheck(e) {
        if (this.clientWidth !== this.originalW /*|| this.clientHeight !== this.originalH*/) {
            this.originalX = e.clientX;
            //this.originalY = e.clientY;
            this.onmousemove = resizableMove;
        }
    }
    function resizableMove(e) {
        var newW = this.originalW + e.clientX - this.originalX;
        //newH = this.originalH + e.clientY - this.originalY;
        if (newW < this.originalW) {
            this.style.width = newW + 'px';
        }
        // if (newH < this.originalH) {
        //     this.style.height = newH + 'px';
        // }
        resizeCallback && resizeCallback({ w: newW });
    }
    function resizableEnd() {
        this.onmousemove = this.onmouseout = this.onmouseup = null;
    }

}
