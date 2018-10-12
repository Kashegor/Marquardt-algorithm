//readValues
let exprPolynomHtml = document.getElementById('expr'),
    prettyHtml = document.getElementById('pretty'),
    result = document.getElementById('result'),
    gesseHtml = document.getElementById('gesse'),
    gradient1Html = document.getElementById('gradient1'),
    outIteration = document.getElementById('iteration'),
    outRegulation = document.getElementById('regulation'),
    outGradXk = document.getElementById('gradientXk'),
    outGradXkLength = document.getElementById('gradie'),
    parenthesis = 'keep',
    implicit = 'hide',
    variables,
    xZero = [document.getElementById('zeroX1'), document.getElementById('zeroX2')],
    accuracy = document.getElementById('accuracy'),
    maxIters = document.getElementById('maxIters'),
    numberIteration = 0,
    numberOfRegulationStrategy = 10000;
doMainAction();
//exprPolynomHtml.value = 'sqrt(75 / 3) + det([[-1, 2], [3, 1]]) - sin(pi / 4)^2';
//result.innerHTML = math.format(math.eval(exprPolynomHtml.value));

//functions

function doMainAction() {
    preparation('x^2+2*y^2-6x*y+5x+4');
    stepOne([1, 1], 0.1, 1);
    stepTwo();
    stepThree();
    stepFour();
}

//---------------------------STEPS------------------------------

function preparation(expression) {
    exprPolynomHtml.value = expression;
    variables = getVariablesFromPolynom(expression);
    setPretty(prettyHtml, expression);
}

function stepOne(x0, accur, m) {
    xZero[0].value = x0[0];
    xZero[1].value = x0[1];
    accuracy.value = accur;
    maxIters.value = m;
    let calculatedGradient = getGradient(variables[0], variables[1]);
    let matrixGessa = getMatrixGessa(variables[0], variables[1]);
    setPretty(gradient1Html, gradientToString(calculatedGradient));
    setPretty(gesseHtml, matrixGessa);
}

function stepTwo() {
    outIteration.innerHTML = '$$k = ' + numberIteration + '$$';
    outRegulation.innerHTML = '$$μk = μ0 = ' + numberOfRegulationStrategy + '$$';
}
function stepThree() {
    let scope = {
        x: xZero[0].value,
        y: xZero[1].value
    }
    let gradientValues = getGradient(variables[0], variables[1]);
    let gradientInPointX = (math.eval(gradientValues[0], scope)).toString();

	let gradientInPointY = (math.eval(gradientValues[1], scope).toString());
	let gradientInPoint = Array(gradientInPointX, gradientInPointY);
	console.log(gradientInPoint);
    outGradXk.innerHTML =`Градиент функции в ${numberIteration}-ой точке: f(xk) = ` + pointToString(gradientInPoint);
}
function stepFour(){
	let scope = {
        x: xZero[0].value,
        y: xZero[1].value
    }
    let gradientValues = getGradient(variables[0], variables[1]);
	let gradXk = math.eval('sqrt(pow(' + gradientValues[0] + ',2)+pow(' + gradientValues[1] + ',2))', scope);
    outGradXkLength.innerHTML =`Градиент функции в ${numberIteration}-ой точке: |f(xk)| =` + gradXk;
    outGradXkLength.innerHTML += '<br> Критерий останова : |▽f(xk)| ≤ ε ';
    outGradXkLength.innerHTML += '<br>'+ gradXk + " " + getSignOfСomparison(gradXk, accuracy.value) + " " + accuracy.value;
}

//--------------------------CALCULATIIONS-------------------------------------

function getVariablesFromPolynom(expression) {
    var nodeExpr = math.parse(expression);
    console.log(nodeExpr.toString());
    var filtered = nodeExpr.filter(function (node) {
        return node.isSymbolNode
    });
    filtered = unique(filtered);
    return filtered;
}

function unique(arr) {
    let obj = {};

    for (var i = 0; i < arr.length; i++) {
        var str = arr[i];
        obj[str] = true; // запомнить строку в виде свойства объекта
    }

    return Object.keys(obj); // или собрать ключи перебором для IE8-
}

function getGradient(first, second) {
    let peremOne = calculateDerivative(first).toString();
    let peremTwo = calculateDerivative(second).toString()
    console.log(Array(peremOne, peremTwo));
    return Array(peremOne, peremTwo); 
}

function calulateDoubleDerivative(first, second) {

    let scope = {
        func: exprPolynomHtml.value,
        perOne: first,
        perTwo: second
    };
    return math.eval('derivative(derivative(func, perOne), perTwo)', scope);
}

function calculateDerivative(perem) {

    let scope = {
        func: exprPolynomHtml.value,
        perem: perem,
    };
    return math.eval('derivative(func, perem)', scope);
}

//-------------------------------VIEW-----------------------------------------

function gradientToString(arrayGradient){
    return '(' + arrayGradient[0] + ')*i+' + '(' + arrayGradient[1] + ')*j';
}
function setPretty(element, value) {
    element.innerHTML = '$$' + math.parse(value).toTex({parenthesis: parenthesis}) + '$$';
}

function getMatrixGessa(first, second) {
    let peremOne = calulateDoubleDerivative(first, first);
    let peremTwo = calulateDoubleDerivative(first, second);
    let peremThree = calulateDoubleDerivative(second, second);
    return '[[' + peremOne + ',' + peremTwo + '], [' + peremTwo + ', ' + peremThree + ']]';
}
function pointToString(coordinates){
	let stringCoord = "(";
	for (let i = 0; i < coordinates.length-1; i++) {
		stringCoord += coordinates[i] + " ; "
	}
	stringCoord += coordinates[coordinates.length-1] + ")";
	return stringCoord;
}
function getSignOfСomparison(a , b){
	if (a>b) {
		return ">";
	}
	if (a===b) {
		return "=";
	}
	if (a<b) {
		return "<";
	}
}

//-------------------------------OUTPUT---------------------------------------

exprPolynomHtml.oninput = function () {
    let node = null;

    try {
        // parse the expression
        node = math.parse(exprPolynomHtml.value);

        // evaluate the result of the expression
        //result.innerHTML = math.format(node.compile().eval());
    }
    catch (err) {
        //result.innerHTML = '<span style="color: red;">' + err.toString() + '</span>';
        console.log('<span style="color: red;">' + err.toString() + '</span>');
    }

    try {
        // export the expression to LaTeX
        let latex = node ? node.toTex({parenthesis: parenthesis, implicit: implicit}) : '';
        console.log('LaTeX expression:', latex);

        // display and re-render the expression
        let elem = MathJax.Hub.getAllJax('pretty')[0];
        MathJax.Hub.Queue(['Text', elem, latex]);
    }
    catch (err) {
    }
};
/*function calculateGrad(first, second) {
    let scope = {
        func: exprPolynomHtml.value,
        firstDerivative: calculateDerivative(first),
        secondDerivative: calculateDerivative(second)
    };
    const node2 = math.parse('');
    const code2 = node2.compile();
    return code2.eval(scope);
}*/