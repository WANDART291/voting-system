import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "../api/axios" 
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, Code2, ThumbsUp, Loader2, Check } from "lucide-react"
import { Input } from "@/components/ui/input"
import { motion } from "framer-motion"

const Projects = () => {
  const navigate = useNavigate()
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [votingId, setVotingId] = useState(null)

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await api.get('/api/projects/')
        setProjects(response.data.results) 
      } catch (error) {
        console.error("Failed to fetch projects:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchProjects()
  }, [])

  const handleVote = async (project) => {
    if (project.has_voted) return
    setVotingId(project.id)
    try {
      await api.post(`/api/projects/${project.id}/vote/`)
      setProjects(currentProjects => 
        currentProjects.map(p => {
          if (p.id === project.id) {
            return { ...p, has_voted: true, vote_count: p.vote_count + 1 }
          }
          return p
        })
      )
    } catch (error) {
      alert("Something went wrong while voting.")
    } finally {
      setVotingId(null)
    }
  }

  const filteredProjects = projects.filter(project => 
    project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    // FIXED: p-4 for mobile, p-8 for desktop
    <div className="min-h-screen bg-zinc-50 p-4 md:p-8">
      
      {/* 1. Header & Search - FIXED: Flex-col for mobile stacking */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto mb-8 space-y-4"
      >
        <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-zinc-900">Project Evaluation</h1>
            <p className="text-sm md:text-base text-zinc-500">Review and cast your votes for this cohort.</p>
          </div>
          <Button variant="outline" size="sm" onClick={() => navigate('/dashboard')} className="self-start md:self-auto">
            Back to Dashboard
          </Button>
        </div>

        <div className="flex gap-2 md:gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
            <Input 
              placeholder="Search..." 
              className="pl-10 bg-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="secondary"><Filter className="mr-2 h-4 w-4" /> Filter</Button>
        </div>
      </motion.div>

      {/* 2. Loading State */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
        </div>
      ) : (
        /* 3. Projects Grid - Already responsive (grid-cols-1 to grid-cols-3) */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto pb-10">
          {filteredProjects.map((project, index) => (
            <motion.div 
              key={project.id}
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: index * 0.1 }}
            >
              <Card className="hover:shadow-lg transition-shadow h-full flex flex-col">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <Badge variant="secondary" className="mb-2 uppercase text-[10px] md:text-xs">
                      {project.category}
                    </Badge>
                    <span className="text-xs text-zinc-400 flex items-center">
                      <ThumbsUp className="h-3 w-3 mr-1" /> {project.vote_count}
                    </span>
                  </div>
                  <CardTitle className="text-lg md:text-xl">{project.name}</CardTitle>
                  <p className="text-xs md:text-sm text-zinc-500 truncate">by {project.creator}</p>
                </CardHeader>
                
                <CardContent className="flex-1">
                  <p className="text-zinc-600 text-sm mb-4 leading-relaxed line-clamp-3">
                    {project.description}
                  </p>
                </CardContent>

                <CardFooter className="flex gap-3 pt-6 border-t bg-zinc-50/50">
                  <Button 
                    variant="outline" 
                    className="flex-1 bg-white hover:bg-zinc-50 text-xs md:text-sm"
                    onClick={() => window.open(`https://github.com/search?q=${project.name}`, '_blank')}
                  >
                    <Code2 className="h-4 w-4 mr-2" /> Code
                  </Button>
                  
                  <Button 
                    className={`flex-1 text-xs md:text-sm transition-all ${
                      project.has_voted 
                        ? "bg-green-600 hover:bg-green-700 text-white" 
                        : "bg-zinc-900 text-white hover:bg-zinc-800"
                    }`}
                    onClick={() => handleVote(project)}
                    disabled={project.has_voted || votingId === project.id}
                  >
                    {votingId === project.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : project.has_voted ? (
                      <> <Check className="h-4 w-4 mr-2" /> Voted </>
                    ) : (
                      "Vote Now"
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Projects