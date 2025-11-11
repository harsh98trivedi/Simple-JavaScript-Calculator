const screen = document.getElementById('answer');
    const buttons = document.querySelectorAll('.calc-btn');
    const historyBtn = document.getElementById('history-btn');
    const historyPanel = document.getElementById('history-panel');
    const historyList = document.getElementById('history-list');
    const closeHistory = document.getElementById('close-history');
    const clearHistory = document.getElementById('clear-history');
    const themeToggle = document.getElementById('theme-toggle');

    // Theme toggle logic
    function setTheme(mode) {
      document.documentElement.classList.toggle('dark', mode === 'dark');
      themeToggle.setAttribute('aria-pressed', mode === 'dark');
      localStorage.setItem('theme', mode);
    }
    setTheme(localStorage.getItem('theme') || 'light');
    themeToggle.onclick = () => {
      const newMode = document.documentElement.classList.contains('dark') ? 'light' : 'dark';
      setTheme(newMode);
    };

    // History logic
    function getHistory() {
      return JSON.parse(localStorage.getItem('calcHistory') || '[]');
    }
    function saveHistory(expr, res) {
      let hist = getHistory();
      hist.push({ expr, res });
      if (hist.length > 50) hist.shift();
      localStorage.setItem('calcHistory', JSON.stringify(hist));
    }
    function renderHistory() {
      const hist = getHistory().slice().reverse();
      historyList.innerHTML = hist.length
        ? hist.map(item => `<div class="flex justify-between p-3 rounded bg-gray-100 dark:bg-gray-700">
          <span>${item.expr}</span>
          <span class="${item.res < 0 ? 'text-red-500' : 'text-green-500'} font-bold">${item.res}</span>
          </div>`).join('')
        : `<p class="text-gray-500">No history yet</p>`;
    }
    historyBtn.onclick = () => {
      renderHistory();
      historyPanel.classList.remove('translate-y-full', 'sm:translate-x-full');
    };
    closeHistory.onclick = () => {
      historyPanel.classList.add('translate-y-full', 'sm:translate-x-full');
    };
    clearHistory.onclick = () => {
      localStorage.removeItem('calcHistory');
      renderHistory();
    };

    // Calculator (BODMAS) with sqrt and power support
    function calculate(expr) {
  try {
    // 1️⃣ Handle sqrt → Math.sqrt
    expr = expr.replace(/sqrt\s*\(/g, 'Math.sqrt(');

    // 2️⃣ Handle power operator ^ → **
    expr = expr.replace(/\^/g, '**');

    // 3️⃣ Allow safe characters only (numbers, operators, parentheses, dots, Math.sqrt)
    const checkExpr = expr.replace(/Math\.sqrt/g, '');
    if (/[^0-9+\-*/().\s**]/.test(checkExpr)) {
      throw new Error('Invalid characters');
    }

    // 4️⃣ Evaluate expression safely
    const result = Function('"use strict"; return (' + expr + ')')();

    // 5️⃣ Handle invalid results
    if (typeof result !== 'number' || isNaN(result) || !isFinite(result)) {
      return 'Err';
    }

    // 6️⃣ Round result (optional)
    return Number.isInteger(result) ? result : parseFloat(result.toFixed(6));
  } catch (err) {
    return 'Err';
  }
}



    // Button click and keyboard support
    buttons.forEach(b => {
      b.onclick = () => {
        const val = b.value;
        if (val === '=') {
          const res = calculate(screen.value);
          if (!isNaN(res)) {
            saveHistory(screen.value, res);
            screen.value = Number.isInteger(res) ? res : res.toFixed(2);
          } else {
            screen.value = 'Err';
          }
        } else if (val === 'C') {
          screen.value = '';
        } else if (val === '⌫') {
          screen.value = screen.value.slice(0, -1);
        } else if (val === 'sqrt') {
          screen.value += 'sqrt(';
        } else if (val === '^') {
          screen.value += '^';
        } else {
          screen.value += val;
        }
      };
    });

    document.addEventListener('keydown', e => {
      if (/[0-9+\-*/%.()]/.test(e.key)) {
        screen.value += e.key;
        return;
      }
      if (e.key === 'Enter' || e.key === '=') {
        const res = calculate(screen.value);
        if (!isNaN(res)) {
          saveHistory(screen.value, res);
          screen.value = Number.isInteger(res) ? res : res.toFixed(2);
        } else {
          screen.value = 'Err';
        }
        e.preventDefault();
      }
      if (e.key === 'Backspace') {
        screen.value = screen.value.slice(0, -1);
        e.preventDefault();
      }
      if (e.key === '^') {
        screen.value += '^';
        e.preventDefault();
      }
      if (e.key.toLowerCase() === 's') {
        screen.value += 'sqrt(';
        e.preventDefault();
      }
      if (e.key.toLowerCase() === 'd') {
        const newMode = document.documentElement.classList.contains('dark') ? 'light' : 'dark';
        setTheme(newMode);
        e.preventDefault();
      }
      if (e.key.toLowerCase() === 'h') {
        historyPanel.classList.contains('translate-y-full') || historyPanel.classList.contains('sm:translate-x-full')
          ? historyPanel.classList.remove('translate-y-full', 'sm:translate-x-full')
          : historyPanel.classList.add('translate-y-full', 'sm:translate-x-full');
        e.preventDefault();
      }
      if (e.key.toLowerCase() === 'c') {
        screen.value = '';
        e.preventDefault();
      }
    });