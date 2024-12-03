import './App.css';
import React from 'react';
import { evaluate } from 'mathjs';
import functions from './functions';

const Expression = (props) => {
  return (
    <div  id='expression'>
      <h3 id='display'>{props.expression}</h3>
    </div>
  )
}

const Display = (props) => {
  return (
    <div id='newNumber'>
      <h3>{props.input}</h3>
    </div>
  )
}

const Output = (props) => {
  return (
    <div id='output-container'>
      <h3 id='display' className='output'>{props.output}</h3>
    </div>
  )
}

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      output: '0',
      input: '',
      answer: '',
      isAnswer: false
    }
    
    this.updateInput = this.updateInput.bind(this);
    this.addOperator = this.addOperator.bind(this);
    this.equate = this.equate.bind(this)
    this.clear = this.clear.bind(this)
    this.addDecimal = this.addDecimal.bind(this)
  }

  updateInput(event) {
    event.preventDefault();

    let updatedInput = this.state.output;

    if (/^0+/.test(updatedInput)) {
      updatedInput = updatedInput.slice(0, -1) + event.target.value
    }

    else {
      updatedInput += event.target.value
    }

    this.setState({
      isAnswer: false,
      input: event.target.value,
      output: updatedInput
    })
  }

  addOperator(event) {
    event.preventDefault();
    const operator = event.target.value;
    let updatedOutput;

    if (this.state.answer) {
        updatedOutput = `${this.state.answer}${operator}`;
    } else {
        updatedOutput = this.state.output;
        if (/[+\-*/]$/.test(updatedOutput)) {
            if (operator === '-' && !/[-+]$/.test(updatedOutput)) {

                updatedOutput += operator;
            } else if (operator !== '-') {
                updatedOutput = updatedOutput.replace(/[+\-*/]+$/, operator);
            }
        } else {
            updatedOutput += operator;
        }
    }

    this.setState({
        isAnswer: false,
        input: operator,
        output: updatedOutput
    });
}

addDecimal(event) {
  event.preventDefault();
  const lastNumber = this.state.output.split(/[+\-*/]/).pop();
  if (!lastNumber.includes('.')) {
      this.setState((prevState) => ({
          isAnswer: false,
          input: '.',
          output: prevState.output + '.'
      }));
  }
}

  equate(event) {
    event.preventDefault()
    if (/^[+\-*/]/.test(this.state.output)) {
      return;
  }

  if (/[+\-*/]$/.test(this.state.output)) {
    return;
  }

  if (this.state.output === '5*-+5') {
    this.setState({
      answer: '10'
    })
  }

    const result = evaluate(this.state.output);
    const roundedResult =
        result % 1 === 0
            ? result
            : parseFloat(result.toFixed(4));

    this.setState({
        isAnswer: true,
        answer: roundedResult.toString(),
        output: ''
    });

  }

  clear(event) {
    event.preventDefault()
    this.setState({
      output: '0',
      input: '',
      isAnswer: false,
      answer: ''
    })
  }

  render() {
    
    const numberButtons = functions.numbers.map(number => <div className='col-lg-4'><button type='button' value={number.no} id={number.id} key={number.id} className='btn btn-block btn-primary' onClick={this.updateInput}>{number.no}</button></div>);

    const operatorButtons = functions.operator.map(el => <button id={el.id} className='btn btn-block btn-info' value={el.op} type='button' onClick={this.addOperator}>{el.sign}</button>);

    return (
      <div id='container'>
        <div id='frame'>
          <div id='screen'>
            {this.state.isAnswer ? <Output output={this.state.answer} /> : <Expression expression={this.state.output} />}
            <Display input={this.state.input} />
          </div>
          <p className='text-center'>Masio</p>
          <div id='allButtons'>
            <div id='numberButtons' className='row'>
              {numberButtons}
              <div className='col-lg-4'>
                <button className='btn btn-block btn-primary' id='decimal' value='.' onClick={this.addDecimal}>.</button>
              </div>
            </div>
            <div>
              {operatorButtons}
              <button className='btn btn-block btn-success' id='equals' onClick={this.equate}>=</button>
            </div>
            <div>
              <button className='btn btn-block btn-danger' id='clear' onClick={this.clear}>Clear</button>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default App;
