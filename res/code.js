//readValues
math.import({eye: math.identity}, {override: true})
let exprPolynomHtml = document.getElementById('expr'),
    prettyHtml = document.getElementById('pretty'),
    result = document.getElementById('result'),
    gesseHtml = document.getElementById('gesse'),
    gradient1Html = document.getElementById('gradient1'),
    outIteration = document.getElementById('iteration'),
    outRegulation = document.getElementById('regulation'),
    parenthesis = 'keep',
    isEnd,
    countThirteenSteps,
    implicit = 'hide',
    variables,
    xZero = [document.getElementById('zeroX1'), document.getElementById('zeroX2')],
    accuracy = document.getElementById('accuracy'),
    maxIters = document.getElementById('maxIters'),
    numberIteration,
    numberOfRegulationStrategy,
    numberOfRegulationStrategyHtml = document.getElementById('strategy'),
    xK = [],
    xKForTenStep = [];
stepsHtml = [];
let okHtml = document.getElementById('ok');
//Всё идёт сюда

let currentStepHtml;

exprPolynomHtml.value = 'x^2+y^2-2x*y^2+x+10';
xZero[0].value = 0;
xZero[1].value = 0;
accuracy.value = 0.05;
maxIters.value = 100;
numberOfRegulationStrategyHtml.value = 1;


MarquardAlgorithm("x^2+y^2-2x*y^2+x+10");

//functions

function MarquardAlgorithm(expression) {
    preparation(expression);
    stepOne();
    stepTwo();
    fullRoot();

    viewMarquardAlgorithm(stepsHtml, xK, isEnd ,output);
}


//---------------------------STEPS------------------------------

function preparation(expression) {
    stepsHtml = [];
    countThirteenSteps = 0;
    numberIteration = 0;
    isEnd = true;
    variables = getVariablesFromPolynom(expression);
    setPretty(prettyHtml, expression);
}

function stepOne() {
    xK[0] = xZero[0].value;
    xK[1] = xZero[1].value;
    xKForTenStep = [...xK];
    numberOfRegulationStrategy = numberOfRegulationStrategyHtml.value;
    let calculatedGradient = new Gradient(variables[0], variables[1]);
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
        x: xK[0],
        y: xK[1]
    }
    let calculatedGradient = new Gradient(variables[0], variables[1]);
    calculatedGradient.setGradientInPoint(point);
    currentStepHtml += `<tr><th>Шаг 3</th><td><div>Градиент функции в ${numberIteration}-ой точке: f(xk) = ${pointToString(calculatedGradient.getGradientInPoint())}</div></td></tr>`;
}

function stepFour() {
    let point = {
        x: xK[0],
        y: xK[1]
    }
    let calculatedGradient = new Gradient(variables[0], variables[1]);
    calculatedGradient.setGradientInPoint(point);
    let gradXk = calculatedGradient.getLength().toString();
    let sign = getSignOfСomparison(Number(gradXk), accuracy.value);
    currentStepHtml += `<tr><th>Шаг 4</th><td><div>|f(xk)| = ${gradXk}<br> Критерий останова : |▽f(xk)| ≤ ε <br>  ${gradXk} ${sign} ${accuracy.value}</div></td></tr>`;
    return sign;
}

function stepFive() {
    let sign = getSignOfСomparison(numberIteration, maxIters.value);
    /*    step5Html.innerHTML = 'Критерий останова :  k ≥ M ';
        step5Html.innerHTML += '<br>' + numberIteration + " " + sign + " " + maxIters.value;*/
    currentStepHtml += `<tr><th>Шаг 5</th><td><div>Критерий останова :  k ≥ M<br> ${numberIteration} ${sign} ${maxIters.value}</div></td></tr>`;
    return sign;
}

function stepSix() {
    let point = {
        x: xK[0],
        y: xK[1]
    }
    let matrixGessa = new Matrix(variables[0], variables[1]);
    matrixGessa.setPoint(point);
    let ans = matrixGessa.getMatrix();
    setPrettyTr('Шаг 6', matrixGessa.getInPoint(), `Матрица Гессе: $$H(x^{${numberIteration}}) = `, '$$');
}

function stepSeven() {
    let point = {
        x: xK[0],
        y: xK[1]
    }
    let matrixGessa = new Matrix(variables[0], variables[1]);
    matrixGessa.setPoint(point);
    let E = math.eye(2);
    E = math.multiply(E, numberOfRegulationStrategy);
    let ansver = math.add(matrixGessa.point, E).toString();
    setPrettyTr('Шаг 7', ansver, `$$H(x^{${numberIteration}}) + μ^{${numberIteration}} * E =`, '$$');
}

function stepEight() {
    let point = {
        x: xK[0],
        y: xK[1]
    }
    let matrixGessa = new Matrix(variables[0], variables[1]);
    matrixGessa.setPoint(point);
    console.log();
    let E = math.eye(2);
    E = math.multiply(E, numberOfRegulationStrategy);
    let ansver = math.add(matrixGessa.point, E);

    setPrettyTr('Шаг 8', math.format(math.inv(ansver), {
        notation: 'fixed',
        precision: 3
    }).toString(), `$$[H(x^{${numberIteration}}) + μ^{${numberIteration}} * E]^{-1} =`, '$$');
    //step8Html.innerHTML += `Проверка : ${ansver.toString()} * ${math.inv(ansver).toString()} = ${math.multiply(ansver, math.inv(ansver)).toString()} `
}

function stepNine() {
    let point = {
        x: xK[0],
        y: xK[1]
    }
    let matrixGessa = new Matrix(variables[0], variables[1]);
    matrixGessa.setPoint(point);
    console.log();
    let E = math.eye(2);
    E = math.multiply(E, numberOfRegulationStrategy);
    let ansver = math.add(matrixGessa.point, E);

    let calculatedGradient = new Gradient(variables[0], variables[1]);
    calculatedGradient.setGradientInPoint(point);
    let dk = math.multiply(math.multiply(math.inv(ansver), -1), calculatedGradient.getGradientInPoint());
    setPrettyTr('Шаг 9', math.format(dk, {
        notation: 'fixed',
        precision: 3
    }).toString(), `Направление спуска: $$d^k=[H(x^{${numberIteration}}) + μ^{${numberIteration}} * E]^{-1} * ▽f(x^{${numberIteration}})=`, '$$');
    return dk;
}

function stepTen(_dk) {
    let xk = {
        x: xKForTenStep[0],
        y: xKForTenStep[1]
    }
    let xk1 = {
        x: math.eval(xk.x + math.subset(_dk, math.index(0))),
        y: math.eval(xk.y + math.subset(_dk, math.index(1)))
    }
    //console.log(math.subset(_dk, math.index(0)));
    setPrettyTr('Шаг 10', math.format(xk1.x, {
        notation: 'fixed',
        precision: 3
    }) + "; " + math.format(xk1.y, {notation: 'fixed', precision: 3}), '$$x^{k+1}=x^k+d^k: ', '$$');
    return xk1;
}

function stepEleven(_xk1) {
    //step5Html.innerHTML = 'Критерий останова : f x < f x+1 :';
    let xk = {
        x: xK[0],
        y: xK[1]
    }
    let firstExpr = math.eval(exprPolynomHtml.value.toString(), _xk1);
    console.log(firstExpr);
    let secondExpr = math.eval(exprPolynomHtml.value.toString(), xk);
    //if (Math.abs(firstExpr - secondExpr) >= 1)
    //isEnd = true;
    let sign = getSignOfСomparison(firstExpr, secondExpr);
    //step11Html.innerHTML += '<br>' + firstExpr + " " + sign + " " + secondExpr;
    currentStepHtml += `<tr><th>Шаг 11</th><td><div>Проверка условия: $$f(x^{k+1}) < f(x^k)$$ $$ ${math.format(firstExpr, {
        notation: 'fixed',
        precision: 3
    })} ${sign} ${math.format(secondExpr, {notation: 'fixed', precision: 3})}$$</div></td></tr>`;

    return sign;
}

function stepTwelve(_xk1) {
    xK[0] = _xk1.x;
    xK[1] = _xk1.y;
    xKForTenStep = [...xK];
    console.log('xK = ' + xK.toString());
    numberIteration++;
    numberOfRegulationStrategy = numberOfRegulationStrategy / 2;
    currentStepHtml += `<tr><th>Шаг 12</th><td><div>Условие выполнилось. Приступаем к данному шагу.<br>&#956; = &#956; / 2, &#956; = ${math.format(numberOfRegulationStrategy, {
        notation: 'fixed',
        precision: 3
    })}<br>k = k + 1, возвращаемся к шагу 3</div></td></tr>`;
    //к шагу 3
}

function stepThirteen(_xk1) {
    xKForTenStep[0] = _xk1.x;
    xKForTenStep[1] = _xk1.y;
    numberOfRegulationStrategy *= 2;
    currentStepHtml += `<tr><th>Шаг 13</th><td><div>Условие не выполнилось. Приступаем к данному шагу.<br>&#956; = &#956; * 2, &#956; = ${math.format(numberOfRegulationStrategy, {
        notation: 'fixed',
        precision: 3
    })}<br>Возвращаемся к шагу 7</div></td></tr>`;
    //к шагу 7
}

//------------------------------ROOTS-----------------------------------------

function fullRoot() {
    //вывод k итерации
    currentStepHtml = `<tr class="iter"><th colspan="2">k = ${numberIteration}</th></tr>`;
    stepThree();
    let str1 = stepFour();
    if (str1 === '<') {
        stepsHtml.push(currentStepHtml);
        return;
    }
    let str2 = stepFive();
    if (str2 === '>' || str2 === '=') {
        stepsHtml.push(currentStepHtml);
        return;
    }
    stepSix();
    miniRoot();
}

function miniRoot() {
    stepSeven();
    stepEight();
    let dk = stepNine();
    //xK = [...xKForTenStep];
    let xk = stepTen(dk);
    if (stepEleven(xk) == '<') {
        countThirteenSteps = 0;
        stepTwelve(xk);
        stepsHtml.push(currentStepHtml);
        //output.innerHTML += currentStepHtml;
        fullRoot();
    } else {
        if (countThirteenSteps > 25) {
            isEnd = false;
            return;
            math.()
        }
        countThirteenSteps++;
        stepThirteen(xk);
        miniRoot();
    }

}

//--------------------------CALCULATIONS-------------------------------------

function getVariablesFromPolynom(expression) {
    let nodeExpr = math.parse(expression);
    console.log(nodeExpr.toString());
    let filtered = nodeExpr.filter(function (node) {
        return node.isSymbolNode
    });
    filtered = unique(filtered);
    return filtered;
}

function unique(arr) {
    let obj = {};

    for (let i = 0; i < arr.length; i++) {
        let str = arr[i];
        obj[str] = true; // запомнить строку в виде свойства объекта
    }

    return Object.keys(obj); // или собрать ключи перебором для IE8-
}

function calulateDoubleDerivative(first, second) {
    let scope = {
        func: exprPolynomHtml.value.toString(),
        perOne: first,
        perTwo: second
    };
    return math.eval('derivative(derivative(func, perOne), perTwo)', scope);
}

function calculateDerivative(perem) {

    let scope = {
        func: exprPolynomHtml.value.toString(),
        perem: perem,
    };
    return math.eval('derivative(func, perem)', scope);
}

//------------------------------CLASES(OBJECTS)-------------------------------

function Gradient(_first, _second) {
    this.first = calculateDerivative(_first);

    this.second = calculateDerivative(_second);
    this.point = [0, 0];

    this.gradientToString = function () {
        return '(' + this.first.toString() + ')*i+' + '(' + this.second.toString() + ')*j';
    }
    this.setGradientInPoint = function (_point) {
        let gradientInPointX = math.format((math.eval(this.first.toString(), _point)), {
            notation: 'fixed',
            precision: 2
        }).toString();
        let gradientInPointY = math.format((math.eval(this.second.toString(), _point)), {
            notation: 'fixed',
            precision: 2
        }).toString();
        this.point = [gradientInPointX, gradientInPointY];
    }
    this.getGradientInPoint = function () {
        return this.point;
    }
    this.getLength = function () {
        return math.format(math.eval('sqrt(pow(' + this.point[0] + ',2)+pow(' + this.point[1] + ',2))'), {
            notation: 'fixed',
            precision: 2
        });
    }
}

function Matrix(first, second) {
    this.peremOne = calulateDoubleDerivative(first, first);
    this.peremTwo = calulateDoubleDerivative(first, second);
    this.peremThree = calulateDoubleDerivative(second, second);
    this.point = [[1, 1], [1, 1]];

    this.setPoint = function (_point) {
        let gradientInPointXX = math.format((math.eval(this.peremOne.toString(), _point)), {
            notation: 'fixed',
            precision: 2
        }).toString();
        let gradientInPointYY = math.format((math.eval(this.peremThree.toString(), _point)), {
            notation: 'fixed',
            precision: 2
        }).toString();
        let gradientInPointXY = math.format((math.eval(this.peremTwo.toString(), _point)), {
            notation: 'fixed',
            precision: 2
        }).toString();
        this.point = [[gradientInPointXX, gradientInPointXY], [gradientInPointXY, gradientInPointYY]];
    }
    this.getInPoint = function () {
        return this.stringMatrix(this.point[0][0], this.point[0][1], this.point[1][0], this.point[1][1]);
    }
    this.getMatrix = function () {

        return this.stringMatrix(this.peremOne, this.peremTwo, this.peremTwo, this.peremThree);
    }
    this.stringMatrix = function (perem1, perem2, perem3, perem4) {
        return '[[' + perem1 + ',' + perem2 + '], [' + perem3 + ', ' + perem4 + ']]';
    }
}

//-------------------------------VIEW-----------------------------------------
function setPretty(element, value) {
    element.innerHTML = '$$' + math.parse(value).toTex({parenthesis: parenthesis}) + '$$';
    //output.insertAdjacentHTML('beforeEnd', `<tr><th>Шаг 5</th><td><div>$$ ${math.parse(value).toTex({parenthesis: parenthesis})}
//$$</div></td></tr>`);
}

function setPrettyTr(name, value, messageBefore, messageAfter) {
    //element.innerHTML = '$$' + math.parse(value).toTex({parenthesis: parenthesis}) + '$$';
    currentStepHtml += `<tr><th>${name}</th><td><div>${messageBefore} ${math.parse(value).toTex({parenthesis: parenthesis})} ${messageAfter}</div></td></tr>`;
}

function pointToString(coordinates) {
    let stringCoord = "(";
    for (let i = 0; i < coordinates.length - 1; i++) {
        stringCoord += coordinates[i] + " ; "
    }
    stringCoord += coordinates[coordinates.length - 1] + ")";
    return stringCoord;
}

function getSignOfСomparison(a, b) {
    if (a > b) {
        return ">";
    }
    if (a == b) {
        return "=";
    }
    if (a < b) {
        return "<";
    }
}
function viewMarquardAlgorithm(stepsHtmlValue, xKValue, isEndValue, outputHtml){
	if (isEndValue == true) {
	        if (stepsHtmlValue.length > 4) {
	            outputHtml.insertAdjacentHTML('beforeEnd', stepsHtmlValue[0]);
	            outputHtml.insertAdjacentHTML('beforeEnd', stepsHtmlValue[1]);
	            outputHtml.insertAdjacentHTML('beforeEnd', '<tr><th colspan="2" align="center">Пропустим несколько итераций в связи с их количеством.<br><img src=content/timeLater' + (Math.floor(Math.random() * (17 - 1 + 1)) + 1) + '.jpg width="640" height="360"></th></tr>');
	            outputHtml.insertAdjacentHTML('beforeEnd', stepsHtmlValue[stepsHtmlValue.length - 2]);
	            outputHtml.insertAdjacentHTML('beforeEnd', stepsHtmlValue[stepsHtmlValue.length - 1]);
	            outputHtml.insertAdjacentHTML('beforeEnd', '</div>');
	        } else {
	            for (let i = 0; i < stepsHtmlValue.length; i++) {
	                outputHtml.insertAdjacentHTML('beforeEnd', stepsHtmlValue[i]);
	            }
	        }
	        outputHtml.insertAdjacentHTML('afterEnd', `<br><div id="resultX">xK = ${math.format(xKValue, {
	            notation: 'fixed',
	            precision: 3
	        }).toString()}</div>`);
	    } else {
	        outputHtml.insertAdjacentHTML('afterEnd', '<div id="resultX">Минимум не найден</div>');
	    }
}
//-------------------------------OUTPUT---------------------------------------
function restart() {
    let nodesCount = output.childNodes.length;
    for (let i = 0; i < nodesCount - 2; i++) {
        output.removeChild(output.childNodes[2]);
    }
    document.getElementById('resultX') ? document.getElementById('resultX').remove() : console.log('resultX = null');

    let node = null;
        try {
            // parse the expression
            node = math.parse(exprPolynomHtml.value);

            // evaluate the result of the expression
            MarquardAlgorithm(exprPolynomHtml.value);
            MathJax.Hub.Typeset();
            //result.innerHTML = math.format(node.compile().eval());
        }
        catch (err) {
            output.insertAdjacentHTML('beforeEnd', `<tr><th colspan="2" align="center"><span style="color: red;">${err.toString()}</span></th></tr>`);
            //result.innerHTML = '<span style="color: red;">' + err.toString() + '</span>';
            console.log('<span style="color: red;">' + err.toString() + '</span>');
            MathJax.Hub.Typeset();
        }
}

/*exprPolynomHtml.oninput = function () {
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
};*/
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