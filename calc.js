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
let maxItems = 6;
for (item of buttons) {
  item.addEventListener("click", (e) => {
    buttonText = e.target.innerText;
    if (buttonText == "X") {
      if (flag == 1) {
        flag = 0;
      }
      buttonText = "*";
      screenValue += buttonText;
      screen.value = screenValue;
    } else if (buttonText == "C") {
      if (flag == 1) {
        flag = 0;
      }
      screenValue = "";
      screen.value = screenValue;
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
      console.log("im an operator");
    } else {
      if (flag == 1) {
        flag = 0;
      }
      screenValue = screen.value + buttonText;
      screen.value = screenValue;
    }
  });
}

document.addEventListener("keydown", function (event) {
  if (event.shiftKey == 57) {
    event.key = "(";
  } else if (event.shiftKey == 48) {
    event.key = ")";
  } else if (event.shiftKey == 53) {
    event.key = "%";
  }
  if (event.keyCode == 88) {
    screenValue += "*";
    screen.value = screenValue;
  }
  if (
    event.key <= 9 ||
    event.key == "+" ||
    event.key == "-" ||
    event.key == "*" ||
    event.key == "." ||
    event.key == "/" ||
    event.key == "%" ||
    event.key == "(" ||
    event.key == ")"
  ) {
    screenValue += event.key;
    screen.value = screenValue;
  }
  if (event.keyCode == 13 || event.keyCode == 187) {
    checkForBracketMulti(); // automatically evaluates if no brackets
  } else if (event.keyCode == 46) {
    screenValue = "";
    screen.value = screenValue;
    console.clear();
  } else if (event.keyCode == 8) {
    screenValue = screenValue.slice(0, -1);
    screen.value = screenValue;
  } else if (event.keyCode == 67) {
    screenValue = "";
    screen.value = screenValue;
    console.clear();
  } else if (event.keyCode == 82) {
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
  if(calcHistory.length >= maxItems){
      calcHistory.shift();
  }
  calcHistory.push({screenValue, result : screen.value});
  localStorage.setItem("calcHistory", JSON.stringify(calcHistory));
};

function addStr(str, index, stringToAdd) {
  return (
    str.substring(0, index) + stringToAdd + str.substring(index, str.length)
  );
}

function checkForBracketMulti() {
  // Check if there's a number directly infront of a bracket
  if (
    screen.value.includes("(") &&
    !isNaN(screen.value.charAt(screen.value.indexOf("(") - 1))
  ) {
    window.onBracketMultiplication();
    return;
  } else {
    screen.value = eval(screenValue);
    let calcHistory = JSON.parse(localStorage.getItem("calcHistory")) || [];
    if(calcHistory.length >= maxItems){
        calcHistory.shift();
    }
    calcHistory.push({screenValue, result : screen.value});
    localStorage.setItem("calcHistory", JSON.stringify(calcHistory));
  }
  flag = 1;
}
