import { Routes, Route } from 'react-router-dom';
import MainLayout from './layout/main-layout';
import AllCourses from './pages/all/all-courses';
import CoursesByInstructor from './pages/all/courses-by-instructor';


function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route path="all-courses" element={<AllCourses />} />
        <Route path="courses-by-instructor" element={<CoursesByInstructor />} />
      </Route>
    </Routes>
  );
}

export default App;