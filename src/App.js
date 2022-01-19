// import logo from './logo.svg';
import './App.css';
import Main from "./components/structure/main";
import { BrowserRouter as Router } from 'react-router-dom'


function App() {
  return (
      <Router className="flex flex-col h-screen relative">
        <div className="bg-custom-pink-a dark:bg-custom-gray-b transition-all">
          <Main/>
        </div>
      </Router>
  );
}

export default App;
