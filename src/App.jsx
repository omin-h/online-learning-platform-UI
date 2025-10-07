import { Routes, Route } from 'react-router-dom';
import MainLayout from './layout/main-layout';
import AllCourses from './pages/all/all-courses';


function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route path="all-courses" element={<AllCourses />} />
      </Route>
    </Routes>
  );
}

export default App;