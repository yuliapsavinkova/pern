import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import TradesCanvas from './pages/TradesCanvas';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/canvas" element={<TradesCanvas />} />
      </Routes>
    </Router>
  );
}

export default App;
