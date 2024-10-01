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
