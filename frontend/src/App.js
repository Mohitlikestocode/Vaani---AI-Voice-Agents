import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "@/pages/Landing";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import GetStarted from "@/pages/GetStarted";
import Chat from "@/pages/Chat";
import Admin from "@/pages/Admin";

function App() {
  return (
    <div className="App swara-grain">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/get-started" element={<GetStarted />} />
          <Route path="/chat/:agentId" element={<Chat />} />
          <Route path="/admin/:agentId" element={<Admin />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
