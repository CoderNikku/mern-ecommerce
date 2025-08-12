import React from "react";
import { Form, Button } from "react-bootstrap"
import { Link } from "react-router-dom";

const Contact = () => {
    return (
        <>
            <div>
                <h1>Contact</h1>
                <Form>
                    <Form.Group>
                        <Form.Label>
                            ente the name
                        </Form.Label>
                        <Form.Control placeholder="enter your name" />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>
                            ente the mail
                        </Form.Label>
                        <Form.Control placeholder="enter your name" />
                    </Form.Group>
                    <Button type="submit">Submit</Button>
                </Form>
            </div>
        </>
    )
}

export default Contact;