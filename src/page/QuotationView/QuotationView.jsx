// import React, { useEffect, useState } from 'react'
import { generateRandom6Digit } from '../../utils/randomWithDate'
import { useLocation } from 'react-router-dom';

import React, { useEffect, useRef, useState } from "react";
// import { useLocation } from "react-router-dom";
import { formatter } from "../../utils/moneyFormatter";
import  "./QuotationView.scss"

function QuotationView() {
    const location = useLocation();
    console.log("location",location.state)
    const [projectData,SetProjectData]=useState()
    const [transformedData,setTransformedData]=useState()
    const [pdfData,setPdfData]=useState()
    const [subtotal,setSubtotal]=useState()
    const tableRef = useRef();




    useEffect(() => {
        SetProjectData(location.state.projectData)
        setTransformedData(location.state.transformedData)
        setSubtotal(location.state.subtotal)
        setPdfData(location.state.pdfData)
    }, [])
    const groupByCategory = (data = []) => {
      return data.reduce(
        (acc, item) => {
          const totalAmount =
            Number(item.amount || 0) +
            Number(item.hardware || 0) +
            Number(item.installation || 0) +
            Number(item.accessories || 0);
          if (!acc[item.category]) {
            acc[item.category] = {
              category: item.category,
              products: [],
              accessories: [],
              totalAmount: 0,
            };
          }
          acc[item.category].products.push(item);
          acc[item.category].totalAmount += totalAmount;
          if (item.accessorieslist && item.accessorieslist.length > 0) {
            acc[item.category].accessories = acc[item.category].accessories.concat(item.accessorieslist);
          }
          acc.grandTotal += totalAmount;
          return acc;
        },
        { grandTotal: 0 }
      );
    };
      const groupedData = groupByCategory(pdfData?.product_info);
    
      const createTable = (groupedData) => {
        const categoryNames = Object.keys(groupedData).filter(
          (name) => name !== "grandTotal"
        );
    
        return (
          <table
            className="offscreen"
            ref={tableRef}
            border="1"
            style={{
              color: "black",
              width: "100%",
              borderCollapse: "collapse",
              background: "white",
            }}
          >
            <thead>
              <tr
                style={{
                  backgroundColor: "#FFFF00",
                  color: "black",
                  textAlign: "center",
                }}
              >
                <th style={{ padding: "5px" }}>AREA OF WORK</th>
                <th style={{ padding: "5px" }}>Specification</th>
                <th style={{ padding: "5px" }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              {categoryNames.map((categoryName, index) => {
                const categoryData = groupedData[categoryName];
                return (
                  <React.Fragment key={index}>
                    {categoryData.products.map((item, productIndex) => {
                      const rows = [];
    
                      if (item.description) {
                        rows.push(
                          <tr key={`description-${productIndex}`}>
                            {productIndex === 0 && (
                              <td
                                rowSpan={categoryData.products.reduce(
                                  (acc, cur) =>
                                    acc +
                                    (cur.description ? 1 : 0) +
                                    (cur.hardware ? 1 : 0) +
                                    (cur.installation ? 1 : 0) +
                                    (cur.accessories ? 1 : 0),
                                  0
                                )}
                              >
                                {categoryName}
                              </td>
                            )}
                            <td>{`${item.productname} ${item.description}`}</td>
                            <td>{item.amount}</td>
                          </tr>
                        );
                      }
    
                      if (item.hardware) {
                        rows.push(
                          <tr key={`hardware-${productIndex}`}>
                            {productIndex === 0 && rows.length === 0 && (
                              <td
                                rowSpan={categoryData.products.reduce(
                                  (acc, cur) =>
                                    acc +
                                    (cur.description ? 1 : 0) +
                                    (cur.hardware ? 1 : 0) +
                                    (cur.installation ? 1 : 0) +
                                    (cur.accessories ? 1 : 0),
                                  0
                                )}
                              >
                                {categoryName}
                              </td>
                            )}
                            <td>Hardware</td>
                            <td>{item.hardware}</td>
                          </tr>
                        );
                      }
    
                      if (item.installation) {
                        rows.push(
                          <tr key={`installation-${productIndex}`}>
                            {productIndex === 0 && rows.length === 0 && (
                              <td
                                rowSpan={categoryData.products.reduce(
                                  (acc, cur) =>
                                    acc +
                                    (cur.description ? 1 : 0) +
                                    (cur.hardware ? 1 : 0) +
                                    (cur.installation ? 1 : 0) +
                                    (cur.accessories ? 1 : 0),
                                  0
                                )}
                              >
                                {categoryName}
                              </td>
                            )}
                            <td>Installation</td>
                            <td>{item.installation}</td>
                          </tr>
                        );
                      }
    
                      if (item.accessories) {
                        rows.push(
                          <tr key={`accessories-${productIndex}`}>
                            {productIndex === 0 && rows.length === 0 && (
                              <td
                                rowSpan={categoryData.products.reduce(
                                  (acc, cur) =>
                                    acc +
                                    (cur.description ? 1 : 0) +
                                    (cur.hardware ? 1 : 0) +
                                    (cur.installation ? 1 : 0) +
                                    (cur.accessories ? 1 : 0),
                                  0
                                )}
                              >
                                {categoryName}
                              </td>
                            )}
                            <td>Accessories</td>
                            <td>{item.accessories}</td>
                          </tr>
                        );
                      }
    
                      return rows;
                    })}
    
                    {categoryData.accessories.length > 0 && (
                      <React.Fragment>
                        <tr
                          style={{
                            backgroundColor: "#FFFF00",
                            color: "black",
                          }}
                        >
                          <td
                            style={{
                              padding: "5px",
                              fontWeight: "800",
                              textAlign: "center",
                            }}
                          >
                            SL NO
                          </td>
                          <td
                            style={{
                              padding: "5px",
                              fontWeight: "800",
                              textAlign: "center",
                            }}
                          >
                            SPECIFICATION
                          </td>
                          <td
                            style={{
                              padding: "5px",
                              fontWeight: "800",
                              textAlign: "center",
                            }}
                          >
                            IMAGE
                          </td>
                        </tr>
                        {categoryData.accessories.map(
                          (accessory, accessoryIndex) => (
                            <tr key={accessoryIndex}>
                              <td
                                style={{
                                  padding: "5px",
                                  textAlign: "center",
                                }}
                              >
                                {accessoryIndex + 1}
                              </td>
                              <td style={{ padding: "5px" }}>{accessory.name}</td>
                              <td
                                style={{
                                  padding: "5px",
                                  textAlign: "center",
                                  height: "20px",
                                }}
                              >
                                <img
                                  src="https://upload.wikimedia.org/wikipedia/en/thumb/4/41/Flag_of_India.svg/255px-Flag_of_India.svg.png"
                                  alt="image"
                                  width={50}
                                  height={50}
                                />
                              </td>
                            </tr>
                          )
                        )}
                        <tr>
                          <td
                            colSpan="2"
                            style={{
                              textAlign: "right",
                              backgroundColor: "#00B050",
                            }}
                          >
                            Total for {categoryName}:
                          </td>
                          <td style={{ backgroundColor: "#00B050" }}>
                            {categoryData.totalAmount}
                          </td>
                        </tr>
                      </React.Fragment>
                    )}
                    {categoryData.accessories.length === 0 && (
                      <tr>
                        <td
                          colSpan="2"
                          style={{ textAlign: "right", backgroundColor: "#00B050" }}
                        >
                          Total for {categoryName}:
                        </td>
                        <td style={{ backgroundColor: "#00B050" }}>
                          {categoryData.totalAmount}
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
              <tr>
                <td
                  colSpan="2"
                  style={{
                    textAlign: "right",
                    backgroundColor: "#FF0000",
                    color: "black",
                  }}
                >
                  Grand Total:
                </td>
                <td style={{ backgroundColor: "#FF0000", color: "black" }}>
                  {groupedData.grandTotal}
                </td>
              </tr>
            </tbody>
          </table>
        );
      };
    
    

  return (
//     <div>
//         <div id="pagedatatoshow"className="offscreen" style={{ margin: "8px", width: "100%" ,  }}>
//         <h6 style={{ textAlign: "center", marginBottom: "10px" }}>
//           Tax Invoice
//         </h6>
//         <div style={{ border: "1px solid" }}>
//           <div className="topsection" style={{ display: "flex" }}>
//             <div
//               className="left"
//               style={{ display: "flex", flexDirection: "column", width: "50%" }}
//             >
//               <div style={{ display: "flex", borderBottom: "1px solid" }}>
//                 <div style={{ width: "100%", height: "100px" }}>
//                   <img src="https://res.cloudinary.com/dczou8g32/image/upload/v1714668042/DEV/jw8j76cgw2ogtokyoisi.png" alt="img" width={90} height={90}/>
//                 </div>
//                 <div className="address" >
//                   <h6>BILTREE</h6>
//                   <h6>54/3175</h6>
//                   <h6>MANGHAT ARCADE</h6>
//                   <h6>KALOOR-KADAVANTHRA ROAD</h6>
//                   <h6>KADAVANTHRA,ERNAKULAM</h6>
//                   <h6>GSTIN/UIN:32AAVFB8613K1Z3</h6>
//                   <h6>State Name:Kerala, Code : 32</h6>
//                   <h6>E-Mail:info@biltree.in</h6>
//                 </div>
//               </div>
//               <div style={{ borderBottom: "1px solid", marginLeft:"2px",display:"flex",flexDirection:"column",gap:"3px" }}>
//                 <h6>Consignee (Ship to)</h6>
//                 <h5>{projectData?.project?.client_name}</h5>
//                 <h6>{projectData?.project?.address1}</h6>
//                 <h6>{projectData?.project?.address2}</h6>
//                 <h6>{projectData?.project?.phonenumber}</h6>

//                 <h6 style={{ display: "flex", gap: "20px",marginBottom:"3px" }}>
//                   <span>GSTIN/UIN</span> <span>: 32AAFFC5911M2Z1</span>
//                 </h6>
//                 {/* <h6 style={{ display: "flex", gap: "10px" }}>
//                   <span>State Name</span> <span>: Kerala,Code:32</span>
//                 </h6> */}
//               </div>
//               <div style={{ marginLeft:"2px",display:"flex",flexDirection:"column",gap:"3px"}}>
//                 <h6>Buyer (Bill to)</h6>
//                 <h5>{projectData?.project?.client_name}</h5>
//                 <h6>{projectData?.project?.address1}</h6>
//                 <h6>{projectData?.project?.address2}</h6>
//                 <h6>{projectData?.project?.phonenumber}</h6>
//                 <h6 style={{ display: "flex", gap: "20px", }}>
//                   <span>GSTIN/UIN</span> <span>: 32AAFFC5911M2Z1</span>
//                 </h6>
//                 {/* <h6 style={{ display: "flex", gap: "10px" }}>
//                   <span>State Name</span> <span>: Kerala,Code:32</span>
//                 </h6> */}
//               </div>
//             </div>
//             <div className="right" style={{ width: "50%" }}>
//               <table style={{ borderCollapse: "collapse", width: "100%" }}>
//                 <thead style={{ borderBottom: "1px solid black" }}>
//                   <tr>
//                     <td
//                       style={{ borderLeft: "1px solid black", padding: "8px" }}
//                     >
//                       <h6>Invoice No</h6>
//                       <h6>{ generateRandom6Digit(new Date())}</h6>
//                     </td>
//                     <td
//                       style={{
//                         borderBottom: "1px solid black",
//                         borderLeft: "1px solid black",
//                         padding: "8px",
//                       }}
//                     >
//                       <h6>Date</h6>
//                       <h6>{new Date().toLocaleDateString()}</h6>
//                     </td>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   <tr>
//                     <td
//                       style={{ borderLeft: "1px solid black", padding: "8px" }}
//                     >
                      
//                       <h6>Delivery Note</h6>
//                     </td>
//                     <td
//                       style={{
//                         borderBottom: "1px solid black",
//                         borderLeft: "1px solid black",
//                         padding: "8px",
//                       }}
//                     >
                      
//                       <h6>Mode/Terms of Payment</h6>
//                     </td>
//                   </tr>
//                   <tr>
//                     <td
//                       style={{
//                         borderTop: "1px solid black",
//                         borderLeft: "1px solid black",
//                         padding: "8px",
//                       }}
//                     >
                      
//                       <h6>Reference No.& Date</h6>
//                     </td>
//                     <td
//                       style={{
//                         borderBottom: "1px solid black",
//                         borderLeft: "1px solid black",
//                         padding: "8px",
//                       }}
//                     >
                      
//                       <h6>Other References</h6>
//                     </td>
//                   </tr>
//                   <tr>
//                     <td
//                       style={{
//                         borderTop: "1px solid black",
//                         borderLeft: "1px solid black",
//                         padding: "8px",
//                       }}
//                     >
                      
//                       <h6>Buyer's Order No</h6>
//                     </td>
//                     <td
//                       style={{
//                         borderBottom: "1px solid black",
//                         borderLeft: "1px solid black",
//                         padding: "8px",
//                       }}
//                     >
                      
//                       <h6>Date</h6>
//                     </td>
//                   </tr>
//                   <tr>
//                     <td
//                       style={{
//                         borderTop: "1px solid black",
//                         borderLeft: "1px solid black",
//                         padding: "8px",
//                       }}
//                     >
                      
//                       <h6>Dispatch Doc No</h6>
//                     </td>
//                     <td
//                       style={{
//                         borderBottom: "1px solid black",
//                         borderLeft: "1px solid black",
//                         padding: "8px",
//                       }}
//                     >
                      
//                       <h6>Delivery Note Date</h6>
//                     </td>
//                   </tr>
//                   <tr>
//                     <td
//                       style={{
//                         borderTop: "1px solid black",
//                         borderLeft: "1px solid black",
//                         borderBottom: "1px solid black",
//                         padding: "8px",
//                       }}
//                     >
                      
//                       <h6>Dispatch throught</h6>
//                     </td>
//                     <td
//                       style={{
//                         borderBottom: "1px solid black",
//                         borderLeft: "1px solid black",
//                         padding: "8px",
//                       }}
//                     >
                      
//                       <h6>Destination</h6>
//                     </td>
//                   </tr>
//                   <tr>
//                     <td
//                       style={{ borderLeft: "1px solid black", padding: "8px" }}
//                     >
//                       <h6 style={{ marginBottom: "75px" }}>
//                         Terms of Delivery
//                       </h6>
//                     </td>
//                   </tr>
//                 </tbody>
//               </table>
//             </div>
//           </div>
//           <div className="middlesection">
//           <table style={{ borderCollapse: "collapse", width: "100%" }}>
//               <thead
//                 style={{
//                   borderBottom: "1px solid black",
//                   borderTop: "1px solid black",
//                 }}
//               >
//                 <tr>
//                   <th>
                    
//                     <h6>Sl.No</h6>
//                   </th>
//                   <th style={{ borderLeft: "1px solid black" }}>
                    
//                     <h6>
//                       Description of <br /> Goods and Services
//                     </h6>
//                   </th>
//                   <th style={{ borderLeft: "1px solid black" }}>
                    
//                     <h6>HSN/SAC</h6>
//                   </th>
//                   <th style={{ borderLeft: "1px solid black" }}>
                    
//                     <h6>Quantity</h6>
//                   </th>
//                   <th style={{ borderLeft: "1px solid black" }}>
                    
//                     <h6>Rate</h6>
//                   </th>
//                   <th style={{ borderLeft: "1px solid black" }}>
                    
//                     <h6>Per</h6>
//                   </th>
//                   <th style={{ borderLeft: "1px solid black" }}>
                    
//                     <h6>Amount</h6>
//                   </th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {pdfData?.product_info?.map((data, index) => (
//                     <tr key={index}>
//                       <td style={{paddingLeft:"3px",paddingBottom:"5px"}}>
                        
//                         <h6>{index+1}</h6>
//                       </td>
//                       <td style={{ borderLeft: "1px solid black",paddingLeft:"3px",paddingBottom:"5px" }}>
                        
//                         <h6>{data.product}</h6>
//                       </td>
//                       <td style={{ borderLeft: "1px solid black",paddingLeft:"3px",paddingBottom:"5px" }}>
                        
//                         <h6> </h6>
//                       </td>
//                       <td style={{ borderLeft: "1px solid black",paddingLeft:"3px",paddingBottom:"5px" }}>
                        
//                         <h6>{data.quantity}</h6>
//                       </td>
//                       <td style={{ borderLeft: "1px solid black",paddingLeft:"3px",paddingBottom:"5px" }}>
                        
//                         <h6> {data.amount}</h6>
//                       </td>
//                       <td style={{ borderLeft: "1px solid black",paddingLeft:"3px",paddingBottom:"5px" }}>
                        
//                         <h6> nos</h6>
//                       </td>
//                       <td style={{ borderLeft: "1px solid black",paddingLeft:"3px",paddingBottom:"5px" }}>
                        
//                         <h6>{data.amount*data.quantity} </h6>
//                       </td>
//                     </tr>
//                   ))}
                
//                 <tr
//                   style={{
//                     borderTop: "1px solid black",
//                     borderBottom: "1px solid black",
//                   }}
//                 >
//                   <td> </td>
//                   <td
//                     style={{ textAlign: "end", borderLeft: "1px solid black",paddingLeft:"3px",paddingBottom:"1px" }}
//                   >
                    
//                     <h6> Total</h6>
//                   </td>
//                   <td
//                     style={{ textAlign: "end", borderLeft: "1px solid black" }}
//                   >
                    
//                   </td>
//                   <td
//                     style={{ textAlign: "end", borderLeft: "1px solid black",paddingLeft:"3px",paddingBottom:"1px" }}
//                   >
                    
//                     <h6>{pdfData?.product_info?.length} Nos</h6>
//                   </td>
//                   <td
//                     style={{ textAlign: "end", borderLeft: "1px solid black" }}
//                   ></td>
//                   <td
//                     style={{ textAlign: "end", borderLeft: "1px solid black" }}
//                   ></td>
//                   <td
//                     style={{ textAlign: "end", borderLeft: "1px solid black",paddingLeft:"3px",paddingBottom:"1px" }}
//                   >
                    
//                     <h6> {subtotal}</h6>
//                   </td>
//                 </tr>
//               </tbody>
//             </table> 
//           </div>
//           <div
//             style={{
//               display: "flex",
//               justifyContent: "space-between",
//               marginTop: "10px",
//               marginLeft:"2px"
//             }}
//           >
//             <h6>Amount Chargeable (in words)</h6>
//             <h6>E.&.O.E</h6>
//           </div>
//           <h6 style={{ marginTop: "5px" }}>
//             INR Sixteen lakh Twenty Eight Thousand Six Hundred Fifty One Only
//           </h6>

//           <table
//   style={{
//     borderCollapse: "collapse",
//     width: "100%",
//     marginTop: "10px",
//   }}
// >
//   <thead
//     style={{
//       borderBottom: "1px solid black",
//       borderTop: "1px solid black",
//     }}
//   >
//     <tr>
//       <th style={{ borderLeft: "1px solid black" }} rowSpan="2">
//         <h6> HSN/SAC</h6>
//       </th>
//       <th style={{ borderLeft: "1px solid black" }} rowSpan="2">
//         <h6> Taxable Value</h6>
//       </th>
//       <th style={{ borderLeft: "1px solid black",borderBottom: "1px solid black",borderRight: "1px solid black" }} colSpan="2">
//         <h6> CGST</h6>
//       </th>
//       <th style={{ borderLeft: "1px solid black",borderBottom: "1px solid black" }} colSpan="2">
//         <h6> SGST/UTGST</h6>
//       </th>
//       <th style={{ borderLeft: "1px solid black" }}>
//         <h6> Total Tax Amount</h6>
//       </th>
//     </tr>
//     <tr>
//       <th style={{ borderLeft: "1px solid black" }}>
//         <h6> Rate</h6>
//       </th>
//       <th style={{ borderLeft: "1px solid black" }}>
//         <h6> Amount</h6>
//       </th>
//       <th style={{ borderLeft: "1px solid black" }}>
//         <h6> Rate</h6>
//       </th>
//       <th style={{ borderLeft: "1px solid black",borderRight: "1px solid black" }}>
//         <h6> Amount</h6>
//       </th>
//     </tr>
    
//   </thead>
//   <tbody style={{ borderBottom: "1px solid black"}}>
//   {transformedData?.map(item => (
//     <tr key={item?.hsn}>
//       <td style={{ borderLeft: "1px solid black" }}>
//         <h6> {item?.hsn}</h6>
//       </td>
//       <td style={{ borderLeft: "1px solid black" }}>
//         <h6> {item?.total.toFixed(2)}</h6>
//       </td>
//       <td style={{ borderLeft: "1px solid black" }}>
//         <h6> {item?.cgstRate}</h6>
//       </td>
//       <td style={{ borderLeft: "1px solid black" }}>
//         <h6> {item?.cgstAmount.toFixed(2)}</h6>
//       </td>
//       <td style={{ borderLeft: "1px solid black" }}>
//         <h6> {item?.sgstRate}</h6>
//       </td>
//       <td style={{ borderLeft: "1px solid black" }}>
//         <h6> {item?.sgstAmount.toFixed(2)}</h6>
//       </td>
//       <td style={{ borderLeft: "1px solid black" }}>
//         <h6>{ (item?.total+item?.sgstAmount+item?.cgstAmount).toFixed(2)}</h6>
//       </td>
//     </tr>
//             ))}

//   </tbody>
// </table>


//           <div style={{ display: "flex", gap: "10px", marginTop: "5px",marginLeft:"2px" }}>
            
//             <h6>Tax Amount (in words)</h6>
//             <h6>
//               INR Sixteen lakh Twenty Eight Thousand Six Hundred Fifty One Only
//             </h6>
//           </div>
//           <div style={{display:"flex",flexDirection:"column",justifyContent:"end", marginTop: "5px",marginLeft:"50%",fontSize:"12px"}}>
//             <h6>Company's bank details</h6>
//             <div style={{display:"flex",gap:"16.4px"}}>
//               <h6>A/c Holder Name</h6>
//               <h6>: BILTREE</h6>
//             </div>
//             <div style={{display:"flex",gap:"38px"}}>
//               <h6>Bank Name</h6>
//               <h6>: ICICI BANK CA - 785236984125</h6>
//             </div>
//             <div style={{display:"flex",gap:"56.6px"}}>
//               <h6>A/c No</h6>
//               <h6>: 785236984125</h6>
//             </div>
//             <div style={{display:"flex",gap:"12.4px"}}>
//               <h6>Branch & IFS Code</h6>
//               <h6>: PANAMPILLY MAGAR & ICIC0002483</h6>
//             </div>
//             <h6>SWIFT Code</h6>
//           </div>
//           <div style={{display:'flex'}}>
//             <div className="leftsection" style={{width:"50%",marginLeft:"2px",marginBottom:"3px"}}>
// <h6 style={{borderBottom:"1px solid black",width:"60px"}}>Declaration</h6>

// <h6>we seclare that this invoice shows the actual price of the goods described and that all particulars are true and currect</h6>
//             </div>
//             <div className="rightsection" style={{width:"50%",textAlign:"end",borderTop:"1px solid black",borderLeft:"1px solid black"}}>
// <h6 style={{marginBottom:"23px",marginRight:"5px"}}>for BILTREEE</h6>
//               <h6 style={{marginRight:"5px"}}>Authorised Signatory</h6>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
<div
      className="quatationgenerator"
      id="quatationgenerator"
      style={{
        background:"white",
        borderRadius:"30px",
        padding:"20px",
        fontSize: "13px",
        fontFamily: "'Roboto'", 
        fontWeight: 400,
        textAlign: "justify",
      }}
    >
      <img
        src="https://res.cloudinary.com/dczou8g32/image/upload/v1714668042/DEV/jw8j76cgw2ogtokyoisi.png"
        alt="logo"
        style={{  height: "90px", paddingBottom: "50px" }}
      />
      <div style={{  }}>
        <p style={{ paddingBottom: "5px" }}>To,</p>
        <p>jijin vj</p>
      </div>

      <div style={{  paddingBottom: "50px" }}>
        <p style={{ textAlign: "end", paddingBottom: "5px" }}>
          QUOTATION NO: QT / 24-25/020
        </p>
        <p style={{ textAlign: "end" }}>
          Date: {new Date().toLocaleDateString()}{" "}
        </p>
      </div>
      <div
        style={{   paddingBottom: "200px" }}
      >
        <p
          style={{
            paddingBottom: "5px",
            lineHeight: "22px",
            textAlign: "justify",
            fontFamily: "'Roboto'", 
            fontWeight: 400,
          }}
        >
          {" "}
          We thank you for giving us an opportunity to quote for the mentioned
          subject. With reference to your enquiry, please find.
        </p>
        <p style={{ paddingBottom: "5px" }}>Sir,</p>
        <p
          style={{
            paddingBottom: "5px",
            lineHeight: "22px",
            fontFamily: "'Roboto'", 
            fontWeight: 400,
          }}
        >
          Biltree was founded on the principle of providing quality work with an
          emphasis on cost- effectiveness and the highest quality work for its
          prospective clients in the quickest way possible. Our strength is in
          achieving recognition for our ability to analyze the client's
          requirements in collaboration with architects and consultants, as well
          as developing an understanding of architectural and interior concepts.
          We specialize in providing solutions’ that blend aesthetically with
          interiors and exteriors, without sacrificing any functional
          attributes. As a company, our goal is to ensure customer satisfaction
          with the quality of our aesthetic. We also intend to achieve fluency
          from design to design and installation. We will maintain our loyalty
          and plough to build good and fair relationships with our clients,
          founded on trust and loyalty.
        </p>
      </div>
      <div style={{ marginLeft: "50px",  textAlign: "center" }}>
        <h5 style={{ paddingBottom: "10px" }}>
          BILTREE -1ST FLOOR MANGHAT ARCADE, KALOOR KADAVANTRA ROAD, KADAVANTRA
          -20{" "}
        </h5>
        <h5>PHONE: +91 9447519770 </h5>
      </div>
      {createTable(groupedData)}
<div style={{display:"flex",justifyContent:"center",marginTop:"20px"}}>

      <img src="https://images.unsplash.com/photo-1479839672679-a46483c0e7c8?q=80&w=2020&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="plan image" height={500}/>
</div>
    </div>
  )
}

export default QuotationView



