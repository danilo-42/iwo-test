import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { Asset } from '../types';

interface Props {
  assets: Asset[];
  weights: number[];
  title: string;
}

interface NodeData {
  id: string;
  value: number;
  sector: string;
  name: string;
  color: string;
}

export const WeedEcosystem: React.FC<Props> = ({ assets, weights, title }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const width = svgRef.current.clientWidth;
    const height = 500;
    
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    // Background gradient hint
    const defs = svg.append("defs");
    const radialGradient = defs.append("radialGradient")
        .attr("id", "bg-glow")
        .attr("cx", "50%")
        .attr("cy", "50%")
        .attr("r", "50%");
    radialGradient.append("stop").attr("offset", "0%").attr("stop-color", "rgba(16, 185, 129, 0.1)");
    radialGradient.append("stop").attr("offset", "100%").attr("stop-color", "rgba(15, 23, 42, 0)");

    svg.append("rect")
       .attr("width", width)
       .attr("height", height)
       .attr("fill", "url(#bg-glow)");

    // Data prep
    const data: NodeData[] = assets.map((asset, i) => ({
      id: asset.ticker,
      name: asset.name,
      sector: asset.sector,
      color: asset.color,
      value: weights[i]
    })).filter(d => d.value > 0.005); 

    const root = d3.hierarchy({ children: data })
      .sum((d: any) => d.value)
      .sort((a, b) => (b.value || 0) - (a.value || 0));

    const pack = d3.pack()
      .size([width, height])
      .padding(12);

    const rootNode = pack(root as any);
    const leaves = rootNode.leaves();

    const group = svg.append("g");

    // Create groups for each node
    const nodes = group.selectAll("g")
      .data(leaves)
      .join("g")
      .attr("transform", d => `translate(${d.x},${d.y})`)
      .style("cursor", "help"); // Indication that you can hover

    // Add Native Tooltip
    nodes.append("title")
         .text((d: any) => `${(d.data as NodeData).name}\nAllocation: ${((d.data as NodeData).value * 100).toFixed(2)}%\nSector: ${(d.data as NodeData).sector}`);

    // Outer glow for dominant species
    nodes.filter((d: any) => d.data.value > 0.15)
         .append("circle")
         .attr("r", (d: any) => d.r + 6)
         .attr("fill", "none")
         .attr("stroke", (d: any) => (d.data as NodeData).color)
         .attr("stroke-width", 2)
         .attr("opacity", 0.4)
         .style("filter", "blur(2px)");

    // Main Circle
    nodes.append("circle")
      .attr("r", (d: any) => d.r)
      .attr("fill", (d: any) => (d.data as NodeData).color)
      .attr("fill-opacity", 0.8)
      .attr("stroke", "#fff")
      .attr("stroke-width", 1.5)
      .attr("stroke-opacity", 0.8)
      .style("filter", "drop-shadow(0px 4px 6px rgba(0,0,0,0.3))");

    // Text Label (Ticker)
    nodes.append("text")
      .attr("text-anchor", "middle")
      .attr("dy", "-0.1em")
      .text((d: any) => (d.data as NodeData).id)
      .attr("font-size", (d: any) => Math.min(d.r * 0.7, 16))
      .attr("fill", "white")
      .attr("font-weight", "800")
      .style("pointer-events", "none")
      .style("text-shadow", "0px 1px 2px rgba(0,0,0,0.8)")
      .style("opacity", (d: any) => d.r > 12 ? 1 : 0);
      
    // Text Label (Percent)
    nodes.append("text")
      .attr("text-anchor", "middle")
      .attr("dy", "1.1em")
      .text((d: any) => `${((d.data as NodeData).value * 100).toFixed(0)}%`)
      .attr("font-size", (d: any) => Math.min(d.r * 0.5, 12))
      .attr("fill", "rgba(255,255,255,0.9)")
      .attr("font-weight", "500")
      .style("pointer-events", "none")
      .style("opacity", (d: any) => d.r > 18 ? 1 : 0);

  }, [assets, weights]);

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-1 shadow-lg flex flex-col h-[550px] relative overflow-hidden">
      
      {/* Header Info */}
      <div className="absolute top-4 left-4 z-10 pointer-events-none">
        <h4 className="text-xl font-bold text-white flex items-center gap-2 drop-shadow-md">
            <span className="w-2 h-6 bg-emerald-500 rounded-sm shadow-[0_0_10px_rgba(16,185,129,0.5)]"></span>
            {title}
        </h4>
        <p className="text-slate-300 text-xs font-medium mt-1 bg-slate-900/60 backdrop-blur-sm p-2 rounded border border-slate-700/50 max-w-[280px]">
            This represents the "Genome" of the fittest weed. <br/>
            <span className="text-emerald-400">Larger Bubble = Higher Weight</span>.
            <br/>
            <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider mt-1 block">Hover bubbles for details</span>
        </p>
      </div>

      <div className="flex-grow relative z-0">
        <svg ref={svgRef} className="w-full h-full block"></svg>
      </div>
      
    </div>
  );
};