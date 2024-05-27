import "./ProductsPage.scss"
import { Link } from "react-router-dom"
function ProductsPage() {
  return (
    <div className="product-page-section">
      <div className="link-div">

     <Link to="/admin/manage-products" className="link-to-manage-products">Manage Products</Link>
      </div>
      <div className="product-inner-section">
         <h2> Products </h2>
          {/* <h4> Manage Products to the inventory </h4> */}

      </div>
    </div>
  )
}

export default ProductsPage