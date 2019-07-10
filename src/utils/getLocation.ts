export const getLocation = () => {
    var map = new AMap.Map('', {
        resizeEnable: true
    });
    return new Promise((resolve, reject) => {
        AMap.plugin('AMap.Geolocation', function () {
            var geolocation = new AMap.Geolocation({
                enableHighAccuracy: true,
                timeout: 1000,          
                buttonPosition: 'RB',    
                buttonOffset: new AMap.Pixel(10, 20),
                zoomToAccuracy: true,   
            });
            map.addControl(geolocation);
            geolocation.getCurrentPosition(function (status, result) {
                if (status == 'complete') {
                    resolve({
                        lat : result.position.lat,
                        lng : result.position.lng
                    })
                } else {
                    reject({
                        msg : result.message
                    })
                }
            });
        });
    })
}