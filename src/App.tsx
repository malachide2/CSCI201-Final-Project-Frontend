import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import HikeDetail from './pages/HikeDetail';
import Login from './pages/Login';
import AddHike from './pages/AddHike';
import Profile from './pages/Profile';
import Friends from './pages/Friends';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-background">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/hike/:id" element={<HikeDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/add-hike" element={<AddHike />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/friends" element={<Friends />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
