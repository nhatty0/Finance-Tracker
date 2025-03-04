// import React from "react";
// import { Line } from "@ant-design/charts";

// function ChartComponent({ sortedTransactions }) {
//   if (!Array.isArray(sortedTransactions) || sortedTransactions.length === 0) {
//     return <p>No data available</p>;
//   }

//   const data = sortedTransactions.map((item) => ({
//     date: item.date,
//     amount: item.amount,
//   }));

//   const config = {
//     data,
//     width: 800,
//     height: 400,
//     autoFit: false,
//     xField: "date",
//     yField: "amount",
//     point: {
//       size: 5,
//       shape: "diamond",
//     },
//     label: {
//       style: {
//         fill: "#aaa",
//       },
//     },
//   };

//   return (
//     <div>
//       <Line {...config} />
//     </div>
//   );
// }

// export default ChartComponent;
