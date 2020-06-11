
export function generateCode(attr) {
    let code = "";
    // console.log(attr);
    for (let temp in attr) {
        code += "let " + temp + "=" + JSON.stringify(attr[temp]) + ";"
    }
    return code
}

export function isTrue(expression, env) {
    let bool = false
    let code = env
    code += "if(" + expression  + "){bool = true}"
    // console.log(code)
    eval(code)
    return bool
}