import axios from "axios";
import React, { useEffect, useState } from "react";
import { Form, Button } from "react-bootstrap"
import { useNavigate, useParams } from "react-router-dom";
import Nav from "../nav";


const AdminpostUpdate = () => {

    const [title, setTitle] = useState('')
    const [info, setInfo] = useState('')
    const [rate, setRate] = useState('')
    const [watching, setWatching] = useState('')
    const [file, setfile] = useState(null)
    const navigate = useNavigate()
    const { id } = useParams()
    const [error, setError] = useState('')

    const handleUpdate = async (e) => {
        e.preventDefault()

        const formData = new FormData();
        formData.append('title', title);
        formData.append('info', info);
        formData.append('rate', rate);
        formData.append('watching', watching)
        if (file) formData.append('imagePath', file)

        const token = localStorage.getItem('token');
        if (!token) {
            console.log('no token found localstorage')
            return
        }

        try {
            const response = await axios.put(`http://localhost:1000/adminblog/adminpostroute/${id}`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            console.log("data is updated", response.data)
            navigate('/admin')
        }
        catch (err) {
            setError('An error occurred while updating  ! not filed any filed .')
        }
    }

    // fech the by id post
    useEffect(() => {
        if (id) {
            axios.get(`http://localhost:1000/adminblog/showpost/${id}`)
                .then((res) => {
                    const post = res.data.data
                    setTitle(post.title)
                    setInfo(post.info)
                    setRate(post.rate)
                    setWatching(post.watching)
                    console.log(res.data.data)
                })
                .catch((err) => console.log("fetchingerror", err))
        }
    }, [id])

    return (
        <>
            <div>
                <h1>updating the admin Post</h1>
                 {error && <p style={{ color: 'red' }}>{error}</p>}
                <Form onSubmit={handleUpdate}>
                    <Form.Group>
                        <Form.Label>image</Form.Label>
                        <Form.Control type="file" onChange={(e) => setfile(e.target.files[0])} />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>title</Form.Label>
                        <Form.Control type="text" onChange={(e) => setTitle(e.target.value)} value={title} placeholder="enter the title" />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Info</Form.Label>
                        <Form.Control type="text" onChange={(e) => setInfo(e.target.value)} value={info} placeholder="enter the info t" />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>rating</Form.Label>
                        <Form.Control type="text" onChange={(e) => setRate(e.target.value)} value={rate} placeholder="enter the reating t" />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>watching</Form.Label>
                        <Form.Control type="text" onChange={(e) => setWatching(e.target.value)} value={watching} placeholder="enter the watching " />
                    </Form.Group>
                    <Button type="submit">update</Button>
                </Form>
                <Button onClick={() => navigate('/admin')}>Back</Button>
            </div>
            <Footer/>
        </>
    )
}


export default AdminpostUpdate;