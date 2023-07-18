import { drawPeruMap } from "./perumap.js"
import data from '../data/entel_movil_parsed.json'
import * as d3 from "d3"

// import the cartography and pass it with data
d3.json("https://cdn.jsdelivr.net/npm/pe-atlas@1.0.1/districts-100k.json")
    .then(response => {
        drawPeruMap(data, response)
    })
