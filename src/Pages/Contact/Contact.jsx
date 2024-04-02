import { useState, useEffect } from "react";
import { CSVLink } from "react-csv";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFileExport,
  faFileImport,
  faSignOutAlt,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";

import papa from "papaparse";
import "./Contact.css"; // Import CSS file for custom styling

const Contact = () => {
  const [user, setUser] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [image, setImage] = useState("");
  const [noContactAvailable, setNoContactAvailable] = useState(false);
  const [emailValid, setEmailValid] = useState(true);
  const [phoneValid, setPhoneValid] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (loggedInUser) {
      setUser(loggedInUser);
    }
  }, [navigate]);

  useEffect(() => {
    if (user && !user.contactList) {
      setUser({ ...user, contactList: [] });
    }
  }, [user]);

  //set contactList status Available or not Available
  useEffect(() => {
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
    setEmailValid(true);
    setPhoneValid(true);
  };

  //for save
  const handleSave = () => {
    const phoneNumberWithoutSpaces = phoneNumber.replace(/\s/g, "");
    const phoneNumberIsValid = /^\d{10}$/.test(phoneNumberWithoutSpaces);
    const emailIsValid = /\S+@\S+\.\S+/.test(email);

    if (!name.trim() || !emailIsValid || !phoneNumberIsValid) {
      alert("Please fill out all required fields correctly.");
      return;
    }

    const updatedContacts = [...user.contactList];
    if (selectedContact) {
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
      const newContact = { id: Date.now(), name, email, phoneNumber, image };
      updatedContacts.push(newContact);
    }
    setUser({ ...user, contactList: updatedContacts });

    const userRecords = JSON.parse(localStorage.getItem("userRecords")) || [];
    const updatedUserRecords = userRecords.map((u) =>
      u.id === user.id ? { ...user, contactList: updatedContacts } : u
    );
    localStorage.setItem("userRecords", JSON.stringify(updatedUserRecords));

    closePopup();
  };

  //for deleting users's contacts
  const handleDelete = (id) => {
    const del = window.confirm("Are you sure to delete this contact...?");
    if (del) {
      const updatedContacts = user.contactList.filter(
        (contact) => contact.id !== id
      );
      setUser({ ...user, contactList: updatedContacts });

      const userRecords = JSON.parse(localStorage.getItem("userRecords")) || [];
      const updatedUserRecords = userRecords.map((u) =>
        u.id === user.id ? { ...user, contactList: updatedContacts } : u
      );
      localStorage.setItem("userRecords", JSON.stringify(updatedUserRecords));
    }
  };

  //for image upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  //for Logout
  const handleLogout = () => {
    const response = window.confirm("Are you sure you want to logout?");
    if (response) {
      localStorage.removeItem("loggedInUser");
      navigate("/signin");
    }
  };

  // for import files
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

  // for image remove
  const handleRemoveImage = () => {
    setImage(""); // Clear the image state
  };

  //match user id
  useEffect(() => {
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
      <div className="container mt-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="mb-0">Contact List</h1>
          <div>
            <CSVLink
              className="btn btn-dark me-2"
              data={user.contactList}
              filename={"contacts.csv"}
              disabled={!user.contactList || user.contactList.length === 0}
            >
              <FontAwesomeIcon icon={faFileExport} className="me-1" />
              Export
            </CSVLink>
            <label htmlFor="importFile" className="btn btn-dark me-2">
              <FontAwesomeIcon icon={faFileImport} className="me-1" />
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
              className="btn btn-outline-success me-2"
              onClick={() => openPopup(null)}
            >
              <FontAwesomeIcon icon={faPlus} className="me-1" />
              Add Contact
            </button>
            <button className="btn btn-danger" onClick={handleLogout}>
              <FontAwesomeIcon icon={faSignOutAlt} className="me-1" />
              Logout
            </button>
          </div>
        </div>
        {showPopup && (
          <div className="popup">
            <div className="popup-content">
              <span className="close" onClick={closePopup}>
                &times;
              </span>
              <h2>{selectedContact ? "Edit Contact" : "Add Contact"}</h2>
              <label>
                Name <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <label>
                Email <span className="text-danger">*</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setEmailValid(e.target.checkValidity());
                }}
                className={`form-control mb-3 ${
                  emailValid ? "" : "is-invalid"
                }`}
                required
              />
              <div className="invalid-feedback">
                Please provide a valid email.
              </div>
              <label>
                Phone Number <span className="text-danger">*</span>
              </label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => {
                  setPhoneNumber(e.target.value);
                  setPhoneValid(e.target.checkValidity());
                }}
                className={`form-control mb-3 ${
                  phoneValid ? "" : "is-invalid"
                }`}
                pattern="[0-9]{10}"
                required
              />
              <div className="invalid-feedback">
                Please provide a valid phone number.
              </div>
              <label>Upload Photo:</label>
              <div className="image-upload">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
                {image && (
                  <div className="preview-image">
                    <img src={image} alt="Contact" />
                    <span
                      className="btn remove-image"
                      onClick={handleRemoveImage}
                    >
                      <FontAwesomeIcon icon={faTrashAlt} className="me-1" />
                    </span>
                  </div>
                )}
              </div>
              <button onClick={handleSave} className="btn btn-primary mt-3">
                Save
              </button>
              {/* <button
                onClick={closePopup}
                className="btn btn-primary mt-3"
              >
                Cancel
              </button> */}
            </div>
          </div>
        )}
        <div className="table-responsive">
          <table className="table table-striped">
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
                        className="contact-image"
                      />
                    )}
                  </td>
                  <td>
                    <button
                      className="btn btn-primary btn-sm me-2"
                      onClick={() => openPopup(contact)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(contact.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {noContactAvailable && (
            <p className="text-center">No contact list available.</p>
          )}
        </div>
      </div>
    )
  );
};

export default Contact;
