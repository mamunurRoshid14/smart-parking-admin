import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import { db } from "../firebase";
import "./ViewReport.css";
import "chart.js/auto";

function ViewReport() {
  const [reportData, setReportData] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [error, setError] = useState("");
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "Revenue by Date ($)",
        data: [],
        backgroundColor: "#36A2EB",
        borderColor: "#2A8BCF",
        borderWidth: 1,
      },
    ],
  });

  useEffect(() => {
    let unsubscribeUsers = () => {};
    let unsubscribeTransactions = () => {};

    const fetchReport = async () => {
      try {
        // Fetch users and listen for changes
        unsubscribeUsers = db.collection("authorizedRFIDs").onSnapshot(
          (usersSnapshot) => {
            const usersMap = {};
            usersSnapshot.forEach((doc) => {
              const data = doc.data();
              usersMap[doc.id] = data.fullName || "Unknown"; // Use document ID as key
            });

            // Fetch transactions and listen for changes
            unsubscribeTransactions = db.collection("transactions").onSnapshot(
              (transactionsSnapshot) => {
                const transactions = transactionsSnapshot.docs.map((doc) => ({
                  id: doc.id,
                  ...doc.data(),
                }));

                // Group transactions by user
                const groupedData = transactions.reduce((acc, transaction) => {
                  const userId = transaction.uid; // uid matches authorizedRFIDs doc ID
                  const userName = usersMap[userId] || "Unknown User";
                  if (!acc[userId]) {
                    acc[userId] = {
                      name: userName,
                      totalCost: 0,
                      transactionCount: 0,
                      transactions: [],
                      expanded: false,
                    };
                  }
                  acc[userId].totalCost += transaction.cost || 0;
                  acc[userId].transactionCount += 1;
                  acc[userId].transactions.push({
                    entry_time: transaction.entry_time || "N/A",
                    exit_time: transaction.exit_time || "N/A",
                    cost: transaction.cost || 0,
                  });
                  return acc;
                }, {});

                // Convert to array for table
                const data = Object.values(groupedData);

                // Group transactions by date for chart
                const revenueByDate = transactions.reduce((acc, t) => {
                  const date = t.entry_time
                    ? t.entry_time.split(" ")[0]
                    : "Unknown";
                  acc[date] = (acc[date] || 0) + (t.cost || 0);
                  return acc;
                }, {});
                const chartLabels = Object.keys(revenueByDate).sort();
                const chartValues = chartLabels.map(
                  (date) => revenueByDate[date]
                );

                // Calculate total revenue
                const revenue = transactions.reduce(
                  (sum, t) => sum + (t.cost || 0),
                  0
                );

                setReportData(data);
                setTotalRevenue(revenue);
                setChartData({
                  labels: chartLabels,
                  datasets: [
                    {
                      label: "Revenue by Date ($)",
                      data: chartValues,
                      backgroundColor: "#36A2EB",
                      borderColor: "#2A8BCF",
                      borderWidth: 1,
                    },
                  ],
                });
                setError("");
              },
              (err) => {
                setError(err.message);
              }
            );
          },
          (err) => {
            setError(err.message);
          }
        );
      } catch (err) {
        setError(err.message);
      }
    };

    fetchReport();

    // Cleanup listeners on unmount
    return () => {
      unsubscribeUsers();
      unsubscribeTransactions();
    };
  }, []);

  const toggleExpand = (index) => {
    setReportData((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, expanded: !item.expanded } : item
      )
    );
  };

  return (
    <div className="container">
      <h1 className="title">Transaction Report</h1>
      {error && <p className="error">{error}</p>}
      <div className="chart-container">
        <Bar
          data={chartData}
          options={{
            scales: {
              y: {
                beginAtZero: true,
                title: { display: true, text: "Revenue ($)" },
              },
              x: {
                title: { display: true, text: "Date" },
              },
            },
            plugins: {
              legend: { display: true },
              title: { display: true, text: "Revenue by Date" },
            },
          }}
        />
      </div>
      <div className="table-container">
        <table className="report-table">
          <thead>
            <tr className="table-header">
              <th>Name</th>
              <th>Total Transactions</th>
              <th>Total Fee ($)</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {reportData.map((row, index) => (
              <React.Fragment key={index}>
                <tr className="table-row">
                  <td>{row.name}</td>
                  <td>{row.transactionCount}</td>
                  <td>{row.totalCost.toFixed(2)}</td>
                  <td>
                    <button
                      className="details-button"
                      onClick={() => toggleExpand(index)}
                    >
                      {row.expanded ? "Hide" : "Show"} Details
                    </button>
                  </td>
                </tr>
                {row.expanded && (
                  <tr>
                    <td colSpan="4">
                      <table className="sub-table">
                        <thead>
                          <tr>
                            <th>Entry Date Time</th>
                            <th>Exit Date Time</th>
                            <th>Fee ($)</th>
                          </tr>
                        </thead>
                        <tbody>
                          {row.transactions.map((txn, idx) => (
                            <tr key={idx}>
                              <td>{txn.entry_time}</td>
                              <td>{txn.exit_time}</td>
                              <td>{txn.cost.toFixed(2)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
            <tr className="table-footer">
              <td colSpan="3">Total Revenue</td>
              <td>${totalRevenue.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ViewReport;
