import React, { useState } from "react";
import styled from "styled-components";

const Container = styled.div`
  width: 100%;
  max-width: 800px; 
  margin: 0 auto;
  padding: 40px 20px; 
  background-color: #f9f9f9; 
  border-radius: 10px; 
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); 
`;

const Title = styled.h2`
  text-align: center;
  color: ${({ theme }) => theme.primary};
  margin-bottom: 20px; 
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px; 
`;


const InputWrapper = styled.div`
  width: 80%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Input = styled.input`
  width: 95%;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 16px;
  transition: border-color 0.3s;
  margin: 0 auto;  
  &:focus {
    border-color: ${({ theme }) => theme.primary};
    outline: none;
  }
`;

const Textarea = styled.textarea`
width: 95%;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 16px;
  transition: border-color 0.3s;
  &:focus {
    border-color: ${({ theme }) => theme.primary};
    outline: none;
  }
`;

const Button = styled.button`
  padding: 15px; 
  border: none;
  border-radius: 5px;
  background-color: ${({ theme }) => theme.primary};
  color: white;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
  &:hover:not(:disabled) {
    background-color: ${({ theme }) => theme.primaryDark};
  }
`;

const Error = styled.span`
  color: red;
  font-size: 14px; 
`;

const ContactUs = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    let errors = {};
    if (!name) errors.name = "Name is required";
    if (!email) errors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) errors.email = "Email address is invalid";
    if (!message) errors.message = "Message is required";
    return errors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setIsSubmitting(true);
    // Here you can add the logic to send the form data to your backend
    console.log({ name, email, message });
    setTimeout(() => {
      setIsSubmitting(false);
      alert("Message sent!");
      setName("");
      setEmail("");
      setMessage("");
    }, 1000);
  };

  return (
    <Container>
      <Title>Feedback</Title>
      <Form onSubmit={handleSubmit}>
        <div>
          <Input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          {errors.name && <Error>{errors.name}</Error>}
        </div>
        <div>
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {errors.email && <Error>{errors.email}</Error>}
        </div>
        <div>
          <Textarea
            placeholder="Message"
            rows="5"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          {errors.message && <Error>{errors.message}</Error>}
        </div>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Sending..." : "Send Message"}
        </Button>
      </Form>
    </Container>
  );
};

export default ContactUs;
