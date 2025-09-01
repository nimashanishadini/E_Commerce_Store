// src/context/AuthContext.jsx
import { createContext, useState, useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('token') || null)
  const navigate = useNavigate()

  // Set axios default baseURL
  axios.defaults.baseURL = 'http://localhost:5000/api' // ✅ Update this to match your backend port

  // Update Axios Authorization header when token changes
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    } else {
      delete axios.defaults.headers.common['Authorization']
    }
  }, [token])

  // Login Function
  const login = async (email, password) => {
    try {
      const response = await axios.post('/auth/login', { email, password })
      const { token, user } = response.data // ✅ Must match backend structure

      localStorage.setItem('token', token)
      setToken(token)
      setUser(user)

      return { success: true }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed',
      }
    }
  }

  // Logout Function
  const logout = () => {
    localStorage.removeItem('token')
    setToken(null)
    setUser(null)
    navigate('/login')
  }

  // Verify user session on app load
  useEffect(() => {
    const verifyAuth = async () => {
      if (!token) return

      try {
        const response = await axios.get('/auth/profile')
        setUser(response.data)
      } catch (err) {
        logout()
      }
    }

    verifyAuth()
  }, [token])

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
