

import reqwest from 'reqwest';

/**
 * 
 * @param {*} fileContent - O conteúdo bruto do .csv 
 */
export async function cleanFileData(fileContent) {
    let values = []
    let count = 0 
    for(let value of fileContent) {
        if(count !== 0) {
            let splittedValue = value.shift().split(";").filter(eachVal => eachVal !== "");
            if(splittedValue.length > 0) {
                let val = {
                    name: splittedValue[0],
                    CEP: parseInt(splittedValue[1]),
                    CPF: parseInt(splittedValue[2])
                }
                values.push(val);
                try {
                    let result = await reqwest({
                        url: `https://viacep.com.br/ws/${val.CEP}/json/`,
                        method: 'get'
                    });
                    val.address = {
                        district: result.bairro,
                        street: result.logradouro,
                        state: result.localidade
                    }
                }catch(e) {
                    val.address = null;
                }
            }
        }
        count++ 
    }
    return values;
}