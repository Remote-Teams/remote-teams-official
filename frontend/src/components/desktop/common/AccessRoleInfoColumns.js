import React from "react";

const data = [
  {
    img: require("../../../assets/img/dummy/access-role-admin.svg"),
    title: "Admin",
    projects: "All",
    resources: "All",
    finances: "All",
    customers: "All",
    reports: "All",
  },
  {
    img: require("../../../assets/img/dummy/access-role-manager.svg"),
    title: "Project manager",
    projects: "Edit, View",
    resources: "Edit, View",
    finances: "All",
    customers: "All",
    reports: "All",
  },
  {
    img: require("../../../assets/img/dummy/access-role-resource.svg"),
    title: "Resource",
    projects: "View",
    resources: "View",
    finances: "View",
    customers: "View",
    reports: "View",
  },
  {
    img: require("../../../assets/img/dummy/access-role-client.svg"),
    title: "Client",
    projects: "View",
    resources: "Nil",
    finances: "Nil",
    customers: "Nil",
    reports: "Nil",
  },
];

function AccessRoleInfoColumns() {
  return (
    <>
      {data.map((data, index) => (
        <div key={index} className="col-3">
          <div className="login-access-roles-content__img-div">
            <img src={data.img} alt="person" className="img-wh-100" />
          </div>
          <h2 className="font-18-bold-space-light-uppercase text-center mb-30">
            {data.title}
          </h2>
          {/* Projects */}
          <div className="row mx-auto mb-18">
            <div className="col-7">
              <h3 className="font-24-semiBold">Projects</h3>
            </div>
            <div className="col-5">
              <h4 className="font-20-semiBold text-italic">{data.projects}</h4>
            </div>
          </div>
          {/* Resources */}
          <div className="row mx-auto mb-18">
            <div className="col-7">
              <h3 className="font-24-semiBold">Resources</h3>
            </div>
            <div className="col-5">
              <h4 className="font-20-semiBold text-italic">{data.resources}</h4>
            </div>
          </div>
          {/* Finances */}
          <div className="row mx-auto mb-18">
            <div className="col-7">
              <h3 className="font-24-semiBold">Finances</h3>
            </div>
            <div className="col-5">
              <h4 className="font-20-semiBold text-italic">{data.finances}</h4>
            </div>
          </div>
          {/* Customers */}
          <div className="row mx-auto mb-18">
            <div className="col-7">
              <h3 className="font-24-semiBold">Customers</h3>
            </div>
            <div className="col-5">
              <h4 className="font-20-semiBold text-italic">{data.customers}</h4>
            </div>
          </div>
          {/* Reports */}
          <div className="row mx-auto mb-18">
            <div className="col-7">
              <h3 className="font-24-semiBold">Reports</h3>
            </div>
            <div className="col-5">
              <h4 className="font-20-semiBold text-italic">{data.resources}</h4>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}

export default AccessRoleInfoColumns;
