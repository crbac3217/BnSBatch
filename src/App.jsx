import { useState, useEffect } from 'react';
import './App.css';
import Papa from 'papaparse';
import { db } from './firebase-config';
import { collection, addDoc, getDocs, deleteDoc, doc } from "firebase/firestore";

function App() {
  const [csvArray, setCsvArray] = useState([]);
  const [orders, setOrders] = useState({});
  const [totals, setTotals] = useState({});

  // Fetch CSV data from Firestore on component mount
  useEffect(() => {
    const fetchData = async () => {
      const querySnapshot = await getDocs(collection(db, "csvData"));
      if (!querySnapshot.empty) {
        const data = querySnapshot.docs[0].data().content; // Assuming we always use the first document
        setCsvArray(data);
        initializeOrders(data);
      }
    };

    fetchData();
  }, []);

  // Initialize orders from fetched or uploaded CSV data
  const initializeOrders = (data) => {
    const initialOrders = {};
    data.forEach(item => {
      if (item && item[Object.keys(item)[0]]) {
        initialOrders[item[Object.keys(item)[0]]] = 0; // Initialize each item's order count to 0
      }
    });
    setOrders(initialOrders);
  };

  // Handle CSV file input changes
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    Papa.parse(file, {
      complete: async function(results) {
        setCsvArray(results.data);
        initializeOrders(results.data);
        // Overwrite data in Firestore
        await addDoc(collection(db, "csvData"), {
          content: results.data,
          createdAt: new Date()
        });
      },
      header: true
    });
  };

  // Calculate and set totals based on orders
  const handleSubmitOrders = () => {
    const newTotals = {};
    csvArray.forEach(row => {
      const itemName = row[Object.keys(row)[0]];
      if (itemName && orders[itemName]) {
        Object.keys(row).forEach((ingredient, index) => {
          if (index > 0) {
            const quantity = parseInt(row[ingredient], 10) || 0;
            if (quantity > 0) {
              newTotals[ingredient] = (newTotals[ingredient] || 0) + (quantity * orders[itemName]);
            }
          }
        });
      }
    });
    setTotals(newTotals);
  };

  return (
    <>
      <div>
        <h1>Butter and Seashell Batch Calculator</h1>
        <h2>Upload your box sheet</h2>
        <input type="file" accept=".csv" onChange={handleFileChange} />
      </div>
      {Object.keys(orders).length > 0 && (
        <div>
          <h2>Orders:</h2>
          <ul>
            {Object.keys(orders).map((item, index) => (
              <li key={index}>
                {item}: <input
                  type="number"
                  value={orders[item]}
                  onChange={(e) => (e) => handleOrderChange(item, e.target.value)}
                />
              </li>
            ))}
          </ul>
          <button onClick={handleSubmitOrders}>Submit Orders</button>
        </div>
      )}
      {Object.keys(totals).length > 0 && (
        <div>
          <h2>Total Batches Needed:</h2>
          <ul>
            {Object.keys(totals).map((ingredient, index) => (
              <li key={index}>{ingredient}: {Math.ceil(totals[ingredient]/12) + " (" + totals[ingredient] + ")"}</li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}

export default App;
