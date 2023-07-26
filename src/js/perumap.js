import * as topojson from "topojson-client"
import { geoMercator, geoPath } from "d3-geo"
import { select, selectAll } from "d3-selection"
import { scaleOrdinal } from "d3-scale"
import { transition } from "d3-transition"
// import * as d3 from "d3"
import { checkboxLegend } from "./checkboxLegend.js"
//import * as Plot from "https://cdn.jsdelivr.net/npm/@observablehq/plot@0.6/+esm"

export const drawPeruMap= (data, response) => {
  
  const width = 800
  const height = 800
  const radius = 2
  let filtered_data = data

  const coverageInfo = [
  {id: "2g", color: "#984ea3"},
  {id: "3g", color: "#4daf4a"},
  {id: "4g", color: "#377eb8"},
  {id: "5g", color: "#e41a1c"},
  ]

  pe = response
  // const districts = topojson.feature(pe, pe.objects.districts).features
  const provinces = topojson.feature(pe, pe.objects.provinces).features
  const departments = topojson.feature(pe, pe.objects.departments).features
  // const provincesmesh = topojson.mesh(pe, pe.objects.provinces, (a, b) => a !== b).coordinates
  // const departmentsmesh = topojson.mesh(pe, pe.objects.departments, (a, b) => a !== b)
  // const nation = topojson.mesh(pe, pe.objects.districts.geometries)

  // setting scales
  const colorScale = scaleOrdinal()
    .domain(coverageInfo.map(f => f.id))
    .range(coverageInfo.map(f => f.color))

  // define the projection and generator
  const projection = geoMercator()
    .scale(2000)
      .translate([2900, 0])

  const geoPathGenerator = geoPath()
    .projection(projection)

  // drawing all stages in the map
  const frame = select("#perumap")
    .append("svg")
      .attr("viewBox", `0 0 ${ width } ${ height }`)

  const canvas = frame.append("g")
    //.attr("transform", `translate(0, 0)`)
    .attr("class", "canvas")

  const cartography = canvas
    .append("g")
      .attr("class", "cartography")

  cartography
    .selectAll(".department")
    .data(departments)
    .join("path")
      .attr("class", "department")
      .attr("d", d => geoPathGenerator(d))
      .attr("stroke", "#09131b")
      .attr("stroke-opacity", 0.5)

  cartography
    .selectAll(".province")
    .data(provinces)
    .join("path")
      .attr("class", "province")
      .attr("d", d => geoPathGenerator(d))
      .attr("fill", "#f8fcff")
      .attr("stroke", "#09131b")
      .attr("stroke-opacity", 0.15)

  // working with legend
  const legend = canvas
    .append("g")
      .attr("class", "legend-container")
      .attr("transform", `translate(0, 20)`)

  checkboxLegend(legend, {
    colorScale,
    width: 20,
    spacing: 30, 
    textOffset: 25
  })
  
  // working with tooltips
  const appendTooltip = () => {
    
    tooltip = canvas
      .append("g")
        .attr("class", "tooltip-container")

    tooltip 
      .append("text")
        .attr("class", "tooltip")
        .attr("text-anchor", "middle")
        .attr("fill", "#192e4d")
        .style("opacity", 0)
    
  }

  const showTooltip = (e, d) => {

    const cx = e.target.getAttribute("cx")
    const cy = e.target.getAttribute("cy")
    const r = e.target.getAttribute("r")
    const text = `${d.centro_poblado}, ${d.region}`

    select(".tooltip")
      .attr("x", cx)
      .attr("y", cy - r - 5)
      .transition()
      .duration(200)
      .text(text)
      .style("opacity", 1)

  }

  const hideTooltip = () => {

    select(".tooltip")
      .transition()
      .style("opacity", 0)

  }

  const updateTooltip = () => {

    selectAll(".data-point")
      .on("mouseenter", showTooltip)
      .on("mouseleave", hideTooltip)
      .transition()

  }

  const displayCountry = () => {

    const data_canvas = canvas
      .append("g")
        .attr("class", "data-canvas")

    let circles = data_canvas
      .selectAll(".data-point")

    circles 
      .data(filtered_data, d => d.centro_poblado)  
      .join("circle")
        .attr("class", "data-point")
        .attr("fill-opacity", 1)
        .attr("cx", d => projection([d.lon, d.lat])[0])
        .attr("cy", d => projection([d.lon, d.lat])[1])
        .attr("fill", d => colorScale(d.tecnologia))
        .attr("r", radius)

    updateTooltip()

    selectAll(".checkbox")
      .on("change", d => {

        let tecnologia = d.target.value
        // let opacity = d.target.checked ? 1 : 0

        if (d.target.checked) {
          let new_data = data.filter(row => row.tecnologia === tecnologia)
          filtered_data = filtered_data.concat(new_data)
        } else {
          filtered_data = filtered_data.filter(row => row.tecnologia !== tecnologia)
        }

        circles = data_canvas
          .selectAll(".data-point")
          .data(filtered_data, d => d.centro_poblado)
          .join("circle")
            .attr("class", "data-point")
            .attr("cx", d => projection([d.lon, d.lat])[0])
            .attr("cy", d => projection([d.lon, d.lat])[1])
            .attr("r", radius)
            .attr("fill", d => colorScale(d.tecnologia))

        circles.exit().remove()

        updateTooltip()

      })
  }

  appendTooltip()
  displayCountry()

};