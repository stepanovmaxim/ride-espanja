import { HashRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Exam from './pages/Exam';
import Practice from './pages/Practice';

export default function App() {
  return (
    <HashRouter>
      <div className="app">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/exam" element={<Exam />} />
          <Route path="/practice" element={<Practice />} />
        </Routes>
      </div>
    </HashRouter>
  );
}
