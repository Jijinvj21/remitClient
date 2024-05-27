import axios from "axios";
// import axiosInstance from "./axiosInstance";
// const baseURL="http://192.168.0.100:8085"
// const API_ROUTES = {
//   PRODUCTENDRY: "product/create",
// };


// const BASE_URL = 'http://192.168.0.102:80';
// const MASRE_TABLE_BASE_URL = 'http://192.168.0.103:8088';
const BASE_URL = 'https://teqbae-accounts-rkkzm.ondigitalocean.app';



export const productAddAPI = async (productAdd) => {
  try {
    const response = await axios.post(`${BASE_URL}/product/create`, productAdd);
    return response
  } catch (error) {
    console.error(error);
    throw error.response.data;
  }
};


export const productGetAPI = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/product/getall`,);
    console.log("productGetAPI",response)
    return response.data
  } catch (error) {
    console.error(error);
    throw error.response.data;
  }
};

export const productDeleteAPI = async (productId) => {
  try {
    console.log({id:productId});
    const response = await axios.post(`${BASE_URL}/product/delete`,{id:productId});
    return response;
  } catch (error) {
    console.error(error);
    throw error.response.data;
  }
};

export const productUpdateAPI = async (productUpdate) => {
  try { //add id
    const response = await axios.put(`${BASE_URL}/product/update`,productUpdate);
    return response;
  } catch (error) {
    console.error(error);
    throw error.response.data;
  }
};

export const gstOptionsGetAPI = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/master/taxrate/get`,);
    console.log(response)
    return response.data.responseData
  } catch (error) {
    console.error(error);
    throw error.response.data;
  }
};

export const projectCreateAPI = async (projectAdd) => {
  try {
    const response = await axios.post(`${BASE_URL}/project/create`,projectAdd);
    console.log(response)
    return response
  } catch (error) {
    console.error(error);
    throw error.response.data;
  }
};

export const projectGetAPI = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/project/getall`,);
    return response.data
  } catch (error) {
    console.error(error);
    throw error.response.data;
  }
};


export const countryOptionsGetAPI = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/master/country/list`,);
    console.log(response)
    return response.data.responseData
  } catch (error) {
    console.error(error);
    throw error.response.data;
  }
};

export const workTypeOptionsGetAPI = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/master/worktype/list`,);
    console.log(response)
    return response.data.responseData
  } catch (error) {
    console.error(error);
    throw error.response.data;
  }
};

export const clientDataGetAPI = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/project/getclient`,);
    return response.data
  } catch (error) {
    console.error(error);
    throw error.response.data;
  }
};

export const createVoucherAPI = async (voucherAdd) => {
  try {
    const response = await axios.post(`${BASE_URL}/voucher/sales/add`,voucherAdd);
    console.log(response)
    return response
  } catch (error) {
    console.error(error);
    throw error.response.data;
  }
};

export const partyDataGetAPI = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/party/getall`,);
    return response.data
  } catch (error) {
    console.error(error);
    throw error.response.data;
  }
};



export const createPurchaseAPI = async (purchaseAdd) => {
  try {
    const response = await axios.post(`${BASE_URL}/voucher/purchase/add`,purchaseAdd);
    console.log(response)
    return response
  } catch (error) {
    console.error(error);
    throw error.response.data;
  }
};

export const createPartyAPI = async (partyAdd) => {
  try {
    const response = await axios.post(`${BASE_URL}/party/create`,partyAdd);
    console.log(response)
    return response
  } catch (error) {
    console.error(error);
    throw error.response.data;
  }
};

export const projectDataByIdAPI = async (id) => {
  try {
    const response = await axios.post(`${BASE_URL}/project/getbyid`,id);
    console.log(response)
    return response
  } catch (error) {
    console.error(error);
    throw error.response.data;
  }
};

export const paymentInAPI = async (paymentIn) => {
  try {
    console.log(paymentIn)
    const response = await axios.post(`${BASE_URL}/voucher/payment/add`,paymentIn);
    console.log(response)
    return response
  } catch (error) {
    console.error(error);
    throw error.response.data;
  }
};

export const unitsDataGetAPI = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/master/unit/get`,);
    return response.data
  } catch (error) {
    console.error(error);
    throw error.response.data;
  }
};


export const paymentDataGetAPI = async (paymentMode) => {
  try {
    console.log(paymentMode)
    const response = await axios.post(`${BASE_URL}/voucher/payment/getall`,paymentMode);
    console.log(response)
    return response
  } catch (error) {
    console.error(error);
    throw error.response.data;
  }
};

export const categeryGetAPI = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/product/category/getall`,);
    return response.data
  } catch (error) {
    console.error(error);
    throw error.response.data;
  }
};


export const stockJournalCreateAPI = async (stockJournalAdd) => {
  try {
    const response = await axios.post(`${BASE_URL}/product/ismaster/create`,stockJournalAdd);
    console.log(response)
    return response
  } catch (error) {
    console.error(error);
    throw error.response.data;
  }
};

export const quotationCreateAPI = async (quotationAdd) => {
  try {
    const response = await axios.post(`${BASE_URL}/quotation/create`,quotationAdd);
    console.log(response)
    return response
  } catch (error) {
    console.error(error);
    throw error.response.data;
  }
};


export const quotationGetAPI = async (id) => {
  try {
    const response = await axios.post(`${BASE_URL}/quotation/get`,id);
    console.log(response)
    return response
  } catch (error) {
    console.error(error);
    throw error.response.data;
  }
};

// export const imageUploadtAPI = async (img) => {
//   try {
//     const response = await axios.post(`${BASE_URL}/upload/image`,img, {
//       headers: {
//         'Content-Type': 'multipart/form-data'
//       }
//     });
//     console.log(response)
//     return response
//   } catch (error) {
//     console.error(error);
//     throw error.response.data;
//   }
// };


export const expenceGetAPI = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/voucher/expenses/item/getall`,);
    return response.data
  } catch (error) {
    console.error(error);
    throw error.response.data;
  }
};
// voucher/expenses/item/add


export const expensesTypeAddAPI = async (expenses) => {
  try {
    const response = await axios.post(`${BASE_URL}/voucher/expenses/item/add`,expenses);
    console.log(response)
    return response
  } catch (error) {
    console.error(error);
    throw error.response.data;
  }
};

export const expensesDataAddAPI = async (expenses) => {
  try {
    const response = await axios.post(`${BASE_URL}/voucher/expenses/add`,expenses);
    console.log(response)
    return response
  } catch (error) {
    console.error(error);
    throw error.response.data;
  }
};


export const categoryDataAddAPI = async (catogery) => {
  try {
    const response = await axios.post(`${BASE_URL}/project/category/create`,catogery);
    console.log(response)
    return response
  } catch (error) {
    console.error(error);
    throw error.response.data;
  }
}

export const categoryDataGetAPI = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/project/category/getall`);
    console.log(response)
    return response
  } catch (error) {
    console.error(error);
    throw error.response.data;
  }
}


export const creditDataAddAPI = async (creditData) => {
  try {
    const response = await axios.post(`${BASE_URL}/voucher/creditnote/add`,creditData);
    console.log(response)
    return response
  } catch (error) {
    console.error(error);
    throw error.response.data;
  }
}


export const debitDataAddAPI = async (debitData) => {
  try {
    const response = await axios.post(`${BASE_URL}/voucher/debitnote/add`,debitData);
    console.log(response)
    return response
  } catch (error) {
    console.error(error);
    throw error.response.data;
  }
}

export const deliveryChallanAddAPI = async (deliveryChallanData) => {
  try {
    console.log(deliveryChallanData)
    const response = await axios.post(`${BASE_URL}/voucher/delivery-challan/add`,deliveryChallanData);
    console.log(response)
    return response
  } catch (error) {
    console.error(error);
    throw error.response.data;
  }
}

export const stateDataGetAPI = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/master/state/list`);
    console.log(response)
    return response
  } catch (error) {
    console.error(error);
    throw error.response.data;
  }
}