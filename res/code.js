//readValues
var expr = document.getElementById('expr'),
    pretty = document.getElementById('pretty'),
    result = document.getElementById('result'),
    gesse = document.getElementById('gesse'),
    gradient1 = document.getElementById('gradient1'),
    //gradient2 = document.getElementById('gradient2'),
    parenthesis = 'keep',
    implicit = 'hide',
    variables;
// initialize with an example expression
//expr.value = 'sqrt(75 / 3) + det([[-1, 2], [3, 1]]) - sin(pi / 4)^2';
doMainAction('x^2+2*y^2-6x*y+5x+4');
//result.innerHTML = math.format(math.eval(expr.value));

//funcions

function doMainAction(expression) {
    expr.value = expression;
    variables = getVariables();
    console.log(variables);
    setPretty(pretty, expr.value);
    var gradient1Str = doGradient(variables[0], variables[1]);
    //var gradient2Str = doGradient(variables[0], variables[1]);
    console.log(variables[0]);
    setPretty(gradient1, gradient1Str);
    //setPretty(gradient2, gradient2Str);
    var matrix = doMatrix(variables[0], variables[1]);
    //!вычислил первый шаг вроде
    setPretty(gesse, matrix);
}
function getVariables() {
    var nodeExpr = math.parse(expr.value);
    console.log(nodeExpr.toString());
    var filtered = nodeExpr.filter(function (node) {
        return node.isSymbolNode
    });
    filtered = unique(filtered);
    return filtered;
}
function unique(arr) {
    var obj = {};

    for (var i = 0; i < arr.length; i++) {
        var str = arr[i];
        obj[str] = true; // запомнить строку в виде свойства объекта
    }

    return Object.keys(obj); // или собрать ключи перебором для IE8-
}
function setPretty(element, value) {
    element.innerHTML = '$$' + math.parse(value).toTex({parenthesis: parenthesis}) + '$$';
}

function doMatrix(first, second) {
    var peremOne = calulateDoubleDerivative(first, first);
    var peremTwo = calulateDoubleDerivative(first, second);
    var peremThree = calulateDoubleDerivative(second, second);
    return '[[' + peremOne + ',' + peremTwo + '], [' + peremTwo + ', ' + peremThree + ']]';
}
function doGradient(first, second) {
    var peremOne = calculateDerivative(first);
    var peremTwo = calculateDerivative(second);
    return '(' + peremOne + ')*i+' + '(' + peremTwo + ')*j';
}
/*function calculateGrad(first, second) {
    let scope = {
        func: expr.value,
        firstDerivative: calculateDerivative(first),
        secondDerivative: calculateDerivative(second)
    };
    const node2 = math.parse('');
    const code2 = node2.compile();
    return code2.eval(scope);
}*/

function calulateDoubleDerivative(first, second) {

    let scope = {
        func: expr.value,
        perOne: first,
        perTwo: second
    };
    const node2 = math.parse('derivative(derivative(func, perOne), perTwo)');
    const code2 = node2.compile();
    return code2.eval(scope);
}
function calculateDerivative(perem) {

    let scope = {
        func: expr.value,
        perem: perem,
    };
    const node2 = math.parse('derivative(func, perem)');
    const code2 = node2.compile();
    return code2.eval(scope);
}

expr.oninput = function () {
    var node = null;

    try {
        // parse the expression
        node = math.parse(expr.value);

        // evaluate the result of the expression
        //result.innerHTML = math.format(node.compile().eval());
    }
    catch (err) {
        //result.innerHTML = '<span style="color: red;">' + err.toString() + '</span>';
        console.log('<span style="color: red;">' + err.toString() + '</span>');
    }

    try {
        // export the expression to LaTeX
        var latex = node ? node.toTex({parenthesis: parenthesis, implicit: implicit}) : '';
        console.log('LaTeX expression:', latex);

        // display and re-render the expression
        var elem = MathJax.Hub.getAllJax('pretty')[0];
        MathJax.Hub.Queue(['Text', elem, latex]);
    }
    catch (err) {
    }
};
