import React from "react";
import { Link } from "react-router-dom";



const Footer = () => {
    return (
        <>
            <div className="footer">
                <div className="footer-left">
                    <input type="text" placeholder="enter your mail" />
                    <button>submit</button>
                </div>
                <div className="footer-right">
                    <Link><i >instagram</i></Link>
                    <Link><i>facebook</i></Link>
                    <Link><i >gmail</i></Link>
                </div>
            </div>
        </>
    )
}


export default Footer;