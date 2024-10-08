function calculateResult() {
  let dev = 0,
    data = 0,
    sec = 0,
    gest = 0

  // Obter valores das respostas (mesmo processo descrito anteriormente)
  const q1 = document.querySelector('input[name="q1"]:checked')
  const q2 = document.querySelector('input[name="q2"]:checked')
  const q3 = document.querySelector('input[name="q3"]:checked')
  const q4 = document.querySelector('input[name="q4"]:checked')
  const q5 = document.querySelector('input[name="q5"]:checked')
  const q6 = document.querySelector('input[name="q6"]:checked')
  const q7 = document.querySelector('input[name="q7"]:checked')
  const q8 = document.querySelector('input[name="q8"]:checked')
  const q9 = document.querySelector('input[name="q9"]:checked')
  const q10 = document.querySelector('input[name="q10"]:checked')

  // Processa as respostas
  let answers = [q1, q2, q3, q4, q5, q6, q7, q8, q9, q10]

  answers.forEach(answer => {
    if (answer) {
      if (answer.value === 'dev') dev++
      else if (answer.value === 'data') data++
      else if (answer.value === 'sec') sec++
      else if (answer.value === 'gest') gest++
    }
  })

  // Gerar gráfico
  createChart(dev, data, sec, gest)
}

function createChart(dev, data, sec, gest) {
  const ctx = document.getElementById('myChart').getContext('2d')

  new Chart(ctx, {
    type: 'pie', // Você pode usar 'pie' para gráfico de pizza
    data: {
      labels: [
        'Desenvolvimento',
        'Análise de Dados',
        'Segurança da Informação',
        'Gestão de TI'
      ],
      datasets: [
        {
          label: 'Interesse por área',
          data: [dev, data, sec, gest],
          backgroundColor: ['#c1d04e', '#4e5b79', '#6e7ea6', '#f2e394'],
          borderColor: ['#c1d04e', '#4e5b79', '#6e7ea6', '#f2e394'],
          borderWidth: 1
        }
      ]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  })
  // Exibir resultado textual
  let resultText = ''
  if (dev > data && dev > sec && dev > gest) {
    resultText =
      'Você demostrou um grande interresse na area de Desenvolvimento de Software!'
  } else if (data > dev && data > sec && data > gest) {
    resultText =
      'Você demostrou um grande interresse na área de Análise de Dados!'
  } else if (sec > dev && sec > data && sec > gest) {
    resultText =
      'Você demostrou um grande interresse na área de Segurança da Informação!'
  } else if (gest > dev && gest > sec && gest > data) {
    resultText = 'Você demostrou um grande interresse na área de Gestao de TI!'
  } else {
    resultText = 'Você tem um vasto mundo para descobir sua area na TI.'
  }

  document.getElementById('result').textContent = resultText
}

function sim() {
  alert(
    'Que bom, ficaremos felizes em fazer parte da sua jornada para o sucesso!! :)'
  )
  // redireciona para um URL após clicar no SIM
  location.href = 'https://www.ages.edu.br/graduacao/'
}

function desvia(btn) {
  // btn declarado na função
  btn.style.position = 'absolute'
  btn.style.bottom = geraPosicao(10, 90)
  btn.style.left = geraPosicao(10, 90)
}

function geraPosicao(min, max) {
  return Math.random() * (max - min) + min + '%'
}
function mostrar() {
  const mostrar = document.querySelector('#mostrar')
  mostrar.style.visibility = 'visible'
}

import {
  GestureRecognizer,
  FilesetResolver,
  DrawingUtils
} from 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3'

const demosSection = document.getElementById('demos')
let gestureRecognizer: GestureRecognizer
let runningMode = 'IMAGE'
let enableWebcamButton: HTMLButtonElement
let webcamRunning: Boolean = false
const videoHeight = '360px'
const videoWidth = '480px'
const video = document.getElementById('webcam')
const canvasElement = document.getElementById('output_canvas')
const canvasCtx = canvasElement.getContext('2d')
const gestureOutput = document.getElementById('gesture_output')

// Check if webcam access is supported.
function hasGetUserMedia() {
  return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)
}

// If webcam supported, add event listener to button for when user
// wants to activate it.
if (hasGetUserMedia()) {
  enableWebcamButton = document.getElementById('webcamButton')
  enableWebcamButton.addEventListener('click', enableCam)
} else {
  console.warn('getUserMedia() is not supported by your browser')
}

// Enable the live webcam view and start detection.
function enableCam(event) {
  if (!gestureRecognizer) {
    alert('Please wait for gestureRecognizer to load')
    return
  }

  if (webcamRunning === true) {
    webcamRunning = false
    enableWebcamButton.innerText = 'ENABLE PREDICTIONS'
  } else {
    webcamRunning = true
    enableWebcamButton.innerText = 'DISABLE PREDICTIONS'
  }

  // getUsermedia parameters.
  const constraints = {
    video: true
  }

  // Activate the webcam stream.
  navigator.mediaDevices.getUserMedia(constraints).then(function (stream) {
    video.srcObject = stream
    video.addEventListener('loadeddata', predictWebcam)
  })
}

let lastVideoTime = -1
let results = undefined
async function predictWebcam() {
  const webcamElement = document.getElementById('webcam')
  // Now let's start detecting the stream.
  if (runningMode === 'IMAGE') {
    runningMode = 'VIDEO'
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
  webcamElement.style.height = videoHeight
  canvasElement.style.width = videoWidth
  webcamElement.style.width = videoWidth

  if (results.landmarks) {
    for (const landmarks of results.landmarks) {
      drawingUtils.drawConnectors(
        landmarks,
        GestureRecognizer.HAND_CONNECTIONS,
        {
          color: '#00FF00',
          lineWidth: 5
        }
      )
      drawingUtils.drawLandmarks(landmarks, {
        color: '#FF0000',
        lineWidth: 2
      })
    }
  }
  canvasCtx.restore()
  if (results.gestures.length > 0) {
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
  // Call this function again to keep predicting when the browser is ready.
  if (webcamRunning === true) {
    window.requestAnimationFrame(predictWebcam)
  }
}

