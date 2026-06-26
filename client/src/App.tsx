import SignUp from './pages/SignUp'
import { Routes,Route , BrowserRouter} from 'react-router-dom'
import Login from './pages/Login'
import HomeRedirect from './pages/HomeRedirect'
import {AppLayout} from './pages/AppLayout'
import Dashboard from './pages/Dashboard'
import {ProtectedRoute} from './pages/ProtectedRoute.tsx'
import Boards from './pages/Boards.tsx'

const App = () => {
  return (
    <div>
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomeRedirect/>}/>
        <Route  path="/signup" element={<SignUp/>}/>
        <Route  path="/signin" element={<Login/>}/>
        <Route path="/" element={<AppLayout/>}>
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard/>
          </ProtectedRoute>
        } />
        <Route path="/boards" element={
          <ProtectedRoute>
            <Boards/>
          </ProtectedRoute>
        }/>
        </Route>
      </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
