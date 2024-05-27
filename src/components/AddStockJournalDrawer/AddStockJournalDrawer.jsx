


import { Autocomplete, Box, Button, Grid, Typography } from "@mui/material";
import Drawer from "@mui/material/Drawer";
import InputComponent from "../InputComponent/InputComponent";
// import { FormControl } from "@mui/base/FormControl";
import bulkUpload from "../../assets/products/bulkUpload.svg";
import ImageAdd from "../../assets/sideBar/ImageAdd.svg";
import { useEffect, useState } from "react";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import { gstOptionsGetAPI, productGetAPI, projectGetAPI, stockJournalCreateAPI, unitsDataGetAPI } from "../../service/api/admin";

// import InputComponent from "../../components/InputComponent/InputComponent";
import ProductInputCard from "../../components/ProductInputCard/ProductDataCard";
// import ImageAdd from "../../assets/sideBar/ImageAdd.svg";
import { useNavigate } from "react-router-dom";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import PlaylistAddRoundedIcon from "@mui/icons-material/PlaylistAddRounded";

function AddStockJournalDrawer({
//   handleSubmit,
//   arrOfInputs,
  toggleDrawer,
  state,
//   ProductFormData,
//   updateData,
//   handleImageChange,
//   handleAdd,
//   handleSelectChange,
//   updatetrue,
//   handleUpdateData,
  // setToggle,
  // toggle,
}) {
  // draw
  const navigate = useNavigate();
  const [productOptions, setProductOptions] = useState([]);
  const [projectOptions, setProjectOptions] = useState([]);

  // const [leftArrOfInputs, setLeftArrOfInputs] = useState([]);
  const [selectedProject, setSelectedProject] = useState(); // State to hold selected product

  const [selectedProduct, setSelectedProduct] = useState("None"); // State to hold selected product
  const [selectedProductDetails, setSelectedProductDetails] = useState(null); // State to hold selected product
  const [totalAmout, setTotalAmout] = useState(0); // State to hold selected product
  const [quantity, setQuantity] = useState(0); // State to hold quantity
  const [myArray, setMyArray] = useState([]);
  const [createdProducts, setCreatedProducts] = useState({
    productname: "",
    unit: "",
    amount: "",
    hsn: "",
  });
  const [selectedTax, setSelectedTax] = useState(0); // State to hold quantity

  const [unitOptions, setUnitOptions] = useState([]);

  const [taxOptions, setTaxOptions] = useState([]);
  const [selectedValue, setSelectedValue] = useState("");
  const [productImage, setProductImage] = useState(null);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    // You can perform any validation or processing here
    setProductImage(file);
  };

  const getTaxOptionsFormAPI = () => {
    gstOptionsGetAPI()
      .then((data) => {
        console.log("tax:", data);
        // setTaxOptions(data);

        // Transform data and set it to state
        const transformedData = data.map((entry) => ({
          value: entry.id,
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

  const getProductsData = () => {
    productGetAPI()
      .then((data) => {
        console.log("getProductsData:", data);
        // setTaxOptions(data);

        // Transform data and set it to state
        const productsData = data.responseData.map((entry) => ({
          value: entry.id,
          label: entry.name,
          rate: entry.rate,
          unit: entry.unit,
        }));
        // productsData.unshift({ value: -1, label: "None" });

        console.log(productsData);
        setProductOptions(productsData);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getProjectData = () => {
    projectGetAPI()
      .then((data) => {
        console.log("getProjectData:", data);
        // setTaxOptions(data);

        // Transform data and set it to state
        const productsData = data.responseData.map((entry) => ({
          value: entry.id,
          label: ` ${entry.name} (${entry.client_name})`,
        }));
        // productsData.unshift({ value: -1, label: "None" });

        console.log(productsData);
        setProjectOptions(productsData);
      })
      .catch((err) => {
        console.log(err);
      });
  };
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
        console.log(unitsdData);
        setUnitOptions(unitsdData);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getUnitOptionsFormAPI();
    getProjectData();
    getProductsData();
    getTaxOptionsFormAPI();
  }, []);
  const handleSelectChange = (event) => {
    console.log(event.target.value);
    setSelectedValue(event.target.value);
  };
  const updatedLeftArrOfInputs = [
    {
      intputName: "quantity",
      label: "Quantity",
      type: "number",
      value: quantity,
    },
    {
      intputName: "amount",
      label: "Amount",
      type: "number",
      value: totalAmout,
      disabled: "disabled",
    },
  ];

  const RightArrOfInputs = [
    {
      intputName: "productname",
      label: " Product Name",
      type: "text",
      value: createdProducts.productname,
    },
    // {
    //   intputName: "unit",
    //   label: "Unit",
    //   type: "text",
    //   value:createdProducts.unit
    // },
    {
      handleChange: handleSelectChange,
      intputName: "unit",
      label: "Unit",
      // type: "text",
      // value:createdProducts.unit

      inputOrSelect: "select",
      options: unitOptions,
    },

    {
      intputName: "tax",
      label: "Tax",
      type: "number",
      inputOrSelect: "select",
      options: taxOptions,
    },
    {
      intputName: "hsn",
      label: "HSN",
      type: "text",
    },
    {
      intputName: "amount",
      label: "  Amount",
      type: "text",
      value: createdProducts.amount,
    },
  ];
  const handleDelete = (event) => {
    event.stopPropagation(); // Prevent the click event from bubbling up to the main div
    alert("You clicked delete!");
  };

  // handle right input change
  const handleRightInputChange = (e) => {
    console.log("handleRightInputChange", e.target);
    const { name, value } = e.target;
    if (name) {
      setCreatedProducts((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    } else {
      setSelectedTax(e.target.value);
    }
  };

  // select prodect from local storage
  const handleSelectedProductChange = (event, newValue) => {
    console.log("newValue", newValue.value);
    setSelectedProduct(newValue);
  };
  const handleSelectedProjectChange = (event, newValue) => {
    console.log(newValue);
    setSelectedProject(newValue);
  };
  // add quantity
  const handleQtyChange = (e) => {
    console.log(e.target.value);
    setQuantity(e.target.value);
    const totalvalue = selectedProduct.rate * e.target.value;
    setTotalAmout(totalvalue);
    console.log(totalvalue);
  };

  // remove and add the product to local storage
  const handleAddProduct = () => {
    const products = {
      productData: selectedProduct,
      qty: quantity,
      totalAmout: selectedProduct?.rate * quantity,
    };
    setMyArray((pre) => [...pre, products]);
    setQuantity(0);
    setSelectedProduct("None");
    setTotalAmout(0);
  };
  // handle create button click
  const handleCreateProduct = async () => {
    try {
      const newArray = myArray.map((item) => ({
        quantity: parseInt(item.qty),
        unit: item.productData.unit,
        product_id: item.productData.value,
      }));
  
      const journalCreate = {
        product: {
          project_id: selectedProject?.value,
          hsn: createdProducts.hsn,
          rate: parseFloat(createdProducts.amount),
          tax_rate: { id: selectedTax },
          tax_id: selectedTax,
          is_master_product: true,
          name: createdProducts.productname,
          unit_id: selectedValue,
        },
        materials_used: newArray,
      };
  
      const formData = new FormData();
      formData.append("project_id", journalCreate.product.project_id);
      formData.append("hsn", journalCreate.product.hsn);
      formData.append("rate", journalCreate.product.rate);
      formData.append("tax_rate", JSON.stringify(journalCreate.product.tax_rate));
      formData.append("tax_id", journalCreate.product.tax_id);
      formData.append("is_master_product", journalCreate.product.is_master_product);
      formData.append("name", journalCreate.product.name);
      formData.append("unit_id", journalCreate.product.unit_id);

      formData.append("materials_used", JSON.stringify(journalCreate.materials_used));
      formData.append("image", productImage);
  
      const data = await stockJournalCreateAPI(formData);
      console.log("stockJournalCreateAPI", data);
  
      // Reset states
      setCreatedProducts({
        productname: "",
        unit: "",
        amount: "",
        hsn: "",
      });
      setMyArray([]);
      setSelectedProduct("None");
      setSelectedProject("None");
      setSelectedTax(0);
    } catch (error) {
      console.error("Error creating product:", error);
    }
  };
  

  

  const list = (anchor) => (
    <Box
      sx={{ width: 800, mx: 5, my: 3 }}
      role="presentation"
      onClick={toggleDrawer(anchor, true)}
      onKeyDown={toggleDrawer(anchor, true)}
    >

<Box className="stockjournl-page">
      <h2> Stock Journal</h2>
      <h4> Enter the product details to create a new product </h4>
      {/* <Button
        disableRipple
        sx={{
          mb: 2,
          textTransform: "none",
          color: "var(--black-button)",
          "&:hover": {
            background: "transparent",
          },
        }}
        component="label"
        onClick={() => navigate(-1)}
      >
        <KeyboardBackspaceIcon />
        Back
      </Button> */}
      <Box sx={{ display: "flex", gap: 2 }}>
        <Box className="input-box" sx={{width:"30% !important"}}>
          <Box sx={{ width: "100%" }}>
            <p className="product-name">product</p>

            <Autocomplete
              sx={{
                display: "inline-block",
                "& input": {
                  width: "100%",
                  border: "none",
                  bgcolor: "var(--inputbg-color)",
                  color: (theme) =>
                    theme.palette.getContrastText(
                      theme.palette.background.paper
                    ),
                },
              }}
              id="custom-input-demo"
              options={productOptions}
              value={selectedProduct}
              onChange={handleSelectedProductChange}
              componentsProps={{
                popper: {
                  modifiers: [
                    {
                      name: "offset",
                      options: {
                        offset: [0, -20],
                      },
                    },
                  ],
                },
              }}
              renderInput={(params) => (
                <div ref={params.InputProps.ref}>
                  <input
                    type="text"
                    {...params.inputProps}
                    style={{ height: "10xp" }}
                  />
                </div>
              )}
            />
          </Box>

          {updatedLeftArrOfInputs.map((input, index) => {
            return (
              <Grid item key={index} xs={6} md={4}>
                <InputComponent
                  handleChange={handleQtyChange}
                  state={input.state}
                  label={input.label}
                  type={input.type}
                  intputName={input.intputName}
                  inputOrSelect={input.inputOrSelect}
                  options={input.options}
                  value={input.value}
                  disabled={input.disabled}
                />
              </Grid>
            );
          })}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{
              mt: "2rem",
              fontWeight: "bold",
              textTransform: "none",
              bgcolor: "var(--black-button)",
              "&:hover": {
                background: "var(--button-hover)",
              },
            }}
            onClick={handleAddProduct}
          >
            Add Product
          </Button>
        </Box>
        <Box className="input-box">
          <Box sx={{ display: "flex", gap: 5 }}>
            <Box sx={{ width: "100%" }}>
              <p className="product-name">Project</p>

              <Autocomplete
                sx={{
                  display: "inline-block",
                  "& input": {
                    width: "100%",
                    border: "none",
                    bgcolor: "var(--inputbg-color)",
                    color: (theme) =>
                      theme.palette.getContrastText(
                        theme.palette.background.paper
                      ),
                  },
                }}
                id="custom-input-demo"
                options={projectOptions}
                value={selectedProject}
                onChange={handleSelectedProjectChange}
                componentsProps={{
                  popper: {
                    modifiers: [
                      {
                        name: "offset",
                        options: {
                          offset: [0, -20],
                        },
                      },
                    ],
                  },
                }}
                renderInput={(params) => (
                  <div ref={params.InputProps.ref}>
                    <input
                      type="text"
                      {...params.inputProps}
                      style={{ height: "10xp" }}
                    />
                  </div>
                )}
              />
              {RightArrOfInputs.map((input, index) => {
                return (
                  <InputComponent
                    key={index}
                    handleChange={input.handleChange || handleRightInputChange}
                    state={input.state}
                    label={input.label}
                    type={input.type}
                    intputName={input.intputName}
                    inputOrSelect={input.inputOrSelect}
                    options={input.options}
                  />
                );
              })}
            </Box>
            {/* image array */}
            {/* <div className="image-add-box"> */}
            <Button
              className="image-add-box"
              disableRipple
              sx={{
                bgcolor: "var(--inputbg-color)",
                mt: 3,
                // mb:-5,
                ml: 2,
                color: "var(--black-button)",
                textTransform: "none",
              }}
              component="label"
            >
              <img src={ImageAdd} alt="add ing" />
              <Typography variant="string" sx={{ pl: 1 }}>
                Upload product image
              </Typography>
              <input type="file" hidden onChange={handleImageChange} />
            </Button>
            {/* </div> */}
          </Box>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{
              mt: "2rem",
              fontWeight: "bold",
              textTransform: "none",
              bgcolor: "var(--black-button)",
              "&:hover": {
                background: "var(--button-hover)",
              },
            }}
            onClick={handleCreateProduct}
          >
            {" "}
            Create
          </Button>
        </Box>
      </Box>
      <p className="added-item"> Added Items</p>
      <Box
        sx={{
          mt: 1,
          pb: 2,
          py: 2,
          // mx: 1,
          // height: 500, // Height of the outer container
          bgcolor: "var(--bgwhite)",
          borderRadius: 5,
          msScrollRails: "none",

          gap: 1,
          // overflow: "hidden", // Hide the scrollbar
        }}
      >
        <Box
          sx={{
            maxHeight: 260, // Height of the inner container, larger than the outer container
            overflowY: "auto", // Enable scrolling
            width: "100%", // Ensure full width
            display: "flex",
            flexWrap: "wrap",
          }}
        >
          {myArray.length === 0 ? (
            <Box
              sx={{
                my: 2,
                mx: "auto",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <PlaylistAddRoundedIcon
                sx={{ mx: "auto" }}
                style={{ fontSize: "40px" }}
              />
              <p style={{ textAlign: "center" }}>No products available</p>
            </Box>
          ) : (
            myArray.map((data, index) => {
              console.log("arr data", data.productData);
              return (
                <Box
                  item
                  key={index}
                  sx={{
                    // mx: "auto",
                    px: "10px",
                    py: 1,
                    // flex: "1 0 1%", // Equivalent to flex: 1 0 calc(20% - 8px)
                    // maxWidth: "15%", // Equivalent to flex-basis: 20%
                  }}
                >
                  <ProductInputCard
                    // handleUpdate={handleUpdate}
                    handleDelete={handleDelete}
                    heading={data.productData.label}
                    image={data.img}
                    qty={data.qty}
                    unit={data.productData.unit}
                    rate={data.totalAmout}
                    amount={data.amount}
                  />
                </Box>
              );
            })
          )}
        </Box>
      </Box>
    </Box>










      
    </Box>
  );
  return (
    <Drawer
      // sx={{
      //   width: 700,
      //   flexShrink: 0,
      //   '& .MuiDrawer-paper': {
      //     width: 700,
      //     boxSizing: 'border-box',
      //   },
      // }}
      sx={{
        "& .MuiDrawer-root": {
          position: "absolute",
        },
        "& .MuiPaper-root": {
          position: "absolute",
        },
      }}
      anchor="right"
      open={state["right"]}
      onClose={toggleDrawer("right", false)}
      className="drawer-component"
    >
      {list("right")}
    </Drawer>
  );
}

export default AddStockJournalDrawer;
