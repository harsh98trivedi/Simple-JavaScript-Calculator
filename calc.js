console.log(
  "Javascript Calculator Made by Harsh Trivedi\nhttps://harsh98trivedi.github.io"
);
let flag = 0;
function isNumber(char) {
  return /^\d$/.test(char);
}

document.getElementById("answer").readOnly = true; //set this attribute in Html file
let screen = document.getElementById("answer");
buttons = document.querySelectorAll("button");
let screenValue = "";
let lastScreenValue = "";
let maxItems = 6;
let isSign = true;
for (item of buttons) {
  item.addEventListener("click", (e) => {
    buttonText = e.target.innerText;
    if (buttonText == "X" && !isSign) {
      if (flag == 1) {
        flag = 0;
      }
      buttonText = "*";
      isSign = true;
      screenValue += buttonText;
      screen.value = screenValue;
    } else if (buttonText == "C") {
      if (flag == 1) {
        flag = 0;
      }
      screenValue = "";
      screen.value = screenValue;
      isSign = true;
    } else if (buttonText == "=") {
      checkForBracketMulti(); // automatically evaluates if no brackets
      //
    } else if (isNumber(buttonText)) {
      if (flag == 1) {
        screenValue = buttonText;
        flag = 0;
      } else {
        screenValue += buttonText;
      }
      screen.value = screenValue;
      isSign = false;
    } else {
      if (flag == 1) {
        flag = 0;
      }
      if (!isSign){
        screenValue = screen.value + buttonText;
        screen.value = screenValue;
        isSign = true;
      }
    }
  });
}

document.addEventListener("keydown", function (event) {
  if (
    event.key <= 9
  ) {
    screenValue += event.key;
    screen.value = screenValue;
    isSign = false;
  }
  if(!isSign && (event.key == "+" ||
  event.key == "-" ||
  event.key == "*" ||
  event.key == "." ||
  event.key == "/" ||
  event.key == "%" ||
  event.key == "(" ||
  event.key == ")")){
    screenValue += event.key;
    screen.value = screenValue;
    isSign = true;
  }
  if (event.key == "Enter" || event.key == "=") {
    event.preventDefault();
    checkForBracketMulti(); // automatically evaluates if no brackets
  } else if (event.Key == "Delete") {
    screenValue = "";
    screen.value = screenValue;
    console.clear();
  } else if (event.key == "Backspace") {
    screenValue = screenValue.slice(0, -1);
    screen.value = screenValue;
  } else if (event.key == "c") {
    screenValue = "";
    screen.value = screenValue;
    console.clear();
  } else if (event.key == "r") {
    location.reload();
  }
});

window.onerror = function () {
  alert("PLEASE INPUT VALID EXPRESSION");
  screenValue = "";
  screen.value = screenValue;
  console.clear();
};

window.onBracketMultiplication = function () {
  screenValue = addStr(screen.value, screen.value.indexOf("("), "*");
  screen.value = eval(screenValue);
  let calcHistory = JSON.parse(localStorage.getItem("calcHistory")) || [];
  if (calcHistory.length >= maxItems) {
    calcHistory.shift();
  }
  calcHistory.push({ screenValue, result: screen.value });
  localStorage.setItem("calcHistory", JSON.stringify(calcHistory));
};

function addStr(str, index, stringToAdd) {
  return (
    str.substring(0, index) + stringToAdd + str.substring(index, str.length)
  );
}

function checkForBracketMulti() {
  // Check if there's a number directly infront of a bracket
  isSign = false;
  if (
    screen.value.includes("(") &&
    !isNaN(screen.value.charAt(screen.value.indexOf("(") - 1))
  ) {
    window.onBracketMultiplication();
    return;
  } else {
    if(eval(screenValue) !== undefined) 
    {
      screen.value = eval(screenValue);
      lastScreenValue = screenValue;
      screenValue = screen.value;
      let calcHistory = JSON.parse(localStorage.getItem("calcHistory")) || [];
      if (calcHistory.length >= maxItems) {
        calcHistory.shift();
      }
      calcHistory.push({ lastScreenValue, result: screen.value });
      localStorage.setItem("calcHistory", JSON.stringify(calcHistory));
    }
  }
  flag = 1;
}
