import axios from "axios";
import React, { useState } from "react";
import { Button, Form } from 'react-bootstrap'
import { Link, useNavigate } from "react-router-dom";
import Nav from "../nav";
import Footer from "../footer";




const Addminaddproduct = () => {
    const [file, setFile] = useState(null)
    const [name, setName] = useState('')
    const [description, setDescription] = useState()
    const [price, setPrice] = useState('')
    const navigate = useNavigate()


    const handleSubmit = async (e) => {
        e.preventDefault()

        const formData = new FormData()
        formData.append('name', name)
        formData.append('description', description)
        formData.append('price', price)
        if (file) {
            formData.append("productImage", file)
        }

        const token = localStorage.getItem('token');
        if (!token) {
            console.error("no token found the localstorage")
            return
        }

        console.log("Token", token);

        try {
            const response = await axios.post('http://localhost:1000/adminproduct/addproduct',
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
            console.log("product add", response)
            navigate('/admin')
        }
        catch (err) {
            console.log('occupai some eeror', err)
        }
    }


    return (
        <>
        <div>
        </div>
            <div>
                <Form onSubmit={handleSubmit}>
                    <Form.Group>
                        <Form.Label>image</Form.Label>
                        <Form.Control type="file" onChange={(e) => setFile(e.target.files[0])} required />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>name</Form.Label>
                        <Form.Control type="text" onChange={(e) => setName(e.target.value)} placeholder="enter the  product name" required />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>description</Form.Label>
                        <Form.Control type="text" onChange={(e) => setDescription(e.target.value)} placeholder="enter the description" required />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>price</Form.Label>
                        <Form.Control type="text" onChange={(e) => setPrice(e.target.value)} placeholder="enter the price" required />
                    </Form.Group>
                    <Button type="submit">submit</Button>
                </Form>
                <Link to={'/admin'}><Button>back</Button></Link>
            </div>
            <Footer/>
        </>
    )
}

export default Addminaddproduct;