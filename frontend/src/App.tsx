import Home from './pages/Home'
import Login from './pages/auth/Login'
import SignUp from './pages/auth/SignUp'
import BaseLayout from './pages/BaseLayout'
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";

function App() {

  return (
    <>
      <Router>
        <Routes>
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<SignUp />} />
          <Route path="/" element={<BaseLayout />} >
            <Route index element={<Home />} />
          </Route>
        </Routes>
      </Router>
    </>
  )
}

export default App
