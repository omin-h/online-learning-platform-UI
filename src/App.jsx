import { Routes, Route } from 'react-router-dom';
import MainLayout from './layout/main-layout';

import AllCourses from './pages/all/all-courses';
import CoursesByInstructor from './pages/all/courses-by-instructor';
import FindCourseById from './pages/all/find-course';

import Course  from './pages/admin/course';
import Students from './pages/admin/students';
import Instructors from './pages/admin/instructors';



function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>

        <Route path="all-courses" element={<AllCourses />} />
        <Route path="courses-by-instructor" element={<CoursesByInstructor />} />
        <Route path="find-course" element={<FindCourseById />} />

        <Route path="course" element={<Course />} />
        <Route path="students" element={<Students />} />
        <Route path="instructors" element={<Instructors />} />
      </Route>
    </Routes>
  );
}

export default App;