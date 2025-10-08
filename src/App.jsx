import { Routes, Route } from 'react-router-dom';
import MainLayout from './layout/main-layout';

import AllCourses from './pages/all/all-courses';
import CoursesByInstructor from './pages/all/courses-by-instructor';
import FindCourseById from './pages/all/find-course';

import Course  from './pages/admin/course';
import Students from './pages/admin/students';
import Instructors from './pages/admin/instructors';
import Enroll from './pages/admin/enrolls';

import CreateStudent from './pages/student/create-student';
import EnrollCourse from './pages/student/enroll-course';

import CreateInstructor from './pages/instructor/create-instructor';

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
        <Route path="enrolls" element={<Enroll />} />

        <Route path="create-student" element={<CreateStudent />} />
        <Route path="enroll-course" element={<EnrollCourse />} />

        <Route path="create-instructor" element={<CreateInstructor />} />


      </Route>
    </Routes>
  );
}

export default App;