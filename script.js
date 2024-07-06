var table, canvas, ctx, cw, ch

const notes = []
const margin = [20, 60]
const startPosition = 40
const rhythms = {
	1: '𝅗',
	2: '𝅗𝅥',
	3: '𝅘𝅥',
	4: '𝅘𝅥𝅮',
	5: '𝅘𝅥𝅯',
	6: '𝅘𝅥𝅰',
	7: '𝅘𝅥𝅱',
	8: '𝅘𝅥𝅲',
}

let currentPosition = 0
let currentRhythm = 3

function init() {
	table = document.querySelector('table')
	canvas = document.querySelector('canvas')
	ctx = canvas.getContext('2d')
	resize()
	refresh()
}

function resize() {
	cw = canvas.width = window.innerWidth
	ch = canvas.height = window.innerHeight
	ctx.font = "36px Noto Music"
	ctx.fillStyle = 'whitesmoke'
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
	for (let i=0; i<5; i++) {
		ctx.moveTo(x, y+(i*12))
		ctx.lineTo(cw-x, y+(i*12))
	}
	ctx.moveTo(x, y)
	ctx.lineTo(x, y+(4*12))
	ctx.moveTo(cw-x, y)
	ctx.lineTo(cw-x, y+(4*12))
	ctx.lineWidth = 0.25
	ctx.strokeStyle = 'whitesmoke'
	ctx.stroke()
}

function drawClef(x, y) {
	ctx.beginPath()
	ctx.fillText("𝄞", x, y+46)
}

function drawNotes() {
	notes.forEach((el, i) => {
		const x = margin[0] + startPosition + (i*20)
		ctx.beginPath()
		if (el[0] == 'a') ctx.fillText(rhythms[el[1]], x, margin[1]+35)
		if (el[0] == 'b') ctx.fillText(rhythms[el[1]], x, margin[1]+29)
		if (el[0] == 'c') ctx.fillText(rhythms[el[1]], x, margin[1]+23)
		if (el[0] == 'd') ctx.fillText(rhythms[el[1]], x, margin[1]+17)
		if (el[0] == 'e') ctx.fillText(rhythms[el[1]], x, margin[1]+11)
		if (el[0] == 'f') ctx.fillText(rhythms[el[1]], x, margin[1]+5)
		if (el[0] == 'g') ctx.fillText(rhythms[el[1]], x, margin[1]-1)
	})
}

function drawCarriage(x, y) {
	const px = x + startPosition + (notes.length*20)
	ctx.beginPath()
	ctx.moveTo(px, y-8)
	ctx.lineTo(px, y+60)
	ctx.lineWidth = 1
	ctx.strokeStyle = performance.now() % 500 < 250 ? 'whitesmoke' : 'transparent'
	ctx.stroke()
}

function refreshTable() {
	let px = margin[1] + (notes.length*20) - (table.clientWidth / 2)
	if (px < 0) px = 0
	if (px > cw - table.clientWidth) px = cw - table.clientWidth
	table.style.setProperty('left', `${px}px`)
	for (let i=1; i<9; i++) {
		if (currentRhythm == i) table.querySelector(`#r${i}`).classList.add('active')
		else table.querySelector(`#r${i}`).classList.remove('active')
	}
}

document.onreadystatechange = () => {
	if (document.readyState != 'complete') return
	init()
}

document.onvisibilitychange = () => {
	if (!document.hidden) refresh()
}

window.onkeydown = e => {
	if (e.key == 'Backspace') {
		notes.pop()
		if (currentPosition > 0) currentPosition--
		return
	}
	if (['a', 'b', 'c', 'd', 'e', 'f', 'g'].includes(e.key)) {
		notes.push([e.key, currentRhythm])
		currentPosition++
	}
	if (['1', '2', '3', '4', '5', '6', '7', '8'].includes(e.key)) {
		currentRhythm = parseInt(e.key)
	}
}

window.onresize = () => resize()