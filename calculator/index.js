const upperScreen = document.querySelector(".upper-screen");
const lowerScreen = document.querySelector(".lower-screen");
let screenText = "";
let operatorsArr = [];

let inParanthesis = [];
let lastOperatorPosition = 0;
let operator;
let result;

//! NOTES

// NOW F4 F3 KEYS ARE PRESSABLE

document.body.addEventListener("keydown", (e) => {
  if (e.key.match(/[0-9+-/*()]/)) {
    screenText += e.key;
  }
  if (e.key == "Backspace") {
    screenText = screenText.slice(0, screenText.length - 1);
  }
  if (e.key == "Enter") {
    calculate();
  }
  lowerScreen.innerText = screenText;
});

function calculate() {
  let openedPharanteses = [];
  let closedPharanteses = [];
  let scopes = [];
  let operations = [];

  console.log("screenText: ", screenText);

  // find pharanteses location
  for (let i = 0; i < screenText.length; i++) {
    if (screenText[i] == "(") {
      openedPharanteses.push({ index: i, isOpen: true });
    }
    if (screenText[i] == ")") {
      closedPharanteses.push({ index: i, isOpen: false });
    }
  }

  // concat opened and closed pharanteses
  let pharanteses = openedPharanteses.concat(closedPharanteses);

  // sort
  pharanteses.sort((a, b) =>
    a.index > b.index ? 1 : b.index > a.index ? -1 : 0
  );

  // find pharanteses scope
  let i = 0;

  while (pharanteses.length > 1) {
    if (pharanteses[i].isOpen && pharanteses[i + 1].isOpen === false) {
      scopes.push(pharanteses.splice(i, 2));
      i = 0;
    } else i++;
  }
  console.log("scopes", scopes);

  // seperate screenText into smaller scopes
  for (let i = 0; i < scopes.length; i++) {
    let length = scopes[i][1].index - scopes[i][0].index;
    operations.push(
      screenText.slice(scopes[i][0].index + 1, scopes[i][0].index + length)
    );
  }
  console.log("operations: ", operations);

  if (scopes.length > 0) {
    solveScopes(operations[0], scopes);
    calculate();
  } else {
    console.log(screenText);
    screenText = priorityCalculation(screenText);
    screenText = secondaryCalculation(screenText);
    console.log(screenText);
  }
  //!--------------------------------------------------------------------------------------
}
function solveScopes(string, scopes) {
  let result = priorityCalculation(string);
  result = secondaryCalculation(result);
  console.log(result);
  screenText =
    screenText.slice(0, scopes[0][0].index) +
    result +
    screenText.slice(scopes[0][1].index + 1, screenText.length);
  console.log("screenText: ", screenText);
}
function priorityCalculation(string) {
  console.log("pCalcStringInput: ", string);

  let operatorsArr = [];
  let result = 0;
  // find all operators
  for (let i = 0; i < string.length; i++) {
    if (string[i].match(/[+-/*()]/))
      operatorsArr.push({ operator: string[i], index: i });
  }

  // finds / * operators and calculate corresponging operations
  let operator = operatorsArr.find((operator) =>
    operator.operator.match(/[/*]/)
  );
  if (!operator) {
    console.log("prior output string: ", string);
    return string;
  }

  let index = operatorsArr.findIndex((index) => index.index == operator.index);

  let prevOperatorIndex;
  let nextOperatorIndex;

  if (index - 1 < 0) prevOperatorIndex = 0;
  else prevOperatorIndex = operatorsArr[index - 1].index;

  if (index == operatorsArr.length - 1) nextOperatorIndex = string.length;
  else nextOperatorIndex = operatorsArr[index + 1].index;

  let leftOperation = string.slice(prevOperatorIndex, operator.index);
  let rightOperation = string.slice(operator.index + 1, nextOperatorIndex);

  console.log("left operation: ", leftOperation);
  console.log("right operation: ", rightOperation);

  // if only one operation
  if (prevOperatorIndex == 0 && nextOperatorIndex == string.length) {
    result = compute(operator.operator, leftOperation, rightOperation);
    string = result;
  }
  // if most left operation but there are operations on right side
  else if (prevOperatorIndex == 0 && nextOperatorIndex != string.length) {
    result = compute(operator.operator, leftOperation, rightOperation);
    string = result + string.slice(-(string.length - nextOperatorIndex));
  }
  // if most right operation but there are operations on left side
  else if (prevOperatorIndex != 0 && nextOperatorIndex == string.length) {
    leftOperation = string.slice(prevOperatorIndex + 1, operator.index);
    result = compute(operator.operator, leftOperation, rightOperation);
    string = string.slice(0, prevOperatorIndex + 1) + result;
  }
  // middle operation
  else if (prevOperatorIndex != 0 && nextOperatorIndex != string.length) {
    leftOperation = string.slice(prevOperatorIndex + 1, operator.index);
    result = compute(operator.operator, leftOperation, rightOperation);
    string =
      string.slice(0, prevOperatorIndex + 1) +
      result +
      string.slice(-(string.length - nextOperatorIndex));
  }
  return priorityCalculation(string);
}
function secondaryCalculation(string) {
  let startsWithOperator = false;
  let startOperator;
  debugger;
  console.log("sCalcStringInput: ", string);
  if (string[0].match(/[+-]/)) {
    startOperator = string[0];
    string = string.slice(1);
    startsWithOperator = true;
  }
  let operatorsArr = [];
  let result = 0;
  // find all operators
  for (let i = 0; i < string.length; i++) {
    if (string[i].match(/[+-]/))
      operatorsArr.push({ operator: string[i], index: i });
  }
  // finds / * operators and calculate corresponging operations
  let operator = operatorsArr.find((operator) =>
    operator.operator.match(/[+-]/)
  );
  console.log(operator);

  if (!operator) {
    console.log("secondary output string: ", string);
    return string;
  }

  let index = operatorsArr.findIndex((index) => index.index == operator.index);

  console.log("index: ", index);

  let prevOperatorIndex = 0;
  let nextOperatorIndex;

  if (index == operatorsArr.length - 1) nextOperatorIndex = string.length;
  else nextOperatorIndex = operatorsArr[index + 1].index;

  let leftOperation = string.slice(prevOperatorIndex, operator.index);
  let rightOperation = string.slice(operator.index + 1, nextOperatorIndex);

  // if only one operation
  if (prevOperatorIndex == 0 && nextOperatorIndex == string.length) {
    result = compute(operator.operator, leftOperation, rightOperation);
    if (startsWithOperator && startOperator == "-") {
      result =
        parseFloat(result) +
        parseFloat(compute("-", 0, `${parseFloat(leftOperation) * 2}`));
    }
    string = `${result}`;
  }
  // if most left operation but there are operations on right side
  else if (prevOperatorIndex == 0 && nextOperatorIndex != string.length) {
    result = compute(operator.operator, leftOperation, rightOperation);
    if (startsWithOperator && startOperator == "-") {
      result =
        parseFloat(result) +
        parseFloat(compute("-", 0, `${parseFloat(leftOperation) * 2}`));
    }
    string = `${result}` + string.slice(-(string.length - nextOperatorIndex));
  }

  return secondaryCalculation(string);
}
function checkValidSyntax() {
  //! there must not be NaN
}
function add(a, b) {
  let result = parseFloat(a) + parseFloat(b);
  return `${result}`;
}
function substract(a, b) {
  let result = parseFloat(a) - parseFloat(b);
  return `${result}`;
}
function multiply(a, b) {
  let result = parseFloat(a) * parseFloat(b);
  return `${result}`;
}
function divide(a, b) {
  let result = parseFloat(a) / parseFloat(b);
  return `${result}`;
}
function compute(operator, leftOperation, rightOperation) {
  switch (operator) {
    case "/":
      result = divide(leftOperation, rightOperation);
      break;
    case "*":
      result = multiply(leftOperation, rightOperation);
      break;
    case "+":
      result = add(leftOperation, rightOperation);
      break;
    case "-":
      result = substract(leftOperation, rightOperation);
      break;
  }
  return result;
}
