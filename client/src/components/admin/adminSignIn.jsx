import axios from "axios";
import React, { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Nav from "../nav";
import Footer from "../footer";



const AdminSignin=()=>{
    const[username,setUsername]=useState("")
    const[email,setEmail]=useState("")
    const[password,setPassword]=useState("")
    const[confpassword,setConfpassword]=useState("")
    const[error,setError]=useState("")
    const navigate=useNavigate()

    const handleSubmit=async(e)=>{
        e.preventDefault()

        const adminuser={username,email,password,confpassword}
        console.log(adminuser)

        try{
            const response=await axios.post("http://localhost:1000/admin/adminreg", adminuser,{
                headers:{"Content-Type": "application/json"},
            });
            console.log("server response",response.data)
            setError("")
            navigate('/adminlogin')
        }
        catch(err){
            console.log("Error Detail", err.response? err.response.data : err.message )
            setError(err.response?.data?.message || "en error occpai dring registartion")
        }
    }

    return(
        <>
        <div>
            <p>admin signin pages</p>
            <Form onSubmit={handleSubmit}>
                <Form.Group>
                    <Form.Label>username</Form.Label>
                    <Form.Control onChange={(e)=>setUsername(e.target.value)} placeholder="enter the username "/>
                </Form.Group>
                <Form.Group>
                    <Form.Label>email</Form.Label>
                    <Form.Control onChange={(e)=>setEmail(e.target.value)} placeholder="enter the username "/>
                </Form.Group>
                <Form.Group>
                    <Form.Label>password</Form.Label>
                    <Form.Control type="password" onChange={(e)=>setPassword(e.target.value)} placeholder="enter the username "/>
                </Form.Group>
                <Form.Group>
                    <Form.Label>Confpassword</Form.Label>
                    <Form.Control type="password"  onChange={(e)=>setConfpassword(e.target.value)} placeholder="enter the username "/>
                </Form.Group>
                <Button type="submit">Signin</Button>
            </Form>
        </div>
        <Footer/>
        </>
    )
}
export default AdminSignin;