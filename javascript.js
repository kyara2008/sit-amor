// Nova lógica: primeira visita é admin (pode editar), visitas subsequentes são visitantes (apenas visualização)

const IS_FIRST_VISIT_KEY = "anniversary_first_visit"
let isAdmin = false

document.addEventListener("DOMContentLoaded", () => {
  checkIfAdmin()
})

function checkIfAdmin() {
  // Se não tem marca de primeira visita, é a primeira vez
  if (!localStorage.getItem(IS_FIRST_VISIT_KEY)) {
    localStorage.setItem(IS_FIRST_VISIT_KEY, "false")
    isAdmin = true
    document.getElementById("adminIndicator").style.display = "block"
  } else {
    isAdmin = false
  }

  loadData()
  updateCounter()
  setInterval(updateCounter, 1000)

  createParticleEffect()
  setInterval(createParticleEffect, 3000)

  // Desabilitar inputs se não for admin
  if (!isAdmin) {
    disableAllInputs()
  }
}

function disableAllInputs() {
  document.getElementById("photoDisplay").style.cursor = "default"
  document.getElementById("photoInput").disabled = true
  document.getElementById("dateInput").disabled = true
  document.getElementById("saveBtn").disabled = true
  document.getElementById("messageInput").disabled = true
  document.getElementById("saveMessageBtn").disabled = true
  document.getElementById("musicInput").disabled = true

  // Remover eventos de clique da foto
  document.getElementById("photoDisplay").removeEventListener("click", photoDisplayClickHandler)

  // Alterar aparência dos botões desabilitados
  document.querySelectorAll(".btn").forEach((btn) => {
    btn.style.opacity = "0.5"
    btn.style.cursor = "not-allowed"
  })

  // Mostrar mensagem de visualização apenas
  const inputs = document.querySelectorAll("input, textarea, .btn, .music-label")
  inputs.forEach((input) => {
    input.title = "Apenas o criador pode editar"
  })
}

function createParticleEffect() {
  const numberOfHearts = 5
  const numberOfGlitters = 40

  for (let i = 0; i < numberOfHearts; i++) {
    createHeart()
  }

  for (let i = 0; i < numberOfGlitters; i++) {
    createGlitter()
  }
}

function createHeart() {
  const heart = document.createElement("div")
  heart.className = "heart-particle"

  const hearts = ["❤️", "💕", "💖"]
  heart.textContent = hearts[Math.floor(Math.random() * hearts.length)]

  /* Distribuindo corações em toda a tela, longe do conteúdo central */
  const randomX = Math.random() * window.innerWidth
  const randomY = Math.random() * window.innerHeight
  const randomDuration = Math.random() * 3 + 2

  heart.style.left = randomX + "px"
  heart.style.top = randomY + "px"
  heart.style.animationDuration = randomDuration + "s"

  document.body.appendChild(heart)

  setTimeout(
    () => {
      heart.remove()
    },
    randomDuration * 1000 + 500,
  )
}

function createGlitter() {
  const glitter = document.createElement("div")
  glitter.className = "glitter-particle"

  const size = Math.random() * 8 + 4
  const randomX = Math.random() * window.innerWidth
  const duration = Math.random() * 3 + 5

  glitter.style.width = size + "px"
  glitter.style.height = size + "px"
  glitter.style.left = randomX + "px"
  glitter.style.top = "-50px"
  glitter.style.animationDuration = duration + "s"
  /* Adicionando opacidade variada para mais realismo */
  glitter.style.opacity = Math.random() * 0.7 + 0.3

  document.body.appendChild(glitter)

  setTimeout(
    () => {
      glitter.remove()
    },
    duration * 1000 + 500,
  )
}

const photoInput = document.getElementById("photoInput")
const photoDisplay = document.getElementById("photoDisplay")
const dateInput = document.getElementById("dateInput")
const saveBtn = document.getElementById("saveBtn")
const daysEl = document.getElementById("days")
const hoursEl = document.getElementById("hours")
const minutesEl = document.getElementById("minutes")
const secondsEl = document.getElementById("seconds")
const messageInput = document.getElementById("messageInput")
const saveMessageBtn = document.getElementById("saveMessageBtn")
const messageDisplay = document.getElementById("messageDisplay")
const musicInput = document.getElementById("musicInput")
const musicPlayer = document.getElementById("musicPlayer")
// Removed referência ao resetBtn

// Photo Upload Handler
function photoDisplayClickHandler() {
  if (!isAdmin) {
    return
  }
  photoInput.click()
}

photoDisplay.addEventListener("click", photoDisplayClickHandler)

photoInput.addEventListener("change", (e) => {
  if (!isAdmin) {
    alert("Apenas o criador pode editar!")
    return
  }
  const file = e.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (event) => {
      const imageData = event.target.result
      localStorage.setItem(STORAGE_KEYS.photo, imageData)
      displayPhoto(imageData)
    }
    reader.readAsDataURL(file)
  }
})

function displayPhoto(imageData) {
  photoDisplay.innerHTML = `<img src="${imageData}" alt="Foto do casal">`
}

// Date Handler
saveBtn.addEventListener("click", () => {
  if (!isAdmin) {
    alert("Apenas o criador pode editar!")
    return
  }
  const selectedDate = dateInput.value
  if (selectedDate) {
    localStorage.setItem(STORAGE_KEYS.date, selectedDate)
    showFeedback(saveBtn, "Data salva com sucesso! ❤️", "success")
  } else {
    showFeedback(saveBtn, "Selecione uma data!", "error")
  }
})

// Counter Update Function - Runs every second for real-time updates
function updateCounter() {
  const storedDate = localStorage.getItem(STORAGE_KEYS.date)

  if (!storedDate) {
    daysEl.textContent = "0"
    hoursEl.textContent = "0"
    minutesEl.textContent = "0"
    secondsEl.textContent = "0"
    return
  }

  const startDate = new Date(storedDate)
  const now = new Date()
  const diff = now - startDate

  if (diff < 0) {
    daysEl.textContent = "0"
    hoursEl.textContent = "0"
    minutesEl.textContent = "0"
    secondsEl.textContent = "0"
    return
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((diff % (1000 * 60)) / 1000)

  daysEl.textContent = days
  hoursEl.textContent = hours
  minutesEl.textContent = minutes
  secondsEl.textContent = seconds
}

// Message Handler
saveMessageBtn.addEventListener("click", () => {
  if (!isAdmin) {
    alert("Apenas o criador pode editar!")
    return
  }
  const message = messageInput.value.trim()
  if (message) {
    localStorage.setItem(STORAGE_KEYS.message, message)
    messageDisplay.textContent = message
    messageDisplay.classList.add("active")
    showFeedback(saveMessageBtn, "Mensagem guardada! 💕", "success")
  } else {
    showFeedback(saveMessageBtn, "Escreva uma mensagem!", "error")
  }
})

// Music Handler
musicInput.addEventListener("change", (e) => {
  if (!isAdmin) {
    alert("Apenas o criador pode editar!")
    return
  }
  const file = e.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (event) => {
      const musicData = {
        name: file.name,
        data: event.target.result,
      }
      addMusicPlayer(musicData)
    }
    reader.readAsDataURL(file)
  }
})

function addMusicPlayer(musicData) {
  const musicItem = document.createElement("div")
  musicItem.className = "music-item"
  musicItem.innerHTML = `
        <audio controls>
            <source src="${musicData.data}" type="audio/mpeg">
            Seu navegador não suporta reprodução de áudio.
        </audio>
        <button class="remove-music-btn" ${!isAdmin ? "disabled" : ""}>Remover</button>
    `

  const removeBtn = musicItem.querySelector(".remove-music-btn")
  removeBtn.addEventListener("click", () => {
    if (!isAdmin) {
      alert("Apenas o criador pode editar!")
      return
    }
    musicItem.remove()
  })

  musicPlayer.appendChild(musicItem)
}

// Load Data from Local Storage
function loadData() {
  const savedPhoto = localStorage.getItem(STORAGE_KEYS.photo)
  if (savedPhoto) {
    displayPhoto(savedPhoto)
  }

  const savedDate = localStorage.getItem(STORAGE_KEYS.date)
  if (savedDate) {
    dateInput.value = savedDate
  }

  const savedMessage = localStorage.getItem(STORAGE_KEYS.message)
  if (savedMessage) {
    messageInput.value = savedMessage
    messageDisplay.textContent = savedMessage
    messageDisplay.classList.add("active")
  }
}

// Feedback Function
function showFeedback(element, message, type) {
  const originalContent = element.textContent
  const originalClass = element.className

  element.textContent = message
  element.classList.add(`btn-${type}`)

  setTimeout(() => {
    element.textContent = originalContent
    element.className = originalClass
  }, 2000)
}

// Local Storage Keys
const STORAGE_KEYS = {
  photo: "anniversary_photo",
  date: "anniversary_date",
  message: "anniversary_message",
}
