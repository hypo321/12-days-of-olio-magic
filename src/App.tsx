import {
  BrowserRouter as Router,
  Routes,
  Route,
} from 'react-router-dom';
import { Calendar } from './components/Calendar';

function App() {
  return (
    <Router basename={process.env.NODE_ENV === 'production' ? '' : '/'}>
      <div className="min-h-screen bg-gradient-to-b from-red-100 to-green-100">
        <Routes>
          <Route path="/" element={<Calendar />} />
          <Route path="/day/:day" element={<Calendar />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
