document.addEventListener('DOMContentLoaded', function () {
    const display = document.getElementById('display');
    const buttons = document.querySelectorAll('.buttons button');

    let currentExpression = ''; // Track the current expression being entered
    let result = null; // Track the result of the previous evaluation

    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const value = button.textContent;
            if (value === '=') {
                calculate();
            } else if (value === 'C') {
                clearDisplay();
            } else {
                addToDisplay(value);
            }
        });
    });

    function addToDisplay(value) {
        display.value += value;
        currentExpression += value;
    }

    function calculate() {
        try {
            if (!currentExpression) return; // No expression to calculate
            const expression = result !== null ? result + currentExpression : currentExpression;
            result = evaluateExpression(expression);
            display.value = result;
            currentExpression = ''; // Reset the current expression
        } catch (error) {
            alert(error.message);
            clearDisplay();
        }
    }

    function evaluateExpression(expression) {
        const tokens = expression.match(/[+\-*/()]|\d+\.\d*|\d+/g);
        const postfix = infixToPostfix(tokens);
        return evaluatePostfix(postfix);
    }

    function infixToPostfix(tokens) {
        const precedence = {
            '+': 1,
            '-': 1,
            '*': 2,
            '/': 2
        };

        const output = [];
        const operators = [];

        tokens.forEach(token => {
            if (/\d/.test(token)) {
                output.push(token);
            } else if (token === '(') {
                operators.push(token);
            } else if (token === ')') {
                while (operators.length && operators[operators.length - 1] !== '(') {
                    output.push(operators.pop());
                }
                operators.pop(); // Discard '('
            } else { // Operator
                while (operators.length && precedence[token] <= precedence[operators[operators.length - 1]]) {
                    output.push(operators.pop());
                }
                operators.push(token);
            }
        });

        while (operators.length) {
            output.push(operators.pop());
        }

        return output;
    }

    function evaluatePostfix(postfix) {
        const stack = [];

        postfix.forEach(token => {
            if (/\d/.test(token)) {
                stack.push(parseFloat(token));
            } else {
                const operand2 = stack.pop();
                const operand1 = stack.pop();
                if (isNaN(operand1) || isNaN(operand2)) {
                    throw new Error('Invalid expression');
                }
                const result = evaluateOperation(token, operand1, operand2);
                stack.push(result);
            }
        });

        if (stack.length !== 1 || !isFinite(stack[0])) {
            throw new Error('Invalid expression');
        }

        return stack[0];
    }

    function evaluateOperation(operator, operand1, operand2) {
        switch (operator) {
            case '+':
                return operand1 + operand2;
            case '-':
                return operand1 - operand2;
            case '*':
                return operand1 * operand2;
            case '/':
                if (operand2 === 0) {
                    throw new Error('Cannot divide by zero');
                }
                return operand1 / operand2;
            default:
                throw new Error('Invalid operator');
        }
    }

    function clearDisplay() {
        display.value = '';
        currentExpression = '';
    }
});
