import Home from './pages/home';
import Main from './pages/main';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
   <BrowserRouter>
   <Routes>
    <Route path = "/" element = {<Home />}/>
    <Route path = "/main" element = {<Main />}/>
   </Routes>
   </BrowserRouter>
  );
}

export default App;
