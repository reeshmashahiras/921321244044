const express = require('express');
const axios = require('axios');
const { Deque } = require('collections/deque');

const app = express();
const port = 3000;

const windowSize = 10;
const numbersWindow = new Deque();

const fetchNumbers = async (numberType) => {
    try {
        const accessToken = "";
        const url = `http://20.244.56.144/test/${numberType}`;
        const headers = { Authorization: `Bearer ${accessToken}` };
        const response = await axios.get(url, { headers });
        return response.data.numbers || [];
    } catch (error) {
        console.error(`Error fetching numbers: ${error.message}`);
        return [];
    }
};

const calculateAverage = (numbers) => {
    try {
        if (numbers.length === 0) {
            return 0;
        }
        return numbers.reduce((sum, num) => sum + num, 0) / numbers.length;
    } catch (error) {
        console.error(`Error calculating average: ${error.message}`);
        return 0;
    }
};

app.get('/numbers/:numberType', async (req, res) => {
    const { numberType } = req.params;
    
    const numbersFetched = await fetchNumbers(numberType);

    numbersFetched.forEach((num) => {
        if (!numbersWindow.includes(num)) {
            numbersWindow.push(num);
            if (numbersWindow.length > windowSize) {
                numbersWindow.shift();
            }
        }
    });

    const avg = calculateAverage(Array.from(numbersWindow));

    const response = {
        windowPrevState: Array.from(numbersWindow),
        windowCurrState: Array.from(numbersWindow),
        numbers: numbersFetched,
        avg,
    };

    res.json(response);
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});