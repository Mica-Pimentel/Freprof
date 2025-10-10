import {
  GestureRecognizer,
  FilesetResolver,
  DrawingUtils
} from 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3'

let gestureRecognizer: GestureRecognizer
let runningMode = 'VIDEO'
let enableWebcamButton = document.getElementById('webcamButton') as HTMLButtonElement
let webcamRunning = false
const videoHeight = '360px'
const videoWidth = '480px'
const video = document.getElementById('webcam') as HTMLVideoElement
const canvasElement = document.getElementById('output_canvas') as HTMLCanvasElement
const canvasCtx = canvasElement.getContext('2d')
const gestureOutput = document.getElementById('gesture_output') as HTMLParagraphElement

// Carregar o modelo do GestureRecognizer
async function loadGestureRecognizer() {
  const vision = await FilesetResolver.forVisionTasks(
    'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm'
  )
  gestureRecognizer = await GestureRecognizer.createFromOptions(vision, {
    runningMode: 'VIDEO'
  })
}
loadGestureRecognizer()

function hasGetUserMedia() {
  return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)
}

if (hasGetUserMedia() && enableWebcamButton) {
  enableWebcamButton.addEventListener('click', enableCam)
} else {
  console.warn('getUserMedia() is not supported by your browser')
}

function enableCam(event: Event) {
  if (!gestureRecognizer) {
    alert('Please wait for gestureRecognizer to load')
    return
  }

  webcamRunning = !webcamRunning
  enableWebcamButton.innerText = webcamRunning ? 'DISABLE PREDICTIONS' : 'ENABLE PREDICTIONS'

  const constraints = { video: true }
  navigator.mediaDevices.getUserMedia(constraints).then(function (stream) {
    video.srcObject = stream
    video.addEventListener('loadeddata', predictWebcam)
  })
}

let lastVideoTime = -1
let results: any = undefined
async function predictWebcam() {
  if (!gestureRecognizer) return
  if (gestureRecognizer.getOptions().runningMode !== 'VIDEO') {
    await gestureRecognizer.setOptions({ runningMode: 'VIDEO' })
  }
  let nowInMs = Date.now()
  if (video.currentTime !== lastVideoTime) {
    lastVideoTime = video.currentTime
    results = gestureRecognizer.recognizeForVideo(video, nowInMs)
  }

  canvasCtx.save()
  canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height)
  const drawingUtils = new DrawingUtils(canvasCtx)

  canvasElement.style.height = videoHeight
  video.style.height = videoHeight
  canvasElement.style.width = videoWidth
  video.style.width = videoWidth

  if (results?.landmarks) {
    for (const landmarks of results.landmarks) {
      drawingUtils.drawConnectors(
        landmarks,
        GestureRecognizer.HAND_CONNECTIONS,
        { color: '#00FF00', lineWidth: 5 }
      )
      drawingUtils.drawLandmarks(landmarks, { color: '#FF0000', lineWidth: 2 })
    }
  }
  canvasCtx.restore()
  if (results?.gestures && results.gestures.length > 0) {
    gestureOutput.style.display = 'block'
    gestureOutput.style.width = videoWidth
    const categoryName = results.gestures[0][0].categoryName
    const categoryScore = parseFloat(
      results.gestures[0][0].score * 100
    ).toFixed(2)
    const handedness = results.handednesses[0][0].displayName
    gestureOutput.innerText = `GestureRecognizer: ${categoryName}\n Confidence: ${categoryScore} %\n Handedness: ${handedness}`
  } else {
    gestureOutput.style.display = 'none'
  }
  if (webcamRunning === true) {
    window.requestAnimationFrame(predictWebcam)
  }
}