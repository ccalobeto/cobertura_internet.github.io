import * as topojson from "topojson-client"
import { geoMercator, geoPath } from "d3-geo"
import { select } from "d3-selection"
import { scaleOrdinal } from "d3-scale"
import * as d3 from "d3"
import { checkboxLegend } from "./checkboxLegend.js"
//import * as Plot from "https://cdn.jsdelivr.net/npm/@observablehq/plot@0.6/+esm"

export const drawPeruMap= (data, response) => {
  
  const width = 800
  const height = 800
  const radius = 3

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
  const colorScale = d3.scaleOrdinal()
    .domain(coverageInfo.map(f => f.id))
    .range(coverageInfo.map(f => f.color))

  // define the projection and generator
  const projection = geoMercator()
    .scale(2000)
    .translate([3000, 30])

  const geoPathGenerator = geoPath()
    .projection(projection)

  // drawing all stages in the map
  const svg = select("#perumap")
    .append("svg")
      .attr("viewBox", `0 0 ${ width } ${ height }`)

  const cartography = svg
    .append("g")

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
  const legend = svg
    .append("g")
      .attr("transform", `translate(0, 20)`)

  checkboxLegend(legend, {
    colorScale,
    width: 20,
    spacing: 30, 
    textOffset: 25
  })
  
  // working with tooltips
  const appendTooltip = () => {
    
    tooltip = svg
      .append("g")

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

    // console.log("text:", text)

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

    d3.selectAll(".data")
      .on("mouseenter", showTooltip)
      .on("mouseleave", hideTooltip)
      .transition()

  }

  const displayCountry = () => {

    let checkedTechnologies = coverageInfo.map(d => d.id)

    // console.log(checkedTechnologies)

    const countryDots = svg
    .append("g")

    countryDots //
      .selectAll(".data")
      .data(data)
      .join("circle")
        .attr("class", "data") //d => `data-county-${d.tecnologia}`
        .attr("cx", d => projection([d.lon, d.lat])[0])
        .attr("cy", d => projection([d.lon, d.lat])[1])
        .attr("fill", d => colorScale(d.tecnologia))
        .attr("fill-opacity", 0.4)
        .attr("r", radius)
    
    updateTooltip()



    d3.selectAll(".checkbox")
      .on("change", d => {

        let checkboxSelection = d.target.value
        let opacity = d.target.checked ? 1 : 0

        console.log("checked", d.target.checked)
        console.log("unchecked", d.target.unChecked)

        checkedTechnologies = ["4g"]

        svg
          .selectAll(".data")
          .filter(d => {
            return checkboxSelection === d.tecnologia
          })
          .style("opacity", opacity)
      })
      
  }

  appendTooltip()
  displayCountry()

};