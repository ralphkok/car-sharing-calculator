import React from "react";

import "./index.scss";

export interface ListProps {
  className?: string;
  prefix?: string,
  suffix?: string,
  onChange: (values: number[]) => void,
};

interface ListState {
  values: number[],
  total: number,
};

export class List extends React.Component<ListProps, ListState> {
  constructor(props) {
    super(props);
    this.state = {
      values: [ 0.0 ],
      total: 0.0,
    };
  }

  onChangeValue = (event, index: number) => {
    let value = Number.parseFloat(event.target.value);
    if (isNaN(value)) {
      value = 0;
    }
    const { values } = this.state;
    
    const newValues = [ ...values ];
    newValues[index] = value;
    const total = newValues.reduce((t: number, v: number) => (
      t + v
    ), 0.0);

    this.setState({ values: newValues, total });

    // if the last value is non-zero, add another element to the list
    if (index === newValues.length - 1 && value !== 0) {
      this.setState({
        values: [
          ...newValues,
          0
        ]
      })
    }

    // notify parent of new total
    const { onChange } = this.props;
    onChange([ ...this.state.values ]);
  }

  render() {
    const { className, prefix, suffix } = this.props;
    const { values } = this.state;
    return (
      <div className={`list ${className || ''}`}>
        { values.map((value: number, index: number) => (
          <div className="item" key={index}>
            {!!prefix && (
              <span>{`${prefix} `}</span>
            )}
            <input
              type="number"
              value={value}
              onFocus={e => e.target.select() }
              onChange={e => this.onChangeValue(e, index)}
              onKeyUp={e => this.onChangeValue(e, index)}
            />
            {!!suffix && (
              <span>{` ${suffix}`}</span>
            )}
          </div>
        ))}
      </div>
    )
  }
}
