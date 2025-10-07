import React, { use } from 'react'

const AllInstructors = () => {
    const [instructors, setInstructors] = useState([]);



    useEffect(() => {
        const fetchInstructors = async () => {
            try {
                const response = await fetch('http://localhost:3000/instructors?page=1&limit=3&search=');
                const data = await response.json();
                // Handle the fetched data
            } catch (error) {
                console.error('Error fetching instructors:', error);
            }
        };

        fetchInstructors();
    }, []);



  return (
    <div>All Instructors</div>
  )
}

export default AllInstructors