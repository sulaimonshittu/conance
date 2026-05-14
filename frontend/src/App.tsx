import Home from '@/pages/Home'
import Login from '@/pages/auth/Login'
import SignUp from '@/pages/auth/SignUp'
import BaseLayout from '@/pages/BaseLayout'
import PageNotFound from '@/pages/PageNotFound'

import ChatList from '@lib/components/chat/ChatList'
//import Chat from "@lib/components/chat/Chat"

//Artisan Imports
import ArtisanHome from '@/pages/artisan/ArtisanHome'
import ArtisanLayout from '@/pages/artisan/ArtisanLayout'
import Earnings from "@/pages/artisan/Earnings"
import RequestsPage from "@/pages/artisan/jobs/Requests"
import Work from '@/pages/artisan/jobs/Work'
import RequestJob from '@/pages/artisan/jobs/RequestJob'
import OngoingJobDetails from '@/pages/artisan/jobs/OngoingJobDetails'
import CompletedJobDetails from '@/pages/artisan/jobs/CompletedJobDetails'

//Client Imports
import ClientHome from '@/pages/client/ClientHome'
import ClientLayout from '@/pages/client/ClientLayout'
import ScrollToTop from "@/lib/components/common/ScrollToTop";

import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";

import { Toaster } from "sonner";

function App() {

  return (
    <section className='max-w-[500px] min-w-[280px] w-full mx-auto'>
      <Toaster richColors closeButton position="top-right" />
      <Router>
        <ScrollToTop />
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
            <Route path="chat" element={<ChatList />} />
            <Route path="requests" element={<RequestsPage />} />
            <Route path="earnings" element={<Earnings />} />
            <Route path="work" element={<Work />} />
            <Route path="request-job/:id" element={<RequestJob />} />
            <Route path="ongoing-job/:id" element={<OngoingJobDetails />} />
            <Route path="completed-job/:id" element={<CompletedJobDetails />} />
          </Route>
          {/* client routes*/}
          <Route path="/client" element={<ClientLayout />} >
            <Route index element={<ClientHome />} />
            <Route path="chat" element={<ChatList />} />
          </Route>
          {/* 404 page not found*/}
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </Router>
    </section>
  )
}

export default App
