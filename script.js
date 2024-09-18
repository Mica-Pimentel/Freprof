function calculateResult() {
  let dev = 0,
    data = 0,
    sec = 0

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
    }
  })

  // Gerar gráfico
  createChart(dev, data, sec)
}

function createChart(dev, data, sec) {
  const ctx = document.getElementById('myChart').getContext('2d')

  new Chart(ctx, {
    type: 'pie', // Você pode usar 'pie' para gráfico de pizza
    data: {
      labels: [
        'Desenvolvimento',
        'Análise de Dados',
        'Segurança da Informação'
      ],
      datasets: [
        {
          label: 'Interesse por área',
          data: [dev, data, sec],
          backgroundColor: ['#c1d04e', '#98A77A', ' #6e7ea6'],
          borderColor: ['##c1d04e', '#98A77A', '#6e7ea6'],
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
  if (dev > data && dev > sec) {
    resultText =
      'Você demostrou um grande interresse na area de Desenvolvimento de Software!'
  } else if (data > dev && data > sec) {
    resultText =
      'Você demostrou um grande interresse na área de Análise de Dados!'
  } else if (sec > dev && sec > data) {
    resultText =
      'Você demostrou um grande interresse na área de Segurança da Informação!'
  } else {
    resultText = 'Você tem um vasto mundo para descobir sua area na TI.'
  }

  document.getElementById('result').textContent = resultText
}
