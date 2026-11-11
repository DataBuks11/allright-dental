// import React, { useEffect, useState } from 'react';
// import Sidebar from '../components/Navbar';

// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   Tooltip,
//   CartesianGrid,
//   ResponsiveContainer,
//   Legend,
// } from 'recharts';

// import { CSVLink } from 'react-csv';
// import jsPDF from 'jspdf';
// import autoTable from 'jspdf-autotable'; // ✅ Correct import

// const Reports = () => {
//   const [data, setData] = useState([]);
//   const [filteredData, setFilteredData] = useState([]);
//   const [yearFilter, setYearFilter] = useState('');
//   const [sortOrder, setSortOrder] = useState('desc');
//   const [startDate, setStartDate] = useState('');
//   const [endDate, setEndDate] = useState('');

//   useEffect(() => {
//     fetch('https://localhost//dental_admin_panel/api/get-monthly-reports.php')
//       .then(res => res.json())
//       .then(res => {
//         if (res.success && Array.isArray(res.data)) {
//           setData(res.data);
//           setFilteredData(res.data);
//         } else {
//           console.error('Failed to load report data');
//         }
//       })
//       .catch(err => console.error('Error fetching report:', err));
//   }, []);

//   useEffect(() => {
//     let result = [...data];

//     if (yearFilter) {
//       result = result.filter(item => item.month.startsWith(yearFilter));
//     }

//     if (startDate && endDate) {
//       result = result.filter(item => {
//         const monthDate = new Date(item.month + '-01');
//         return monthDate >= new Date(startDate) && monthDate <= new Date(endDate);
//       });
//     }

//     result.sort((a, b) => {
//       return sortOrder === 'asc'
//         ? new Date(a.month + '-01') - new Date(b.month + '-01')
//         : new Date(b.month + '-01') - new Date(a.month + '-01');
//     });

//     setFilteredData(result);
//   }, [yearFilter, sortOrder, startDate, endDate, data]);

//   const exportPDF = () => {
//     const doc = new jsPDF();
//     doc.text('Monthly Appointment Report', 14, 16);
//     const tableData = filteredData.map(row => [
//       formatMonth(row.month),
//       row.appointments,
//     ]);

//     autoTable(doc, {
//       head: [['Month', 'Appointments']],
//       body: tableData,
//     });

//     doc.save('appointment_report.pdf');
//   };

//   const formatMonth = (monthStr) => {
//     const date = new Date(monthStr + '-01');
//     return date.toLocaleString('default', { month: 'long', year: 'numeric' });
//   };

//   return (
//     <div className="d-flex">
//       <Sidebar />
//       <div className="flex-grow-1 p-4" style={{ marginLeft: '250px', minHeight: '100vh' }}>
//         <h2 className="mb-4">📊 Monthly Reports</h2>

//         <div className="d-flex flex-wrap gap-3 align-items-end mb-4">
//           <div>
//             <label>Year:</label>
//             <input
//               type="number"
//               className="form-control"
//               value={yearFilter}
//               onChange={e => setYearFilter(e.target.value)}
//               placeholder="e.g., 2025"
//             />
//           </div>
//           <div>
//             <label>Sort Order:</label>
//             <select className="form-control" value={sortOrder} onChange={e => setSortOrder(e.target.value)}>
//               <option value="desc">Descending</option>
//               <option value="asc">Ascending</option>
//             </select>
//           </div>
//           <div>
//             <label>Start Date:</label>
//             <input type="month" className="form-control" onChange={e => setStartDate(e.target.value)} />
//           </div>
//           <div>
//             <label>End Date:</label>
//             <input type="month" className="form-control" onChange={e => setEndDate(e.target.value)} />
//           </div>
//           <div>
//             <label>Export:</label><br />
//             <button className="btn btn-sm btn-danger me-2" onClick={exportPDF}>Export PDF</button>
//             <CSVLink
//               className="btn btn-sm btn-success"
//               filename="appointment_report.csv"
//               data={filteredData.map(r => ({
//                 Month: formatMonth(r.month),
//                 Appointments: r.appointments
//               }))}
//             >
//               Export CSV
//             </CSVLink>
//           </div>
//         </div>

//         {/* Chart */}
//         <div style={{ width: '100%', height: 300 }} className="mb-5">
//           <ResponsiveContainer>
//             <BarChart data={filteredData}>
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis dataKey="month" tickFormatter={formatMonth} />
//               <YAxis />
//               <Tooltip labelFormatter={formatMonth} />
//               <Legend />
//               <Bar dataKey="appointments" fill="#0d6efd" name="Appointments" />
//             </BarChart>
//           </ResponsiveContainer>
//         </div>

//         {/* Table */}
//         <table className="table table-striped table-hover">
//           <thead className="table-primary">
//             <tr>
//               <th>📅 Month</th>
//               <th>📋 Appointments</th>
//             </tr>
//           </thead>
//           <tbody>
//             {filteredData.map((r, i) => (
//               <tr key={i}>
//                 <td>{formatMonth(r.month)}</td>
//                 <td>{r.appointments}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default Reports;
