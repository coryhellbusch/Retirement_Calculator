function taxesOwed(tradRetirementValue, withdrawalRate, deduction, stateTax) {

    const taxable = (tradRetirementValue * (withdrawalRate/100)) - deduction;
    const limit1 = 23200, limit2 = 94300, limit3 = 201050, limit4 = 383900, limit5 = 487450, limit6 = 731200;
    const rate1 = 0.1, rate2 = 0.02, rate3 = 0.1, rate4 = 0.02, rate5 = 0.08, rate6 = 0.03, rate7 = 0.02;
    
    const taxes = (taxable * rate1) + 
                    (taxable > limit1 ? (taxable - limit1) * rate2 : 0) +
                    (taxable > limit2 ? (taxable - limit2) * rate3 : 0) +
                    (taxable > limit3 ? (taxable - limit3) * rate4 : 0) +
                    (taxable > limit4 ? (taxable - limit4) * rate5 : 0) +
                    (taxable > limit5 ? (taxable - limit5) * rate6 : 0) +
                    (taxable > limit6? (taxable - limit6) * rate7 : 0) + 
                    (taxable * (stateTax/100));

    return taxes;
}

export default taxesOwed;