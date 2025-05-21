console.log(
  "Javascript Calculator Made by Harsh Trivedi\nhttps://harsh98trivedi.github.io"
);

let flag = 0;

function isNumber(char) {
  return /^\d$/.test(char);
}

document.getElementById("answer").readOnly = true;
let screen = document.getElementById("answer");
buttons = document.querySelectorAll("button");
let screenValue = "";
let lastScreenValue = "";
let maxItems = 6;
let isSign = true;

for (item of buttons) {
  item.addEventListener("click", (e) => {
    buttonText = e.target.innerText;

    // 根号功能
    if (buttonText == "√" && !isSign) {
      if (flag == 1) {
        flag = 0;
      }
      screenValue = Math.sqrt(eval(screen.value));
      screen.value = screenValue;
    }

    // sin, cos, tan 功能
    else if (buttonText == "sin" || buttonText == "cos" || buttonText == "tan") {
      if (flag == 1) {
        flag = 0;
      }
      let angle = eval(screen.value);
      let result;

      if (buttonText == "sin") {
        result = Math.sin(toRadians(angle));
      } else if (buttonText == "cos") {
        result = Math.cos(toRadians(angle));
      } else if (buttonText == "tan") {
        result = Math.tan(toRadians(angle));
      }

      screenValue = result;
      screen.value = screenValue;
    }

    // 其他按钮处理
    else if (buttonText == "X" && !isSign) {
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
      screen.classList.remove("negative"); // Remove negative class
      isSign = true;
    } else if (buttonText == "=") {
      checkForBracketMulti();
      if (parseFloat(screen.value) < 0) {
        screen.classList.add("negative");
      } else {
        screen.classList.remove("negative");
      }
    } else if (buttonText == "(" || buttonText == ")") {
      if (flag == 1) {
        flag = 0;
      }
      screenValue += buttonText;
      screen.value = screenValue;
    } else if (isNumber(buttonText)) {
      if (flag == 1) {
        screenValue = buttonText;
        flag = 0;
      } else {
        screenValue += buttonText;
      }
      screen.value = screenValue;
      isSign = false;
      screen.classList.remove("negative"); // Remove negative class
    } else {
      if (flag == 1) {
        flag = 0;
      }
      if (!isSign) {
        screenValue = screen.value + buttonText;
        screen.value = screenValue;
        isSign = true;
      }
      screen.classList.remove("negative"); // Remove negative class
    }
  });
}

document.addEventListener("keydown", function (event) {
  // ... (same code as before)
});

window.onerror = function () {
  alert("PLEASE INPUT VALID EXPRESSION");
  screenValue = "";
  screen.value = screenValue;
  screen.classList.remove("negative"); // Remove negative class
  console.clear();
};

function checkForBracketMulti() {
  // Check for potential multiple operations after brackets and eval expression.
  if (eval(screenValue) !== undefined) {
    if (!Number.isInteger(eval(screenValue))) {
      screen.value = eval(screenValue).toFixed(2);
    } else {
      screen.value = eval(screenValue);
    }

    lastScreenValue = screenValue;
    screenValue = screen.value;
    if (parseFloat(screen.value) < 0) {
      screen.classList.add("negative");
    } else {
      screen.classList.remove("negative");
    }
  }
  flag = 1;
}

// 将角度转换为弧度
function toRadians(degrees) {
  return degrees * (Math.PI / 180);
}
