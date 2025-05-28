import React, { useEffect, useState } from 'react';
import Signup from './Signup';
import axios from "axios";


const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [userId, setUserId] = useState("");
  const [events, setEvents] = useState([]);
  const [addAdmin, setAddAdmin] = useState(false);
  const [expandedUserId, setExpandedUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const usersPerPage = 4;

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchUserInfo = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const response = await axios.get("/api/auth/userInfo", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data?.id) {
          setUserId(response.data.id);
        }
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };

    fetchUserInfo();
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get("/api/auth/getAllUsers", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(res.data.users);
      } catch (err) {
        console.error("Error fetching users:", err);
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchUsers();
  }, [userId]);


  const handleDelete = async (userIdToDelete) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/auth/deleteUser/${userIdToDelete}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(users.filter(user => user._id !== userIdToDelete));
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const indexOfLast = currentPage * usersPerPage;
  const currentUsers = users.slice(indexOfLast - usersPerPage, indexOfLast);
  const totalPages = Math.ceil(users.length / usersPerPage);

  return (
    <div>


      {loading ? (
        <div className="flex justify-center items-center h-screen">

        </div>
      ) : (
        <div className="mt-[95px] mb-[-120px] p-8 flex flex-col items-center justify-center font-[Segoe_UI]">
          <div className="w-full flex justify-between items-center mb-8">
            <h2>All Users</h2>
            <button className="hover:bg-[#001a4d] bg-[#002366] text-white px-6 py-3 border-none rounded-[10px] cursor-pointer font-semibold text-base transition-colors duration-300 ease-in-out hover:bg-[#001a4d]" onClick={() => setAddAdmin(true)}>
              Add Admin +
            </button>
          </div>

          {currentUsers.map((user) => (
            user.role === "master" ? <></>  :
            <div className="hover:shadow-lg w-[96%] grid grid-cols-[0.7fr_0.7fr_1fr_0.5fr_0.2fr] gap-4 bg-white border border-[#d0d7e4] rounded-[12px] p-6 mb-6 shadow-md hover:shadow-lg transition-shadow duration-300 ease-in-out" key={user._id}>
              <div className="mb-4">
                <h3 className = "m-0 text-xl text-black">{user.first_name || "Untitled User"}  {user.last_name}</h3>
              </div>
              <div className="flex justify-around text-center text-[16px] text-[#333] mb-4 flex-wrap gap-3">
                <p className='m-0 pr-3 break-words'>{user.email || "No email available"}</p>
              </div>
              <p className="role">{user.role}</p>
              <div className="flex justify-end gap-3">
                <button className="bg-transparent border-none cursor-pointer text-[15px] font-semibold px-3 py-2 rounded-lg transition-colors duration-200 text-red-500 hover:bg-[rgba(255,0,0,0.1)]" onClick={() => {
                  handleDelete(user.id)
                  }}>
                  Delete
                </button>
              </div>

              {expandedUserId === user.id && (
                <div className="w-[96%] mb-[15px] -mt-[10px] p-6 bg-[#eef4ff] border border-[#007bff] rounded-[12px] text-[16px]">
                  <h4 className='mb-3 text-[#002366] text-lg'>Booked Events:</h4>
                  {events.length > 0 ? (
                    <ul className='list-none pl-4'>
                      {events.map((event) => (
                        <li className="mb-2 pl-4 bg-[#333]" key={event._id}>
                          <strong>{event.name}</strong> — {event.category} — {event.price}$ — at {event.venue}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>No events found.</p>
                  )}
                </div>
              )}
            </div>
          ))}

          <div className="mt-6 text-center">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                className={`bg-babyJanaBlue text-white border-0 mx-[5px] py-[10px] px-[18px] rounded-[8px] cursor-pointer text-[15px] transition-colors duration-300 ease-in-out hover:bg-darkerJanaBlue active:bg-black ${currentPage === i + 1 ? "active" : ""}`}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      )}

      {addAdmin && (
        <div className="fixed top-[40px] left-0 w-full h-full  flex items-center justify-center z-[999]">
          <div className="relative bg-white rounded-[16px] mt-[-90px] w-[95%] max-w-[1000px] max-h-[90vh] overflow-y-visible p-0 shadow-[0_6px_24px_rgba(0,0,0,0.15)]">
            <button className="absolute top-[150px] right-[20px] bg-transparent border-0 text-2xl font-bold text-gray-800 cursor-pointer z-[1000]" onClick={() => setAddAdmin(false)}>✖</button>
            <Signup flag={true} />
          </div>
        </div>
      )}

    </div>
  );
};

export default ManageUsers;
