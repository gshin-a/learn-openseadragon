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
    zoomPerScroll: 2, // 한 번 줌인 시 배율 x2

    // viewer navigator 설정
    showNavigator: true,
    navigatorPosition: "BOTTOM_RIGHT"
});

viewer.addHandler('canvas-click', function(event) {
    // The canvas-click event gives us a position in web coordinates.
    var webPoint = event.position;

    // Convert that to viewport coordinates, the lingua franca of OpenSeadragon coordinates.
    var viewportPoint = viewer.viewport.pointFromPixel(webPoint);

    // Convert from viewport coordinates to image coordinates.
    var imagePoint = viewer.viewport.viewportToImageCoordinates(viewportPoint);

    // Show the results.
    console.log(webPoint.toString(), viewportPoint.toString(), imagePoint.toString());
});

const detectZoom = (zoom) => {
    console.log('current zoom level: ', Math.round(zoom.zoom * 10) / 10)
}
  
viewer.addHandler('zoom', detectZoom)

const handlebtnclick = () => {
    console.log('button click')
    viewer.viewport.zoomTo(20);
}