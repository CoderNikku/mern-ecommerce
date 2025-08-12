import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import Nav from '../nav';
import Footer from '../footer';

const UpdateUserBlog = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [file, setFile] = useState(null);
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const { id } = useParams();

    const handleUpdate = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        if (file) formData.append('imagePath', file);

        const token = localStorage.getItem('token');
        if (!token) {
            console.log("No token found in localStorage");
            return;
        }

        try {
            const response = await axios.put(`http://localhost:1000/userblog/userblogup/${id}`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log("Updated data", response.data);
            navigate('/profile');
        } catch (err) {
            setError("An error occurred while updating.");
        }
    };

    useEffect(() => {
        if (id) {
            axios.get(`http://localhost:1000/userblog/showuserblog/${id}`)
                .then((response) => {
                    const blog = response.data.data;
                    setTitle(blog.title);
                    setDescription(blog.description);
                })
                .catch((err) => {
                    console.error("Error fetching blog", err);
                });
        }
    }, [id]);

    return (
        <>
            <div>
                <Nav />
            </div>

            <div>
                <h1>Update Blog</h1>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <Form onSubmit={handleUpdate}>
                    <Form.Group>
                        <Form.Label>Title</Form.Label>
                        <Form.Control
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                            type="text"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>File</Form.Label>
                        <Form.Control
                            type="file"
                            onChange={(e) => setFile(e.target.files[0])}
                        />
                    </Form.Group>
                    <Button type="submit">Submit</Button>{' '}
                    <Button onClick={() => navigate('/profile')}>Back</Button>
                </Form>
            </div>
            <Footer/>
        </>
    );
};

export default UpdateUserBlog;
