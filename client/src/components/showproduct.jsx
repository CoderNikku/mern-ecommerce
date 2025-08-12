import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { Button } from "react-bootstrap";
import Footer from "./footer";


const ShowProduct = () => {
    const [adminproduct, setAdminproduct] = useState([])
    const navigate = useNavigate()
    const { id } = useParams();


    useEffect(() => {
        if (id) {
            axios.get(`http://localhost:1000/adminproduct/showadminproduct/${id}`)
                .then((response) => {
                    setAdminproduct(response.data.data);
                    console.log(response.data.data)
                })
                .catch((err) => {
                    console.error("Error fetching post:", err);
                });
        }
    }, [id]);

    return (
        <>
            <div>
                <img src={`http://localhost:1000/adminproducts/${adminproduct.productImage}`} height={'400px'} width={'500px'} />
                <p>{adminproduct.name}</p>
                <p>{adminproduct.description}</p>
                <p>{adminproduct.price}</p>
                <Button>Buy</Button>
                <Link to={'/product'}><Button>Back</Button></Link>
            </div>
            <Footer />
        </>
    )
}

export default ShowProduct;