import { useReducer } from "react";
import "./App.css"
import DigitButton from "./Digitbutton";
import OperationButton from "./OperationButton";


export const ACTIONS = {
  ADD_DIGIT :'add-digit',
  CLEAR : 'clear',
  OPERATIONS : 'choose-operand',
  DELETE_DIGIT : 'delete-digit',
  EVALUATE : 'evluate'
}

function reducer(state, {type, payload}) {
  switch(type) {
    case ACTIONS.ADD_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          currentOperand: payload.digit,
          overwrite: false,

        }
      }
      if (payload.digit === "0" && state.currentOperand === "0" ) return state
      if (payload.digit === "." && state.currentOperand.include(".")){
        return state
      } 
      return {
        ...state,
        currentOperand : '${currentOperand || ""}${payload.digit}'
      }
    case ACTIONS.OPERATIONS:
      if (state.currentOperand == null && state.previousOperand == null){
        return state
      }
      if (state.previousOperand == null)
        return{
          ...state,
          operation: payload.operation,
          previousOperand: state.currentOperand,
          currentOperand: null
        }

        return{
          ...state,
          previousOperand: evaluate(state),
          operation: payload.currentOperand,
          currentOperand: null
        }

    case ACTIONS.CLEAR:
      return{}
    case ACTIONS.DELETE_DIGIT:
      if(state.overwrite) {
        return {
          ...state,
          overwrite: false,
          currentOperand: null
        }
      }
      if(state.currentOperand == null) return state
      if(state.currentOperand.length === 1){
        return {...state, currentOperand: null }
      }

      return {
        ...state,
        currentOperand: state.current.slice(0, -1)
      }
    case ACTIONS.EVALUATE:
      if(
        state.operation == null ||
        state.curentOperand == null ||
        state.previousOperand == null
      ){
        return state
      }
      return {
        ...state,
        overwrite: true,
        previousOperand: null,
        operation: null,
        currentOperand: evaluate(state)
      }
  }
}


function evaluate({currentOperand, previousOperand, operation }) {
  const prev = parseFloat(previousOperand)
  const current = parseFloat(currentOperand)
  if (isNaN(prev) || isNaN(current)) return ""
  let computation = ""
  switch (operation){
    case "+": computation = prev + current
      break  
    case "-": computation = prev - current
      break  
    case "*": computation = prev * current
      break  
    case "/": computation = prev / current
      break  
    case "+": computation = prev + current
      break  }
    return computation.toString()
}

const INTEGER_FORMATER = new Intl.NumberFormat("en-us", {
  maximumFractionDigits: 0,
})
function formatOperand(operand) {
  if (operand == null) return 
  const [integer, decimal] = operand.split('.')
  if (decimal == null) return INTEGER_FORMATER.format(integer)
  return '${INTEGER_FORMATER.format(integer)}.${decimal}'
}



function App() {
  const [{currentOperand, previousOperand, operation }, dispatch] = useReducer(reducer, {})

  dispatch({ type: ACTIONS.ADD_DIGIT, payload: {digit: 1}})
  return (
    <div className="calculator-grid">
      <div className="output">
        <div className="previous-operand">{formatOperand(previousOperand)} {operation}</div>
        <div className="current-operand">{formatOperand(currentOperand)}</div>
      </div>
      <button className="span-two" onClick={dispatch({type: ACTIONS.CLEAR})}>AC</button>
      <button onClick={dispatch({type: ACTIONS.DELETE_DIGIT})}>DEL</button>
      <OperationButton operation={"/"} dispatch={dispatch} />
      <DigitButton digit={"1"} dispatch={dispatch} />
      <DigitButton digit={"2"} dispatch={dispatch} />
      <DigitButton digit={"3"} dispatch={dispatch} />
      <OperationButton operation={"*"} dispatch={dispatch} />
      <DigitButton digit={"4"} dispatch={dispatch} />
      <DigitButton digit={"5"} dispatch={dispatch} />
      <DigitButton digit={"6"} dispatch={dispatch} />
      <OperationButton operation={"+"} dispatch={dispatch} />
      <DigitButton digit={"7"} dispatch={dispatch} />
      <DigitButton digit={"8"} dispatch={dispatch} />
      <DigitButton digit={"9"} dispatch={dispatch} />
      <OperationButton operation={"-"} dispatch={dispatch} />
      <DigitButton digit={"."} dispatch={dispatch} />
      <DigitButton digit={"0"} dispatch={dispatch} />
      <button className="span-two" onClick={dispatch({type: ACTIONS.EVALUATE})} />
    </div>
  )
}

export default App;
