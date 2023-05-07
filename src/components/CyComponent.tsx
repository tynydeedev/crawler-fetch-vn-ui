/* eslint-disable @typescript-eslint/no-explicit-any */
import cytoscape from "cytoscape";
import React, { useEffect, useRef, useState } from "react";
import "./CyComponent.css";

interface Props {
  graph: Record<string, any>;
  symbols: string[];
}

function CyComponent({ graph, symbols }: Props) {
  const [layoutSet, setLayout] = useState(false);
  const container = useRef(null);
  const cy = useRef<cytoscape.Core>() as React.MutableRefObject<cytoscape.Core>;

  useEffect(() => {
    if (container.current && !cy.current) {
      cy.current = cytoscape({
        container: container.current,
        zoomingEnabled: true,
        userZoomingEnabled: true,
        minZoom: 0.6,
        maxZoom: 3,
        boxSelectionEnabled: true,
        styleEnabled: true,
        style: [
          {
            selector: "edge",
            style: {
              "curve-style": "bezier",
              "target-arrow-shape": "triangle",
              label: "data(label)",
              width: 3,
              "edge-distances": "node-position",
              "text-rotation": "autorotate",
            },
          },
          {
            selector: "node",
            style: {
              content: "data(name)",
              "text-valign": "center",
              "text-halign": "center",
              "font-size": "16px",
              "font-family": "sans-serif",
              "z-index": 10,
              height: "80px",
              width: "80px",
            },
          },
        ],
      });
      (window as any).cy = cy.current;
    }
  });

  useEffect(() => {
    async function updateGraph() {
      symbols.forEach((symbol) => {
        if (!graph[symbol]) return;
        addNode(symbol);
        for (const edge of graph[symbol]) {
          if (symbols.includes(edge.to)) {
            addNode(edge.to);
            if (edge.bid) {
              addEdge(symbol, edge.to, "bid", edge.bid);
            } else {
              addEdge(symbol, edge.to, "ask", edge.ask);
            }
          }
        }
      });
    }

    function addNode(node: string) {
      if (!cy.current.$id(node).length) {
        cy.current.add({
          group: "nodes",
          data: {
            id: node,
            name: node,
            gene: true,
          },
        });
        setLayout(false);
      }
    }

    function addEdge(
      source: string,
      target: string,
      action: "bid" | "ask",
      value: number
    ) {
      let label =
        action === "bid" ? `Best Bid: ${value}` : `Best Ask: ${value}`;
      if (!cy.current.$id(`${source}-${target}`).length) {
        cy.current.add({
          group: "edges",
          data: {
            id: `${source}-${target}`,
            source: source,
            target: target,
            label,
          },
        });
      } else {
        const oldData = parseFloat(
          cy.current
            .$id(`${source}-${target}`)
            .data("label")
            .split(":")[1]
            .trim()
        );

        if (oldData > value) {
          label += " ↓";
        } else if (oldData < value) {
          label += " ↑";
        } else {
          label += " ∽";
        }

        cy.current.$id(`${source}-${target}`).data("label", label);
      }
    }

    if (cy.current) {
      updateGraph();
    }
  }, [graph, symbols]);

  useEffect(() => {
    const layoutCircle = {
      name: "circle",
      avoidOverlap: true,
      animate: true,
    };

    const layoutCose = {
      name: "breadthfirst",
      avoidOverlap: true,
      spacingFactor: 1.75,
      circle: true,
      animate: true,
      fit: true,
    };

    function updateLayout() {
      if (cy.current.nodes().length <= 6) {
        cy.current.layout(layoutCircle).run();
      } else {
        cy.current.layout(layoutCose).run();
      }
    }

    cy.current.nodes().forEach((node) => {
      if (symbols.includes(node.data("name"))) return;
      cy.current.remove(node);
      updateLayout();
    });

    if (
      cy.current &&
      !layoutSet &&
      cy.current.nodes().length === symbols.length
    ) {
      updateLayout();
      setLayout(true);
    }
  }, [symbols, layoutSet]);

  return <div id="cy" ref={container}></div>;
}

export default CyComponent;
