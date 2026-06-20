import { useState } from 'react'
import './App.css'

function App() {
  const [display, setDisplay] = useState('0')
  const [previousValue, setPreviousValue] = useState(null)
  const [operator, setOperator] = useState(null)
  const [waitingForOperand, setWaitingForOperand] = useState(false)

  const inputDigit = (digit) => {
    if (waitingForOperand) {
      setDisplay(String(digit))
      setWaitingForOperand(false)
    } else {
      setDisplay(display === '0' ? String(digit) : display + digit)
    }
  }

  const inputDecimal = () => {
    if (waitingForOperand) {
      setDisplay('0.')
      setWaitingForOperand(false)
      return
    }
    if (!display.includes('.')) {
      setDisplay(display + '.')
    }
  }

  const clear = () => {
    setDisplay('0')
    setPreviousValue(null)
    setOperator(null)
    setWaitingForOperand(false)
  }

  const toggleSign = () => {
    setDisplay(String(-parseFloat(display)))
  }

  const inputPercent = () => {
    setDisplay(String(parseFloat(display) / 100))
  }

  const performOperation = (nextOperator) => {
    const inputValue = parseFloat(display)

    if (previousValue == null) {
      setPreviousValue(inputValue)
    } else if (operator) {
      const currentValue = previousValue
      let newValue

      switch (operator) {
        case '+':
          newValue = currentValue + inputValue
          break
        case '-':
          newValue = currentValue - inputValue
          break
        case '×':
          newValue = currentValue * inputValue
          break
        case '÷':
          newValue = inputValue !== 0 ? currentValue / inputValue : 'Error'
          break
        default:
          newValue = inputValue
      }

      setPreviousValue(newValue)
      setDisplay(String(newValue))
    }

    setWaitingForOperand(true)
    setOperator(nextOperator)
  }

  const handleEquals = () => {
    if (operator && previousValue != null) {
      performOperation('=')
      setOperator(null)
    }
  }

  const buttons = [
    { label: 'C', type: 'function', action: clear },
    { label: '±', type: 'function', action: toggleSign },
    { label: '%', type: 'function', action: inputPercent },
    { label: '÷', type: 'operator', action: () => performOperation('÷') },
    { label: '7', type: 'number', action: () => inputDigit(7) },
    { label: '8', type: 'number', action: () => inputDigit(8) },
    { label: '9', type: 'number', action: () => inputDigit(9) },
    { label: '×', type: 'operator', action: () => performOperation('×') },
    { label: '4', type: 'number', action: () => inputDigit(4) },
    { label: '5', type: 'number', action: () => inputDigit(5) },
    { label: '6', type: 'number', action: () => inputDigit(6) },
    { label: '-', type: 'operator', action: () => performOperation('-') },
    { label: '1', type: 'number', action: () => inputDigit(1) },
    { label: '2', type: 'number', action: () => inputDigit(2) },
    { label: '3', type: 'number', action: () => inputDigit(3) },
    { label: '+', type: 'operator', action: () => performOperation('+') },
    { label: '0', type: 'number wide', action: () => inputDigit(0) },
    { label: '.', type: 'number', action: inputDecimal },
    { label: '=', type: 'operator', action: handleEquals },
  ]

  return (
    <div className="calculator-wrapper">
      <div className="calculator">
        <div className="display">
          <span className="display-text">{display}</span>
        </div>
        <div className="buttons">
          {buttons.map((btn, index) => (
            <button
              key={index}
              className={`btn ${btn.type}`}
              onClick={btn.action}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default App
