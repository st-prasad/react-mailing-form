import { useState } from "react";
import "./App.css";

const ContactForm = () => {
  const formInitialDetails = {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: "",
  };
  const [formDetails, setFormDetails] = useState(formInitialDetails);
  const [buttonText, setButtonText] = useState("Send");
  const [status, setStatus] = useState({});

  const onFormUpdate = (category, value) => {
    setFormDetails({
      ...formDetails,
      [category]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

      // Validation check
  if (
    formDetails.firstName.trim() === "" ||
    formDetails.email.trim() === "" ||
    formDetails.message.trim() === ""
    //trim() remove any leading or trailing whitespace from the input values before checking if they are empty
  ) {
    setStatus({
      success: false,
      message: "Please fill in all the required fields.",
    });
    return;
  }

    setButtonText("Sending...");

    try {
    const response = await fetch("/api/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
      body: JSON.stringify(formDetails),
    });

    const result = await response.json();
    setButtonText("Send");
    // setStatus(JSON.parse(text));
    setFormDetails(formInitialDetails);
    console.log(result.status);


    if (result.status === "success") {
      setStatus({
        success: true,
        message: "Message Sent!",
      });
    } else if (result.status === "error") {
      setStatus({
        success: false,
        message: "Message Failed!, try again later",
      });
    }
  } catch (error) {
    console.error("Error:", error.message);
    console.error("Error Stack:", error.stack);
    setStatus({
      success: false,
      message: "Could not connect to server. Please try again later.",
    });
  }
};

  return (
    <div className="form-container">
      <h1>Contact Us</h1>
      <p>We're here to help if you have any questions</p>
      <form className="form-inner" onSubmit={handleSubmit}>
        <div className="row">
          <input
            type="text"
            value={formDetails.firstName}
            placeholder="First Name"
            onChange={(e) => onFormUpdate("firstName", e.target.value)}
          />
          <input
            type="text"
            value={formDetails.lastName}
            placeholder="Last Name"
            onChange={(e) => onFormUpdate("lastName", e.target.value)}
          />
        </div>
        <div className="row">
          <input
            type="email"
            value={formDetails.email}
            placeholder="Email Address"
            onChange={(e) => onFormUpdate("email", e.target.value)}
          />
          <input
            type="tel"
            value={formDetails.phone}
            placeholder="Phone No."
            onChange={(e) => onFormUpdate("phone", e.target.value)}
          />
        </div>
        <div className="row">
          <textarea
            rows="6"
            value={formDetails.message}
            placeholder="Message"
            onChange={(e) => onFormUpdate("message", e.target.value)}
          ></textarea>
        </div>
        <button type="submit">{buttonText}</button>
        {status.message && (
          <div className="row">
            <p className={status.success === false ? "danger" : "success"}>
              {status.message}
            </p>
          </div>
        )}
      </form>
    </div>
  );
};

export default ContactForm;
