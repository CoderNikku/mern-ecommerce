import axios from "axios";
import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import Nav from "../nav";
import Footer from "../footer";


const AddminLogin = () => {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const navigate = useNavigate()

    const handleLogin = async (e) => {
        e.preventDefault();

        if (!username || !password) {
            setError("please enter borth username and password")
        }

        const adminuser = { username, password }
        console.log(adminuser)

        try {
            const response = await axios.post('http://localhost:1000/admin/adminlogin', adminuser, {
                headers: { "Content-Type": "application/json" },
            });
            console.log("server response", response.data);
            setError("")

            // Store user data in localStorage (adjust based on your backend response)
            const { token } = response.data;
            localStorage.setItem("token", token); // <== Save token here
            const admin = response.data.admin || { username }; // Fallback to username if no user object
            localStorage.setItem("admin", JSON.stringify(admin));
            navigate("/admin")
        }
        catch (err) {
            console.log("Error detail: ", err.response ? err.response.data : err.message);
            setError(err.response?.data?.message || "an error occrred dring login. please try again. ");
        }
    }
    return (
        <>
        <div>
            <Nav/>
        </div>
            <div>
                <h3>enter the addmin email and password </h3>
                <Form onSubmit={handleLogin}>
                    <Form.Group>
                        <Form.Label>email/username</Form.Label>
                        <Form.Control onChange={(e) => setUsername(e.target.value)} placeholder="eneter the email/username" required />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Password</Form.Label>
                        <Form.Control onChange={(e) => setPassword(e.target.value)} placeholder="eneter the password" required />
                    </Form.Group>
                    <Button type="submit">Adminlogin</Button>
                </Form>
                {/* <Link to={'/adminsignin'}><Button type="submit">adminSignin</Button></Link> */}
            </div>
            <Footer />
        </>
    )
}
export default AddminLogin;



