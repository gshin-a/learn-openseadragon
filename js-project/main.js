const tileSources = [
    "dzi/testfiles.dzi"
];

const viewer = OpenSeadragon({
    id: "seadragon-viewer",
    prefixUrl: "openseadragon/images/",
    tileSources,

    // zoom 설정
    minZoomLevel: 0.5, // 최소 배율 0.5
    maxZoomLevel: 32, // 최대 배율 20
    gestureSettingsMouse: {
        clickToZoom: false // click할 때 zoom-in 되는 기능 false
    },

    // viewer navigator 설정
    showNavigator: true,
    navigatorPosition: "BOTTOM_RIGHT",

});

let DOMArr = [];

let commentMode = false;
let selectionMode = false;
let drag = null;

new OpenSeadragon.MouseTracker({
    element: viewer.element,
    pressHandler: function(event) {
        if(commentMode){
            // The canvas-click event gives us a position in web coordinates.
            var webPoint = event.position;
                
            // Convert that to viewport coordinates, the lingua franca of OpenSeadragon coordinates.
            var viewportPoint = viewer.viewport.pointFromPixel(webPoint);

            // Convert from viewport coordinates to image coordinates.
            var imagePoint = viewer.viewport.viewportToImageCoordinates(viewportPoint);

            console.log(viewportPoint, viewportPoint.toString(),imagePoint,  imagePoint.toString())

            const fixedElDOM = document.createElement("div");
            fixedElDOM.id = `fixed-el-${DOMArr.length}`;
            fixedElDOM.className = 'fixed-el';
            DOMArr.push(fixedElDOM.id);
            console.log('DOMArr',DOMArr, fixedElDOM);
            viewer.addOverlay({
                element: fixedElDOM,
                location: new OpenSeadragon.Point(viewportPoint.x, viewportPoint.y)
            })
        }else if(selectionMode){
            var overlayElement = document.createElement('div');
            overlayElement.style.background = 'red';
            overlayElement.className = "ruler"
            var viewportPos = viewer.viewport.pointFromPixel(event.position);
            viewer.addOverlay(overlayElement, new OpenSeadragon.Rect(viewportPos.x, viewportPos.y, 0, 0));
            
            drag = {
              overlayElement: overlayElement, 
              startPos: viewportPos
            };
        }        
    },
    dragHandler: function(event) {
        if (!drag) {
          return;
        }
        
        var viewportPos = viewer.viewport.pointFromPixel(event.position);
        var diffX = viewportPos.x - drag.startPos.x;
        var diffY = viewportPos.y - drag.startPos.y;

        const radian = Math.atan2(Math.abs(diffY), Math.abs(diffX));
        const degree = radian * 180 / Math.PI;

        console.log(radian, degree)
        
        var location = new OpenSeadragon.Rect(
            Math.min(drag.startPos.x, drag.startPos.x + diffX), 
            Math.min(drag.startPos.y, drag.startPos.y + diffY), 
            Math.abs(diffX), 
            Math.abs(diffY)
        );
        
        viewer.updateOverlay(drag.overlayElement, location);
    },
        releaseHandler: function() {      
        if(drag) drag = null;
        //   selectionMode = false;
        //   viewer.setMouseNavEnabled(true);
    }
})

function activateComment() {
    commentMode = true;
    viewer.setMouseNavEnabled(false);
}

function deactivateComment() {
    commentMode = false;
    viewer.setMouseNavEnabled(true);
}


const detectZoom = (zoom) => {
    console.log('current zoom level: ', Math.round(zoom.zoom * 10) / 10);

}
  
viewer.addHandler('zoom', detectZoom)

const zoomTo20Level = () => {
    viewer.viewport.zoomTo(20);
}

function activateRuler () {
    selectionMode = true;
    viewer.setMouseNavEnabled(false);
}

function deactivateRuler () {
    selectionMode = false;
    viewer.setMouseNavEnabled(true);
}