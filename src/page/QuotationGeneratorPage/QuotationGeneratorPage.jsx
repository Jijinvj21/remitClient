import { Box, Button, Grid, Modal, Typography } from "@mui/material";
import "./QuotationGeneratorPage.scss";
import InputComponent from "../../components/InputComponent/InputComponent";
import ProductInputCard from "../../components/ProductInputCard/ProductDataCard";
import jsPDF from "jspdf";
import "jspdf-autotable";
import ImageAdd from "../../assets/sideBar/ImageAdd.svg";
import { useEffect, useRef, useState } from "react";
import React from "react";

import {
  categeryGetAPI,
  categoryDataAddAPI,
  categoryDataGetAPI,
  clientDataGetAPI,
  gstOptionsGetAPI,
  productAddAPI,
  productGetAPI,
  projectGetAPI,
  quotationCreateAPI,
  unitsDataGetAPI,
} from "../../service/api/admin";
// import { useNavigate } from "react-router-dom";
import { renderToString } from "react-dom/server";
import AddClientDrawer from "../../components/AddClientDrawer/AddClientDrawer";
import AddProductDrawer from "../../components/AddProductDrawer/AddProductDrawer";
import AddStockJournalDrawer from "../../components/AddStockJournalDrawer/AddStockJournalDrawer";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "0px solid #000",
  borderRadius: "10px",
  boxShadow: 24,
  p: 4,
};

function QuotationGeneratorPage() {
  const tableRef = useRef();
  const exclusionRef = useRef();
  const exclusionData = exclusionRef.current;
  const table = tableRef.current;
  const [clientOptions, setClientOptions] = useState([]);
  // const [projectOptions, setProjectOptions] = useState([]);
  const [productsOptions, setProductsOptions] = useState([]);
  const [accessoriesProductsOptions, setAccessoriesProductsOptions] = useState(
    []
  );

  const [drawerImg, setDrawerImg] = useState("");
  const [projectImg, setProjectImg] = useState("");

  const [inputs, setInputs] = useState([""]); // State to store  Terms and Conditions values
  const [inputsExclusion, setInputsExclusion] = useState([""]); // State to store  Terms and Conditions values
  const [selectedClient, setSelectedClient] = useState({});
  const [selectedProduct, setSelectedProduct] = useState({});
  

  const [leftInputs, setLeftInputs] = useState({
    quantity: "",
    amount: "",
    description: "",
    hardware: "",
    installation: "",
    accessories: "",
  });
  const [rightIputs, setRightIputs] = useState({
    quoteamount: "",
    completiontime: "",
    startdate: "",
  });
  // const [formData, setFormData] = useState([]);
  // adding data form local storage
  const [selectedAccessory, setSelectedAccessory] = useState({});
  const [quantity, setQuantity] = useState(1);
  const [accessoriesList, setAccessoriesList] = useState([]);
  const [areaOfWorkCategorySelected, setAreaOfWorkCategorySelected] =
    useState();
  const [areaOfWorkCategoryInput, setAreaOfWorkCategoryInput] = useState();

  const [open, setOpen] = useState(false);
  const [projectFormData, setProjectFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    address1: "",
    address2: "",
    pinCode: "",
    worktype: "",
    country: "",
    project: "",
  });
  const [toggle, setToggle] = useState(true);
  const [toggle2, setToggle2] = useState(true);

  const [state, setState] = useState({
    right: false,
  });
  const [state2, setState2] = useState({
    right: false,
  });
  const [productData, setProductData] = useState([]);

  const [ProductDrawerFormData, setProductDrawerFormData] = useState({
    name: "",
    quantity: "",
    rate: 0,
    hsn: "",
  });
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [projectOptions, setProjectOptions] = useState([]);
  const [unitOptions, setUnitOptions] = useState([]);
  const [taxRateValue, setTaxRateValue] = useState({});
  const [selectedValue, setSelectedValue] = useState("");

  const [projectValue, setProjectValue] = useState("");
  const [categoryValue, setCategoryValue] = useState("");
  const [img, setImg] = useState(null);
  const [taxOptions, setTaxOptions] = useState([]);

  const getTaxOptionsFormAPI = () => {
    gstOptionsGetAPI()
      .then((data) => {
        console.log("tax:", data);
        // setTaxOptions(data);

        // Transform data and set it to state
        const transformedData = data.map((entry) => ({
          value: entry.percentage,
          label: entry.name ? `${entry.name} ${entry.percentage}` : "none",
          taxlabel: entry.percentage,
          id: entry.id,
        }));
        console.log(transformedData);
        setTaxOptions(transformedData);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getCategeryOptionsFormAPI = () => {
    categoryDataGetAPI()
      .then((data) => {
        console.log("category:", data.data?.responseData);

        // Transform data and set it to state
        const categoryOptions = data.data?.responseData.map((entry) => ({
          value: entry.id,
          label: `${entry.name}`,
        }));
        categoryOptions.unshift(
          { value: 0, label: "None" },
          { value: -2, label: "Add" }
        );

        console.log("categoryOptions", categoryOptions);
        setCategoryOptions(categoryOptions);
      })
      .catch((err) => {
        console.log(err);
        setCategoryOptions(
          { value: 0, label: "None" },
          { value: -2, label: "Add" }
        );
      });
  };
  // const getClientOptionsFormAPI = () => {
  //   projectGetAPI()
  //     .then((data) => {
  //       console.log("projects:", data);

  //       // Transform data and set it to state
  //       const projectdData = data?.responseData.map(entry => ({
  //         value: entry.id,
  //         label:`${entry.name} ( ${entry.client_name} )`,

  //       }));
  //       projectdData.unshift({ value: 0, label: "None" });

  //       console.log("projectdData",projectdData);
  //       setProjectOptions(projectdData);
  //     })
  //     .catch(err => {
  //       console.log(err);
  //     });
  // };
  const getUnitOptionsFormAPI = () => {
    unitsDataGetAPI()
      .then((data) => {
        console.log("units:", data);

        // Transform data and set it to state
        const unitsdData = data?.responseData.map((entry) => ({
          value: entry.id,
          label: entry.name,
        }));
        unitsdData.unshift({ value: 0, label: "None" });
        console.log("unitsdData", unitsdData);
        setUnitOptions(unitsdData);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getTaxOptionsFormAPI();
    getCategeryOptionsFormAPI();
    getUnitOptionsFormAPI();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log("name,value", name, value);
    setProjectFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  const toggleDrawer = (anchor, open) => (event) => {
    console.log(event);
    console.log("Toggle Drawer:", anchor, open);
    if (
      event &&
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setState({ ...state, [anchor]: open });
  };

  const toggleDrawer2 = (anchor, open) => (event) => {
    console.log(event);
    console.log("Toggle Drawer:", anchor, open);
    if (
      event &&
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setState2({ ...state2, [anchor]: open });
  };

  const handleAccessoryChange = (event) => {
    const selectedOptionObject = productsOptions.find(
      (option) => option.value == event.target.value
    );
    console.log("event.target", event.target.value, selectedOptionObject);
    if (selectedOptionObject.value == -2) {
      console.log(
        "event.target",
        event.target.value.value,
        selectedOptionObject.value
      );
      console.log(selectedOptionObject.value == -2);
      toggleDrawer2("right", true)();
    } else {
      setSelectedAccessory({ selectedOptionObject });
    }
  };

  // const handleQuantityChange = (event) => {
  //   setQuantity(event.target.value);
  // };
  const arrOfInputs = [
    {
      handleChange: handleChange,
      intputName: "project",
      label: "Project Name",
      type: "text",
      value: projectFormData.project,
    },
    {
      handleChange: handleChange,
      intputName: "name",
      label: "Client Name",
      type: "text",
      value: projectFormData.name,
    },
    {
      handleChange: handleChange,
      intputName: "email",
      label: "Email",
      type: "email",
      value: projectFormData.email,
    },
    {
      handleChange: handleChange,
      intputName: "mobile",
      label: "Mobile",
      type: "tel",
      value: projectFormData.mobile,
    },
    {
      handleChange: handleChange,
      intputName: "address1",
      label: "Address 1",
      type: "text",
      value: projectFormData.address1,
    },
    {
      handleChange: handleChange,
      intputName: "address2",
      label: "Address 2",
      type: "text",
      value: projectFormData.address2,
    },
    {
      handleChange: handleChange,
      intputName: "pinCode",
      label: "Pin Code",
      type: "text",
      value: projectFormData.pinCode,
    },
  ];

  const handleAdd = () => {
    alert("add");
  };
  const handleprojectImageChange = (e) => {
    const file = e.target.files[0];
    setProjectImg(file);
  };

  // const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const getCliendData = () => {
    clientDataGetAPI()
      .then((data) => {
        console.log("clientData:", data);
        // setTaxOptions(data);

        // Transform data and set it to state
        const partyData = data.responseData.map((entry) => ({
          value: entry.id,
          label: entry.name,
          project: entry.project_name,
        }));
        partyData.unshift({ value: -2, label: "Add" });
        partyData.unshift({ value: -1, label: "None" });

        console.log(partyData);
        setClientOptions(partyData);
      })
      .catch((err) => {
        console.log("err", err);
      });
    setClientOptions([
      { value: -1, label: "None" },
      { value: -2, label: "Add" },
    ]);
  };
  const getProjectData = () => {
    projectGetAPI()
      .then((data) => {
        console.log("getProjectData:", data);
        // setTaxOptions(data);

        // Transform data and set it to state
        const projectData = data.responseData.map((entry) => ({
          value: entry.id,
          label: entry.name,
        }));
        projectData.unshift({ value: -2, label: "Add" });
        projectData.unshift({ value: -1, label: "None" });

        console.log(projectData);
        setProjectOptions(projectData);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getProductsData = () => {
    productGetAPI()
      .then((data) => {
        console.log("productGetAPI:", data);
        // setTaxOptions(data);

        // Transform data and set it to state
        const productsData = data.responseData.map((entry) => ({
          value: entry.id,
          label: entry.name,
          unit: entry.unit,
          amount: entry.rate,
          image: entry.image,
          unit_id: entry.unit_id,
        }));
        productsData.unshift({ value: -1, label: "None" });
        productsData.unshift({ value: -2, label: "Add" });

        console.log("productsData", data.responseData);
        setProductsOptions(productsData);
      })
      .catch((err) => {
        console.log(err);
      });
    setProductsOptions([
      { value: -1, label: "None" },
      { value: -2, label: "Add" },
    ]);
  };

  const getcategorysData = () => {
    categoryDataGetAPI()
      .then((data) => {
        console.log("CatogarytGetAPI:", data);
        // setTaxOptions(data);

        // Transform data and set it to state
        const productsData = data.responseData.map((entry) => ({
          value: entry.id,
          label: entry.name,
          unit_id: entry.unit_id,
        }));
        productsData.unshift({ value: -1, label: "None" });
        productsData.unshift({ value: -2, label: "Add" });

        console.log("productsData", data.responseData);
        setProductsOptions(productsData);
      })
      .catch((err) => {
        console.log(err);
      });
    setProductsOptions([
      { value: -1, label: "None" },
      { value: -2, label: "Add" },
    ]);
  };

  const getProductsDataforaccessories = () => {
    productGetAPI()
      .then((data) => {
        console.log("productGetAPI:", data);
        const filteredData = data.responseData.filter(
          (entry) => entry.is_master_product === false
        );

        // Transform filtered data and set it to state
        const productsData = filteredData.map((entry) => ({
          value: entry.id,
          label: entry.name,
          unit: entry.unit,
          amount: entry.rate,
          image: entry.image,
          unit_id: entry.unit_id,
          is_master_product: entry.is_master_product,
        }));
        productsData.unshift({ value: -1, label: "None" });
        productsData.unshift({ value: -2, label: "Add" });

        console.log("productsData", filteredData);
        setAccessoriesProductsOptions(productsData);
      })
      .catch((err) => {
        console.log(err);
      });
    setAccessoriesProductsOptions([
      { value: -1, label: "None" },
      { value: -2, label: "Add" },
    ]);
  };

  useEffect(() => {
    getcategorysData();
    getProductsDataforaccessories();
    getProductsData();
    getProjectData();
    getCliendData();
  }, []);

  const handleleftIputsChange = (e) => {
    const { name, value } = e.target;
    console.log("name, value", name, value);
    setLeftInputs({
      ...leftInputs,
      [name]: value,
    });
    // handleAddData()
  };
  const handleAddData = () => {
    console.log("firsttest");
    const productDatas = {
      ...leftInputs,
      accessorieslist: accessoriesList,
      product: `${selectedProduct.selectedOptionObject?.value}`,
      productname: selectedProduct.selectedOptionObject?.label,
      productunit: selectedProduct.selectedOptionObject?.unit,
      category:`${areaOfWorkCategorySelected?.value}`
    };
    console.log("handleAddData", selectedProduct);
    setProductData([...productData, productDatas]);
  };
  const handlerightIputsChange = (e) => {
    const { name, value } = e.target;
    console.log("first", name, value);
    setRightIputs((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  // Function to handle input value change
  const handleInputChange = (index, value) => {
    console.log(index);
    const newInputs = [...inputs];
    newInputs[index] = "\u2022 " + value;
    setInputs(newInputs);
    console.log(newInputs);
  };

  const handleClientname = (e) => {
    console.log("e.target", e.target.value === "-2");
    if (e.target.value === "-2") {
      toggleDrawer("right", true)();
    }
    const selectedOptionObject = clientOptions.find(
      (option) => option.value == e.target.value
    );
    console.log("event.target", e.target.value, selectedOptionObject);

    setSelectedClient({ selectedOptionObject });
  };
  // const handleProjectname = (e) => {
  //   console.log("e.target", e.target.value === "-2");
  //   // alert(e.target.value==="-2")
  //   if (e.target.value === "-2") {
  //     navigate("/admin/projects/add-projects");
  //   }
  // };

  const handleExclusionInputChange = (index, value) => {
    console.log(index);
    const newInputs = [...inputsExclusion];
    newInputs[index] = "\u2022 " + value;
    setInputsExclusion(newInputs);
    console.log(newInputs);
  };

  // Function to handle adding a new input field
  const handleAddInput = () => {
    setInputs([...inputs, ""]);
  };
  const handleAddInputExclusion = () => {
    setInputsExclusion([...inputsExclusion, ""]);
  };
  useEffect(() => {
    console.log(inputs);
  }, [inputs]);

  // const handleImageChange = (e) => {
  //   const file = e.target.files[0];
  //   setImg(file);
  // };
  const handleImageChange = (e) => {
    console.log("e.target.files", e.target.files);
    const files = e.target.files; // Get all selected files
    const fileList = Array.from(files); // Convert FileList to array
    setImg(fileList); // Update state with array of files
  };

  const handleAddAccessory = async () => {
    console.log(
      "selectedAccessoryselectedOptionObject",
      selectedAccessory.selectedOptionObject
    );
    if (selectedAccessory.selectedOptionObject?.value !== "") {
      const accessory = {
        accessories: `${selectedAccessory.selectedOptionObject?.value}`,
        name: selectedAccessory.selectedOptionObject.label,
        quantity: quantity,
        price: `${selectedAccessory.selectedOptionObject.amount}`,
        unit: selectedAccessory.selectedOptionObject.unit,
        image: selectedAccessory.selectedOptionObject.image,
        unit_id: selectedAccessory.selectedOptionObject.unit_id,
      };
      console.log("accessory", [...accessoriesList, accessory]);
      setAccessoriesList([...accessoriesList, accessory]);
      setSelectedAccessory();
      setQuantity(1);
      // handleAddData()
    }
  };
  const handleProductNameChange = (event) => {
    const selectedOptionObject = productsOptions.find(
      (option) => option.value == event.target.value
    );
    if (selectedOptionObject.value == -2) {
      console.log(
        "event.target",
        event.target.value.value,
        selectedOptionObject.value
      );
      console.log(selectedOptionObject.value == -2);
      toggleDrawer2("right", true)();
    } else {
      setSelectedProduct({ selectedOptionObject });
    }
  };

  const handleAreaOfWorkCategoryChange = (event) => {
    if (event.target.value == -2) {
      setOpen(true);
      setAreaOfWorkCategorySelected({});
    } else {
      handleClose();
      const selectedOptionObject = categoryOptions.find(
        (option) => option.value == event.target.value
      );
      setAreaOfWorkCategorySelected(selectedOptionObject);
    }
  };

  const areaOfWorkCategoryInputChange = (e) => {
    setAreaOfWorkCategoryInput(e.target.value);
  };

  const handleAddAreaOfWorkCategory = () => {
    const createData = {
      project_id: selectedClient?.selectedOptionObject?.value,
      name: areaOfWorkCategoryInput,
    };
    selectedClient?.selectedOptionObject?.value
      ? categoryDataAddAPI(createData)
          .then((data) => {
            console.log(data);
          })
          .catch((err) => {
            console.log(err);
          })
      : alert("Client not Selected");
  };

  const leftArrOfInputs = [
    {
      handleChange: handleAreaOfWorkCategoryChange,
      intputName: "AreaOfWorkCategory",
      label: "Area Of Work / Category",
      inputOrSelect: "select",
      // value: areaOfWorkCategorySelected,
      options: categoryOptions,
    },
    {
      // handleChange:handleProductNameChange,
      intputName: "productname",
      label: " Product Name",
      inputOrSelect: "select",
      options: productsOptions,
    },
    // {
    //   intputName: "quantity",
    //   label: " Quantity",
    //   type: "number",
    // },
    {
      intputName: "amount",
      label: " Amount",
      type: "number",
    },
    {
      intputName: "description",
      label: "Description",
      type: "text",
    },
    {
      intputName: "hardware",
      label: " Hardware",
      type: "number",
    },
    {
      intputName: "installation",
      label: " Installation",
      type: "number",
    },
    {
      intputName: "accessories",
      label: " Accessories",
      type: "number",
    },
    {
      handleChange: handleAccessoryChange,
      intputName: " accessorieslist",
      label: " Accessories list",
      inputOrSelect: "select",
      value: selectedAccessory,
      options: accessoriesProductsOptions,
    },
    // {
    //   handleChange:handleQuantityChange,
    //   intputName: "accessoriesQuantity",
    //   label: " Quantity",
    //   type: "number",
    // },
  ];
  const RightArrOfInputs = [
    {
      handleChange: handleClientname,
      intputName: "clientname",
      label: "Client Name",
      inputOrSelect: "select",
      // value:selectedClient,
      options: clientOptions,
    },
    {
      // handleChange: handleProjectname,
      intputName: "projectdetails",
      label: "Project Details",
      // inputOrSelect: "select",
      // options: projectOptions,
      value: selectedClient?.selectedOptionObject?.project,
      disabled: "disabled",
    },
    {
      handleChange: handlerightIputsChange,
      intputName: "quoteamount",
      label: " Quote amount",
      type: "text",
    },
    {
      handleChange: handlerightIputsChange,
      intputName: "completiontime",
      label: "Completion Time",
      type: "date",
    },
    {
      handleChange: handlerightIputsChange,
      intputName: "startdate",
      label: "Start date",
      type: "date",
    },
  ];
  const handleDelete = (event) => {
    event.stopPropagation(); // Prevent the click event from bubbling up to the main div
    alert("You clicked delete!");
  };
  const pageone = renderToString(
    <div
      className="quatationgenerator"
      id="quatationgenerator"
      style={{
        fontSize: "13px",
        fontFamily: "'Roboto'", // Corrected font family name
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
        <p>{selectedClient?.selectedOptionObject?.label}</p>
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
            fontFamily: "'Roboto'", // Corrected font family name
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
            fontFamily: "'Roboto'", // Corrected font family name
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

  const handleGenerate = async () => {
    const pdftable = document.querySelector("#ALLPRODUCTtable");
    const pdflastpage = document.querySelector(
      "#exclusion-terms-and-condition"
    );

    const pdf = new jsPDF("p", "pt", "a4", true);
    const OPTITimesRoman = "../../assets/Fonts/OPTITimes-Roman.otf"; // Path to font file

    // Embed font using addFileToVFS and addFont
    pdf.addFileToVFS("OPTITimes-Roman.otf", OPTITimesRoman); // 'Metropolis-Regular.ttf' is the name you want to give to the font within the PDF
    pdf.addFont("OPTITimes-Roman.otf", "OPTITimesRomanfont", "normal");

    pdf.setFont("OPTITimesRomanfont"); // Set the font before adding text

    pdf.html(pageone, {
      callback: async () => {
        // Make the callback function async
        pdf.addPage();
        pdf.addImage(
          "https://res.cloudinary.com/dczou8g32/image/upload/v1714668042/DEV/jw8j76cgw2ogtokyoisi.png",
          30,
          30,
          100, // Width
          60 // Height
        );
        pdf.autoTable({
          html: pdftable, // Pass the HTML structure directly
          startY: 100,
          useCss: true,
          theme: "grid",
          headStyles: {
            fillColor: "yellow",
            textColor: "black",
            lineWidth: 2,
            lineColor: "black",
            // cellWidth:200
          },
          columnStyles: {
            0: { cellWidth: 100 },
            1: { cellWidth: 335 },
            2: { cellWidth: 80 },
          },
          styles: {
            lineWidth: 1,
            lineColor: "black",
            cellPadding: 5,
            fontFamily: "Inter",
            fontSize: 10,
            // valign: 'middle',
            // halign: 'center' // Set horizontal alignment to center
          },

          didDrawCell: async function (data) {
            console.log("didDrawCell", data?.cell?.raw);
            if (data.column.index === 2 && data.cell.section === "body") {
              var td = data.cell.raw;
              console.log("didDrawCell2", td.getElementsByTagName("td"));
              // var img = td.getElementsByTagName("img")[0];
              var imageSize = 35; // Increase image size here
              var img = data?.cell.raw.parentElement
                ?.getElementsByTagName("td")[2]
                ?.getElementsByTagName("img")[0]?.src;
              console.log("img.src", img);
              pdf.addImage(
                img,
                data.cell.x + 5,
                data.cell.y + 5,
                imageSize, // Width
                imageSize // Height
              );
            }
          },
        });

        if (img) {
          const imageUrls = img.map((file) => URL.createObjectURL(file));
          pdf.addPage();

          const addImageProcess = async (url) => {
            const response = await fetch(url);
            const blob = await response.blob();
            const reader = new FileReader();
            return new Promise((resolve) => {
              reader.onloadend = () => {
                resolve(reader.result);
              };
              reader.readAsDataURL(blob);
            });
          };

          const imageWidth = 575; // Set the width of the image
          const imageHeight = 820; // Set the height of the image
          const paddingX = 10; // Set the horizontal padding
          const paddingY = 10; // Set the vertical padding
          const marginLeft = 0; // Set the left margin
          const marginTop = 0; // Set the top margin

          for (const [i, url] of imageUrls.entries()) {
            const image = await addImageProcess(url); // Await here
            pdf.addImage(
              image,
              "png",
              marginLeft + paddingX,
              marginTop + paddingY,
              imageWidth,
              imageHeight
            );
            if (i !== imageUrls.length - 1) {
              pdf.addPage();
            }
          }
        }
        console.log(
          "inputsExclusion",
          inputsExclusion[0] !== "",
          inputsExclusion.length
        );

        inputsExclusion[0] !== "" || inputs[0] !== "" ? pdf.addPage() : "";
        inputsExclusion[0] !== "" || inputs[0] !== ""
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

        inputsExclusion[0] !== "" &&
          pdf.text("EXCLUSIONS ", padding, 80, {
            maxWidth,
            lineHeightFactor: 1.5,
          });
        pdf.setFontSize(12);
        console.log("inputsExclusion", inputsExclusion.length);
        const inputText1 = inputsExclusion.join("\n"); // Convert the inputs array to a newline-separated string
        pdf.text(`${inputText1}`, 50, 100, {
          maxWidth,
          lineHeightFactor: 1.5,
          align: "left",
        });

        pdf.setFontSize(15);
        console.log("TERMS AND CONDITIONS", inputs[0] == "", inputs.length);
        inputs[0] !== "" &&
          pdf.text(
            "TERMS AND CONDITIONS",
            padding,
            inputsExclusion.length * (inputsExclusion.length < 5 ? 25 : 20) +
              95,
            {
              maxWidth,
              lineHeightFactor: 1.5,
            }
          );
        pdf.setFontSize(12);
        const inputText = inputs.join("\n"); // Convert the inputs array to a newline-separated string
        pdf.text(
          `${inputText}`,
          50,
          inputsExclusion.length * (inputsExclusion.length < 5 ? 25 : 20) + 115,
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

  const hanldeAddDataToApi = () => {
    console.log(productData);

    const quotationData = {
      id: selectedClient?.selectedOptionObject?.value,
      client: selectedClient?.selectedOptionObject.project,
      quote_amount: rightIputs.quoteamount,
      completation_time: rightIputs.completiontime,
      start_date: rightIputs.startdate,
      terms_and_conditions: inputs,
      product_info: productData,
      exclusion: inputsExclusion,
      image: img[0],
      approved: false,
    };

    console.log("quotationData", productData);

    // Create FormData instance
    const formData = new FormData();

    // Append each key-value pair to formData
    formData.append("id", quotationData.id);
    // formData.append("categort", areaOfWorkCategorySelected?.value);
    formData.append("client", quotationData.client);
    formData.append("quote_amount", quotationData.quote_amount);
    formData.append("completation_time", quotationData.completation_time);
    formData.append("start_date", quotationData.start_date);
    formData.append(
      "terms_and_conditions",
      JSON.stringify(quotationData.terms_and_conditions)
    );
    formData.append("product_info", JSON.stringify(quotationData.product_info));
    formData.append("exclusion", JSON.stringify(quotationData.exclusion));
    formData.append("image", quotationData.image);
    formData.append("approved", quotationData.approved);

    // Call API with FormData
    quotationCreateAPI(formData)
      .then((data) => {
        console.log(data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const grandTotal = productData.reduce((total, item) => {
    const itemTotal =
      parseInt(item.amount || 0) +
      parseInt(item.hardware || 0) +
      parseInt(item.installation || 0) +
      parseInt(item.accessories || 0);
    return total + itemTotal;
  }, 0);

  const handleDrawerSelectChange = (event) => {
    setSelectedValue(event.target.value);
    console.log(event.target.value);
  };

  const handleDrawerChange = (e) => {
    const { name, value } = e.target;
    setProductDrawerFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleDrawerImageChange = (e) => {
    const file = e.target.files[0];

    setDrawerImg(file);
  };
  const handleTaxRateChange = (event) => {
    console.log(event.target.value);
    const selectedOptionObject = taxOptions.find(
      (option) => option.taxlabel == event.target.value
    );
    console.log(selectedOptionObject);
    // setTaxRateValue({
    //   label: selectedOptionObject ? selectedOptionObject.label : "", // Handle case where selectedOptionObject is undefined
    //   value: event.target.value
    // });
    setTaxRateValue(selectedOptionObject);
  };
  const handleSelectChange = (event) => {
    setSelectedValue(event.target.value);
    console.log(event.target.value);
  };

  const handleSelectProject = (event) => {
    setProjectValue(event.target.value);
    console.log(event.target.value);
  };

  const handleSelectCatogary = (event) => {
    setCategoryValue(event.target.value);
    console.log(event.target.value);
  };

  const handleDrawerAddProducts = () => {
    const formData = new FormData();

    formData.append("name", ProductDrawerFormData?.name);
    formData.append("hsn", ProductDrawerFormData?.hsn);
    formData.append("rate", parseInt(ProductDrawerFormData.rate));
    formData.append("quantity", parseInt(ProductDrawerFormData.quantity));
    formData.append("unit", selectedValue);
    formData.append("projectid", parseInt(projectValue));
    formData.append("is_product", toggle);
    formData.append("category_id", categoryValue);
    // formData.append('gst', ((parseInt(ProductDrawerFormData.rate) * parseInt(ProductFormData.quantity)) * (taxRateValue.value?.replace("%", ""))) / 100);
    formData.append("tax_rate", taxRateValue.id);
    formData.append("image", drawerImg);

    productAddAPI(formData)
      .then((data) => {
        // fetchData()
        if (data.status === 200) {
          setProductDrawerFormData({
            name: "",
            qate: "",
            quantity: "",
            rate: "",
            taxvalue: "",
            hsn: "",
          });
          setSelectedValue("");
          setTaxRateValue("");
          alert("Product added successfully");
        }
      })
      .catch((err) => {
        console.log(err);
        alert("Problem in adding product");
      });
  };
  const arrOfDrawerInputs = [
    {
      handleChange: handleDrawerChange,
      intputName: "name",
      label: " Product Name",
      type: "text",
    },
    {
      handleChange: handleDrawerChange,
      intputName: "rate",
      label: "Rate",
      type: "number",
    },
    {
      handleChange: handleDrawerChange,
      intputName: "quantity",
      label: "Quantity",
      type: "number",
    },
    {
      handleChange: handleTaxRateChange,
      intputName: "taxrate",
      label: "Tax Rate",

      inputOrSelect: "select",
      options: taxOptions,
    },
    {
      intputName: "taxvalue",
      label: " Tax Value",
      // type: "number",
      value:
        (parseFloat(ProductDrawerFormData.rate || 0) *
          parseFloat(ProductDrawerFormData.quantity || 0) *
          (parseFloat(taxRateValue.value?.replace("%", "")) || 0)) /
        100,

      disabled: "disabled",
    },
    {
      handleChange: handleDrawerChange,
      intputName: "hsn",
      label: "HSN",
      type: "text",
    },
    {
      handleChange: handleSelectChange,
      intputName: "unit",
      label: "Unit",
      // type: "text",

      inputOrSelect: "select",
      options: unitOptions,
    },
    {
      handleChange: handleSelectProject,
      intputName: "project",
      label: "Projects",
      // type: "text",
      // value:selectedValue,

      inputOrSelect: "select",
      options: projectOptions,
    },
    {
      handleChange: handleSelectCatogary,
      intputName: "categery",
      label: "Categerys",
      // type: "text",
      // value:selectedValue,

      inputOrSelect: "select",
      options: categoryOptions,
    },
  ];

  return (
    <Box className="quotation-generator-page">
      <h2> Quotation Generator</h2>
      <h4> Enter the product details to create a new quotation </h4>
      <Box sx={{ display: "flex", gap: 2 }}>
        <Box className="input-box">
          <Box sx={{ display: "flex", gap: 2 }}>
            <Box sx={{ width: "100%" }}>
              {RightArrOfInputs.slice(0, 3).map((input, index) => {
                return (
                  <InputComponent
                    key={index}
                    handleChange={input.handleChange}
                    state={input.state}
                    label={input.label}
                    type={input.type}
                    intputName={input.intputName}
                    inputOrSelect={input.inputOrSelect}
                    options={input.options}
                    disabled={input.disabled}
                    value={input.value}
                  />
                );
              })}
            </Box>
            <Box sx={{ width: "100%" }}>
              {RightArrOfInputs.slice(3).map((input, index) => {
                return (
                  <InputComponent
                    key={index}
                    handleChange={input.handleChange}
                    state={input.state}
                    label={input.label}
                    type={input.type}
                    intputName={input.intputName}
                    inputOrSelect={input.inputOrSelect}
                    options={input.options}
                  />
                );
              })}
              <Button
                disableRipple
                sx={{
                  mt: 3,
                  textTransform: "none",
                  color: "var(--black-button)",
                  "&:hover": {
                    background: "transparent",
                  },
                }}
                component="label"
              >
                <img src={ImageAdd} alt="add img" />
                <Typography
                  variant="string"
                  sx={{
                    pl: 1,
                  }}
                >
                  Add plan
                </Typography>
                <input
                  type="file"
                  multiple
                  hidden
                  onChange={handleImageChange}
                />
              </Button>
            </Box>
          </Box>

          {/* EXCLUSIONS */}
          <Box sx={{}}>
            <Typography
              className="Terms-label"
              variant="string"
              sx={{
                pl: 1,
              }}
            >
              Exclusion
            </Typography>
            <Box sx={{ display: "flex", gap: 1, alignItems: "end" }}>
              <Box
                sx={{
                  my: 1,
                  display: "flex",
                  flexDirection: "column",
                  gap: 1,
                  width: "100%",
                }}
              >
                {inputsExclusion.map((input, index) => (
                  <InputComponent
                    key={index}
                    handleChange={(e) =>
                      handleExclusionInputChange(index, e.target.value)
                    } // Pass index and value
                    label={input.label}
                    type={input.type}
                    intputName={input.intputName}
                  />
                ))}
              </Box>
              <Button
                variant="contained"
                color="primary"
                sx={{
                  height: "45px",
                  my: 1,
                  // mx:"auto",
                  fontWeight: "bold",
                  textTransform: "none",
                  bgcolor: "var(--black-button)",
                  "&:hover": {
                    background: "var(--button-hover)",
                  },
                }}
                onClick={handleAddInputExclusion}
              >
                Add
              </Button>
            </Box>
          </Box>

          <Box>
            <Typography
              className="Terms-label"
              variant="string"
              sx={{
                pl: 1,
              }}
            >
              Add Terms and Conditions
            </Typography>
            {/* Render input fields based on state */}
            <Box sx={{ display: "flex", gap: 1, alignItems: "end" }}>
              <Box
                sx={{
                  my: 1,
                  display: "flex",
                  flexDirection: "column",
                  gap: 1,
                  width: "100%",
                }}
              >
                {inputs.map((input, index) => (
                  <InputComponent
                    key={index}
                    handleChange={(e) =>
                      handleInputChange(index, e.target.value)
                    } // Pass index and value
                    label={input.label}
                    type={input.type}
                    intputName={input.intputName}
                  />
                ))}
              </Box>
              {/* Button to add more input fields */}
              <Button
                variant="contained"
                color="primary"
                sx={{
                  height: "45px",
                  my: 1,
                  // mx:"auto",
                  fontWeight: "bold",
                  textTransform: "none",
                  bgcolor: "var(--black-button)",
                  "&:hover": {
                    background: "var(--button-hover)",
                  },
                }}
                onClick={handleAddInput}
              >
                {/* <FiPlus size={20} /> */}
                {/* Add more Terms and Conditions */}
                Add
              </Button>
            </Box>
          </Box>
          <Box
            sx={{
              display: "flex",
            }}
          ></Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-start",
              fontWeight: "700",
            }}
          >
            <p style={{ cursor: "pointer" }} onClick={handleGenerate}>
              Preview
            </p>
          </Box>
        </Box>

        <Box className="input-box" sx={{ gap: 2 }}>
          <Box sx={{ display: "flex", gap: 2 }}>
            {leftArrOfInputs.slice(0, 1).map((input, index) => (
              <InputComponent
                key={index}
                handleChange={input.handleChange}
                label={input.label}
                type="text"
                value={input.value}
                intputName={input.intputName}
                inputOrSelect={input.inputOrSelect}
                options={input.options}
              />
            ))}
          </Box>

          <Box sx={{ display: "flex", gap: 2 }}>
            {leftArrOfInputs.slice(1, 2).map((input, index) => (
              <InputComponent
                key={index}
                handleChange={handleProductNameChange}
                label={input.label}
                type={input.type}
                // value={areaOfWorkCategorySelected} // Ensure the value is correctly passed
                inputName={input.inputName} // Ensure the prop name is correct
                inputOrSelect={input.inputOrSelect}
                options={input.options}
              />
            ))}

            {leftArrOfInputs.slice(2, 3).map((input, index) => (
              <InputComponent
                key={index}
                handleChange={(e) => handleleftIputsChange(e, input.intputName)}
                label={input.label}
                type={input.type}
                value={leftInputs[input.intputName]} // Ensure the value is correctly passed
                intputName={input.intputName}
                inputOrSelect={input.inputOrSelect}
                options={input.options}
              />
            ))}
          </Box>

          <Box sx={{ display: "flex", gap: 2 }}>
            {leftArrOfInputs.slice(3, 4).map((input, index) => (
              <InputComponent
                key={index}
                handleChange={(e) => handleleftIputsChange(e, input.intputName)}
                label={input.label}
                type={input.type}
                value={leftInputs[input.intputName]} // Ensure the value is correctly passed
                intputName={input.intputName}
                inputOrSelect={input.inputOrSelect}
                options={input.options}
              />
            ))}
          </Box>

          <Box sx={{ display: "flex", gap: 2 }}>
            {leftArrOfInputs.slice(4, 7).map((input, index) => (
              <InputComponent
                key={index}
                handleChange={(e) => handleleftIputsChange(e, input.intputName)}
                label={input.label}
                type={input.type}
                value={leftInputs[input.intputName]} // Ensure the value is correctly passed
                intputName={input.intputName}
                inputOrSelect={input.inputOrSelect}
                options={input.options}
              />
            ))}
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            {leftArrOfInputs.slice(7, 9).map((input, index) => {
              console.log(input);
              return (
                <InputComponent
                  key={index} // Ideally, you should use a unique identifier instead of index if available
                  handleChange={input.handleChange}
                  label={input.label}
                  type={input.type}
                  value={input?.selectedOptionObject?.value} // Ensure the value is correctly passed
                  intputName={input.intputName}
                  inputOrSelect={input.inputOrSelect}
                  options={input.options}
                />
              );
            })}

            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{
                mt: 3,
                fontWeight: "bold",
                textTransform: "none",
                bgcolor: "var(--black-button)",
                "&:hover": {
                  background: "var(--button-hover)",
                },
              }}
              // onClick={handleOpen}
              // onClick={() => {
              //   toggleDrawer("right", true)();
              // }}
              onClick={()=>{handleAddAccessory()}}
            >
              Add
            </Button>
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{
                mt: 1,
                fontWeight: "bold",
                textTransform: "none",
                bgcolor: "var(--black-button)",
                "&:hover": {
                  background: "var(--button-hover)",
                },
              }}
              onClick={handleAddData}
            >
              Add Product
            </Button>
          </Box>
        </Box>

        <Box
          sx={{
            // mt: 1,
            pb: 2,
            py: 2,
            bgcolor: "var(--bgwhite)",
            borderRadius: 5,
            msScrollRails: "none",
            gap: 1,
            display: "flex",
            flexFlow: "row wrap",
          }}
        >
          <Box
            sx={{
              height: "57vh", // Height of the inner container, larger than the outer container
              overflowY: "auto", // Enable scrolling
              width: "100%", // Ensure full width
              flexGrow: 1,
            }}
          >
            {/* // {productData?.map((data, index) => { */}
            {productData.map((product, productIndex) => {
              console.log("firstproduct", product);
              return (
                <div key={productIndex}>
                  {/* Render Product Input Card for the main product */}
                  <Grid
                    md={4}
                    item
                    sx={{
                      mx: "auto",
                      px: "10px",
                      py: 1,
                    }}
                  >
                    <ProductInputCard
                      handleDelete={handleDelete}
                      heading={product.productname}
                      image={product.img} // Assuming you have an image property in productData
                      qty={product.quantity}
                      unit={product.productunit}
                      rate={product.amount}
                      amount={product.amount}
                    />
                  </Grid>

                  {/* Map over accessorieslist of the current product */}
                  {product.accessorieslist.map((accessory, accessoryIndex) => (
                    <Grid
                      md={4}
                      item
                      key={`${productIndex}-${accessoryIndex}`} // Use a unique key combining productIndex and accessoryIndex
                      sx={{
                        mx: "auto",
                        px: "10px",
                        py: 1,
                      }}
                    >
                      <ProductInputCard
                        handleDelete={handleDelete}
                        heading={accessory.name}
                        image={accessory.img} // Assuming you have an image property in accessorieslist
                        qty={accessory.quantity}
                        unit={accessory.unit}
                        rate={accessory.price}
                        amount={accessory.amount}
                      />
                    </Grid>
                  ))}
                </div>
              );
            })}
          </Box>
        </Box>
      </Box>
      {/* <p className="added-item"> Added Items</p> */}
      {/* there are table data for the pdf  */}

      {/* EXCLUSIONS */}
      {/* <div ref={exclusionRef}>
      <p style={{padding:"0"}}>EXCLUSIONS</p>
      {inputsExclusion.map((line, index) => (
        <p style={{paddingLeft:"15px",paddingTop:"10px"}} key={index} >{line}</p>
      ))}
    </div> */}

      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "end",
        }}
      >
        <Button
          type="submit"
          variant="contained"
          color="primary"
          sx={{
            mt: "2rem",
            // mx:"auto",
            fontWeight: "bold",
            textTransform: "none",
            bgcolor: "var(--black-button)",
            "&:hover": {
              background: "var(--button-hover)",
            },
          }}
          // onClick={handleDownloadPdf}
          onClick={hanldeAddDataToApi}
        >
          Create
        </Button>
      </Box>
      <div>
        {/* <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <div>
              <h4 style={{ textAlign: "center" }}>Add Accessories</h4>
            </div>
          </Box>
        </Modal> */}
        <AddClientDrawer
          setToggle={setToggle}
          toggle={toggle}
          handleAdd={handleAdd}
          handleImageChange={handleprojectImageChange}
          arrOfInputs={arrOfInputs}
          projectFormData={projectFormData}
          state={state}
          toggleDrawer={toggleDrawer}
        />
        
        <AddStockJournalDrawer handleSelectChange={handleDrawerSelectChange}
          arrOfInputs={arrOfDrawerInputs}
          toggleDrawer={toggleDrawer2}
          state={state2}
          ProductFormData={ProductDrawerFormData}
          handleImageChange={handleDrawerImageChange}
          handleAdd={handleDrawerAddProducts}
          setToggle={setToggle2}
          toggle={toggle2}/>
      </div>

      <table
        className="offscreen"
        id="ALLPRODUCTtable"
        style={{ backgroundColor: "white" }}
      >
        <thead></thead>
        <tbody>
          {productData.map((item, index) => (
            <React.Fragment key={index}>
              <tr style={{ textAlign: "center", backgroundColor: "#FFFF00" }}>
                <th
                  style={{
                    width: "100px",
                    paddingBottom: "5px",
                    paddingTop: "5px",
                  }}
                >
                  AREA OF WORK
                </th>
                <th style={{ paddingBottom: "5px", paddingTop: "5px" }}>
                  SPECIFICATION
                </th>
                <th style={{ paddingBottom: "5px", paddingTop: "5px" }}>
                  AMOUNT
                </th>
              </tr>
              <tr>
                <td style={{ textAlign: "center" }} rowspan="4">
                  {item.productname}
                </td>
                <td
                  style={{
                    paddingLeft: "5px",
                    paddingRight: "5px",
                    paddingBottom: "5px",
                    paddingTop: "5px",
                  }}
                >
                  {item.description}
                </td>
                <td
                  style={{
                    paddingLeft: "5px",
                    paddingRight: "5px",
                    paddingBottom: "5px",
                    paddingTop: "5px",
                  }}
                >
                  {item.amount}
                </td>
              </tr>
              <tr>
                <td
                  style={{
                    paddingLeft: "5px",
                    paddingRight: "5px",
                    paddingBottom: "5px",
                    paddingTop: "5px",
                  }}
                >
                  hardware
                </td>
                <td
                  style={{
                    paddingLeft: "5px",
                    paddingRight: "5px",
                    paddingBottom: "5px",
                    paddingTop: "5px",
                  }}
                >
                  {item.hardware}
                </td>
              </tr>
              <tr>
                <td
                  style={{
                    paddingLeft: "5px",
                    paddingRight: "5px",
                    paddingBottom: "5px",
                    paddingTop: "5px",
                  }}
                >
                  installation
                </td>
                <td
                  style={{
                    paddingLeft: "5px",
                    paddingRight: "5px",
                    paddingBottom: "5px",
                    paddingTop: "5px",
                  }}
                >
                  {item.installation}
                </td>
              </tr>
              <tr>
                <td
                  style={{
                    paddingLeft: "5px",
                    paddingRight: "5px",
                    paddingBottom: "5px",
                    paddingTop: "5px",
                  }}
                >
                  accessories
                </td>
                <td
                  style={{
                    paddingLeft: "5px",
                    paddingRight: "5px",
                    paddingBottom: "5px",
                    paddingTop: "5px",
                  }}
                >
                  {item.accessories}
                </td>
              </tr>

              <tr>
                <td
                  style={{
                    backgroundColor: "#00B050",
                    paddingBottom: "5px",
                    paddingTop: "5px",
                    paddingRight: "5px",
                    fontWeight: "800",
                    textAlign: "right ",
                  }}
                  colspan="2"
                >
                  {" "}
                  TOTAL{" "}
                </td>
                <th
                  style={{
                    backgroundColor: "#00B050",
                    paddingBottom: "5px",
                    paddingTop: "5px",
                    paddingRight: "5px",
                    fontWeight: "800",
                    textAlign: "right ",
                  }}
                >
                  {parseInt(item.amount || 0) +
                    parseInt(item.hardware || 0) +
                    parseInt(item.installation || 0) +
                    parseInt(item.accessories || 0)}
                </th>
              </tr>

              <tr>
                <td colSpan="12"> </td>
              </tr>

              {item.accessorieslist[0] && (
                <>
                  <tr>
                    <td
                      style={{
                        backgroundColor: "#00B0F0",
                        paddingBottom: "5px",
                        paddingTop: "5px",
                        fontWeight: "800",
                        textAlign: "center ",
                      }}
                      colSpan="12"
                    >
                      {" "}
                      ACCESSORIES LIST OF {item.productname.toUpperCase()}{" "}
                    </td>
                  </tr>
                  <tr style={{ backgroundColor: "#FFFF00" }}>
                    <td
                      style={{
                        paddingBottom: "5px",
                        paddingTop: "5px",
                        fontWeight: "800",
                        textAlign: "center ",
                      }}
                    >
                      {" "}
                      SL NO{" "}
                    </td>
                    <td
                      style={{
                        paddingBottom: "5px",
                        paddingTop: "5px",
                        fontWeight: "800",
                        textAlign: "center ",
                      }}
                    >
                      SPECIFICATION{" "}
                    </td>
                    <td
                      style={{
                        paddingBottom: "5px",
                        paddingTop: "5px",
                        fontWeight: "800",
                        textAlign: "center ",
                      }}
                    >
                      {" "}
                      IMAGE{" "}
                    </td>
                  </tr>
                </>
              )}
              {item.accessorieslist.map((accessory, i) => {
                console.log("accessory", accessory);
                return (
                  <tr key={`${index}-${i}`}>
                    <td
                      style={{
                        paddingBottom: "5px",
                        paddingTop: "5px",
                        textAlign: "center",
                      }}
                    >
                      {index + 1}
                    </td>
                    <td
                      style={{
                        paddingLeft: "5px",
                        paddingRight: "5px",
                        paddingBottom: "5px",
                        paddingTop: "5px",
                      }}
                    >
                      {accessory.name}
                    </td>
                    <td
                      style={{
                        paddingLeft: "30px",
                        paddingRight: "10px",
                        paddingBottom: "20px",
                        paddingTop: "20px",
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      {" "}
                      <img
                        src="https://upload.wikimedia.org/wikipedia/en/thumb/4/41/Flag_of_India.svg/255px-Flag_of_India.svg.png"
                        alt="image"
                        width={50}
                        height={50}
                      />{" "}
                    </td>
                  </tr>
                );
              })}
            </React.Fragment>
          ))}
          <tr>
            <td
              style={{
                backgroundColor: "#FF0000",
                paddingBottom: "5px",
                paddingTop: "5px",
                paddingRight: "10px",
                fontWeight: "800",
                textAlign: "right ",
                color: "white",
                border: "1px solid black",
              }}
              colspan="2"
            >
              {" "}
              GRAND TOTAL{" "}
            </td>
            <th
              style={{
                backgroundColor: "#FF0000",
                paddingBottom: "5px",
                paddingTop: "5px",
                paddingRight: "10px",
                fontWeight: "800",
                textAlign: "right ",
                color: "white",
                border: "1px solid black",
              }}
            >
              {grandTotal}
            </th>
          </tr>
        </tbody>
      </table>

      <div>
        <table
          id="tablethree"
          style={{ backgroundColor: "white", display: "none" }}
        >
          <thead style={{ backgroundColor: "yellow" }}>
            <tr>
              <th style={{ border: "2px solid" }}>Area of Work</th>
              <th style={{ border: "2px solid" }}>Specification</th>
              <th style={{ border: "2px solid" }}>Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td rowspan="2" style={{ padding: "10px" }}>
                Field 1
              </td>
              <td style={{ padding: "10px" }}>
                {" "}
                typesetting industry. ever since the 1500s
              </td>
              <td style={{ padding: "10px" }}> 123,222.00</td>
            </tr>
            <tr>
              <td style={{ padding: "10px" }}>
                {" "}
                typesetting industry. ever since the 1500s
              </td>
              <td style={{ padding: "10px" }}> 123,222.00</td>
            </tr>
            <tr></tr>
            <tr>
              <td rowspan="2" style={{ padding: "10px" }}>
                Field 2
              </td>
              <td style={{ padding: "10px" }}>
                {" "}
                typesetting industry. ever since the 1500s
              </td>
              <td style={{ padding: "10px" }}> 123,222.00</td>
            </tr>
            <tr>
              <td style={{ padding: "10px" }}>
                {" "}
                typesetting industry. ever since the 1500s
              </td>
              <td style={{ padding: "10px" }}> 123,222.00</td>
            </tr>
            <tr>
              <td rowspan="2" style={{ padding: "10px" }}>
                Field 3
              </td>
              <td style={{ padding: "10px" }}>
                {" "}
                typesetting industry. ever since the 1500s
              </td>
              <td style={{ padding: "10px" }}> 123,222.00</td>
            </tr>
            <tr>
              <td style={{ padding: "10px" }}>
                {" "}
                typesetting industry. ever since the 1500s
              </td>
              <td style={{ padding: "10px" }}> 123,222.00</td>
            </tr>
            <tr style={{ backgroundColor: "green" }}>
              <td colspan="2" style={{ textAlign: "end" }}>
                TOTAL
              </td>
              <td style={{ textAlign: "center" }}>321</td>
            </tr>
            <tr style={{ backgroundColor: "red" }}>
              <td colspan="2" style={{ textAlign: "end" }}>
                GRAND TOTAL
              </td>
              <td style={{ textAlign: "center" }}>321</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Box sx={{ display: "flex", justifyContent: "center", mb: 4 }}>
              <h4> Add Area Of Work / Category</h4>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                alignItems: "center",
                my: 1,
                gap: 1,
              }}
            >
              <InputComponent
                label="Area Of Work / Category"
                intputName="AreaOfWorkCategory"
                type="text"
                value={areaOfWorkCategoryInput}
                handleChange={areaOfWorkCategoryInputChange}
                // inputOrSelect={data.inputOrSelect}
                // options={data.option}
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                sx={{
                  mt: 3,
                  fontWeight: "bold",
                  textTransform: "none",
                  bgcolor: "var(--black-button)",
                  "&:hover": {
                    background: "var(--button-hover)",
                  },
                }}
                onClick={handleAddAreaOfWorkCategory}
              >
                Add
              </Button>
            </Box>
          </Box>
        </Modal>
      </div>
    </Box>
  );
}

export default QuotationGeneratorPage;