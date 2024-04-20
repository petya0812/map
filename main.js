import './style.css'
import { Map, View } from 'ol'
import TileLayer from 'ol/layer/Tile'
import OSM from 'ol/source/OSM'
import Feature from 'ol/Feature'
import Point from 'ol/geom/Point'
import VectorSource from 'ol/source/Vector'
import VectorLayer from 'ol/layer/Vector'
import { useGeographic } from 'ol/proj.js'
import LineString from 'ol/geom/LineString'
import { Style, Circle as CircleStyle, Fill, Stroke } from 'ol/style'
import PathAnimation from 'ol-ext/featureanimation/Path'
import { generateBaloons } from './utils'


// Coordinates to geographic
useGeographic()

// GEO_MAPS
const OSMlayer = new TileLayer({
  source: new OSM()
})

// INITIALIZATION MAP
const map = new Map({
  target: 'map',
  layers: [OSMlayer],
  view: new View({
    center: [30.06497118892972, 60.09796067453493],
    zoom: 8
  })
})

// ADD ROUTE

const baloons = generateBaloons(70)

const features = []

baloons.forEach(baloon => {
  features.push({
    baloon: new Feature({
      type: 'baloon',
      baloon,
      geometry: new Point(baloon.route[0])
    }),
    track: new Feature({
      type: 'track',
      baloon,
      geometry: new LineString([baloon.route[0]])
    })
  })
})

const BALOON_STYLE = new Style({
  image: new CircleStyle({
    radius: 7,
    fill: new Fill({ color: 'red' })
  })
})

const TRACK_STYLE = new Style({
  stroke: new Stroke({
    color: 'green',
    width: 2
  })
})

const vectorLayer = new VectorLayer({
  source: new VectorSource({
    features: features.map(f => [f.baloon, f.track]).flat()
  }),
  style: function (feature) {
    switch (feature.get('type')) {
      case 'baloon':
        return BALOON_STYLE
      case 'track':
        return TRACK_STYLE
    }
  }
})

map.addLayer(vectorLayer);


// EXTENSION

function animationConstructor(baloon) {
  return new PathAnimation({
    path: new LineString(baloon.route),
    duration: 15000,
    hiddenStyle: BALOON_STYLE
  })
}

setTimeout(async () => {
  features.forEach(f => {

    const animation = animationConstructor(f.baloon.get('baloon'))

    vectorLayer.animateFeature(f.baloon, animation)

    vectorLayer.on('animating', () => {
      const trackCoord = f.track.getGeometry().simplify(0.0001).getCoordinates()
      const pointCoord = f.baloon.getGeometry().getCoordinates()
      f.track.getGeometry().setCoordinates([...trackCoord, pointCoord])
    })

  })
}, 1000)
