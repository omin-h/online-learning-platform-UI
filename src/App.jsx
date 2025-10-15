import { Routes, Route } from 'react-router-dom';
import MainLayout from './layout/main-layout';

import AllCourses from './pages/all/all-courses';


import Course  from './pages/admin/course';
import Students from './pages/admin/students';
import Instructors from './pages/admin/instructors';
import Enroll from './pages/admin/enrolls';

import CreateStudent from './pages/student/create-student';
import EnrollCourse from './pages/student/enroll-course';


import Login from './utils/login';
function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="create-student" element={<CreateStudent />} />
      <Route path="dashboard" element={<MainLayout />}>

        <Route path="all-courses" element={<AllCourses />} />
    

        <Route path="course" element={<Course />} />
        <Route path="students" element={<Students />} />
        <Route path="instructors" element={<Instructors />} />
        <Route path="enrolls" element={<Enroll />} />

        
        <Route path="enroll-course" element={<EnrollCourse />} />

   


      </Route>
    </Routes>
  );
}

export default App;