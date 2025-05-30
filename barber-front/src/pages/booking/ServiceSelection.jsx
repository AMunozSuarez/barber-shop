import React from 'react';

const ServiceSelection = () => {
  const services = [
    { id: 1, name: 'Haircut', duration: '30 mins', price: 20 },
    { id: 2, name: 'Shave', duration: '15 mins', price: 15 },
    { id: 3, name: 'Beard Trim', duration: '20 mins', price: 10 },
    { id: 4, name: 'Hair Coloring', duration: '60 mins', price: 50 },
  ];

  return (
    <div>
      <h1>Select a Service</h1>
      <ul>
        {services.map(service => (
          <li key={service.id}>
            <h2>{service.name}</h2>
            <p>Duration: {service.duration}</p>
            <p>Price: ${service.price}</p>
            <button>Select</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ServiceSelection;