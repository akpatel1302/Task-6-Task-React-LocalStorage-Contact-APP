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
  const navigate = useNavigate();

  // Load user data from localStorage
  useEffect(() => {
    const userRecords = JSON.parse(localStorage.getItem("userRecords"));
    const loggedInUser = userRecords.find((user) => user.id);
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
  };

  const handleSave = () => {
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
    closePopup();
  };

  const handleDelete = (id) => {
    const del = window.confirm("Are you sure to delete this contact...?");
    if (del) {
      const updatedContacts = user.contactList.filter(
        (contact) => contact.id !== id
      );
      setUser({ ...user, contactList: updatedContacts });
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

  const handlefilechange = (e) => {
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
    // const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    // console.log(loggedInUser.id);
    if (user) {
      const userRecords = JSON.parse(localStorage.getItem("userRecords"));
      const updatedUserRecords = userRecords.map((u) =>
        u.id === user.id ? user : u
      );
      console.log("user.id: " + user.id);
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
            onChange={handlefilechange}
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
              />
              <label>Email:</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <label>Phone Number:</label>
              <input
                type="text"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
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
          <table className="">
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
                    <img
                      src={contact.image}
                      height={100}
                      width={100}
                      alt={contact.name}
                    />
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
          </table>
        </div>
      </div>
    )
  );
};

export default Contact;
