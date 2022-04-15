import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
import { Navbar, RequireAuth, RequireCompany } from './components';
import { Login, Register, Main, Scheduler, FindCompany, Companies, Businesses } from './pages';

function App() {
  return (
    <>
      <Router>
        <Navbar/>
        <div className="container">
          <Routes>
            <Route path="/" element={<RequireAuth> <RequireCompany> <Main/> </RequireCompany> </RequireAuth>} />
            <Route path="/scheduler" element={<RequireAuth> <RequireCompany> <Scheduler/> </RequireCompany> </RequireAuth>} />
            <Route path="/scheduler/:id" element={<RequireAuth> <RequireCompany> <Scheduler/> </RequireCompany> </RequireAuth>} />
            <Route path="/companies" element={<RequireAuth> <RequireCompany> <Companies/> </RequireCompany> </RequireAuth>} />
            <Route path="/companies/:id" element={<RequireAuth> <RequireCompany> <Businesses/> </RequireCompany> </RequireAuth>} />
            <Route path='/login' element={<Login/>} />
            <Route path='/register' element={<Register/>} />
          </Routes>
        </div>
      </Router>
      <ToastContainer
        position="bottom-right"
        theme="colored"
      />
    </>
  );
}

export default App;
