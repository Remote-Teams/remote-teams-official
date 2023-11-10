import React, { Component, Fragment } from "react";

export class ProfilePaymentHistoryTab extends Component {
  render() {
    return (
      <Fragment>
        <div className="profile_payment_history_main_container">
          <table className="table text-center">
            <thead>
              <tr>
                <th>DATE</th>
                <th>PLAN TYPE</th>
                <th>AMOUNT</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>02-Jan-2020</td>
                <td>Basic</td>
                <td>$12</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Fragment>
    );
  }
}

export default ProfilePaymentHistoryTab;
