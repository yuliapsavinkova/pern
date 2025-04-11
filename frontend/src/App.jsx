import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import PositionsCanvas from './pages/PositionsCanvas';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/canvas" element={<PositionsCanvas />} />
      </Routes>
    </Router>
  );
}

export default App;
