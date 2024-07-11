import { useState, useEffect } from 'react';
import './App.css';
import Papa from 'papaparse'; // This library helps in parsing CSV files

function App() {
  const [csvFile, setCsvFile] = useState(null);
  const [csvArray, setCsvArray] = useState([]);
  const [orders, setOrders] = useState({});
  const [totals, setTotals] = useState({});

  // Function to handle file input change
  const handleFileChange = (e) => {
    setCsvFile(e.target.files[0]);
  };

  // Function to parse CSV file
  useEffect(() => {
    if (csvFile) {
      Papa.parse(csvFile, {
        complete: function(results) {
          setCsvArray(results.data);
          const initialOrders = {};
          results.data.forEach(item => {
            if (item && item[Object.keys(item)[0]]) {
              initialOrders[item[Object.keys(item)[0]]] = 0; // Initialize each item's order count to 0
            }
          });
          setOrders(initialOrders);
        },
        header: true,
      });
    }
  }, [csvFile]);

  // Handle changes to the order inputs
  const handleOrderChange = (itemName, value) => {
    setOrders(prevOrders => ({
      ...prevOrders,
      [itemName]: Number(value)
    }));
  };

  // Submit orders and calculate totals
  const handleSubmitOrders = () => {
    const newTotals = {};
    csvArray.forEach(row => {
      const itemName = row[Object.keys(row)[0]]; // Get the item name (assumed to be in the first column)
      if (itemName && orders[itemName]) {
        Object.keys(row).forEach((ingredient, index) => {
          if (index > 0) { // Skip the first column since it's the item name
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
                  onChange={(e) => handleOrderChange(item, e.target.value)}
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
              <li key={index}>{ingredient}: {Math.ceil(totals[ingredient]/12)+ " (" + totals[ingredient] + ")"}</li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}

export default App;
