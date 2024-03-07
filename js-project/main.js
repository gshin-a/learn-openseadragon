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

    // overlays: [{
    //     id: 'fixed-el-0', // Green overlay
    //     x: 0.059,
    //     y: 0.08
    // }]
});

let DOMArr = [];

const handleAddComment = (event) => {
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
}

function activateComment() {
    viewer.addHandler('canvas-click', handleAddComment);
}

function deactivateComment() {
    viewer.removeHandler('canvas-click', handleAddComment);
}


const detectZoom = (zoom) => {
    console.log('current zoom level: ', Math.round(zoom.zoom * 10) / 10);

}
  
viewer.addHandler('zoom', detectZoom)

const handlebtnclick = () => {
    console.log('button click')
    viewer.viewport.zoomTo(20);
}