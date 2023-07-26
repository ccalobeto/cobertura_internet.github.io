import { drawPeruMap } from "./perumap.js"
import data from '../data/entel_movil_parsed.json'
import { json } from "d3-fetch"

// import the cartography and pass it with data
json("https://cdn.jsdelivr.net/npm/pe-atlas@1.0.1/districts-100k.json")
    .then(response => {
        drawPeruMap(data, response)
    })
