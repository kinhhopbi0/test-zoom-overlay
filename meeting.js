window.addEventListener('DOMContentLoaded', function(event) {
    getSignature();
});
ZoomMtg.setZoomJSLib('https://source.zoom.us/2.13.0/lib', '/av')

ZoomMtg.preLoadWasm()
ZoomMtg.prepareWebSDK()
// loads language files, also passes any error messages to the ui
ZoomMtg.i18n.load('en-US')
ZoomMtg.i18n.reload('en-US')

var authEndpoint = ''
var sdkKey = 'BJvHvXAETNelXgCaqayrRg'
var meetingNumber = ''
var passWord = ''
var role = 0
var userName = 'JavaScript'
var userEmail = ''
var registrantToken = ''
var zakToken = ''
var leaveUrl = 'https://zoom.us';
const clientId = "BJvHvXAETNelXgCaqayrRg";
const clientSecret = "u9TMk31Y17NgVM9P5KpDvVYX5IWUIh1z";
function getSignature() {
    const params = new Proxy(new URLSearchParams(window.location.search), {
        get: (searchParams, prop) => searchParams.get(prop),
    });
    meetingNumber = params.meetingNumber
    passWord = params.pass
    console.log(params);
    if (testTool.isMobileDevice()) {
        vConsole = new VConsole();
    }
    let signature = generateSignature(clientId, clientSecret, meetingNumber, role)
    startMeeting(signature)
}
function generateSignature(key, secret, meetingNumber, role) {
    // const KJUR = require('jsrsasign')
    const iat = Math.round(new Date().getTime() / 1000) - 30
    const exp = iat + 60 * 60 * 2
    const oHeader = { alg: 'HS256', typ: 'JWT' }

    const oPayload = {
        sdkKey: key,
        appKey: key,
        mn: meetingNumber,
        role: role,
        iat: iat,
        exp: exp,
        tokenExp: exp
    }

    const sHeader = JSON.stringify(oHeader)
    const sPayload = JSON.stringify(oPayload)
    const sdkJWT = KJUR.jws.JWS.sign('HS256', sHeader, sPayload, secret)
    return sdkJWT
}
function startMeeting(signature) {
    ZoomMtg.init({
        leaveUrl: leaveUrl,
        success: (success) => {
            console.log(success)
            console.log(meetingNumber)
            ZoomMtg.join({
                signature: signature,
                sdkKey: sdkKey,
                meetingNumber: meetingNumber,
                passWord: passWord,
                userName: userName,
                userEmail: userEmail,
                // tk: registrantToken,
                // zak: zakToken,
                success: (success) => {
                    console.log(success)
                    document.getElementById('custom-area').style.display = 'inline-block';
                },
                error: (error) => {
                    console.log(error)
                },
            })
        },
        error: (error) => {
            console.log(error)
        }
    })
}
