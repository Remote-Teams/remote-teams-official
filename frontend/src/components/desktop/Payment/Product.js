import React from "react";
import getSymbolFromCurrency from "currency-symbol-map";
// import "./App.css";

const Product = ({
  product,
  currentProductSelected,
  handleClick,
  index,
  activePlan,
}) => {
  let OrganizationData = JSON.parse(localStorage.getItem("OrganizationData"));
  // NEW PAYMENT FLOW
  //   OrganizationData.currency = "inr";
  return (
    <div
      key={index}
      className={
        activePlan === product.name
          ? "active-plan leads-red-gradient-block subscription-box col-md-5"
          : "leads-red-gradient-block subscription-box col-md-5"
      }
      onClick={() => handleClick(product)}
    >
      <div className="subscription-box__imgBlock">
        {/* <i className="fa fa-users fa-4x" /> */}
        {product.name === "Free Forever" && (
          <img
            src={require("./../../../assets/img/plans/plans-astronaut.svg")}
            alt="plans"
            className="plans0-img"
          />
        )}

        {product.name === "SPACESTATION" && (
          <img
            src={require("./../../../assets/img/plans/plans-astronaut.svg")}
            alt="plans"
            className="plans0-img"
          />
        )}
        {product.name === "SPACESHIP" && (
          <img
            src={require("./../../../assets/img/plans/plans-astronaut.svg")}
            alt="plans"
            className="plans0-img"
          />
        )}
        {product.name === "ROVER" && (
          <img
            src={require("./../../../assets/img/plans/plans-astronaut.svg")}
            alt="plans"
            className="plans0-img"
          />
        )}
        {product.name === "ASTRONAUT" && (
          <img
            src={require("./../../../assets/img/plans/plans-astronaut.svg")}
            alt="plans"
            className="plans0-img"
          />
        )}
      </div>
      <div className="plan-content text-left">
        <p className="plan-price">
          {" "}
          {OrganizationData.currency === "inr"
            ? "Rs."
            : getSymbolFromCurrency(
                OrganizationData.currency.toUpperCase()
              )}{" "}
          {product.priceData.unit_amount / 100}/Mo
        </p>
        <p className="plan-name">{product.name}</p>
        {/* </div>
                            <div> */}
        <p className="plan-users">
          {product.name === "ASTRONAUT"
            ? `${product.metadata.maxUsers} User`
            : product.name === "ROVER"
            ? `2-${product.metadata.maxUsers} Users`
            : product.name === "SPACESHIP"
            ? `6-${product.metadata.maxUsers} Users`
            : product.name === "SPACESTATION"
            ? `11-${product.metadata.maxUsers} Users`
            : ""}
        </p>
      </div>
    </div>
    // <div className="w-2/5 rounded overflow-hidden border rounded-md p-2">
    //   <div className="px-2 py-2">
    //     <div className="text-gray-500 text-xl mb-2 font-medium">
    //       {product.name}
    //     </div>
    //     <p className="text-pasha text-2xl font-extrabold">
    //       {product.metadata.amount}
    //     </p>
    //     <div className="flex-wrap">
    //       <div className="leading-none text-gray-500 text-xs font-medium">
    //         {/* Per {product.interval} */}
    //         per month
    //       </div>
    //       <div className="leading-none text-gray-500 text-xs font-medium mt-1">
    //         {/* Billed {product.billed} */}
    //         billed monthly
    //       </div>
    //     </div>

    //     <div className="flex justify-center mt-6">
    //       {product.id === organizationData.productId ? (
    //         <button
    //           className="bg-pasha hover:bg-white outline-none hover:text-pasha hover:border hover:border-black text-white focus:bg-white focus:text-pasha font-light py-2 px-4 rounded-lg"
    //           type="submit"
    //         >
    //           <div className="w-auto -mx-2 md:mx-0">Selected</div>
    //         </button>
    //       ) : (
    //         <button
    //           onClick={() => handleClick(product)}
    //           className="bg-pasha hover:bg-white outline-none hover:text-pasha hover:border hover:border-black text-white focus:bg-white focus:text-pasha font-light py-2 px-4 rounded-lg"
    //           type="submit"
    //         >
    //           <div className="w-auto -mx-2 md:mx-0">Select</div>
    //         </button>
    //       )}
    //     </div>
    //   </div>
    // </div>
  );
};

export default Product;
