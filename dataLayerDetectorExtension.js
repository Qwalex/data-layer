if (!Array.isArray(window.dataLayer)) {
	window.dataLayer = []
}

window.previousEvents = []
window.dataLayerCollector = {
	eventCategory: {
		footer: [],
		verhnee_menu: []
	}
}

const collect = (event) => {
	Object.keys(window.dataLayerCollector).forEach((key) => {
		if (event[key] && window.dataLayerCollector[key][event[key]]) {
			window.dataLayerCollector[key][event[key]].push(event)
		}
	})
	
	return event
}

const getEvents = () => {
	return window.dataLayer.filter(({ event }) => /^vnt_/.test(event))
}

const savePrevious = () => {
	window.previousEvents = JSON.parse(JSON.stringify(getEvents()))
}

const hasDiff = () => {
	if (window.previousEvents.length !== getEvents().length) {
		return true
	}
	
	return false
}

const getLast = () => collect([...getEvents()].reverse()[0])

const check = () => {
	if (hasDiff()) {
		console.log(getLast())
		savePrevious()
	}
}

window.addEventListener('load', () => {
	console.log('data layer check started')

	setInterval(() => {
		check()
	}, 100)
})
