import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faEye } from "@fortawesome/free-solid-svg-icons";
import Footer from "./footer";
import Nav from "./nav";

const ShowBlog = () => {
    const [post, setPost] = useState([])
    const { id } = useParams();


    useEffect(() => {
        if (id) {
            axios.get(`http://localhost:1000/adminblog/showpost/${id}`)
                .then((response) => {
                    setPost(response.data.data);
                    console.log(response.data.data)
                })
                .catch((err) => {
                    console.error("Error fetching post:", err);
                });
        }
    }, [id]);

    return (
        <>
        <Nav/>
            <div>
                <p><strong>{post.title}</strong></p>
                <img src={`http://localhost:1000/adblgim/${post.imagePath}`} height={300} width={400} alt="" />
                <p>{post.info}</p>
                <p>{post.view}</p>
                <p><FontAwesomeIcon icon={faStar} style={{ color: "gold" }} /> {post.rate}</p>
                <p><FontAwesomeIcon icon={faEye} />{post.watching}</p>
                <Link to={'/blog'}><button>back</button></Link>
            </div>
            <Footer/>
        </>
    )
}
export default ShowBlog;

