var table, canvas, ctx, cw, ch

const notes = []
const margin = [20, 60]
const startPosition = 40
const spacing = 25
const lineHeight = 12
const rhythms = {
	1: ['𝅗', '𝄻'],
	2: ['𝅗𝅥', '𝄼'],
	3: ['𝅘𝅥', '𝄽'],
	4: ['𝅘𝅥𝅮', '𝄾'],
	5: ['𝅘𝅥𝅯', '𝄿'],
	6: ['𝅘𝅥𝅰', '𝅀'],
	7: ['𝅘𝅥𝅱', '𝅁']
}
const clefs = {
	'g': {
		'4': 36
	}
}
const pixelRatio = () => {
	let dpr = window.devicePixelRatio || 1
	let bsr = ctx.webkitBackingStorePixelRatio || ctx.mozBackingStorePixelRatio || ctx.msBackingStorePixelRatio || ctx.oBackingStorePixelRatio || ctx.backingStorePixelRatio || 1
  return dpr / bsr
}

let currentPosition = 0
let currentRhythm = 3
let isBreak = false
let pieceClef = 'g4'

function init() {
	table = document.querySelector('table')
	canvas = document.querySelector('canvas')
	ctx = canvas.getContext('2d')
	resize()
	refresh()
	refreshBreak()
}

function resize() {
	cw = canvas.width = (window.innerWidth * pixelRatio())
	ch = canvas.height = (window.innerHeight * pixelRatio())
	ctx.font = "42px Noto Music"
	ctx.fillStyle = 'whitesmoke'
	ctx.setTransform(pixelRatio(), 0, 0, pixelRatio(), 0, 0)
}

function refresh() {
	if (document.hidden) return
	requestAnimationFrame(refresh)
	ctx.clearRect(0, 0, cw, ch)
	drawPentagram(margin[0], margin[1])
	drawCarriage(margin[0], margin[1])
	drawClef(margin[0], margin[1])
	drawNotes()
	refreshTable()
}

function drawPentagram(x, y) {
	ctx.beginPath()
	ctx.globalAlpha = 0.25
	for (let i=0; i<5; i++) {
		ctx.fillRect(x, y+(i*lineHeight), cw-(x*2), 1)
	}
	ctx.fillRect(x-1, y, 1, 4*lineHeight+1)
	ctx.fillRect(cw-x, y, 1, 4*lineHeight+1)
}

function drawClef(x, y) {
	ctx.beginPath()
	ctx.globalAlpha = 1
	ctx.fillText("𝄞", x, y+46)
}

function drawNotes() {
	notes.forEach((el, i) => {
		let pos = 0
		ctx.beginPath()
		ctx.globalAlpha = 1
		if (el[0] == 'a') pos = initialNotePosition()
		else if (el[0] == 'b') pos = initialNotePosition() - (lineHeight/2)
		else if (el[0] == 'c') pos = initialNotePosition() - ((lineHeight/2)*2)
		else if (el[0] == 'd') pos = initialNotePosition() - ((lineHeight/2)*3)
		else if (el[0] == 'e') pos = initialNotePosition() - ((lineHeight/2)*4)
		else if (el[0] == 'f') pos = initialNotePosition() - ((lineHeight/2)*5)
		else if (el[0] == 'g') pos = initialNotePosition() - ((lineHeight/2)*6)
		ctx.fillText(rhythms[el[1]][el[2] ? 1 : 0], margin[0] + startPosition + (i*spacing), margin[1]+pos+(lineHeight*el[3]))
	})
}

function drawCarriage(x, y) {
	const px = x + startPosition + (notes.length*spacing)
	ctx.beginPath()
	ctx.globalAlpha = performance.now() % 500 < 250 ? 1 : 0
	ctx.fillRect(px, y-6, 1, 5*lineHeight)
}

function refreshTable() {
	let px = margin[0] + (notes.length*spacing) - (table.clientWidth / 2)
	let py = (margin[1] + (lineHeight*4) + 30) * pixelRatio()
	if (px < 0) px = 0
	if (px > cw - table.clientWidth) px = cw - table.clientWidth
	table.style.setProperty('left', `${px}px`)
	table.style.setProperty('top', `${py}px`)
	for (let i=1; i<8; i++) {
		if (currentRhythm == i) table.querySelector(`#r${i}`).classList.add('active')
		else table.querySelector(`#r${i}`).classList.remove('active')
	}
}

function refreshBreak() {
	table.querySelectorAll('tr td label').forEach(el => el.style.removeProperty('display'))
	if (isBreak) table.querySelectorAll('tr td label:first-of-type').forEach(el => el.style.setProperty('display', 'none'))
	else table.querySelectorAll('tr td label:last-of-type').forEach(el => el.style.setProperty('display', 'none'))
}

function initialNotePosition() {
	const c = pieceClef.split('')
	return clefs[c[0]][c[1]]
}

function handleClick() {
	document.querySelectorAll('table tr td')?.forEach(el => {
		el.onclick = e => {
			const id = e.target?.parentNode?.id
			if (id) currentRhythm = id.split('')[1]
		}
	})
}

document.onreadystatechange = () => {
	if (document.readyState != 'complete') return
	init()
	handleClick()
}

document.onvisibilitychange = () => {
	if (!document.hidden) refresh()
}

window.onkeydown = e => {
	if (['F5', 'F12'].includes(e.key)) return
	e.preventDefault()
	e.stopPropagation()
	const key = e.key.toLocaleLowerCase()
	if (key == 'backspace') {
		notes.pop()
		if (currentPosition > 0) currentPosition--
		return
	}
	if (['a', 'b', 'c', 'd', 'e', 'f', 'g'].includes(key)) {
		let octave = 0
		if (e.ctrlKey) octave = 1
		if (e.shiftKey) octave = -1
		notes.push([key, currentRhythm, isBreak, octave])
		currentPosition++
	}
	if (['1', '2', '3', '4', '5', '6', '7'].includes(key)) {
		currentRhythm = parseInt(key)
	}
	if (key == 'p') {
		isBreak = !isBreak
		this.refreshBreak()
	}
}

window.onresize = () => resize()