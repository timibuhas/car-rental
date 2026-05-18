// src/utils/apiUtils.js

export const fetchApi = async () => {
    try {
      const [clientsResponse, carsResponse] = await Promise.all([
        fetch("http://localhost:5000/clienti"),
        fetch("http://localhost:5000/autoturisme"),
      ]);
  
      if (!clientsResponse.ok || !carsResponse.ok) {
        throw new Error("Failed to fetch data");
      }
  
      const clientsData = await clientsResponse.json();
      const carsData = await carsResponse.json();
  
      return { clients: clientsData, autoturisme: carsData }; // Return as an object
    } catch (err) {
      console.error("Error fetching data:", err);
      throw err; // Re-throw the error for handling in the component
    }
  };
  