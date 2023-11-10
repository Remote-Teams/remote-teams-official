import React, { Fragment } from "react";
import { useHistory } from "react-router-dom";
import { Link } from "react-router-dom";

export default function BreadcrumbMenu({ menuObj }) {
  let history = useHistory();

  return (
    <div className="rt-breadcrumb-menu">
      <div className="row mx-0 flex-nowrap rt-breadcrumb-menu__row">
        {menuObj.map((data, index) => (
          <Fragment key={index}>
            {data.type === "goBackButton" ? (
              <>
                <button
                  className="rt-breadcrumb-menu__li"
                  onClick={() => history.goBack()}
                >
                  <span>{data.title}</span>
                </button>
              </>
            ) : data.link ? (
              <>
                <Link to={data.link}>
                  <div className="rt-breadcrumb-menu__li">
                    <span>{data.title}</span>
                  </div>
                </Link>
              </>
            ) : (
              <div className="rt-breadcrumb-menu__li rt-breadcrumb-menu__li--last">
                <span>{data.title}</span>
              </div>
            )}
          </Fragment>
        ))}
      </div>
    </div>
  );
}
