import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [carName, setCarName] = useState('');
  const [ownerId, setOwnerId] = useState('');
  const [personName, setPersonName] = useState('');
  const [carIdToDelete, setCarIdToDelete] = useState('');
  const [personIdToDelete, setPersonIdToDelete] = useState('');
  const [carIdToSell, setCarIdToSell] = useState('');
  const [newOwner, setNewOwner] = useState('');
  const [cars, setCars] = useState([]);
  const [persons, setPersons] = useState([]);
  const [carsOwners, setCarsOwners] = useState([]);
  
  const fetchCarsOwners = () => {
      axios.get('http://localhost:4000/carsOwners')
      .then(response => {
        setCarsOwners(response.data);
      })
      .catch(error => {
        console.error('Error fetching cars:', error);
      });
  }
  const fetchCars = () => {
    axios.get('http://localhost:4000/cars')
      .then(response => {
        setCars(response.data);
      })
      .catch(error => {
        console.error('Error fetching cars:', error);
      });
  };

  const fetchPersons = () => {
    axios.get('http://localhost:4000/persons')
      .then(response => {
        console.log(response.data);
        setPersons(response.data);
      })
      .catch(error => {
        console.error('Error fetching persons:', error);
      });
  };

  const createCar = () => {
    axios.post('http://localhost:4000/cars', { car_name: carName })
      .then(response => {
        console.log('Car created:', response.data);
      })
      .catch(error => {
        console.error('Error creating car:', error);
      });
  };

  const deleteCar = () => {
    axios.delete(`http://localhost:4000/cars/${carIdToDelete}`)
      .then(response => {
        console.log('Car deleted:', response.data);
      })
      .catch(error => {
        console.error('Error deleting car:', error);
      });
  };

  const sellCar = () => {
    axios.put(`http://localhost:4000/cars/${carIdToSell}/sell/${newOwner}`)
      .then(response => {
        console.log('Car sold:', response.data);
      })
      .catch(error => {
        console.error('Error selling car:', error);
      });
  };

  const createPerson = () => {
    axios.post('http://localhost:4000/persons', { fullname: personName })
      .then(response => {
        console.log('Person created:', response.data);
      })
      .catch(error => {
        console.error('Error creating person:', error);
      });
  };

  const deletePerson = () => {
    axios.delete(`http://localhost:4000/persons/${personIdToDelete}`)
      .then(response => {
        console.log('Person deleted:', response.data);
      })
      .catch(error => {
        console.error('Error deleting person:', error);
      });
  };

  useEffect(() => {
    fetchCars();
    fetchPersons();
    fetchCarsOwners();
  }, []);

  return (
      <div className="app-container">

        <div className="section">
          <h2>Cars with Owners</h2>
          <table>
            <thead>
              <tr>
                <th>Car Name</th>
                <th>Owner Name</th>
              </tr>
            </thead>
            <tbody>
              {carsOwners.map((car, index) => (
                <tr key={index}>
                  <td>{car.car_name}</td>
                  <td>{car.owner_name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>


        <div className="section">
          <h2>Cars</h2>
          <ul>
            {cars.map(car => (
              <li key={car.id}>
                ID: {car.id}, Car Name: {car.car_name}, Owner ID: {car.owner_id}
              </li>
            ))}
          </ul>
        </div>
  
        <div className="section">
          <h2>Persons</h2>
          <ul>
            {persons.map(person => (
              <li key={person.id}>
                ID: {person.id}, Full Name: {person.fullname}
              </li>
            ))}
          </ul>
        </div>
  
        <div className="section">
          <input type="text" placeholder="Car Name" value={carName} onChange={(e) => setCarName(e.target.value)} />
          <button onClick={createCar}>Create Car</button>
  
          <input type="text" placeholder="Car ID to delete" value={carIdToDelete} onChange={(e) => setCarIdToDelete(e.target.value)} />
          <button onClick={deleteCar}>Delete Car</button>
  
          <input type="text" placeholder="Car ID to sell" value={carIdToSell} onChange={(e) => setCarIdToSell(e.target.value)} />
          <input type="text" placeholder="New Owner ID" value={newOwner} onChange={(e) => setNewOwner(e.target.value)} />
          <button onClick={sellCar}>Sell Car</button>
        </div>
  
        <div className="section">
          <input type="text" placeholder="Person Name" value={personName} onChange={(e) => setPersonName(e.target.value)} />
          <button onClick={createPerson}>Create Person</button>
  
          <input type="text" placeholder="Person ID to delete" value={personIdToDelete} onChange={(e) => setPersonIdToDelete(e.target.value)} />
          <button onClick={deletePerson}>Delete Person</button>
        </div>
      </div>
    );
}

export default App;
