import * as d3 from 'd3'
import {useEffect, useRef} from "react";

export default function Entourage({entourage, width, height}) {
  const svgRef = useRef()


  useEffect(() => {
    // const svgElement = d3.select(document.getElementById("entourage-container-"+entourage.id).contentDocument);
    // console.log(document.getElementById("entourage-container-"+entourage.id).contentDocument)

    svgRef.current.addEventListener("load", () => {
      const svg = d3.select(svgRef.current.contentDocument.documentElement);
      svg.selectAll("#PEOPLE-OUTLINE")
        .on("mouseover", function () {
          d3.select(this)
            .style("opacity", 1);
        })
        .on("mouseout", function () {
          d3.select(this)
            .style("opacity", 0);
        });
    });
  }, [])
    return (
      <>
        <object style={{ position: 'absolute', height: height }} data={entourage.element} type="image/svg+xml" ref={svgRef}>
        </object>
      </>
    )
}
