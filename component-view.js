const client = ZoomMtgEmbedded.createClient()

let meetingSDKElement = document.getElementById('meetingSDKElement')

var authEndpoint = 'http://localhost:4000/'
var sdkKey = 'BJvHvXAETNelXgCaqayrRg'
var meetingNumber = document.getElementsByName("meeting_id")[0].value;
var passWord = document.getElementsByName("passcode")[0].value;
var overLayContainer = document.querySelector(".zoom-overlay");
overLayContainer.style.display = "none";

var role = 0
var userName = 'Test client'
var userEmail = ''
var registrantToken = ''
var zakToken = ''
let height = screen.height;
let width = screen.width;

client.init({
  zoomAppRoot: meetingSDKElement,
  language: 'en-US',
  customize: {
    video: {
      popper: {
        disableDraggable: true
      },
      viewSizes: {
        default: {
          width: width * 0.8,
          height: height * 0.7
        },
        // ribbon: {
        //   width: 300,
        //   height: 200
        // }
      }
    }
    
  }
})


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

function getSignature() {
  meetingNumber = document.getElementsByName("meeting_id")[0].value.replaceAll(" ", "");
  console.log("number meeting ", meetingNumber);
  passWord = document.getElementsByName("passcode")[0].value;
  if (!meetingNumber || !passWord) {
    alert("please input")
    return;
  }

  const clientId = "BJvHvXAETNelXgCaqayrRg";
  const clientSecret = "u9TMk31Y17NgVM9P5KpDvVYX5IWUIh1z"
  const signature = generateSignature(clientId, clientSecret, meetingNumber, role);
  startMeeting(signature)
  // fetch(authEndpoint, {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json'
  //   },
  //   body: JSON.stringify({
  //     meetingNumber: meetingNumber,
  //     role: role
  //   })
  // }).then((response) => {
  //   return response.json()
  // }).then((data) => {
  //   console.log(data)
  //   startMeeting(data.signature)
  // }).catch((error) => {
  // 	console.log(error)
  // })
}

function startMeeting(signature) {
  overLayContainer.style.display = "block";
  client.join({
    signature: signature,
    sdkKey: sdkKey,
    meetingNumber: meetingNumber,
    password: passWord,
    userName: userName,
    // userEmail: userEmail,
    // tk: registrantToken,
    // zak: zakToken
  })
}
