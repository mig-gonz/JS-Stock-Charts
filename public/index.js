// main function
async function main() {
  const response = await fetch(
    "https://api.twelvedata.com/time_series?symbol=GME,AAPL,AMZN,AME&interval=1day&apikey=9f013699d290484a829fe79dcc5c131c"
  );
  const result = await response.json();

  let GME = result.GME;
  let AAPL = result.AAPL;
  let AMZN = result.AMZN;
  let AME = result.AME;
  // turning stock symbols into an arry
  const stocks = [GME, AAPL, AMZN, AME];

  const timeChartCanvas = document.querySelector("#time-chart");
  const highestPriceChartCanvas = document.querySelector(
    "#highest-price-chart"
  );
  const averagePriceChartCanvas = document.querySelector(
    "#average-price-chart"
  );

  // color funciton
  function getColor(stock) {
    if (stock === "GME") {
      return "rgba(61, 161, 61, 0.7)";
    }
    if (stock === "AAPL") {
      return "rgba(209, 4, 25, 0.7)";
    }
    if (stock === "AMZN") {
      return "rgba(18, 4, 209, 0.7)";
    }
    if (stock === "AME") {
      return "rgba(166, 43, 158, 0.7)";
    }
  }
  // console.log(stocks);

  // Chartjs, line chart
  stocks.forEach((stock) => stock.values.reverse());
  new Chart(timeChartCanvas.getContext("2d"), {
    type: "line",
    data: {
      labels: stocks[0].values.reverse().map((value) => value.datetime),
      datasets: stocks.map((stock) => ({
        label: stock.meta.symbol,
        data: stock.values.map((value) => parseFloat(value.high)),
        backgroundColor: getColor(stock.meta.symbol),
        borderColor: getColor(stock.meta.symbol),
      })),
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });

  // Chartjs, bar chart
  new Chart(highestPriceChartCanvas.getContext("2d"), {
    type: "bar",
    data: {
      labels: stocks.map((stock) => {
        return stock.meta.symbol;
      }),
      datasets: [
        {
          label: "Highest stock price",
          data: stocks.map((stock) => {
            let sortedStock = stock.values.map((value) => {
              return parseFloat(value.high);
            });
            sortedStock = sortedStock.sort(function (a, b) {
              return b - a;
            });
            // console.log(sortedStock);
            return sortedStock[0];
          }),
          backgroundColor: stocks.map((stock) => {
            return getColor(stock.meta.symbol);
          }),
          borderColor: stocks.map((stock) => {
            return getColor(stock.meta.symbol);
          }),
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });

  // average chart here, at this point just copy above chart and tweak it for average values
  new Chart(averagePriceChartCanvas.getContext("2d"), {
    type: "pie",
    data: {
      labels: stocks.map((stock) => stock.meta.symbol),
      datasets: [
        {
          label: "Average",
          backgroundColor: stocks.map((stock) => getColor(stock.meta.symbol)),
          borderColor: stocks.map((stock) => getColor(stock.meta.symbol)),
          data: stocks.map((stock) => calculateAverage(stock.values)),
        },
      ],
    },
  });

  // average price finder function
  function calculateAverage(values) {
    let total = 0;
    values.forEach((value) => {
      total += parseFloat(value.high);
    });
    return total / values.length;
  }
}

main();
