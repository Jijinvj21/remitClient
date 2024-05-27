
const getDataFromLocalStorage = (from) => {
    try {
        const data = localStorage.getItem(from);
        if (data) {
          return(JSON.parse(data));
        }
    } catch (error) {
        console.log("error form local storage get function :", error)
    }
  
  };

  const postDataFromLocalStorage = (to,data) => {
    try {
      localStorage.setItem(to, JSON.stringify(data));
      
    } catch (error) {
        console.log("error form local storage post function :", error)
    }
  
  };

  const removeDataFromLocalStorage = (to) => {
    try {
      localStorage.removeItem(to);
      
    } catch (error) {
        console.log("error form local storage remove function :", error)
        
    }
  
  };

