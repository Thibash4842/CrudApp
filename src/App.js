import { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';
// import e from 'express';

function App() {
  const [users, setUsers] = useState([]);
  const [filterUser, setFilterUser] = useState([]);
  const [isModelOpen, setIsModelOpen] = useState(false);
  const [userData, setUserData] = useState({name:"",age:"",city:""});

  const getAllUsers = async () => {
    await axios.get("http://localhost:8000/users").then
      ((res) => {
        setUsers(res.data);
        setFilterUser(res.data);
      });
  }

  useEffect(() => {
    getAllUsers();
  }, []);

  // Search function
  const handleSearchChane = (e) => {
    const searchText = e.target.value.toLowerCase();
    const filteredUsers = users.filter((user) => user.name.toLowerCase().includes(searchText) || user.city.toLowerCase().includes(searchText));
    setFilterUser(filteredUsers);
  }

  // Delete function
  const handleDelete = async (id) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this user?");
    if (isConfirmed) {
      await axios.delete(`http://localhost:8000/users/${id}`).then
        ((res) => {
          console.log(res.data)
          setUsers(res.data);
          setFilterUser(res.data);
        });
    }
  }

  // Add User Record
  const handleaAddRecord =()=>{
    setUserData({name:"",age:"",city:""});
    setIsModelOpen(true);
  }

  // close model
  const closeModel = () =>{
    setIsModelOpen(false);
    getAllUsers();
  }
  //get user data to set 
  const handleData = (e) =>{
  setUserData({...userData,[e.target.name]:e.target.value})
  }

  // submit function
  const handleSubmit = async (e) =>{
    e.preventDefault();
    if(userData.id){
    await axios.patch(`http://localhost:8000/users/${userData.id}`,userData).then
    ((res)=>{
      console.log(res)
    })
  }else {
    await axios.post("http://localhost:8000/users",userData).then
    ((res)=>{
      console.log(res)
    })
  }
  closeModel();
  setUserData({name:"",age:"",city:""});
}

  // update user function
  const handleUpdateReacord = (user) => {
    setUserData(user);
    setIsModelOpen(true);
  }
  return (
    <div className="App">
      <div className='container'>
        <h3>CRUD Application with React.js Front and Node.js Backend</h3>
        <div className='input-search'>
          <input type='search' placeholder='Saerch Text Here' onChange={handleSearchChane} />
          <button className='edit' onClick={handleaAddRecord}>Add Record</button>
        </div>
        <table>
          <thead>
            <tr>
              <th>S.No</th>
              <th>Name</th>
              <th>Age</th>
              <th>City</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {
              filterUser && filterUser.map((user, index) => {
                return (
                  <tr key={user.id}>
                    <td>{index + 1}</td>
                    <td>{user.name}</td>
                    <td>{user.age}</td>
                    <td>{user.city}</td>
                    <td><button className='btn edit' onClick={()=>handleUpdateReacord(user)}>Edit</button></td>
                    <td><button className='btn delete' onClick={() => handleDelete(user.id)}>Delete</button></td>
                  </tr>
                )
              })
            }
          </tbody>
        </table>
        {isModelOpen && (
          <div className='model'>
            <div className='model-content'>
              <span className='close' onClick={closeModel}>
                &times;
              </span>
              <h2>{userData.id ? "Update record" : "Add Record"}</h2>
              <div className='input-group'>
                <label htmlFor='name'>Full Name </label>
                <input type='text' id='name' name='name'value={userData.name} onChange={handleData} />
              </div>
              <div className='input-group'>
                <label htmlFor='age'>Age </label>
                <input type='number' id='age' name='age' value={userData.age} onChange={handleData} />
              </div>
              <div className='input-group'>
                <label htmlFor='city'>City </label>
                <input type='text' id='city' name='city' value={userData.city} onChange={handleData} />
              </div>
              <button className='btn edit' onClick={handleSubmit}>{userData.id ? "Update User":"Add User"}</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
