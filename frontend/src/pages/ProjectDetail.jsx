import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import api from "../api/axios" 
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import { ArrowLeft, MessageSquare, Loader2, ThumbsUp, Clock } from "lucide-react"

export default function ProjectDetail() {
  const { id } = useParams() 
  const navigate = useNavigate()
  
  const [project, setProject] = useState(null)
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState("")
  const [loading, setLoading] = useState(true)
  const [posting, setPosting] = useState(false)

  // 1. Fetch data
  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        const projectRes = await api.get(`/api/projects/${id}/`)
        setProject(projectRes.data)

        try {
           const commentsRes = await api.get(`/api/projects/${id}/comments/`)
           setComments(commentsRes.data.results || commentsRes.data || [])
        } catch (err) {
           console.log("No comments found yet.")
        }
      } catch (error) {
        console.error("Failed to fetch project:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchProjectData()
  }, [id])

  // 2. Submit comment
  const handleCommentSubmit = async (e) => {
    e.preventDefault()
    if (!newComment.trim()) return

    setPosting(true)
    try {
      const token = localStorage.getItem('access_token')
      const res = await api.post(`/api/projects/${id}/comments/`, 
        { content: newComment, text: newComment },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      
      setComments([res.data, ...comments])
      setNewComment("") 
    } catch (error) {
      console.error("Failed to post comment:", error)
      alert("Make sure your Django backend is running and accepts comments!")
    } finally {
      setPosting(false)
    }
  }

  // HELPER: Format dates to look professional (e.g., "Mar 13, 2026")
  const formatDate = (dateString) => {
    if (!dateString) return "Just now"
    const options = { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }
    return new Intl.DateTimeFormat('en-US', options).format(new Date(dateString))
  }

  if (loading) return (
    <div className="min-h-screen flex justify-center items-center bg-zinc-50">
      <Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
    </div>
  )

  if (!project) return <div className="p-10 text-center">Project not found!</div>

  return (
    <div className="min-h-screen bg-zinc-50 p-6 md:p-12">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Back Button */}
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Gallery
        </Button>

        {/* Project Header - UPGRADED */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="bg-white p-8 rounded-2xl shadow-sm border border-zinc-100 relative overflow-hidden"
        >
          {/* Decorative top border line */}
          <div className="absolute top-0 left-0 w-full h-1 bg-zinc-900"></div>

          <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-zinc-900 mb-2">{project.name}</h1>
              <p className="text-sm text-zinc-500">Built by <span className="font-semibold text-zinc-700">{project.creator}</span></p>
            </div>
            
            <div className="flex items-center gap-3">
              {project.category && (
                <Badge variant="secondary" className="uppercase tracking-wider text-xs px-3 py-1">
                  {project.category}
                </Badge>
              )}
              <div className="flex items-center bg-zinc-100 text-zinc-800 px-3 py-1 rounded-full text-sm font-semibold">
                <ThumbsUp className="w-4 h-4 mr-2 text-zinc-500" />
                {project.vote_count || 0} Votes
              </div>
            </div>
          </div>

          <div className="prose text-zinc-700 max-w-none leading-relaxed">
            <p>{project.description}</p>
          </div>
        </motion.div>

        {/* Comments Section - UPGRADED */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-white p-8 rounded-2xl shadow-sm border border-zinc-100"
        >
          <h2 className="text-xl font-bold text-zinc-900 mb-8 flex items-center">
            <MessageSquare className="mr-3 h-5 w-5 text-zinc-400" /> Evaluation Comments
            <span className="ml-3 bg-zinc-100 text-zinc-600 py-0.5 px-2.5 rounded-full text-xs font-bold">
              {comments.length}
            </span>
          </h2>

          {/* Comment List */}
          <div className="space-y-6 mb-10">
            {comments.length === 0 ? (
              <div className="text-center py-10 bg-zinc-50 rounded-xl border border-dashed border-zinc-200">
                <p className="text-zinc-500 text-sm">No comments yet. Be the first to evaluate!</p>
              </div>
            ) : (
              comments.map((c, index) => {
                const authorName = c.user || c.author || "Reviewer";
                const initial = authorName.charAt(0).toUpperCase(); // Grabs the first letter for the Avatar

                return (
                  <div key={index} className="flex gap-4 group">
                    {/* The Avatar Circle */}
                    <div className="flex-shrink-0 w-10 h-10 bg-zinc-900 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-sm group-hover:scale-105 transition-transform">
                      {initial}
                    </div>

                    {/* The Comment Bubble */}
                    <div className="flex-1 bg-zinc-50 p-4 rounded-2xl rounded-tl-none border border-zinc-100">
                      <div className="flex justify-between items-start mb-2">
                        <p className="text-sm font-bold text-zinc-900">{authorName}</p>
                        <p className="text-xs text-zinc-400 flex items-center">
                          <Clock className="w-3 h-3 mr-1" /> 
                          {formatDate(c.created_at || c.date_posted)}
                        </p>
                      </div>
                      <p className="text-zinc-700 text-sm leading-relaxed">{c.text || c.content}</p>
                    </div>
                  </div>
                )
              })
            )}
          </div>

          {/* Add Comment Form */}
          <form onSubmit={handleCommentSubmit} className="space-y-4 relative">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Leave professional feedback on code quality, UI, or architecture..."
              className="w-full min-h-[120px] p-4 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900 text-sm resize-y bg-zinc-50 focus:bg-white transition-colors"
              disabled={posting}
            />
            <div className="flex justify-end">
              <Button type="submit" className="bg-zinc-900 text-white hover:bg-zinc-800 px-8 rounded-lg" disabled={posting}>
                 {posting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                 {posting ? "Posting..." : "Post Evaluation"}
              </Button>
            </div>
          </form>
        </motion.div>

      </div>
    </div>
  )
}