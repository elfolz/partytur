var table, canvas, ctx, cw, ch

const notes = []
const margin = [20, 60]
const startPosition = 40
const rhythms = {
	1: ['𝅗', '𝄻'],
	2: ['𝅗𝅥', '𝄼'],
	3: ['𝅘𝅥', '𝄽'],
	4: ['𝅘𝅥𝅮', '𝄾'],
	5: ['𝅘𝅥𝅯', '𝄿'],
	6: ['𝅘𝅥𝅰', '𝅀'],
	7: ['𝅘𝅥𝅱', '𝅁']
}

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
		let pos = 0
		ctx.beginPath()
		if (el[0] == 'a') pos = 35
		else if (el[0] == 'b') pos = 29
		else if (el[0] == 'c') pos = 23
		else if (el[0] == 'd') pos = 17
		else if (el[0] == 'e') pos = 11
		else if (el[0] == 'f') pos = 5
		else if (el[0] == 'g') pos = -1
		ctx.fillText(rhythms[el[1]][el[2] ? 1 : 0], margin[0] + startPosition + (i*20), margin[1]+(pos*el[3]))
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

document.onreadystatechange = () => {
	if (document.readyState != 'complete') return
	init()
}

document.onvisibilitychange = () => {
	if (!document.hidden) refresh()
}

window.onkeydown = e => {
	e.preventDefault()
	e.stopPropagation()
	const key = e.key.toLocaleLowerCase()
	if (key == 'backspace') {
		notes.pop()
		if (currentPosition > 0) currentPosition--
		return
	}
	if (['a', 'b', 'c', 'd', 'e', 'f', 'g'].includes(key)) {
		let octave = 1
		if (e.ctrlKey) octave = 2
		if (e.shiftKey) octave = -2
		notes.push([key, currentRhythm, isBreak, octave])
		currentPosition++
	}
	// e.ctrlKey / e.shiftKey / e.altKey
	if (['1', '2', '3', '4', '5', '6', '7'].includes(key)) {
		currentRhythm = parseInt(key)
	}
	if (key == 'p') {
		isBreak = !isBreak
		this.refreshBreak()
	}
}

window.onresize = () => resize()