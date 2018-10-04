    //readValues
    var expr = document.getElementById('expr'),
        pretty = document.getElementById('pretty'),
        result = document.getElementById('result'),
        stepOne = document.getElementById('stepOne'),
        parenthesis = 'keep',
        implicit = 'hide';
    // initialize with an example expression
    //expr.value = 'sqrt(75 / 3) + det([[-1, 2], [3, 1]]) - sin(pi / 4)^2';
    doMainAction('x^2+y^3+2x*y+5+23x^4');
    //result.innerHTML = math.format(math.eval(expr.value));
    
    //funcions
    function doMainAction(expression){
        expr.value = expression;
        setPretty(pretty,expr.value);
        var matrix = doMatrix('x','y');
        //!вычислил первый шаг вроде
        setPretty(stepOne,matrix);
    }

    function setPretty(element,value){
        element.innerHTML = '$$' + math.parse(value).toTex({parenthesis: parenthesis}) + '$$';
    }

    function doMatrix(first,second){
        var peremOne = calulateDoubleDerivative('x','x');
        var peremTwo = calulateDoubleDerivative('x','y');
        var peremThree = calulateDoubleDerivative('y','y');
        return '[[' + peremOne + ',' + peremTwo + '], [' + peremTwo + ', ' + peremThree + ']]';
    }
    function calulateDoubleDerivative(first, second){

        let scope = {
        func: expr.value,
        perOne: first,
        perTwo: second
    }
    const node2 = math.parse('derivative(derivative(func, perOne), perTwo)');
    const code2 = node2.compile();
    return code2.eval(scope);
    };
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
