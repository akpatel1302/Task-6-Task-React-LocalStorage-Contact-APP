import { useState, useEffect } from "react";
import { CSVLink } from "react-csv";
import { useNavigate } from "react-router-dom";
import papa from "papaparse";

const Contact = () => {
  const [user, setUser] = useState(null); // Current logged-in user
  const [showPopup, setShowPopup] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [image, setImage] = useState("");

  const [noContactAvailable, setNoContactAvailable] = useState(false); //  no contacts available

  const [emailValid, setEmailValid] = useState(true);
  const [phoneValid, setPhoneValid] = useState(true);
  const navigate = useNavigate();

  // Load user data from localStorage
  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (loggedInUser) {
      setUser(loggedInUser);
    } else {
      navigate("/signin"); // Redirect to signin if no user is logged in
    }
  }, [navigate]);

  useEffect(() => {
    // Initialize user's contactList if not already present
    if (user && !user.contactList) {
      setUser({ ...user, contactList: [] });
    }
  }, [user]);

  useEffect(() => {
    // Check if no contacts are available
    if (user && user.contactList && user.contactList.length === 0) {
      setNoContactAvailable(true);
    } else {
      setNoContactAvailable(false);
    }
  }, [user]);

  const openPopup = (contact) => {
    setSelectedContact(contact);
    setName(contact ? contact.name : "");
    setEmail(contact ? contact.email : "");
    setPhoneNumber(contact ? contact.phoneNumber : "");
    setImage(contact ? contact.image : "");
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
    setSelectedContact(null);
    setName("");
    setEmail("");
    setPhoneNumber("");
    setImage("");
    setEmailValid(true); // Reset email validation state
    setPhoneValid(true); // Reset phone number validation state
  };

  const handleSave = () => {
    // Custom validation for phone number and email
    const phoneNumberWithoutSpaces = phoneNumber.replace(/\s/g, ""); // Remove white spaces
    const phoneNumberIsValid = /^\d{10}$/.test(phoneNumberWithoutSpaces); // Check if phone number is exactly 10 digits

    const emailIsValid = /\S+@\S+\.\S+/.test(email); // Check if email is in valid format

    if (
      !name.trim() || // Check if name is empty or only contains white spaces
      !emailIsValid || // Check if email is not valid
      !phoneNumberIsValid // Check if phone number is not valid
    ) {
      alert("Please fill out all required fields correctly.");
      return;
    }

    const updatedContacts = [...user.contactList];
    if (selectedContact) {
      // Edit existing contact
      const index = updatedContacts.findIndex(
        (contact) => contact.id === selectedContact.id
      );
      updatedContacts[index] = {
        ...selectedContact,
        name,
        email,
        phoneNumber,
        image,
      };
    } else {
      // Add new contact
      const newContact = { id: Date.now(), name, email, phoneNumber, image };
      updatedContacts.push(newContact);
    }
    setUser({ ...user, contactList: updatedContacts });

    // Update localStorage
    const userRecords = JSON.parse(localStorage.getItem("userRecords")) || [];
    const updatedUserRecords = userRecords.map((u) =>
      u.id === user.id ? { ...user, contactList: updatedContacts } : u
    );
    localStorage.setItem("userRecords", JSON.stringify(updatedUserRecords));

    closePopup();
  };

  const handleDelete = (id) => {
    const del = window.confirm("Are you sure to delete this contact...?");
    if (del) {
      const updatedContacts = user.contactList.filter(
        (contact) => contact.id !== id
      );
      setUser({ ...user, contactList: updatedContacts });

      // Update localStorage
      const userRecords = JSON.parse(localStorage.getItem("userRecords")) || [];
      const updatedUserRecords = userRecords.map((u) =>
        u.id === user.id ? { ...user, contactList: updatedContacts } : u
      );
      localStorage.setItem("userRecords", JSON.stringify(updatedUserRecords));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleLogout = () => {
    const response = window.confirm("Are you sure you want to logout?");
    if (response) {
      localStorage.removeItem("loggedInUser");
      navigate("/signin"); // Redirect to signin page
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      papa.parse(result, {
        header: true,
        complete: (parsedData) => {
          setUser({
            ...user,
            contactList: [...user.contactList, ...parsedData.data],
          });
        },
      });
    };
    reader.readAsText(file);
  };

  useEffect(() => {
    // Update userRecords in localStorage when user state changes
    if (user) {
      const userRecords = JSON.parse(localStorage.getItem("userRecords")) || [];
      const updatedUserRecords = userRecords.map((u) =>
        u.id === user.id ? user : u
      );
      localStorage.setItem("userRecords", JSON.stringify(updatedUserRecords));
    }
  }, [user]);

  return (
    user && (
      <div>
        <CSVLink
          className="btn btn-dark"
          data={user.contactList}
          filename={"contacts.csv"}
          disabled={!user.contactList || user.contactList.length === 0} // Disable export button if no contacts available
        >
          Export
        </CSVLink>
        <h1>Contact List</h1>
        <label htmlFor="importFile" className="btn btn-dark">
          Import
          <input
            type="file"
            id="importFile"
            style={{ display: "none" }}
            accept=".csv"
            onChange={handleFileChange}
          />
        </label>
        <button
          className="btn btn-outline-success"
          onClick={() => openPopup(null)}
        >
          Add Contact
        </button>
        <button className="btn btn-danger" onClick={handleLogout}>
          Logout
        </button>
        {showPopup && (
          <div className="popup">
            <div className="popup-content">
              <span className="close" onClick={closePopup}>
                &times;
              </span>
              <h2>{selectedContact ? "Edit Contact" : "Add Contact"}</h2>
              <label>Name:</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <label>Email:</label>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setEmailValid(e.target.checkValidity()); // Update email validity state
                }}
                className={`form-control ${emailValid ? "" : "is-invalid"}`} // Apply Bootstrap validation
                required
              />
              <div className="invalid-feedback">
                Please provide a valid email.
              </div>
              <label>Phone Number:</label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => {
                  setPhoneNumber(e.target.value);
                  setPhoneValid(e.target.checkValidity()); // Update phone number validity state
                }}
                className={`form-control ${phoneValid ? "" : "is-invalid"}`} // Apply Bootstrap class based on phone number validity
                pattern="[0-9]{10}" // Update phone number pattern
                required
              />
              <div className="invalid-feedback">
                Please provide a valid phone number.
              </div>
              <label>Upload Photo:</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
              {image && <img src={image} alt="Contact" />}
              <button onClick={handleSave}>Save</button>
            </div>
          </div>
        )}
        <div className="container display-contact d-flex justify-content-center pt-5">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone Number</th>
                <th>Image</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {user.contactList.map((contact) => (
                <tr key={contact.id}>
                  <td>{contact.name}</td>
                  <td>{contact.email}</td>
                  <td>{contact.phoneNumber}</td>
                  <td>
                    {contact.image && (
                      <img
                        src={contact.image}
                        height={100}
                        width={100}
                        alt={contact.name}
                      />
                    )}
                  </td>
                  <td>
                    <button
                      className="btn btn-primary"
                      onClick={() => openPopup(contact)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleDelete(contact.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
            {noContactAvailable && (
              <p className="no-contact-msg">No contact list available.</p>
            )}{" "}
          </table>
        </div>
      </div>
    )
  );
};

export default Contact;
