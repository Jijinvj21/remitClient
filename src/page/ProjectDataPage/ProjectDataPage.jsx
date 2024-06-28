


import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./ProjectDataPage.scss";
import { Box, Modal, ToggleButton, ToggleButtonGroup } from "@mui/material";
import SimCardDownloadOutlinedIcon from "@mui/icons-material/SimCardDownloadOutlined";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { projectDataByIdAPI, quotationGetAPI } from "../../service/api/admin";
import jsPDF from "jspdf";
import "jspdf-autotable";
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 900,
  bgcolor: "background.paper",
  border: "0px solid #000",
  borderRadius: "10px",
  boxShadow: 24,
  p: 4,
};
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import { generateRandom6Digit } from "../../utils/randomWithDate";
import { renderToString } from "react-dom/server";

function ProjectDataPage() {
  const pdftableRef = useRef();
  const pdftable = pdftableRef.current;
  const tableRef = useRef();


  
  const [toggle, setToggle] = useState(true);
  const [projectData, setProjectData] = useState({});
  const [totalAmount, setTotalAmount] = useState(0); // State to hold the total amount
  const [quotationGetData, setQuotationGetData] = useState();
  const [open, setOpen] = useState(false);
  const [pdfData, setPdfData] = useState({});
  useEffect(() => {
   console.log(pdfData,"pdfDatapdfData")
  }, [pdfData])
  
  
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


  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const location = useLocation();
  const navigate = useNavigate();


  useEffect(() => {
    quotationGetAPI({ id: location?.state })
      .then((data) => {
        console.log("projectDataByIdAPI", data.data.responseData      );
        setQuotationGetData(data.data.responseData);
      })
      .catch((err) => {
        console.log(err);
      });

    projectDataByIdAPI({ id: location?.state })
      .then((data) => {
        console.log("projectDataByIdAPI",data.data.responseData)
        setProjectData(data.data.responseData);
        // Calculate total amount when project data is fetched
        const totalWithoutTax = data.data.responseData?.transaction.reduce(
          (acc, curr) =>
            acc + (curr.amount - (curr.igst + curr.cgst + curr.sgst)),
          0
        );
        const total = data.data.responseData?.transaction.reduce(
          (acc, curr) => acc + curr.amount,
          0
        );
        setTotalAmount(toggle ? total : totalWithoutTax);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [location, toggle]);
  const quotatiaddress = "BILTREE -1ST FLOOR MANGHAT ARCADE,  ";
  const phone = "PHONE: +91 9447519770 ";
  const width = 405;
  const padding = 20;
  const maxWidth = width - 2 * padding;
  const locmaxWidth = 1000 - 2 * padding;
  const generatePDF = () => {
    const pdf = new jsPDF("p", "pt", "a4", true);
    const imageWidth = 200; // Width in millimeters

    const imageHeight = 100; // Height in millimeters
    pdf.addImage(
      "https://res.cloudinary.com/dczou8g32/image/upload/v1714668042/DEV/jw8j76cgw2ogtokyoisi.png",

      15,
      0,
      imageWidth, // Width
      imageHeight // Height
    );
    pdf.setFontSize(10);

    pdf.text(quotatiaddress, 333, 50, { locmaxWidth, lineHeightFactor: 1.5 });
    pdf.text("KALOOR KADAVANTRA ROAD, ", 390, 65, {
      locmaxWidth,
      lineHeightFactor: 1.5,
    });

    pdf.text(" KADAVANTRA -20", 448, 80, {
      locmaxWidth,
      lineHeightFactor: 1.5,
    });

    pdf.text(phone, 420, 100, { maxWidth, lineHeightFactor: 1.5 });

    pdf.autoTable({
      head: [
        [
          "ID",
          "Data",
          "particular",
          toggle && "IGST",
          toggle && "CGST",
          toggle && "SGST",
          "Total",
        ],
      ],
      body: projectData?.transaction?.map((val, i) => [
        i + 1,
        new Date(val.date).toLocaleDateString(),
        val.particular,
        toggle ? val.igst : "0",
        toggle ? val.cgst : "0",
        toggle ? val.sgst : "0",
        toggle ? val.amount : val.amount - (val.igst + val.cgst + val.sgst),
      ]),
      columnStyles: {
        0: { cellWidth: 100 },
        1: { cellWidth: 100 },
        2: { cellWidth: 100 },
        3: { cellWidth: 50 },
        4: { cellWidth: 50 },
        5: { cellWidth: 50 },
        6: { cellWidth: 50 },
      },
      theme: "grid",
      headStyles: {
        fillColor: "black",
        textColor: "white",
        halign: "center",
      },
      margin: { top: 120, left: 40 },
    });

    const blobURL = pdf.output("bloburl");
    window.open(blobURL, "_blank");
  };

  // Function to convert table data to CSV format
  // Function to convert table data to CSV format
  // Function to convert table data to CSV format
  // Function to convert table data to CSV format
  const convertTableToCSV = () => {
    let csv = [];
    // Header row
    let headerRow = [
      "ID",
      "Date",
      "Particular",
      "IGST",
      "CGST",
      "SGST",
      "Total",
    ];
    csv.push(headerRow.join(","));
    // Data rows
    projectData?.transaction.forEach((row, index) => {
      let date = new Date(row.date);
      let formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1)
        .toString()
        .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
      let rowData = [
        index + 1,
        formattedDate,
        row.particular,
        toggle ? row.igst : 0,
        toggle ? row.cgst : 0,
        toggle ? row.sgst : 0,
        toggle ? row.amount : row.amount - (row.igst + row.cgst + row.sgst),
      ];
      csv.push(rowData.join(","));
    });
    // Join rows with newline characters
    return csv.join("\n");
  };

  // Function to handle CSV download
  const downloadCSV = () => {
    const csvContent = convertTableToCSV();
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "project_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  const pageone = renderToString(
    <div
      className="quatationgenerator"
      id="quatationgenerator"
      style={{
        fontSize: "13px",
        fontFamily: "'Roboto'", 
        fontWeight: 400,
        textAlign: "justify",
      }}
    >
      <img
        src="https://res.cloudinary.com/dczou8g32/image/upload/v1714668042/DEV/jw8j76cgw2ogtokyoisi.png"
        alt="logo"
        style={{ marginLeft: "20px", height: "90px", paddingBottom: "50px" }}
      />
      <div style={{ marginLeft: "50px" }}>
        <p style={{ paddingBottom: "5px" }}>To,</p>
        <p>{pdfData?.project}</p>
      </div>

      <div style={{ width: "510px", paddingBottom: "50px" }}>
        <p style={{ textAlign: "end", paddingBottom: "5px" }}>
          QUOTATION NO: QT / 24-25/020
        </p>
        <p style={{ textAlign: "end" }}>
          Date: {new Date().toLocaleDateString()}{" "}
        </p>
      </div>
      <div
        style={{ marginLeft: "50px", width: "500px", paddingBottom: "200px" }}
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
      <div style={{ marginLeft: "50px", width: "500px", textAlign: "center" }}>
        <h5 style={{ paddingBottom: "10px" }}>
          BILTREE -1ST FLOOR MANGHAT ARCADE, KALOOR KADAVANTRA ROAD, KADAVANTRA
          -20{" "}
        </h5>
        <h5>PHONE: +91 9447519770 </h5>
      </div>
    </div>
  );
  const handlepdfgenerate = () => {
    // const pdfpagedata = document.querySelector("#pagedatatoshow");
    // const pdf = new jsPDF("p", "pt", "a4", true);
    // pdf.html(pdftable, {
    //   callback: () => {
    //     const blobURL = pdf.output("bloburl");
    //     window.open(blobURL, "_blank");
    //   },
    // });
    const pdftable = document.querySelector("#ALLPRODUCTtable");
    const pdflastpage = document.querySelector(
      "#exclusion-terms-and-condition"
    );

    const pdf = new jsPDF("p", "pt", "a4", true);
    const OPTITimesRoman = "../../assets/Fonts/OPTITimes-Roman.otf"; 
    pdf.addFileToVFS("OPTITimes-Roman.otf", OPTITimesRoman); 
    pdf.addFont("OPTITimes-Roman.otf", "OPTITimesRomanfont", "normal");

    pdf.setFont("OPTITimesRomanfont");

    pdf.html(pageone, {
      callback: async () => {
        pdf.addPage();
        pdf.addImage(
          "https://res.cloudinary.com/dczou8g32/image/upload/v1714668042/DEV/jw8j76cgw2ogtokyoisi.png",
          30,
          30,
          100, 
          60 
        );
        

        pdf.autoTable({
          html: tableRef.current,
          useCss: true,
          startY: 30,
          theme: 'grid',
          styles: {
            fontSize: 7, 
            cellPadding: 1, 
            valign: 'middle',
            halign: 'center',
          },
          headStyles: {
            fillColor: [255, 255, 0],
            textColor: [255, 0, 0],
            fontStyle: 'bold',
          },
          columnStyles: {
            0: { cellWidth: 150 }, // Adjusted width for the first column
            1: { cellWidth: 275 }, // Adjusted width for the second column
            2: { cellWidth: 90 }, // Adjusted width for the third column
          },
          didDrawCell: async function (data) {
            console.log("didDrawCell", data?.cell?.raw);
            if (data.column.index === 2 && data.cell.section === "body") {
    
              // data.cell.styles.cellPadding = { top: 10, left: 5, right: 5, bottom: 10 };
                        var td = data.cell.raw;
              console.log("didDrawCell2", td.getElementsByTagName("td"));
              // var img = td.getElementsByTagName("img")[0];
              var imageSize = 20; // Increase image size here
              var img = data?.cell.raw.parentElement
                ?.getElementsByTagName("td")[2]
                ?.getElementsByTagName("img")[0]?.src;
              console.log("img.src", img);
              pdf.addImage(
                img,
                data.cell.x + 5,
                data.cell.y + 1,
                imageSize, // Width
                imageSize // Height
              );
            }
          },
        });
const img="https://images.unsplash.com/photo-1479839672679-a46483c0e7c8?q=80&w=2020&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        if (img) {
          // Directly create the image URL from the single image file
          // const imageUrl = URL.createObjectURL(img);
          pdf.addPage();
        
          // const addImageProcess = async (url) => {
          //   const response = await fetch(url);
          //   const blob = await response.blob();
          //   const reader = new FileReader();
          //   return new Promise((resolve) => {
          //     reader.onloadend = () => {
          //       resolve(reader.result);
          //     };
          //     reader.readAsDataURL(blob);
          //   });
          // };
        
          const imageWidth = 575;
          const imageHeight = 820; 
          const paddingX = 10; 
          const paddingY = 10; 
          const marginLeft = 0; 
          const marginTop = 0; 
        
          // Process the single image
          // const image = await addImageProcess(imageUrl);
          pdf.addImage(
            img,
            "png",
            marginLeft + paddingX,
            marginTop + paddingY,
            imageWidth,
            imageHeight
          );
        }
        
        console.log(
          "inputsExclusion",
          // inputsExclusion[0] !== "",
          // inputsExclusion.length
          pdfData.terms_and_conditions

        );

        pdfData.exclusion[0] !== "" || pdfData.terms_and_conditions[0] !== "" ? pdf.addPage() : "";
        pdfData.exclusion[0] !== "" || pdfData.terms_and_conditions[0] !== ""
          ? pdf.addImage(
              "https://res.cloudinary.com/dczou8g32/image/upload/v1714668042/DEV/jw8j76cgw2ogtokyoisi.png",
              30,
              0,
              100, // Width
              50 // Height
            )
          : "";

        const width = 555;
        const padding = 40;
        const maxWidth = width - 2 * padding;

        pdf.setFont("Inter");

        pdf.setFontSize(15);

        pdfData.exclusion[0] !== "" &&
          pdf.text("EXCLUSIONS ", padding, 80, {
            maxWidth,
            lineHeightFactor: 1.5,
          });
        pdf.setFontSize(12);
        console.log("pdfData.exclusion", pdfData.exclusion.length);
        const inputText1 = pdfData.exclusion.join("\n"); 
        pdf.text(`${inputText1}`, 50, 100, {
          maxWidth,
          lineHeightFactor: 1.5,
          align: "left",
        });

        pdf.setFontSize(15);
        console.log("TERMS AND CONDITIONS", pdfData.terms_and_conditions[0] == "", pdfData.terms_and_conditions.length);
        pdfData.terms_and_conditions[0] !== "" &&
          pdf.text(
            "TERMS AND CONDITIONS",
            padding,
            pdfData.exclusion.length * (pdfData.exclusion.length < 5 ? 25 : 20) +
              95,
            {
              maxWidth,
              lineHeightFactor: 1.5,
            }
          );
        pdf.setFontSize(12);
        const inputText = pdfData.terms_and_conditions.join("\n"); 
        pdf.text(
          `${inputText}`,
          50,
          pdfData.exclusion.length * (pdfData.exclusion.length < 5 ? 25 : 20) + 115,
          {
            maxWidth,
            lineHeightFactor: 1.5,
            align: "left",
          }
        );
        pdf.setFont("Inter", "bold");
        pdf.setFontSize(10);

        pdf.text(
          `BILTREE - 1ST FLOOR MANGHAT ARCADE , KALOOR KADAVANTRA ROAD , KADAVANTRA - 20`,
          65,
          660,
          {
            maxWidth: "1000",
            lineHeightFactor: 1.5,
            align: "left",
          }
        );
        pdf.text(`PHONE : + 91 9447519770`, 245, 700, {
          maxWidth: "1000",
          lineHeightFactor: 1.5,
          align: "left",
        });

        const blobURL = pdf.output("bloburl");
        window.open(blobURL, "_blank");
      },
    });
  };
  const handleGetDataFormArray= (index)=>{
alert(index)
setPdfData(quotationGetData[index])
handlepdfgenerate()
  }

  const items = Array(54).fill();

const chunkedItems = [];
const chunkSize = 20;

for (let i = 0; i < items.length; i += chunkSize) {
  chunkedItems.push(items.slice(i, i + chunkSize));
}
const subtotal = pdfData?.product_info?.reduce((acc, curr) => acc + (curr.amount * curr.quantity), 0);

const data = quotationGetData?.flatMap(quotation => quotation?.product_info || []);
// console.log("dataquotationGetData",data)

const calculateTax = (total, rate) => {
  const subtotal = parseFloat(total);
  const taxAmount = subtotal * (rate / 100);
  
  return {
    cgstRate: rate / 2,
    cgstAmount: taxAmount / 2,
    sgstRate: rate / 2,
    sgstAmount: taxAmount / 2
  };
};


// Check if data is defined before using reduce
const transformedData = data ? data.reduce((acc, item) => {
  console.log("dataquotationGetData,",item)
  const existingItemIndex = acc.findIndex(elem => elem.hsn === item.hsn);
  if (existingItemIndex !== -1) {
    const existingItem = acc[existingItemIndex];
    existingItem.total += parseFloat(item.amount);
    // Calculate tax for the product
    const tax = calculateTax(item.amount, parseFloat(item.tax_rate.percentage));
    existingItem.cgstAmount += tax.cgstAmount;
    existingItem.sgstAmount += tax.sgstAmount;
  } else {
    const { cgstRate, cgstAmount, sgstRate, sgstAmount } = calculateTax(
      item.amount,
      parseFloat(item.tax_rate.percentage)
    );
    acc.push({
      hsn: item.hsn,
      total: parseFloat(item.amount),
      cgstRate,
      cgstAmount,
      sgstRate,
      sgstAmount
    });
  }
  return acc;
}, []) : [];


// Find the approved quotation
const approvedQuotation = quotationGetData?.find((quotation) => quotation.approved);
  
// Get the quotation amount or default to 0
const quotationValue = approvedQuotation?.quote_amount || 0;

// Get the total expenses or default to 0
const totalExpenses = approvedQuotation ? (projectData?.total_expenses || 0) : 0;

// Calculate the margin
const margin = quotationValue - totalExpenses;

  return (
    <div className="projectDatapage-section">
      <div className="top-section">
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <div className="data_show_card">
            <h6>Quotation Value</h6>
            <h6>{quotationValue} </h6>
           
          </div>
          <div className="data_show_card">
            <h6>Purchase / Expence</h6>
            {/* <h6>{projectData?.total_expenses || 0}</h6> */}
            <h6> {totalExpenses}</h6>
          </div>
          <div className="data_show_card">
            <h6>Margin</h6>
            {/* <h6>{totalAmount}</h6> Display total amount */}
            <h6>{approvedQuotation ? margin : 0}</h6>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "20px",
            paddingRight: "60px",
          }}
        >
          <div className="toggle_button ">
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <h4>With Tax</h4>
              <p>|</p>
              <h4>Without Tax</h4>
            </div>

            <ToggleButtonGroup
              value={toggle ? "true" : "false"}
              exclusive
              onChange={(e, value) => setToggle(value === "true")}
              aria-label="text alignment"
            >
              <ToggleButton
                value="true"
                aria-label="left aligned"
                sx={{
                  fontSize: "12px",
                  borderRadius: "35px",
                  width: "90px",
                  height: "35px",
                  textAlign: "center",
                  marginTop: "5px",
                  marginLeft: "10px",
                  "&.Mui-selected, &.Mui-selected:hover": {
                    color: "white",
                    backgroundColor: "#8cdb7e",
                  },
                }}
              >
                <p>yes</p>
              </ToggleButton>
              <ToggleButton
                value="false"
                aria-label="centered"
                sx={{
                  fontSize: "12px",
                  borderRadius: "35px",
                  width: "90px",
                  height: "35px",
                  textAlign: "center",
                  marginTop: "5px",
                  marginLeft: "10px",
                  "&.Mui-selected, &.Mui-selected:hover": {
                    color: "white",
                    backgroundColor: "#8cdb7e",
                  },
                }}
              >
                <p>no</p>
              </ToggleButton>
            </ToggleButtonGroup>
          </div>
          <button
            // className="data_show_card"
            style={{
              border: "none",
              cursor: "pointer",
              backgroundColor: "white",
            }}
            onClick={() => generatePDF()}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                marginTop: "10px",
              }}
            >
              <SimCardDownloadOutlinedIcon style={{ fontSize: "40px" }} />
              <h6>Download</h6>
            </div>
          </button>

          <button
            // className="data_show_card"
            style={{
              border: "none",
              cursor: "pointer",
              backgroundColor: "white",
            }}
            onClick={downloadCSV}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                marginTop: "10px",
              }}
            >
              <SimCardDownloadOutlinedIcon style={{ fontSize: "40px" }} />
              <h6>Download CSV</h6>
            </div>
          </button>

          <button
            // className="data_show_card"
            style={{
              border: "none",
              cursor: "pointer",
              backgroundColor: "white",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                marginTop: "10px",
                fontSize: "20px",
              }}
              onClick={handleOpen}
              
            >
              <h5>View quotation</h5>
            </div>
          </button>
        </div>
      </div>
      {projectData?.transaction ? (
        <div className="table">
          <TableContainer component={Paper} id="pdf-content">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Data</TableCell>
                  <TableCell>particular</TableCell>
                  {toggle && <TableCell>IGST</TableCell>}
                  {toggle && <TableCell>CGST</TableCell>}
                  {toggle && <TableCell>SGST</TableCell>}
                  <TableCell>Total</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {projectData?.transaction.map((row, index) => (
                  <TableRow key={index + 1}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>
                      {new Date(row.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{row.particular}</TableCell>
                    {toggle && <TableCell>{toggle ? row.igst : 0}</TableCell>}
                    {toggle && <TableCell>{toggle ? row.cgst : 0}</TableCell>}
                    {toggle && <TableCell>{toggle ? row.sgst : 0}</TableCell>}
                    <TableCell>
                      {toggle
                        ? row.amount
                        : row.amount - (row.igst + row.cgst + row.sgst)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      ) : (
        <div style={{ textAlign: "center", padding: "10px" }}>
          <p>NO DATA</p>
        </div>
      )}

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Box sx={{ display: "flex", justifyContent: "center", mb: 4 }}>
            <h4>Quotation</h4>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <TableContainer component={Paper} id="pdf-content">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Project</TableCell>
                    <TableCell>Start Date</TableCell>
                    <TableCell>Completion Time</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>View</TableCell>
                    <TableCell>Download</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {quotationGetData?.map((row, index) => {
                    console.log(row);
                    return (
                      <TableRow key={index + 1}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{row.project}</TableCell>
                        <TableCell>
                          {new Date(row.start_date).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          {new Date(row.completation_time).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          {row.approved ? "Approved" : "Not Approved"}
                        </TableCell>
                        <TableCell>
                          <RemoveRedEyeOutlinedIcon   onClick={() => navigate("/admin/Quotation-View",{ state:{projectData,pdfData,subtotal,transformedData,quotationGetData} })}/>
                        </TableCell>
                        <TableCell>
                          <FileDownloadOutlinedIcon  onClick={()=>handleGetDataFormArray(index)}/>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Box>
      </Modal>
      {/* <div ref={pdftableRef} id="pagedatatoshow"className="offscreen" style={{ margin: "8px", width: "580px" ,  }}>
        <h6 style={{ textAlign: "center", marginBottom: "10px" }}>
          Tax Invoice
        </h6>
        <div style={{ border: "1px solid" }}>
          <div className="topsection" style={{ display: "flex" }}>
            <div
              className="left"
              style={{ display: "flex", flexDirection: "column", width: "50%" }}
            >
              <div style={{ display: "flex", borderBottom: "1px solid" }}>
                <div style={{ width: "100px", height: "100px" }}>
                  <img src="https://res.cloudinary.com/dczou8g32/image/upload/v1714668042/DEV/jw8j76cgw2ogtokyoisi.png" alt="img" width={90} height={90}/>
                </div>
                <div className="address" >
                  <h6>BILTREE</h6>
                  <h6>54/3175</h6>
                  <h6>MANGHAT ARCADE</h6>
                  <h6>KALOOR-KADAVANTHRA ROAD</h6>
                  <h6>KADAVANTHRA,ERNAKULAM</h6>
                  <h6>GSTIN/UIN:32AAVFB8613K1Z3</h6>
                  <h6>State Name:Kerala, Code : 32</h6>
                  <h6>E-Mail:info@biltree.in</h6>
                </div>
              </div>
              <div style={{ borderBottom: "1px solid", marginLeft:"2px",display:"flex",flexDirection:"column",gap:"3px" }}>
                <h6>Consignee (Ship to)</h6>
                <h5>{projectData?.project?.client_name}</h5>
                <h6>{projectData?.project?.address1}</h6>
                <h6>{projectData?.project?.address2}</h6>
                <h6>{projectData?.project?.phonenumber}</h6>

                <h6 style={{ display: "flex", gap: "20px",marginBottom:"3px" }}>
                  <span>GSTIN/UIN</span> <span>: 32AAFFC5911M2Z1</span>
                </h6>
                
              </div>
              <div style={{ marginLeft:"2px",display:"flex",flexDirection:"column",gap:"3px"}}>
                <h6>Buyer (Bill to)</h6>
                <h5>{projectData?.project?.client_name}</h5>
                <h6>{projectData?.project?.address1}</h6>
                <h6>{projectData?.project?.address2}</h6>
                <h6>{projectData?.project?.phonenumber}</h6>
                <h6 style={{ display: "flex", gap: "20px", }}>
                  <span>GSTIN/UIN</span> <span>: 32AAFFC5911M2Z1</span>
                </h6>
              
              </div>
            </div>
            <div className="right" style={{ width: "50%" }}>
              <table style={{ borderCollapse: "collapse", width: "100%" }}>
                <thead style={{ borderBottom: "1px solid black" }}>
                  <tr>
                    <td
                      style={{ borderLeft: "1px solid black", padding: "8px" }}
                    >
                      <h6>Invoice No</h6>
                      <h6>{ generateRandom6Digit(new Date())}</h6>
                    </td>
                    <td
                      style={{
                        borderBottom: "1px solid black",
                        borderLeft: "1px solid black",
                        padding: "8px",
                      }}
                    >
                      <h6>Date</h6>
                      <h6>{new Date().toLocaleDateString()}</h6>
                    </td>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td
                      style={{ borderLeft: "1px solid black", padding: "8px" }}
                    >
                      
                      <h6>Delivery Note</h6>
                    </td>
                    <td
                      style={{
                        borderBottom: "1px solid black",
                        borderLeft: "1px solid black",
                        padding: "8px",
                      }}
                    >
                      
                      <h6>Mode/Terms of Payment</h6>
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{
                        borderTop: "1px solid black",
                        borderLeft: "1px solid black",
                        padding: "8px",
                      }}
                    >
                      
                      <h6>Reference No.& Date</h6>
                    </td>
                    <td
                      style={{
                        borderBottom: "1px solid black",
                        borderLeft: "1px solid black",
                        padding: "8px",
                      }}
                    >
                      
                      <h6>Other References</h6>
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{
                        borderTop: "1px solid black",
                        borderLeft: "1px solid black",
                        padding: "8px",
                      }}
                    >
                      
                      <h6>Buyer's Order No</h6>
                    </td>
                    <td
                      style={{
                        borderBottom: "1px solid black",
                        borderLeft: "1px solid black",
                        padding: "8px",
                      }}
                    >
                      
                      <h6>Date</h6>
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{
                        borderTop: "1px solid black",
                        borderLeft: "1px solid black",
                        padding: "8px",
                      }}
                    >
                      
                      <h6>Dispatch Doc No</h6>
                    </td>
                    <td
                      style={{
                        borderBottom: "1px solid black",
                        borderLeft: "1px solid black",
                        padding: "8px",
                      }}
                    >
                      
                      <h6>Delivery Note Date</h6>
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{
                        borderTop: "1px solid black",
                        borderLeft: "1px solid black",
                        borderBottom: "1px solid black",
                        padding: "8px",
                      }}
                    >
                      
                      <h6>Dispatch throught</h6>
                    </td>
                    <td
                      style={{
                        borderBottom: "1px solid black",
                        borderLeft: "1px solid black",
                        padding: "8px",
                      }}
                    >
                      
                      <h6>Destination</h6>
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{ borderLeft: "1px solid black", padding: "8px" }}
                    >
                      <h6 style={{ marginBottom: "75px" }}>
                        Terms of Delivery
                      </h6>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div className="middlesection">
          <table style={{ borderCollapse: "collapse", width: "100%" }}>
              <thead
                style={{
                  borderBottom: "1px solid black",
                  borderTop: "1px solid black",
                }}
              >
                <tr>
                  <th>
                    
                    <h6>Sl.No</h6>
                  </th>
                  <th style={{ borderLeft: "1px solid black" }}>
                    
                    <h6>
                      Description of <br /> Goods and Services
                    </h6>
                  </th>
                  <th style={{ borderLeft: "1px solid black" }}>
                    
                    <h6>HSN/SAC</h6>
                  </th>
                  <th style={{ borderLeft: "1px solid black" }}>
                    
                    <h6>Quantity</h6>
                  </th>
                  <th style={{ borderLeft: "1px solid black" }}>
                    
                    <h6>Rate</h6>
                  </th>
                  <th style={{ borderLeft: "1px solid black" }}>
                    
                    <h6>Per</h6>
                  </th>
                  <th style={{ borderLeft: "1px solid black" }}>
                    
                    <h6>Amount</h6>
                  </th>
                </tr>
              </thead>
              <tbody>
                {pdfData?.product_info?.map((data, index) => (
                    <tr key={index}>
                      <td style={{paddingLeft:"3px",paddingBottom:"5px"}}>
                        
                        <h6>{index+1}</h6>
                      </td>
                      <td style={{ borderLeft: "1px solid black",paddingLeft:"3px",paddingBottom:"5px" }}>
                        
                        <h6>{data.product}</h6>
                      </td>
                      <td style={{ borderLeft: "1px solid black",paddingLeft:"3px",paddingBottom:"5px" }}>
                        
                        <h6> </h6>
                      </td>
                      <td style={{ borderLeft: "1px solid black",paddingLeft:"3px",paddingBottom:"5px" }}>
                        
                        <h6>{data.quantity}</h6>
                      </td>
                      <td style={{ borderLeft: "1px solid black",paddingLeft:"3px",paddingBottom:"5px" }}>
                        
                        <h6> {data.amount}</h6>
                      </td>
                      <td style={{ borderLeft: "1px solid black",paddingLeft:"3px",paddingBottom:"5px" }}>
                        
                        <h6> nos</h6>
                      </td>
                      <td style={{ borderLeft: "1px solid black",paddingLeft:"3px",paddingBottom:"5px" }}>
                        
                        <h6>{(data.amount||0)}</h6>
                      </td>
                    </tr>
                  ))}
                
                
                <tr
                  style={{
                    borderTop: "1px solid black",
                    borderBottom: "1px solid black",
                  }}
                >
                  <td> </td>
                  <td
                    style={{ textAlign: "end", borderLeft: "1px solid black",paddingLeft:"3px",paddingBottom:"1px" }}
                  >
                    
                    <h6> Total</h6>
                  </td>
                  <td
                    style={{ textAlign: "end", borderLeft: "1px solid black" }}
                  >
                    
                  </td>
                  <td
                    style={{ textAlign: "end", borderLeft: "1px solid black",paddingLeft:"3px",paddingBottom:"1px" }}
                  >
                    
                    <h6>{pdfData?.product_info?.length} Nos</h6>
                  </td>
                  <td
                    style={{ textAlign: "end", borderLeft: "1px solid black" }}
                  ></td>
                  <td
                    style={{ textAlign: "end", borderLeft: "1px solid black" }}
                  ></td>
                  <td
                    style={{ textAlign: "end", borderLeft: "1px solid black",paddingLeft:"3px",paddingBottom:"1px" }}
                  >
                    
                    <h6> {subtotal}</h6>
                  </td>
                </tr>
              </tbody>
            </table> 
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "10px",
              marginLeft:"2px"
            }}
          >
            <h6>Amount Chargeable (in words)</h6>
            <h6>E.&.O.E</h6>
          </div>
          <h6 style={{ marginTop: "5px" }}>
            INR Sixteen lakh Twenty Eight Thousand Six Hundred Fifty One Only
          </h6>

          <table
  style={{
    borderCollapse: "collapse",
    width: "100%",
    marginTop: "10px",
  }}
>
  <thead
    style={{
      borderBottom: "1px solid black",
      borderTop: "1px solid black",
    }}
  >
    <tr>
      <th style={{ borderLeft: "1px solid black" }} rowSpan="2">
        <h6> HSN/SAC</h6>
      </th>
      <th style={{ borderLeft: "1px solid black" }} rowSpan="2">
        <h6> Taxable Value</h6>
      </th>
      <th style={{ borderLeft: "1px solid black",borderBottom: "1px solid black",borderRight: "1px solid black" }} colSpan="2">
        <h6> CGST</h6>
      </th>
      <th style={{ borderLeft: "1px solid black",borderBottom: "1px solid black" }} colSpan="2">
        <h6> SGST/UTGST</h6>
      </th>
      <th style={{ borderLeft: "1px solid black" }}>
        <h6> Total Tax Amount</h6>
      </th>
    </tr>
    <tr>
      <th style={{ borderLeft: "1px solid black" }}>
        <h6> Rate</h6>
      </th>
      <th style={{ borderLeft: "1px solid black" }}>
        <h6> Amount</h6>
      </th>
      <th style={{ borderLeft: "1px solid black" }}>
        <h6> Rate</h6>
      </th>
      <th style={{ borderLeft: "1px solid black",borderRight: "1px solid black" }}>
        <h6> Amount</h6>
      </th>
    </tr>
    
  </thead>
  <tbody style={{ borderBottom: "1px solid black"}}>
  {transformedData?.map(item => (
    <tr key={item?.hsn}>
      <td style={{ borderLeft: "1px solid black" }}>
        <h6> {item?.hsn}</h6>
      </td>
      <td style={{ borderLeft: "1px solid black" }}>
        <h6> {item?.total.toFixed(2)}</h6>
      </td>
      <td style={{ borderLeft: "1px solid black" }}>
        <h6> {item?.cgstRate}</h6>
      </td>
      <td style={{ borderLeft: "1px solid black" }}>
        <h6> {item?.cgstAmount.toFixed(2)}</h6>
      </td>
      <td style={{ borderLeft: "1px solid black" }}>
        <h6> {item?.sgstRate}</h6>
      </td>
      <td style={{ borderLeft: "1px solid black" }}>
        <h6> {item?.sgstAmount.toFixed(2)}</h6>
      </td>
      <td style={{ borderLeft: "1px solid black" }}>
        <h6>{ (item?.total+item?.sgstAmount+item?.cgstAmount).toFixed(2)}</h6>
      </td>
    </tr>
            ))}

  </tbody>
</table>


          <div style={{ display: "flex", gap: "10px", marginTop: "5px",marginLeft:"2px" }}>
            
            <h6>Tax Amount (in words)</h6>
            <h6>
              INR Sixteen lakh Twenty Eight Thousand Six Hundred Fifty One Only
            </h6>
          </div>
          <div style={{display:"flex",flexDirection:"column",justifyContent:"end", marginTop: "5px",marginLeft:"50%",fontSize:"12px"}}>
            <h6>Company's bank details</h6>
            <div style={{display:"flex",gap:"16.4px"}}>
              <h6>A/c Holder Name</h6>
              <h6>: BILTREE</h6>
            </div>
            <div style={{display:"flex",gap:"38px"}}>
              <h6>Bank Name</h6>
              <h6>: ICICI BANK CA - 785236984125</h6>
            </div>
            <div style={{display:"flex",gap:"56.6px"}}>
              <h6>A/c No</h6>
              <h6>: 785236984125</h6>
            </div>
            <div style={{display:"flex",gap:"12.4px"}}>
              <h6>Branch & IFS Code</h6>
              <h6>: PANAMPILLY MAGAR & ICIC0002483</h6>
            </div>
            <h6>SWIFT Code</h6>
          </div>
          <div style={{display:'flex'}}>
            <div className="leftsection" style={{width:"50%",marginLeft:"2px",marginBottom:"3px"}}>
<h6 style={{borderBottom:"1px solid black",width:"60px"}}>Declaration</h6>

<h6>we seclare that this invoice shows the actual price of the goods described and that all particulars are true and currect</h6>
            </div>
            <div className="rightsection" style={{width:"50%",textAlign:"end",borderTop:"1px solid black",borderLeft:"1px solid black"}}>
<h6 style={{marginBottom:"23px",marginRight:"5px"}}>for BILTREEE</h6>
              <h6 style={{marginRight:"5px"}}>Authorised Signatory</h6>
            </div>
          </div>
        </div>
      </div> */}
       {createTable(groupedData)}
    </div>
  );
}

export default ProjectDataPage;