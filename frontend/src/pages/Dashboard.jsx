import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, Users, Trophy, LogOut, ArrowRight, Sparkles } from "lucide-react"
import { motion } from "framer-motion"

const Dashboard = () => {
  const navigate = useNavigate()
  const [user, setUser] = useState({ name: "Wandile" }) // You can fetch real name later

  useEffect(() => {
    const savedToken = localStorage.getItem('access_token')
    if (!savedToken) navigate('/login')
  }, [navigate])

  const handleLogout = () => {
    localStorage.removeItem('access_token')
    navigate('/')
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, duration: 0.4 }
    })
  }

  return (
    <div className="min-h-screen bg-slate-50">
      
      {/* 1. HERO SECTION: Rich Gradient Background */}
      <div className="bg-gradient-to-br from-indigo-900 via-blue-800 to-indigo-900 pb-32 pt-12 px-4 sm:px-8 shadow-xl">
        <div className="max-w-6xl mx-auto flex justify-between items-start">
          <motion.div 
            initial={{ opacity: 0, x: -20 }} 
            animate={{ opacity: 1, x: 0 }}
            className="text-white space-y-2"
          >
            <div className="flex items-center gap-2 opacity-80 text-sm font-medium uppercase tracking-wider">
              <Sparkles className="h-4 w-4 text-yellow-400" />
              Student Portal v1.0
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
              Hello, {user.name}
            </h1>
            <p className="text-blue-200 text-lg max-w-lg">
              Your evaluation period ends in 3 days. You have pending votes for the Software Engineering cohort.
            </p>
          </motion.div>

          <Button 
            onClick={handleLogout}
            variant="ghost" 
            className="text-white hover:bg-white/10 border border-white/20"
          >
            <LogOut className="mr-2 h-4 w-4" /> Sign Out
          </Button>
        </div>
      </div>

      {/* 2. FLOATING CARDS: Negative margin pulls them up */}
      <div className="max-w-6xl mx-auto px-4 sm:px-8 -mt-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: Main Action (Clickable) */}
          <motion.div 
            custom={0} initial="hidden" animate="visible" variants={cardVariants}
            onClick={() => navigate('/projects')}
            className="cursor-pointer group"
          >
            <Card className="shadow-lg border-0 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 bg-white relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Activity className="h-24 w-24 text-blue-600" />
              </div>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold text-blue-600 uppercase tracking-wide">
                  Action Required
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-slate-900">12</span>
                  <span className="text-sm text-slate-500 font-medium">Projects</span>
                </div>
                <p className="text-sm text-slate-500 mt-2 mb-4">
                  2 new submissions since yesterday.
                </p>
                <div className="flex items-center text-blue-600 text-sm font-bold group-hover:underline">
                  Start Voting <ArrowRight className="ml-2 h-4 w-4" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Card 2: Rank (NOW CLICKABLE -> LEADERBOARD) */}
          <motion.div 
            custom={1} initial="hidden" animate="visible" variants={cardVariants}
            onClick={() => navigate('/leaderboard')} // <--- Added link
            className="cursor-pointer" // <--- Added pointer
          >
            <Card className="shadow-lg border-0 bg-white h-full relative overflow-hidden hover:shadow-xl transition-shadow">
              <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-50 rounded-full -mr-10 -mt-10 blur-2xl"></div>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold text-yellow-600 uppercase tracking-wide flex items-center">
                  <Trophy className="h-4 w-4 mr-2" /> Current Rank
                </CardTitle>
              </CardHeader>
              <CardContent className="relative">
                <div className="text-4xl font-bold text-slate-900">Top 10%</div>
                <p className="text-sm text-slate-500 mt-2">
                  You are in the top tier of active evaluators.
                </p>
                <div className="w-full bg-slate-100 h-2 mt-4 rounded-full overflow-hidden">
                  <div className="bg-yellow-500 h-full w-[90%] rounded-full" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Card 3: Peers (Visual Only) */}
          <motion.div custom={2} initial="hidden" animate="visible" variants={cardVariants}>
            <Card className="shadow-lg border-0 bg-white h-full">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold text-emerald-600 uppercase tracking-wide flex items-center">
                  <Users className="h-4 w-4 mr-2" /> Community
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-slate-900">340</div>
                <p className="text-sm text-slate-500 mt-2">
                  Peers currently online and voting.
                </p>
                <div className="flex -space-x-2 mt-4">
                  {[1,2,3,4].map((i) => (
                    <div key={i} className={`h-8 w-8 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-500`}>
                      {String.fromCharCode(64+i)}
                    </div>
                  ))}
                  <div className="h-8 w-8 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-xs text-slate-400">
                    +99
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

        </div>
      </div>
    </div>
  )
}

export default Dashboard