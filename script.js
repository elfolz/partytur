var table, canvas, ctx, cw, ch

const notes = []
const margin = [20, 60]
const startPosition = 60
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

let pieceClef = 'g4'
let pieceTempo = [4, 4]
let currentPosition = 0
let currentRhythm = 3
let isBreak = false

function init() {
	table = document.querySelector('table')
	canvas = document.querySelector('canvas')
	ctx = canvas.getContext('2d')
	resize()
	refresh()
	refreshBreak()
}

function resize() {
	cw = canvas.width = window.innerWidth
	ch = canvas.height = window.innerHeight
	ctx.setTransform(pixelRatio(), 0, 0, pixelRatio(), 0, 0)
}

function refresh() {
	if (document.hidden) return
	requestAnimationFrame(refresh)
	ctx.clearRect(0, 0, cw, ch)
	drawPentagram(margin[0], margin[1])
	drawClef(margin[0], margin[1])
	drawTempo(margin[0], margin[1])
	drawCarriage(margin[0], margin[1])
	drawNotes()
	refreshTable()
}

function drawPentagram(x, y) {
	ctx.beginPath()
	ctx.fillStyle = '#646464'
	for (let i=0; i<5; i++) {
		ctx.fillRect(x, y+(i*lineHeight), cw-(x*2), 1)
	}
	ctx.fillRect(x-1, y, 1, 4*lineHeight+1)
	ctx.fillRect(cw-x, y, 1, 4*lineHeight+1)
}

function drawHelperLines(x, y) {
	const h = margin[1] + (lineHeight*4)
	let quant = Math.abs(y - h) / lineHeight
	if (h > y) quant -= 3
	ctx.beginPath()
	ctx.fillStyle = '#646464'
	for (let i=0; i<quant; i++) {
		const posy = y > h ? margin[1]+(lineHeight*(4+i)) : margin[1]-(lineHeight*i)
		ctx.fillRect(x-4, posy, spacing, 1)
	}
}

function drawClef(x, y) {
	ctx.beginPath()
	ctx.fillStyle = 'whitesmoke'
	ctx.font = "42px Noto Music"
	ctx.fillText("𝄞", x, y+46)
}

function drawTempo(x, y) {
	const posx = x + 35
	ctx.beginPath()
	ctx.fillStyle = 'whitesmoke'
	ctx.font = "22px Noto Music"
	ctx.fillText(pieceTempo[0], posx, y+20)
	ctx.fillRect(posx, y+24, 15, 1)
	ctx.fillText(pieceTempo[1], posx, y+44)
}

function drawNotes() {
	notes.forEach((el, i) => {
		let pos = 0
		if (el[0] == 'a') pos = initialNotePosition()
		else if (el[0] == 'b') pos = initialNotePosition() - (lineHeight/2)
		else if (el[0] == 'c') pos = initialNotePosition() - ((lineHeight/2)*2)
		else if (el[0] == 'd') pos = initialNotePosition() - ((lineHeight/2)*3)
		else if (el[0] == 'e') pos = initialNotePosition() - ((lineHeight/2)*4)
		else if (el[0] == 'f') pos = initialNotePosition() - ((lineHeight/2)*5)
		else if (el[0] == 'g') pos = initialNotePosition() - ((lineHeight/2)*6)
		const x = margin[0] + startPosition + (i*spacing)
		const y = margin[1] + pos + ((lineHeight/2)*el[3])
		drawHelperLines(x, y)
		ctx.beginPath()
		ctx.fillStyle = 'whitesmoke'
		ctx.font = "42px Noto Music"
		ctx.fillText(rhythms[el[1]][el[2] ? 1 : 0], x, y)
	})
}

function drawCarriage(x, y) {
	const px = x + startPosition + (notes.length*spacing)
	ctx.beginPath()
	ctx.fillStyle = performance.now() % 500 < 250 ? 'whitesmoke' : 'transparent'
	ctx.fillRect(px, y-6, 1, 5*lineHeight)
}

function refreshTable() {
	let px = margin[0] + (notes.length*spacing) - (table.clientWidth / 2)
	let py = (margin[1] + (lineHeight*4) + 30) * pixelRatio() + 10
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
		if (e.ctrlKey) octave = 7
		if (e.shiftKey) octave = -7
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