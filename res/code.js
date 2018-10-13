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
    step5Html = document.getElementById('step5');
    step6Html = document.getElementById('step6');
    step7Html = document.getElementById('step7');
    step8Html = document.getElementById('step8');
    step9Html = document.getElementById('step9');
    step10Html = document.getElementById('step10');
    step11Html = document.getElementById('step11');
    numberIteration = 0,
    numberOfRegulationStrategy = 10000;
doMainAction();
//exprPolypacknomHtml.value = 'sqrt(75 / 3) + det([[-1, 2], [3, 1]]) - sin(pi / 4)^2';
//result.innerHTML = math.format(math.eval(exprPolynomHtml.value));

//functions

function doMainAction() {
    preparation('x^2+2*y^5-6x*y+5x^5+4');
    stepOne([1, 1], 0.1, 1);
    stepTwo();
    stepThree();
    stepFour();
    stepFive();
    stepSix();
    stepSeven();
    stepEight();
    let dk = stepNine();
    let dk1 = stepTen(dk);
    stepEleven(dk1);
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
    let calculatedGradient =  new Gradient(variables[0], variables[1]);
    let matrixGessa = new Matrix(variables[0], variables[1]);
    setPretty(gradient1Html, calculatedGradient.gradientToString());
    setPretty(gesseHtml, matrixGessa.getMatrix());
}

function stepTwo() {
    outIteration.innerHTML = '$$k = ' + numberIteration + '$$';
    outRegulation.innerHTML = '$$μk = μ0 = ' + numberOfRegulationStrategy + '$$';
}
function stepThree() {
    let point = {
        x: xZero[0].value,
        y: xZero[1].value
    }
    let calculatedGradient = new Gradient(variables[0], variables[1]);
    calculatedGradient.setGradientInPoint(point);
    outGradXk.innerHTML =`Градиент функции в ${numberIteration}-ой точке: f(xk) = ` + pointToString(calculatedGradient.getGradientInPoint());
}
function stepFour(){
	let point = {
        x: xZero[0].value,
        y: xZero[1].value
    }
    let calculatedGradient = new Gradient(variables[0], variables[1]);
    calculatedGradient.setGradientInPoint(point);
	let gradXk = calculatedGradient.getLength().toString();
    outGradXkLength.innerHTML =`Градиент функции в ${numberIteration}-ой точке: |f(xk)| =` + gradXk;
    outGradXkLength.innerHTML += '<br> Критерий останова : |▽f(xk)| ≤ ε ';
    outGradXkLength.innerHTML += '<br>'+ gradXk + " " + getSignOfСomparison(gradXk, accuracy.value) + " " + accuracy.value;
}
function stepFive() {
    step5Html.innerHTML = 'Критерий останова :  k ≥ M ';
    step5Html.innerHTML += '<br>'+ numberIteration + " " + getSignOfСomparison(numberIteration, maxIters.value) + " " + maxIters.value;
}
function stepSix(){
    let point = {
        x: xZero[0].value,
        y: xZero[1].value
    }
    let matrixGessa = new Matrix(variables[0], variables[1]);
    matrixGessa.setPoint(point);
    setPretty(step6Html, matrixGessa.getInPoint());
}
function stepSeven() {
    let point = {
        x: xZero[0].value,
        y: xZero[1].value
    }
    let matrixGessa = new Matrix(variables[0], variables[1]);
    matrixGessa.setPoint(point);
    console.log();
    let E =math.eye(2);
    E = math.multiply(E , numberOfRegulationStrategy);
    let ansver = math.add(matrixGessa.point, E);
    setPretty(step7Html, ansver.toString());
}
function stepEight(){
    let point = {
        x: xZero[0].value,
        y: xZero[1].value
    }
    let matrixGessa = new Matrix(variables[0], variables[1]);
    matrixGessa.setPoint(point);
    console.log();
    let E =math.eye(2);
    E = math.multiply(E , numberOfRegulationStrategy);
    let ansver = math.add(matrixGessa.point, E);

    setPretty(step8Html, math.inv(ansver).toString());
    step8Html.innerHTML += `Проверка : ${ansver.toString()} * ${math.inv(ansver).toString()} = ${math.multiply(ansver,math.inv(ansver)).toString()} `
}
function stepNine(){
    let point = {
        x: xZero[0].value,
        y: xZero[1].value
    }
    let matrixGessa = new Matrix(variables[0], variables[1]);
    matrixGessa.setPoint(point);
    console.log();
    let E =math.eye(2);
    E = math.multiply(E , numberOfRegulationStrategy);
    let ansver = math.add(matrixGessa.point, E);

    let calculatedGradient = new Gradient(variables[0], variables[1]);
    calculatedGradient.setGradientInPoint(point);
    let dk = math.multiply(math.multiply(math.inv(ansver),-1) ,calculatedGradient.getGradientInPoint());
    console.log(calculatedGradient.getGradientInPoint().toString());
    console.log((math.multiply(math.inv(ansver),-1).toString()));
    console.log(dk.toString());
    setPretty(step9Html, dk.toString());
    return dk;
}
function stepTen(_dk) {
    let xk = {
        x: xZero[0].value,
        y: xZero[1].value
    }
    let xk1 ={
     x: math.eval( xk.x + math.subset(_dk, math.index(0))),
     y: math.eval(xk.y + math.subset(_dk, math.index(1)))
    }
    //console.log(math.subset(_dk, math.index(0)));
    setPretty(step10Html, xk1.x + "  ;  "+xk1.y);
    return xk1;
}
function stepEleven(_xk1){
    step5Html.innerHTML = 'Критерий останова : f x < f x+1 :';
    let xk = {
        x: xZero[0].value,
        y: xZero[1].value
    }
    let firstExpr = math.eval(exprPolynomHtml.value.toString(), xk);
    console.log(firstExpr);
    let secondExpr = math.eval(exprPolynomHtml.value.toString(), _xk1)
    step11Html.innerHTML += '<br>'+ firstExpr + " " + getSignOfСomparison(firstExpr, secondExpr) + " " + secondExpr;
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

//------------------------------CLASES(OBJECTS)-------------------------------

function Gradient(_first, _second){
    this.first = calculateDerivative(_first);

    this.second = calculateDerivative(_second);
    this.point = [0,0];
    
    this.gradientToString = function(){
        return '(' + this.first.toString() + ')*i+' + '(' + this.second.toString() + ')*j';
    }
    this.setGradientInPoint = function(_point){
        let gradientInPointX = (math.eval(this.first.toString(), _point)).toString();
        let gradientInPointY = (math.eval(this.second.toString(), _point).toString());
        this.point = [gradientInPointX, gradientInPointY];
    }
    this.getGradientInPoint = function(){
        return this.point;
    }
    this.getLength = function(){
        return math.eval('sqrt(pow(' + this.point[0] + ',2)+pow(' + this.point[1] + ',2))')
    }
}
function Matrix(first,second) {
    this.peremOne = calulateDoubleDerivative(first, first);
    this.peremTwo = calulateDoubleDerivative(first, second);
    this.peremThree = calulateDoubleDerivative(second, second);
    this.point = [[1,1],[1,1]];

    this.setPoint = function(_point){
        let gradientInPointXX = (math.eval(this.peremOne.toString(), _point)).toString();
        let gradientInPointYY = (math.eval(this.peremThree.toString(), _point).toString());
        let gradientInPointXY = (math.eval(this.peremTwo.toString(), _point).toString());
        this.point = [[gradientInPointXX,gradientInPointXY],[gradientInPointXY, gradientInPointYY]];
    }
    this.getInPoint = function(){
        return this.stringMatrix(this.point[0][0],this.point[0][1],this.point[1][0],this.point[1][1]);
    }
    this.getMatrix = function(){
        
        return this.stringMatrix(this.peremOne,this.peremTwo,this.peremTwo,this.peremThree);
    }
    this.stringMatrix = function(perem1,perem2,perem3,perem4){
        return '[[' + perem1 + ',' + perem2 + '], [' + perem3 + ', ' + perem4 + ']]';
    }
}

//-------------------------------VIEW-----------------------------------------
function setPretty(element, value) {
    element.innerHTML = '$$' + math.parse(value).toTex({parenthesis: parenthesis}) + '$$';
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