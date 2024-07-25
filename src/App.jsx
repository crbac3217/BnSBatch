import { useState, useEffect } from 'react';
import './App.css';
import Papa from 'papaparse';

function App() {
  const [csvArray, setCsvArray] = useState([]);
  const [orders, setOrders] = useState({});
  const [totals, setTotals] = useState({});

  // Fetch CSV data from Google Sheets on component mount
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("https://docs.google.com/spreadsheets/d/e/2PACX-1vQVgdv2ZeL9-980WmtSFyrPwZ9mAzYNkg7p0uUK-i3AsSTRhojMjViuERxSwrWn7tvAyKskOspZMHUu/pub?gid=0&single=true&output=csv");
      const text = await response.text();
      const results = Papa.parse(text, { header: true });
      if (results.data && results.data.length > 0) {
        setCsvArray(results.data);
        initializeOrders(results.data);
      }
    };

    fetchData();
  }, []);

  // Initialize orders from fetched CSV data
  const initializeOrders = (data) => {
    const initialOrders = {};
    data.forEach(item => {
      if (item && item[Object.keys(item)[0]]) {
        initialOrders[item[Object.keys(item)[0]]] = 0;
      }
    });
    setOrders(initialOrders);
  };

  // Handle changes to the order inputs
  const handleOrderChange = (itemName, value) => {
    setOrders(prevOrders => ({
      ...prevOrders,
      [itemName]: Number(value)
    }));
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
        <h2>Current Orders</h2>
      </div>
      {Object.keys(orders).length > 0 && (
        <div>
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
              <li key={index}>{ingredient}: {Math.ceil(totals[ingredient]/12) + " (" + totals[ingredient] + ")"}</li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}

export default App;
