import "./App.css";
import Graph from "./components/Graph";
import Log from "./components/Log";

function App() {
  return (
    <div>
      <h1>Binance simple crawler</h1>
      <div id="app">
        <Graph />
        <Log />
      </div>
    </div>
  );
}

export default App;
