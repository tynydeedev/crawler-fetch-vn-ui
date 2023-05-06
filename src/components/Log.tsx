import { useState, useEffect } from "react";

function Log() {
  const [logs, setLogs] = useState<Array<Array<string>>>([]);
  const [listening, setListening] = useState(false);

  useEffect(() => {
    if (!listening) {
      setListening(true);

      const events = new EventSource("http://localhost:3000/log");

      events.onmessage = (event) => {
        setLogs((logs) => {
          if (logs.length > 200) {
            logs.shift();
            scrollToBottom();
          }
          const data = (event.data as string)
            .split(" --- ")
            .map((e: string, i: number) =>
              i === 0 ? new Date(e).toString() : e
            );
          return [...logs, data];
        });
      };

      events.onopen = () => {
        console.log("connected to log stream");
      };

      events.onerror = (error) => {
        console.log(error);
      };
    }
  }, [listening, logs]);

  function scrollToBottom() {
    const logDiv = document.getElementById("log-area") as HTMLElement;
    logDiv.scrollTop = logDiv.scrollHeight;
  }

  return (
    <div id="log">
      <ul id="log-area">
        {logs.map((log, i) => (
          <li key={`log-${i}`}>
            <p>
              <b>{log[0]}:</b>
            </p>
            <p>{log[1]}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Log;
