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

    // Calculator (BODMAS)
    function calculate(expr) {
      try {
        const tokens = expr.match(/(\d+(\.\d+)?|[+\-*/%()])/g);
        const prec = { '+': 1, '-': 1, '*': 2, '/': 2, '%': 2 };
        const output = [], ops = [];
        tokens.forEach(t => {
          if (!isNaN(t)) output.push(parseFloat(t));
          else if (t in prec) {
            while (ops.length && prec[ops[ops.length - 1]] >= prec[t]) output.push(ops.pop());
            ops.push(t);
          } else if (t === '(') ops.push(t);
          else if (t === ')') { while (ops[ops.length - 1] !== '(') output.push(ops.pop()); ops.pop(); }
        });
        while (ops.length) output.push(ops.pop());
        const stack = [];
        output.forEach(t => {
          if (typeof t === 'number') stack.push(t);
          else {
            const b = stack.pop(), a = stack.pop();
            if (typeof a === 'undefined' || typeof b === 'undefined') throw Error('Malformed');
            if (t === '+') stack.push(a + b);
            if (t === '-') stack.push(a - b);
            if (t === '*') stack.push(a * b);
            if (t === '/') stack.push(a / b);
            if (t === '%') stack.push(a % b);
          }
        });
        return stack[0];
      } catch {
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