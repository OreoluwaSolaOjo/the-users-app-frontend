import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './InputForm.css';
import { API_BASE_URL } from '../utils/base_url';
interface FormData {
    companyName: string;
    numOfUsers: number;
    numOfProducts: number;
    percentage: number;
}
interface User {
    email: string;
    numOfProducts: number,
    numOfUsers: number,
    percentage: number,
    companyName: string,
    id: string,
    file: File,
    image: string | null,
    // ... other fields if there are any
}
interface InputFormProps {
    onFormSubmit: (data: FormData) => void;
}

const InputForm: React.FC<InputFormProps> = ({ onFormSubmit }) => {
    const [companyName, setCompanyName] = useState<string | ''>('');
    const [numOfUsers, setNumOfUsers] = useState<number | ''>('');
    const [numOfProducts, setNumOfProducts] = useState<number | ''>('');
    const [percentage, setPercentage] = useState(0);
    const [authing, setAuthing] = useState(false);
    const navigate = useNavigate();
    const [userData, setUserData] = useState<User | null>(null);

    const userToken: any = localStorage.getItem("userToken");
    // const userToken = JSON.parse(_userToken);
    const userEmail: any = localStorage.getItem("email");
    useEffect(() => {

      if (userEmail ==="adminuser@getnada.com") {
        navigate('/')
      }
    }, []);
    useEffect(() => {

        if (numOfUsers !== '' && numOfProducts !== '' && Number(numOfProducts) + Number(numOfUsers) !== 0) {
            const calculatedPercentage = (Number(numOfUsers) / (Number(numOfUsers) + Number(numOfProducts))) * 100;
            setPercentage(calculatedPercentage);
        } else {
            setPercentage(0);
        }
    }, [numOfUsers, numOfProducts]);

    const handleSubmit = async () => {
        setAuthing(true)
        const _userEmail: any = localStorage.getItem("email");
        try {
            const payload = {
                companyName: companyName.toString(),
                numOfUsers: Number(numOfUsers),
                numOfProducts: Number(numOfProducts),
                percentage: parseFloat(percentage.toFixed(2)),
                email: _userEmail
            };
            // console.log("pa", payload.companyName)
            // console.log("pa", JSON.stringify(payload))
            // console.log("here i am", userToken)
          
            // const response = await fetch(`${API_BASE_URL}/submit-data`, {
                 const response = await fetch('/api/users/submit-data', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': userToken
                },
                body: JSON.stringify(payload)
            });

            const data = await response.json();
            // console.log("here is data", data)
            if (data.success) {
                alert('Record submitted successfully');
            } else {
                alert('Error submitting data');
            }
            setAuthing(false)
        } catch (error: any) {
            setAuthing(false);
            alert('Error logging in: ' + error.message);
        }
    }

    const handleLogout = () => {
        localStorage.clear()
        navigate('/login')
    }
    useEffect(() => {
        // console.log("got here 1")
        const _userToken: any = localStorage.getItem("userToken");
        const userId: any = localStorage.getItem("uid")
        console.log("this is token", _userToken)
        console.log("userId", userId)
        // console.log("_userToken:", _userToken);

        // console.log("got here 2")
        // const userToken = JSON.parse(_userToken)
        // console.log("userT", _userToken)

        const getUsers = async () => {

            // const response = await fetch(`${API_BASE_URL}/retrieve-non-admin-users`, {
                const response = await fetch(`/api/users/retrieve-single-data/${userId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': _userToken
                },

            });
            const data = await response.json();
            // console.log("newdata", data)
            console.log("this is single user", data.data)
            setUserData(data.data)
        }
        getUsers();
    }, [])
    return (
        <div className='user-input-container'>
            <div className='user-logout'>
                {/* <p>USER A</p> */}
                <p className='ptag'>Logged in as: <span className='span' >{userEmail}</span></p>
                <button onClick={handleLogout}>Logout</button>
            </div>
            {
               (userData && userData?.image) &&  <div>
               <img className='img-profile' src={userData?.image} alt="" />
               <h1>Hi User: {userData.email}</h1>
           </div>
            }
           
            <div>
                <p className='heading'>Company Name</p>
                <input
                    className='user-input'
                    type="text"
                    placeholder="Company Name"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                />
            </div>
            <div>
                <p className='heading'>Number of users</p>
                <input
                    className='user-input'
                    type="number"
                    placeholder="Number of Users"
                    value={numOfUsers}
                    onChange={(e) => setNumOfUsers(Number(e.target.value))}
                />
            </div>
            <div>
                <p className='heading'>Number of Products</p>
                <input
                    className='user-input'
                    type="number"
                    placeholder="Number of Products"
                    value={numOfProducts}
                    onChange={(e) => setNumOfProducts(Number(e.target.value))}
                />
            </div>
            <div>
                <p className='heading'>Percentage</p>
                <input
                    className='user-input'
                    type="text"
                    value={`${percentage.toFixed(2)}%`}
                    readOnly
                />
            </div>

            <button className='submit-btn' onClick={handleSubmit}>{authing ? 'Submitting' : 'Submit'}</button>

        </div>
    );
}

export default InputForm;
