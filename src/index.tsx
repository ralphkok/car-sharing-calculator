import "rxjs";
import React from "react";
import ReactDOM from "react-dom";

import "./index.scss";
import { List } from "./components/List";
import { Footer } from "./components/Footer";

interface AppState {
  distances: number[][];
  expenses: number[][];
  balance: number[];
};

class App extends React.Component<{}, AppState> {
  constructor(props) {
    super(props);

    this.state = {
      distances: [[0], [0]],
      expenses: [[0], [0]],
      balance: [0, 0],
    };
  }

  onUpdateDistance = (values: number[], index: number) => {
    const { distances } = this.state;
    this.setState({
      distances: distances.map((d, i) => (
        i === index
          ? values
          : d
      ))
    });
    this.calculateBalance();
  }

  onUpdateExpenses = (values: number[], index: number) => {
    const { expenses } = this.state;
    this.setState({
      expenses: expenses.map((e, i) => (
        i === index
          ? values
          : e
      ))
    });
    this.calculateBalance();
  }

  calculateBalance = () => {
    const { distances: [ djm, drl], expenses: [ ejm, erl ] } = this.state;
    const totalDistance = this.add(djm) + this.add(drl);
    const totalExpense = this.add(ejm) + this.add(erl);
    const balanceJM = totalExpense * this.add(djm) / totalDistance;
    const balanceRL = totalExpense * this.add(drl) / totalDistance;
    this.setState({
      balance: [
        Math.max(0, balanceJM - this.add(ejm)),
        Math.max(0, balanceRL - this.add(erl)),
      ]
    });
  }

  add = (values: number[]): number => (
    values.reduce((total: number, value: number) => (
      total + value
    ), 0)
  );

  render = () => {
    const { distances: [ djm, drl ], expenses: [ ejm, erl ], balance } = this.state;
    return (
      <div className="container">
        <div className="header">
          <h2>J&amp;M</h2>
          <h2>R&amp;L</h2>
        </div>
        <div className="lists">
          <div className="listScroller">
            <h3>Distances (km)</h3>
            <div className="listset">
              <List
                className={
                  djm.length > drl.length
                    ? 'longest'
                    : djm.length < drl.length
                      ? 'shortest'
                      : ''
                }
                onChange={v => this.onUpdateDistance(v, 0)}
              />
              <List
                className={
                  drl.length > djm.length
                    ? 'longest'
                    : drl.length < djm.length
                      ? 'shortest'
                      : ''
                }
                onChange={v => this.onUpdateDistance(v, 1)}
              />
            </div>
            <div className="subtotal">
              <p>{`${this.add(djm)} km`}</p>
              <p>Total</p>
              <p>{`${this.add(drl)} km`}</p>
            </div>
            <h3>Expenses (€)</h3>
            <div className="listset">
              <List
                className={
                  ejm.length > erl.length
                    ? 'longest'
                    : ejm.length < erl.length
                      ? 'shortest'
                      : ''
                }
                onChange={v => this.onUpdateExpenses(v, 0)}
                />
              <List
                className={
                  erl.length > ejm.length
                  ? 'longest'
                  : erl.length < ejm.length
                    ? 'shortest'
                      : ''
                }
                onChange={v => this.onUpdateExpenses(v, 1)}
              />
            </div>
            <div className="subtotal">
              <p>{`€${Math.round((this.add(ejm) + Number.EPSILON) * 100) / 100}`}</p>
              <p>Total</p>
              <p>{`€${Math.round((this.add(erl) + Number.EPSILON) * 100) / 100}`}</p>
            </div>
          </div>
        </div>
        <Footer
          totals={balance}
        />
      </div>
    )
  };
};

ReactDOM.render(<App />, document.getElementById('root'));