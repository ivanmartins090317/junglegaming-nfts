const progressBar = document.getElementById('scroll-progress')
const copyStatus = document.getElementById('copy-status')
const questProgress = document.getElementById('quest-progress')
const questBoxes = Array.from(document.querySelectorAll('[data-quest]'))

function updateScrollProgress() {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight
  const ratio = scrollable > 0 ? Math.min(window.scrollY / scrollable, 1) : 0
  progressBar.style.transform = `scaleX(${ratio})`
}

function updateQuestProgress() {
  const done = questBoxes.filter((box) => box.checked).length
  questProgress.textContent = `Progresso ${done} / ${questBoxes.length}`
}

function copyWithSelection(value) {
  const field = document.createElement('textarea')
  field.value = value
  field.setAttribute('readonly', '')
  field.style.position = 'fixed'
  field.style.opacity = '0'
  document.body.appendChild(field)
  field.select()
  const copied = document.execCommand('copy')
  field.remove()
  return copied
}

async function copyText(value) {
  try {
    await navigator.clipboard.writeText(value)
    return true
  } catch {
    return copyWithSelection(value)
  }
}

async function handleCopyClick(event) {
  const button = event.target.closest('[data-copy]')
  if (!button) return
  const copied = await copyText(button.dataset.copy)
  copyStatus.textContent = copied
    ? `Copiado: ${button.dataset.copy}`
    : 'Não foi possível copiar. Selecione o texto e copie manualmente.'
}

window.addEventListener('scroll', updateScrollProgress, { passive: true })
window.addEventListener('resize', updateScrollProgress)
document.addEventListener('click', handleCopyClick)
questBoxes.forEach((box) => box.addEventListener('change', updateQuestProgress))

updateScrollProgress()
updateQuestProgress()
