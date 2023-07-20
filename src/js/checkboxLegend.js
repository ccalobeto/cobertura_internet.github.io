import { range } from 'd3'

export const checkboxLegend = (selection, props) => {

  const {colorScale, width, spacing, textOffset } = props

  const groups = selection.selectAll("tick")
    .data(colorScale.domain())

  const groupsEnter = groups
    .enter().append("g")
      .attr("class", "tick")

  groupsEnter
    .merge(groups)
      .attr("transform", (d, i) => 
        `translate(${ i * (width + spacing) }, 0)`)
  
  groups.exit().remove()

  groupsEnter
    .append("rect")
    .merge(groups.select("rect"))
      // .attr("x", (d, i) => {i * (height + spacing)})
      // .attr("y", 0)
      .attr("width", width)
      .attr("height", width)
      .attr("fill", colorScale)

  groupsEnter
    .append("text")
    .merge(groups.select("text"))
      .text(d => d)
      // .attr("dy", "0.32em")
      .attr("x", textOffset)
      .attr("y", textOffset / 2)
  
  // console.log("labels", groupsEnter)

}