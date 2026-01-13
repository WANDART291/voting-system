import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "../api/axios"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Trophy, Medal, ArrowLeft, Star, Crown } from "lucide-react"
import { motion } from "framer-motion"

const Leaderboard = () => {
  const navigate = useNavigate()
  const [leaders, setLeaders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await api.get('/api/projects/top/')
        setLeaders(response.data)
      } catch (error) {
        console.error("Failed to fetch leaderboard", error)
      } finally {
        setLoading(false)
      }
    }
    fetchLeaderboard()
  }, [])

  const getRankStyle = (index) => {
    switch(index) {
      case 0: return "bg-yellow-100 border-yellow-300 text-yellow-700" 
      case 1: return "bg-slate-100 border-slate-300 text-slate-700"  
      case 2: return "bg-orange-100 border-orange-300 text-orange-800" 
      default: return "bg-white border-zinc-100 text-zinc-600"
    }
  }

  const getIcon = (index) => {
    switch(index) {
      case 0: return <Crown className="h-6 w-6 text-yellow-500 mb-2" />
      case 1: return <Medal className="h-6 w-6 text-slate-400 mb-2" />
      case 2: return <Medal className="h-6 w-6 text-orange-400 mb-2" />
      default: return <Star className="h-5 w-5 text-zinc-300 mb-2" />
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto mb-8 md:mb-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
      >
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
            <Trophy className="h-8 w-8 text-yellow-500" /> 
            Hall of Fame
          </h1>
          <p className="text-slate-500 mt-2">Top rated projects for this cohort.</p>
        </div>
        <Button variant="outline" onClick={() => navigate('/dashboard')} className="w-full md:w-auto">
          <ArrowLeft className="mr-2 h-4 w-4" /> Dashboard
        </Button>
      </motion.div>

      {/* Podium Grid - FIXED: Order for mobile vs Desktop */}
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 items-end pb-10">
        {leaders.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2 }}
            // Mobile: Standard order (0,1,2). Desktop: Gold in middle (order-2)
            className={`${index === 0 ? 'md:order-2 md:-mt-12 z-10' : index === 1 ? 'md:order-1' : 'md:order-3'}`}
          >
            {/* FIXED: Scale effect only on desktop (md:scale-110) */}
            <Card className={`text-center border-2 shadow-xl overflow-hidden relative ${index === 0 ? 'md:scale-110 shadow-yellow-200' : ''}`}>
              <div className={`h-2 ${index === 0 ? 'bg-yellow-400' : index === 1 ? 'bg-slate-300' : 'bg-orange-300'}`} />
              <CardHeader className="pt-8 pb-4 flex flex-col items-center">
                {getIcon(index)}
                <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2 ${getRankStyle(index)}`}>
                  Rank #{index + 1}
                </div>
                <CardTitle className="text-xl font-bold truncate w-full px-2">
                  {project.name}
                </CardTitle>
                <p className="text-xs text-slate-400">by {project.creator}</p>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-extrabold text-slate-900 mb-1">
                  {project.vote_count}
                </div>
                <p className="text-xs text-slate-500 font-medium uppercase">Total Votes</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default Leaderboard