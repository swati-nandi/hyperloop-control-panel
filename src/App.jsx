import { useState, useEffect } from "react";

function StatusCard({ label, value, color }) {
  return (
    <div className="bg-gray-800 p-4 rounded-xl text-center shadow-lg transition-all duration-300">
      <h2 className="text-lg mb-2">{label}</h2>
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
    </div>
  );
}

export default function App() {
  const [running, setRunning] = useState(false);
  const [emergency, setEmergency] = useState(false);

  const [data, setData] = useState({
    speed: 0,
    pressure: 100,
    temp: 25
  });

  // 🔄 Simulation
  useEffect(() => {
    if (!running || emergency) return;

    const interval = setInterval(() => {
      setData(prev => {
        let speed = prev.speed + (Math.random() * 40 - 20);
        let pressure = prev.pressure + (Math.random() * 10 - 5);
        let temp = prev.temp + (Math.random() * 4 - 2);

        // limits
        speed = Math.max(0, Math.min(1200, speed));
        pressure = Math.max(0, Math.min(200, pressure));
        temp = Math.max(0, Math.min(100, temp));

        return {
          speed: Math.round(speed),
          pressure: Math.round(pressure),
          temp: Math.round(temp)
        };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [running, emergency]);

  // 🎨 Colors
  const getColor = (type, value) => {
    if (type === "speed") {
      if (value > 900) return "text-red-400";
      if (value > 500) return "text-yellow-400";
      return "text-green-400";
    }
    if (type === "pressure") {
      return value > 120 ? "text-red-400" : "text-green-400";
    }
    if (type === "temp") {
      return value > 70 ? "text-red-400" : "text-green-400";
    }
  };

  // 🚨 Emergency
  const handleEmergency = () => {
    setEmergency(true);
    setRunning(false);
    setData(prev => ({ ...prev, speed: 0 }));
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center p-6">
      <h1 className="text-3xl font-bold mb-6">Hyperloop Control Panel</h1>

      {/* Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl mb-6">
        <StatusCard label="Speed (km/h)" value={data.speed} color={getColor("speed", data.speed)} />
        <StatusCard label="Pressure (Pa)" value={data.pressure} color={getColor("pressure", data.pressure)} />
        <StatusCard label="Temperature (°C)" value={data.temp} color={getColor("temp", data.temp)} />
      </div>

      {/* Warning */}
      {data.pressure > 120 && (
        <div className="bg-red-600 px-4 py-2 rounded mb-4 animate-pulse">
          ⚠ High Pressure!
        </div>
      )}

      {/* Controls */}
      <div className="flex gap-4">
        <button
          onClick={() => !emergency && setRunning(true)}
          className="px-4 py-2 bg-green-500 hover:bg-green-600 rounded"
        >
          Start
        </button>

        <button
          onClick={() => setRunning(false)}
          className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 rounded"
        >
          Stop
        </button>

        <button
          onClick={handleEmergency}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded"
        >
          Emergency
        </button>

        <button
          onClick={() => setEmergency(false)}
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded"
        >
          Reset
        </button>
      </div>
    </div>
  );
}