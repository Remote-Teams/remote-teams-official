import React from "react";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import isEmpty from "../../../store/validations/is-empty";
import dateFns from "date-fns";

const PaymentHistoryTab = () => {
  const [paymentHis, setpaymentHis] = useState([]);

  const paymentHistory = useSelector((state) => state.payment.paymentHistory);
  useEffect(() => {
    if (!isEmpty(paymentHistory)) {
      setpaymentHis(paymentHistory);
    }
  }, [paymentHistory]);

  if (!isEmpty(paymentHis)) {
    return (
      <>
        <div className="finances-table-thead">
          <table className="finances-table finances-table--payment-history">
            <thead>
              <tr>
                <th>Date</th>
                <th>Plan Type</th>
                <th>Amount</th>
              </tr>
            </thead>
          </table>
        </div>
        <div className="finances-table-tbody finances-table-tbody--payment-history">
          <table className="finances-table finances-table--payment-history">
            <tbody>
              {paymentHis.map((billing, index) => {
                return (
                  <tr key={index}>
                    <td>
                      {dateFns.format(
                        new Date(billing.created * 1000),
                        "Do-MMM-YYYY"
                      )}{" "}
                    </td>
                    <td>
                      {billing.amount === 24000
                        ? "SPACESTATION"
                        : billing.amount === 16000
                        ? "SPACESHIP"
                        : billing.amount === 8000
                        ? "ROVER"
                        : "ASTROUNOT"}{" "}
                    </td>
                    <td>${billing.amount}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </>
    );
  } else {
    return "No payment history found";
  }
};

export default PaymentHistoryTab;
