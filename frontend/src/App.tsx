import Home from '@/pages/Home'
import Login from '@/pages/auth/Login'
import SignUp from '@/pages/auth/SignUp'
import BaseLayout from '@/pages/BaseLayout'
import PageNotFound from '@/pages/PageNotFound'

//Artisan Imports
import ArtisanHome from '@/pages/artisan/ArtisanHome'
import ArtisanLayout from '@/pages/artisan/ArtisanLayout'
import Earnings from "@/pages/artisan/Earnings"
import RequestsPage from "@/pages/artisan/Requests"
import Work from '@/pages/artisan/Work'

//Client Imports
import ClientHome from '@/pages/client/ClientHome'
import ClientLayout from '@/pages/client/ClientLayout'
import Chat from "@lib/components/chat/Chat"

import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";

function App() {

  return (
    <section className='max-w-[400px] min-w-[280px] w-full mx-auto'>
      <Router>
        <Routes>
          {/* auth routes*/}
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<SignUp />} />

          {/* base routes*/}
          <Route path="/" element={<BaseLayout />} >
            <Route index element={<Home />} />
          </Route>

          {/* artisan routes*/}
          <Route path="/artisan" element={<ArtisanLayout />} >
            <Route index element={<ArtisanHome />} />
            <Route path="chat" element={<Chat />} />
            <Route path="requests" element={<RequestsPage />} />
            <Route path="earnings" element={<Earnings />} />
            <Route path="work" element={<Work />} />
          </Route>
          {/* client routes*/}
          <Route path="/client" element={<ClientLayout />} >
            <Route index element={<ClientHome />} />
            <Route path="chat" element={<Chat />} />
          </Route>
          {/* 404 page not found*/}
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </Router>
    </section>
  )
}

export default App
