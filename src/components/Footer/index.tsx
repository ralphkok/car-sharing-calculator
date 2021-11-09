import React from "react";

import './index.scss';

export interface FooterProps {
  totals: number[],
};

export const Footer = (props: FooterProps) => {
  const { totals } = props;
  return (
    <div className="footer">
      <h3>To pay:</h3>
      <div className="amounts">
        { totals.map((t, i) => (
          <div
            className="amount"
            key={i}
          >{
            `€${isNaN(t) ? 0 : Math.round((t + Number.EPSILON) * 100) / 100}`
          }</div>
        ))}
      </div>
    </div>
  );
}