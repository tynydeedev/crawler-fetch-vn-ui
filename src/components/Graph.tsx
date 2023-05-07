/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import CyComponent from "./CyComponent";
import MultiSelect from "./MultiSelect";
import "./Graph.css";

function Graph() {
  const [selectedList, setSelectedList] = useState<Array<string>>([]);
  const [symbolOptions, setSymbolOptions] = useState<Array<string>>([]);
  const [graph, setGraph] = useState<Record<string, any>>({});
  const [listening, setListening] = useState(false);

  useEffect(() => {
    if (!listening) {
      setListening(true);

      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
      const events = new EventSource(`${apiUrl}/graph`);

      events.onmessage = (event) => {
        const parsedData = JSON.parse(event.data.trim());
        setSymbolOptions(Object.keys(parsedData));
        setGraph(parsedData);
      };

      events.onopen = () => {
        console.log("connected to graph stream");
      };

      events.onerror = (error) => {
        console.log(error);
      };
    }
  }, [listening, graph]);

  function handleSelect(value: string[]) {
    setSelectedList(value);
  }

  return (
    <div id="graph">
      <MultiSelect options={symbolOptions} onChange={handleSelect} />
      <CyComponent graph={graph} symbols={selectedList} />
    </div>
  );
}

export default Graph;
