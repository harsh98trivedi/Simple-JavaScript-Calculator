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

// --- BEGIN: square button handler (added by you) ---
(function() {
  // Try common display selectors — update if your project uses a different id/class
  const displayEl =
    document.getElementById('display') ||
    document.getElementById('result') ||
    document.getElementById('screen') ||
    document.querySelector('.display') ||
    document.querySelector('.screen') ||
    document.querySelector('input[type="text"]');

  if (!displayEl) {
    console.warn('Square handler: display element not found. Please update selector in the handler.');
    return;
  }

  const squareBtn = document.getElementById('btn-square');
  if (!squareBtn) {
    console.warn('Square handler: btn-square not found. Ensure you added the button with id="btn-square".');
    return;
  }

  function formatResult(n) {
    if (!isFinite(n)) return String(n);
    if (Math.abs(Math.round(n) - n) < 1e-12) return String(Math.round(n));
    return Number(n.toFixed(8)).toString();
  }

  squareBtn.addEventListener('click', () => {
    // Read text from the display — supports either input.value or element.innerText
    let text = (displayEl.value !== undefined) ? displayEl.value : (displayEl.innerText || displayEl.textContent || '');
    text = text.toString().trim().replace(/,/g, '');

    if (text === '') {
      // nothing entered — show 0
      if ('value' in displayEl) displayEl.value = '0';
      else displayEl.innerText = '0';
      return;
    }

    // If the display looks like a plain number, parse it. Otherwise try limited evaluation.
    let value;
    if (/^[+-]?\d*\.?\d+(e[+-]?\d+)?$/i.test(text)) {
      value = Number(text);
    } else {
      // allow only safe characters for simple expressions
      const safe = /^[0-9+\-*/().\s]+$/;
      try {
        if (safe.test(text)) {
          value = Function('"use strict"; return (' + text + ')')();
        } else {
          throw new Error('Unsafe expression');
        }
      } catch (err) {
        if ('value' in displayEl) displayEl.value = 'Error';
        else displayEl.innerText = 'Error';
        return;
      }
    }

    const squared = value * value;
    const out = formatResult(squared);
    if ('value' in displayEl) displayEl.value = out;
    else displayEl.innerText = out;
  });
})();
// --- END: square button handler ---
