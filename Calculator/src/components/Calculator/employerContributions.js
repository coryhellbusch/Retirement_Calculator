
function employerContributions(salary, employerMatch, salaryInc, currentAge, retireAge, rate, employerCap) {
    let years = retireAge - currentAge;
    let i = 0;
    let totalEmployerCont = 0;
    
    while (i < years) {
        if (i === 0) {
            if((salary * (employerMatch/100)) > employerCap) {
                totalEmployerCont = employerCap;
            } else {
                totalEmployerCont = salary * (employerMatch/100)
            }
        } else {
            if ((salary * (employerMatch/100)) > employerCap) {
                totalEmployerCont = (totalEmployerCont * (1 + (rate/100)) + (employerCap))
            } else {
                totalEmployerCont = (totalEmployerCont * (1 + (rate/100))) + (salary * (employerMatch/100))
            }
        }
        
        i++
        salary = salary * (1 + (salaryInc/100))
    }

    return totalEmployerCont;
}

export default employerContributions;