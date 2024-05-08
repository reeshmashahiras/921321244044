
const express = require('express');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 9876; 

const WINDOW_SIZE = 10;
let storedNumbers = [];


app.use(express.json());

app.get('/numbers/:numberid', async (req, res) => {
  const { numberid } = req.params;
  
  try {
   
    const response = await fetchNumbers(numberid);

    storedNumbers = updateStoredNumbers(response.numbers);
    const average = calculateAverage(storedNumbers);

    res.json({
      windowPrevState: storedNumbers.slice(-WINDOW_SIZE - 1, -1),
      windowCurrState: storedNumbers.slice(-WINDOW_SIZE),
      numbers: response.numbers,
      avg: average
    });
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});
const fetchNumbers = async (numberid) => {
  const response = await axios.get(`http://localhost:9876/numbers/e${numberid}`);
  return response.data;
};


const updateStoredNumbers = (newNumbers) => {
  const uniqueNumbers = new Set([...storedNumbers, ...newNumbers]);
  return Array.from(uniqueNumbers).slice(-WINDOW_SIZE);
};
const calculateAverage = (numbers) => {
  const sum = numbers.reduce((acc, num) => acc + num, 0);
  return sum / Math.min(numbers.length, WINDOW_SIZE);
};

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
