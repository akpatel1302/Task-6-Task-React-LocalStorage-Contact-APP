// import { useState, useEffect } from "react";
// import { CSVLink, CSVDownload } from "react-csv";

// const Contact = () => {
//   const [contacts, setContacts] = useState([]);
//   const [showPopup, setShowPopup] = useState(false);
//   const [selectedContact, setSelectedContact] = useState(null);
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [phoneNumber, setPhoneNumber] = useState("");
//   const [image, setImage] = useState("");
//   const [userId, setUserId] = useState("");

//   // Load userId from local storage
//   useEffect(() => {
//     const storedUserId = localStorage.getItem("userId");
//     if (storedUserId) {
//       setUserId(storedUserId);
//     } else {
//       const newUserId = Date.now().toString();
//       setUserId(newUserId);
//       localStorage.setItem("userId", newUserId);
//     }
//   }, []);

//   // Load contacts from local storage
//   useEffect(() => {
//     const storedContacts = localStorage.getItem(`contacts_${userId}`);
//     if (storedContacts) {
//       setContacts(JSON.parse(storedContacts));
//     }
//   }, [userId]);

//   // Save contacts to local storage when contacts state changes
//   useEffect(() => {
//     localStorage.setItem(`contacts_${userId}`, JSON.stringify(contacts));
//   }, [contacts, userId]);

//   const openPopup = (contact) => {
//     setSelectedContact(contact);
//     setName(contact ? contact.name : "");
//     setEmail(contact ? contact.email : "");
//     setPhoneNumber(contact ? contact.phoneNumber : "");
//     setImage(contact ? contact.image : "");
//     setShowPopup(true);
//   };

//   const closePopup = () => {
//     setShowPopup(false);
//     setSelectedContact(null);
//     setName("");
//     setEmail("");
//     setPhoneNumber("");
//     setImage("");
//   };

//   const handleSave = () => {
//     const updatedContacts = [...contacts];
//     if (selectedContact) {
//       // Edit existing contact
//       const index = updatedContacts.findIndex(
//         (contact) => contact.id === selectedContact.id
//       );
//       updatedContacts[index] = {
//         ...selectedContact,
//         name,
//         email,
//         phoneNumber,
//         image,
//       };
//     } else {
//       // Add new contact
//       const newContact = { id: Date.now(), name, email, phoneNumber, image };
//       updatedContacts.push(newContact);
//     }
//     setContacts(updatedContacts);
//     closePopup();
//   };

//   const handleDelete = (id) => {
//     const updatedContacts = contacts.filter((contact) => contact.id !== id);
//     setContacts(updatedContacts);
//   };

//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     const reader = new FileReader();
//     reader.onloadend = () => {
//       setImage(reader.result);
//     };
//     reader.readAsDataURL(file);
//   };

//   const handleLogout = () => {
//     localStorage.removeItem("loggedInUser");
//     window.location.href = "/signin"; // Redirect sign-in page
//   };

//   return (
//     <div>
//       <CSVLink
//         className="btn btn-dark"
//         data={contacts}
//         filename={"contacts.csv"}
//       >
//         Export
//       </CSVLink>
//       <h1>Contact List</h1>
//       {/* <button>LOGOUT</button> */}
//       <button className="btn btn-dark" onClick={() => openPopup(null)}>
//         Add Contact
//       </button>
//       <button className="btn btn-danger" onClick={handleLogout}>
//         Logout
//       </button>
//       {showPopup && (
//         <div className="popup">
//           <div className="popup-content">
//             <span className="close" onClick={closePopup}>
//               &times;
//             </span>
//             <h2>{selectedContact ? "Edit Contact" : "Add Contact"}</h2>
//             <label>Name:</label>
//             <input
//               type="text"
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//             />
//             <label>Email:</label>
//             <input
//               type="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//             />
//             <label>Phone Number:</label>
//             <input
//               type="text"
//               value={phoneNumber}
//               onChange={(e) => setPhoneNumber(e.target.value)}
//             />
//             <label>Upload Photo:</label>
//             <input type="file" accept="image/*" onChange={handleImageChange} />
//             {image && <img src={image} alt="Contact" />}
//             <button onClick={handleSave}>Save</button>
//           </div>
//         </div>
//       )}
//       <div className="container display-contact d-flex justify-content-center pt-5">
//         <table>
//           <thead>
//             <tr>
//               <th>Name</th>
//               <th>Email</th>
//               <th>Phone Number</th>
//               <th>Image</th>
//               <th>Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {contacts.map((contact) => (
//               <tr key={contact.id}>
//                 <td>{contact.name}</td>
//                 <td>{contact.email}</td>
//                 <td>{contact.phoneNumber}</td>
//                 <td>
//                   <img
//                     src={contact.image}
//                     height={100}
//                     width={100}
//                     alt={contact.name}
//                   />
//                 </td>
//                 <td>
//                   <button
//                     className="btn btn-primary"
//                     onClick={() => openPopup(contact)}
//                   >
//                     Edit
//                   </button>
//                   <button
//                     className="btn btn-danger"
//                     onClick={() => handleDelete(contact.id)}
//                   >
//                     Delete
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default Contact;

import { useState, useEffect } from "react";
import { CSVLink } from "react-csv";
import { useNavigate } from "react-router-dom";
import papa from "papaparse";

const Contact = () => {
  const [contacts, setContacts] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [image, setImage] = useState("");
  const [userId, setUserId] = useState("");
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  // Load userId from local storage
  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      setUserId(storedUserId);
    } else {
      const newUserId = Date.now().toString();
      setUserId(newUserId);
      localStorage.setItem("userId", newUserId);
    }
  }, []);

  // Load contacts from local storage
  useEffect(() => {
    const storedContacts = localStorage.getItem(`contacts_${userId}`);
    if (storedContacts) {
      setContacts(JSON.parse(storedContacts));
    }
  }, [userId]);

  // Save contacts to local storage when contacts state changes
  useEffect(() => {
    localStorage.setItem(`contacts_${userId}`, JSON.stringify(contacts));
  }, [contacts, userId]);

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
    const updatedContacts = [...contacts];
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
    setContacts(updatedContacts);
    closePopup();
  };

  const handleDelete = (id) => {
    const del = window.confirm("Are you sure to delete this contact...?");
    if (del) {
      const updatedContacts = contacts.filter((contact) => contact.id !== id);
      setContacts(updatedContacts);
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
      navigate("/signin"); // Redirect sign-in page
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
          setData(parsedData.data);

          console.log(parsedData.data);
        },
      });
    };
    reader.readAsText(file);
  };

  const handleFileImport = () => {
    const updatedContacts = [...contacts, ...data];
    setContacts(updatedContacts);
    localStorage.setItem(`contacts_${userId}`, JSON.stringify(updatedContacts));
  };

  return (
    <div>
      <CSVLink
        className="btn btn-dark"
        data={contacts}
        filename={"contacts.csv"}
      >
        Export
      </CSVLink>
      <h1>Contact List</h1>
      <label
        htmlFor="importFile"
        className="btn btn-dark"
        onClick={handleFileImport}
      >
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
            <input type="file" accept="image/*" onChange={handleImageChange} />
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
            {contacts.map((contact) => (
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
  );
};

export default Contact;
