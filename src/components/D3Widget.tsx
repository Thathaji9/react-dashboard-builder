import React, { useRef, useEffect } from "react";
import * as d3 from "d3";
import "./WidgetStyles.css";
import { ResponsiveContainer } from "recharts";

interface D3WidgetProps {
  radius: number;
  color: string;
}

const D3Widget: React.FC<D3WidgetProps> = ({ radius, color }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;

    svg.selectAll("*").remove();

    const g = svg
      .append("g")
      .attr("transform", `translate(${width / 2}, ${height / 2})`);

    g.append("circle")
      .attr("r", Math.min(radius, width / 2 - 10, height / 2 - 10))
      .attr("fill", color)
      .attr("stroke", d3.rgb(color).darker(0.7).toString())
      .attr("stroke-width", 2);
  }, [radius, color]);

  return (
    <div className="widget-content d3-widget">
      <h4>D3 Circle</h4>
      <ResponsiveContainer width="100%" height="80%">
        <svg ref={svgRef} style={{ width: "100%", height: "100%" }}></svg>
      </ResponsiveContainer>
    </div>
  );
};

export default D3Widget;
