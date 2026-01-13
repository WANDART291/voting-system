import { useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "../api/axios"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Lock, Mail, Loader2, AlertCircle } from "lucide-react" 
import { motion } from "framer-motion"
import { Alert, AlertDescription } from "@/components/ui/alert"

const Login = () => {
  const [email, setEmail] = useState("") 
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // FIX: Added '/api' to the URL
      const response = await api.post('/api/auth/jwt/create/', {
        email: email,
        password: password
      })

      const accessToken = response.data.access
      localStorage.setItem('access_token', accessToken)
      
      console.log("Login Success! Token:", accessToken)
      
      // UPDATED: Redirect to Dashboard instead of Home
      navigate('/dashboard') 

    } catch (err) {
      console.error("Login Failed:", err)
      
      if (err.response && err.response.data) {
        setError(JSON.stringify(err.response.data)) 
      } else {
        setError("Connection failed. Is Django running?")
      }

    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="h-screen flex items-center justify-center bg-zinc-50 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="w-[350px] shadow-xl border-zinc-200">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Welcome Back</CardTitle>
            <CardDescription className="text-center">
              Enter your credentials to access the voting portal.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              
              {error && (
                <Alert variant="destructive" className="bg-red-50 text-red-600 border-red-200 p-3">
                  <AlertCircle className="h-4 w-4 inline mr-2" />
                  <AlertDescription className="inline text-xs break-all">
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
                  <Input 
                    id="email" 
                    type="email"
                    placeholder="student@alx.com" 
                    className="pl-9"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
                  <Input 
                    id="password" 
                    type="password" 
                    className="pl-9"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <Button type="submit" className="w-full bg-zinc-900 hover:bg-zinc-800" disabled={loading}>
                {loading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : "Sign In"}
              </Button>

            </form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-xs text-zinc-500">Secure connection via API</p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  )
}

export default Login