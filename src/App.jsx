import { useState, useEffect } from 'react';
import './App.css';
import Papa from 'papaparse'; // This library helps in parsing CSV files

function App() {
  const [count, setCount] = useState(0);
  const [csvFile, setCsvFile] = useState(null);
  const [csvArray, setCsvArray] = useState([]);

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
        },
        header: true,
      });
    }
  }, [csvFile]);

  return (
    <>
      <div>
        <h1>Butter and Seashell Admin Hub</h1>
      </div>
      <div>
        <input
          type="file"
          accept=".csv"
          onChange={handleFileChange}
        />
      </div>
      {csvArray.length > 0 && (
        <div>
          <h2>CSV Data:</h2>
          <table>
            <thead>
              <tr>
                {Object.keys(csvArray[0]).map((header, index) => (
                  <th key={index}>{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {csvArray.map((row, index) => (
                <tr key={index}>
                  {Object.values(row).map((val, idx) => (
                    <td key={idx}>{val}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

export default App;
