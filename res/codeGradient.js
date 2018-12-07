math.import({eye: math.identity}, {override: true})
let exprPolynomHtml = document.getElementById('expr'),
    prettyFxHtml = document.getElementById('prettyFx'),
    prettyG1Html = document.getElementById('prettyG1'),
    parenthesis = 'keep',
    xZero = [document.getElementById('zeroX1'), document.getElementById('zeroX2')],
    accuracy = document.getElementById('accuracy'),
    maxIters = document.getElementById('maxIters'),
    g1Expr = document.getElementById('g1Expr'),
    g1Value = document.getElementById('g1Value'),
    outputHtml = document.getElementById('output');
    //g2Expr = document.getElementById('g2Expr'),
    //g2Value = document.getElementById('g2Value'); 

//Code initialization

prettyFxHtml.value = '(x1-4)^2+(x2-5)^2';
xZero[0].value = 0;
xZero[1].value = 0;
accuracy.value = 0;
maxIters.value = 5;
g1Expr.value = 'x1+x2-1';
g1Value.value = 0;
//g2Expr.value = 'x1+x2-1';
//g2Value.value = 0;

//dataForAlg initialization
var data = new DataForGradientAlg(prettyFxHtml.value,g1Expr.value,g1Value.value,xZero[0].value,xZero[1].value,accuracy.value,maxIters.value);


calculateAndViewAlg(data,prettyFxHtml, prettyG1Html,output);

function calculateAndViewAlg(data,prettyFxHtml, prettyG1Html,outputHtml) {
    //preparetions

    //вывод Fx и G1
    setVariables(data);

    //calculations
    var gradientAlgResult = gradientAlgorithm(data);

    //view
    viewFxAndG1Pretty(data, prettyFxHtml, prettyG1Html);
    viewGradientAlgResult(data,gradientAlgResult,outputHtml);
}

//---------------------------STEPS------------------------------

function setVariables(dataForGradientAlg){
    dataForGradientAlg.variablesFx = getVariablesFromPolynom(dataForGradientAlg.Fx);
    dataForGradientAlg.variablesg1 = getVariablesFromPolynom(dataForGradientAlg.g1Expr);
}

function stepOne(dataForGradientAlg,algResult){
    algResult.stepOne = `Задаём x0 = (${dataForGradientAlg.xZero[0]};${dataForGradientAlg.xZero[1]}); `;
    algResult.stepOne += `e = ${dataForGradientAlg.accuracy};`;
    algResult.stepOne += `M = ${dataForGradientAlg.maxIters};`;
}
function stepTwo(dataForGradientAlg,algResult){
    dataForGradientAlg.numderOfIteration =0;
    algResult.stepTwo = `k = ${dataForGradientAlg.numderOfIteration}`;
}
function stepThree(dataForGradientAlg,algResult){
    algResult.stepsHtml[dataForGradientAlg.numderOfIteration] += 
    `k ${getSignOfСomparison(dataForGradientAlg.numderOfIteration,
        dataForGradientAlg.maxIterations)} M`;
    return getSignOfСomparison(dataForGradientAlg.numderOfIteration,
        dataForGradientAlg.maxIterations);
    
}
//------------------------------ROOTS-----------------------------------------
function gradientAlgorithm(dataForGradientAlg) {
    var algResult = new GradientAlgResult();
    stepOne(dataForGradientAlg,algResult);
    stepTwo(dataForGradientAlg,algResult);
    mainRoot(dataForGradientAlg, algResult);
    return algResult;
}

function mainRoot(dataForGradientAlg, algResult){
    var sign = stepThree(dataForGradientAlg, algResult);
    //что-то проверить и закончить
    if(sign === '>'){return;}
    
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

function DataForGradientAlg(Fx,g1Expr,g1Value,/*g2Expr,g2Value,*/xZero1,xZero2,accuracy,maxIters){
    this.Fx = Fx;
    this.g1Expr = g1Expr;
    this.g1Value = g1Value;
    //this.g2Expr = g2Expr;
    //this.g2Value = g2Value;
    this.xZero = [xZero1,xZero2];
    this.accuracy = accuracy;
    this.maxIterations = maxIters;
    this.variablesFx = {};
    this.variablesg1 = {};
    this.numderOfIteration;
}

function GradientAlgResult(){
    this.stepsHtml = [];
    this.stepOne;
    this.stepTwo;
}

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
function viewGradientAlgResult(dataForGradientAlg,gradientAlgResult,outputHtml){
    setPrettyTr(outputHtml,'Шаг 1',gradientAlgResult.stepOne,' ');
    setPrettyTr(outputHtml,'Шаг 2',gradientAlgResult.stepTwo,' ');
    
}

function viewFxAndG1Pretty(dataForGradientAlg,prettyFxHtml,prettyG1Html) {
    setPretty(prettyFxHtml, dataForGradientAlg.Fx);
    setPretty(prettyG1Html, dataForGradientAlg.g1Expr);
}

function setPretty(element, value) {
    element.innerHTML = '$$' + math.parse(value).toTex({parenthesis: parenthesis}) + '$$';
    //output.insertAdjacentHTML('beforeEnd', `<tr><th>Шаг 5</th><td><div>$$ ${math.parse(value).toTex({parenthesis: parenthesis})}
//$$</div></td></tr>`);
}

function setPrettyTrWithExpr(currentHtml, name, value, messageBefore, messageAfter) {
    //element.innerHTML = '$$' + math.parse(value).toTex({parenthesis: parenthesis}) + '$$';
    currentHtml.innerHTML += `<tr><th>${name}</th><td><div>${messageBefore} ${math.parse(value).toTex({parenthesis: parenthesis})} ${messageAfter}</div></td></tr>`;
}
function setPrettyTr(currentHtml, name, messageBefore, messageAfter) {
    //element.innerHTML = '$$' + math.parse(value).toTex({parenthesis: parenthesis}) + '$$';
    currentHtml.innerHTML += `<tr><th>${name}</th><td><div>${messageBefore} ${messageAfter}</div></td></tr>`;
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