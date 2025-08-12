import React, { useState } from "react";
import Nav from "./nav";
import image1 from "../assets/images/slide1.jpg";
import { Link } from "react-router-dom";
import About from "./about";
import Contact from "./contact";
import Footer from "./footer";
import Product from "./product";


const Home = () => {
    return (
        <>
            <Nav />
            {/* Banner */}
            <div className="navimage">
                <img src={image1} alt="Banner" height={300} width={900} />
                <p>Welcome to visit this E commerce Site</p>
                <p>visit th new proudct some new artical and etc </p>
                <Link to={"/blog"}><button>Click</button></Link>
            </div>
            <About/>
            <Product/>
            <Contact/>
            <Footer/>
        </>
    );
};

export default Home;
