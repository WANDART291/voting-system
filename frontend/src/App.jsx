import Projects from "./pages/Projects"
import Leaderboard from "./pages/Leaderboard" // <--- IMPORTED LEADERBOARD
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { LayoutDashboard, CheckCircle2 } from "lucide-react"
import Login from "./pages/Login"
import Dashboard from "./pages/Dashboard" 

// We moved your Home Page into a small component here so we can use navigation
const Home = () => {
  const navigate = useNavigate(); // This is the hook that lets us change pages

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-zinc-50 gap-6 px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.5 }}
        className="text-center space-y-4 max-w-2xl"
      >
        <span className="bg-zinc-900 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
          Full Stack Architecture v1.0
        </span>
        <h1 className="text-4xl font-extrabold text-zinc-900 tracking-tight lg:text-6xl">
          ALX Peer Voting System
        </h1>
        <p className="text-zinc-500 text-lg leading-relaxed">
          The official platform for evaluating student projects. 
          Vote on <span className="text-zinc-900 font-medium">Innovation, Code Quality, and UI/UX</span> for apps like 
          Job Platforms and Movie Recommenders.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="flex gap-4"
      >
        {/* OnClick event triggers navigation to /login */}
        <Button 
          onClick={() => navigate('/login')} 
          className="bg-zinc-900 text-white hover:bg-zinc-800 px-8 py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all"
        >
          <LayoutDashboard className="mr-2 h-5 w-5" /> 
          Enter Evaluation Portal
        </Button>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        transition={{ delay: 0.5 }}
        className="absolute bottom-10 flex gap-6 text-zinc-400 text-sm"
      >
        <div className="flex items-center"><CheckCircle2 className="w-4 h-4 mr-1" /> Secure JWT Authentication</div>
        <div className="flex items-center"><CheckCircle2 className="w-4 h-4 mr-1" /> Real-time Leaderboard</div>
      </motion.div>
    </div>
  )
}

// This is the main "Traffic Controller" for your app
export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} /> 
        <Route path="/projects" element={<Projects />} />
        {/* The new Leaderboard Route */}
        <Route path="/leaderboard" element={<Leaderboard />} /> 
      </Routes>
    </Router>
  )
}