import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import Nav from '../nav'
import Footer from '../footer'



const ViewUserBlog = () => {
    const [userblog, setUserblog] = useState([])
    const { id } = useParams()
    const nevigate=useNavigate()

    useEffect(() => {
        if (id) {
            axios.get(`http://localhost:1000/userblog/showuserblog/${id}`)
                .then((response) => {
                    setUserblog(response.data.data)
                    console.log(response.data.data)
                })
                .catch((err) => {
                    console.log("the some occupai error", err)
                })
        }
    }, [id])


    return (
        <>
        <div>
            <Nav/>
        </div>
            <div>
                <h1>view user blog page</h1>
                <div>
                    <img src={`http://localhost:1000/userimages/${userblog.imagePath}`} height={200} width={300} alt="" />
                    <p>{userblog.title}</p>
                    <p>{userblog.description}</p>
                </div>
                <button onClick={()=>nevigate('/profile')}>back</button>
            </div>
            <Footer/>
        </>
    )
}


export default ViewUserBlog;