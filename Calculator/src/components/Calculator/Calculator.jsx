import React, { useEffect, useState } from 'react'
import './Calculator.css'
import TVM from 'tvm-financejs'
import taxesOwed from './taxesOwed'
import employerContributions from './employerContributions'

const Calculator = () => {
    const [currentAge, setCurrentAge] = useState('')
    const [retireAge, setRetireAge] = useState('')
    const [startingTrad401k, setStartingTrad401k] = useState('')
    const [startingRoth401k, setStartingRoth401k] = useState('')
    const [startingTradIra, setStartingTradIra] = useState('')
    const [startingRothIra, setStartingRothIra] = useState('')
    const [contTrad401k, setContTrad401k] = useState('')
    const [contRoth401k, setContRoth401k] = useState('')
    const [contTradIra, setcontTradIra] = useState('')
    const [contRothIra, setContRothIra] = useState('')
    const [retirementValue, setRetirementValue] = useState(0);
    const [tradRetirementValue, setTraditionalRetirementValue] =useState('');
    const [rothRetirementValue, setRothRetirementValue] = useState('');
    const [inflAdjRetValue, setInflAdjRetValue] = useState('');
    const [years, setYears] = useState('');
    const [rate, setRate] = useState('');
    const [withdrawalRate, setWithdrawalRate] = useState('')
    const [deduction, setDeduction] = useState('')
    const [stateTax, setStateTax] = useState('')
    const [taxes, setTaxes] = useState('');
    const [afterTaxInflAdj, setAfterTaxInflAdj] = useState('')
    const [isChecked, setIsChecked] = useState(false);
    const [salary, setSalary] = useState('');
    const [employerMatch, setEmployerMatch] = useState('');
    const [isRoth, setIsRoth] = useState(false);
    const [salaryInc, setSalaryInc] = useState('');
    const [isChecked2, setIsChecked2] = useState(false);
    const [employerCap, setEmployerCap] = useState('');

    useEffect(() => {
        setYears(retireAge - currentAge)
    }, [retirementValue])

    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    });

    const handleChange2 = (event) => {
        setIsChecked2(event.target.checked);
    }

    const handleChange = (event) => {
        setIsChecked(event.target.checked);
    }

    const handleRothChange = (event) => {
        setIsRoth(event.target.checked);
    }

    const calculateRetirement = (event) => {
        event.preventDefault();
        const startingValue = Number(startingTrad401k) + Number(startingRoth401k) + Number(startingTradIra) + Number(startingRothIra)
        const startingTrad = Number(startingTrad401k) + Number(startingTradIra)
        const startingRoth = Number(startingRoth401k) + Number(startingRothIra)
        const employerCont = Number(employerContributions(salary, employerMatch, salaryInc, currentAge, retireAge, rate, employerCap));
        const annualCont = Number(contTrad401k) + Number(contRoth401k) + Number(contTradIra) + Number(contRothIra)
        const annualTrad = Number(contTrad401k) + Number(contTradIra);
        const annualRoth = Number(contRoth401k) + Number(contRothIra);
        const tvm = new TVM();
        const yearsOfGrowth = retireAge - currentAge;
        const tempRetireValue = -(tvm.FV((rate/100)/12, yearsOfGrowth*12, annualCont/12, startingValue)) + employerCont
        let tempTradRetireValue = -(tvm.FV((rate/100)/12, yearsOfGrowth*12, annualTrad/12, startingTrad))
        let tempRothRetireValue = -(tvm.FV((rate/100)/12, yearsOfGrowth*12, annualRoth/12, startingRoth))
        if(isRoth) {
            tempRothRetireValue += employerCont
        } else {
            tempTradRetireValue += employerCont
        }
        setRetirementValue(tempRetireValue)
        setInflAdjRetValue(tempRetireValue / Math.pow(1.02, yearsOfGrowth))
        setTraditionalRetirementValue(tempTradRetireValue)
        setRothRetirementValue(tempRothRetireValue)
        const tempTaxes = (taxesOwed(tempTradRetireValue, withdrawalRate, deduction, stateTax))
        setTaxes(tempTaxes)
        setAfterTaxInflAdj(((tempRetireValue * (withdrawalRate/100)) - tempTaxes) / Math.pow(1.02, yearsOfGrowth))
    }

  return (
    <div className='calculator'>
        <form className='calc-form' onSubmit={calculateRetirement}>
            <table>
                <tbody>
                    <tr>
                        <td><label>Current age</label></td>
                        <td><input 
                            type='number' 
                            value={currentAge} 
                            onChange={(e) => setCurrentAge(e.target.value)}>
                            </input>
                        </td>
                    </tr>
                    <tr>
                        <td><label>Retirement age</label></td>
                        <td><input 
                            type='number' 
                            value={retireAge} 
                            onChange={(e) => setRetireAge(e.target.value)}>
                            </input>
                        </td>
                    </tr>
                    <tr>
                        <td><label>Expected Annual Rate of Return</label></td>
                        <td><input 
                            type='number' 
                            value={rate} 
                            onChange={(e) => setRate(e.target.value)}>
                            </input>
                        </td>
                    </tr>
                    <tr>
                        <td><label>Percentage Withdrawn Each Year (4% is sustainable)</label></td>
                        <td><input 
                            type='number' 
                            value={withdrawalRate} 
                            onChange={(e) => setWithdrawalRate(e.target.value)}>
                            </input>
                        </td>
                    </tr>
                    <tr>
                        <td><label>Total Tax Deductions (2024 standard is $29,200)</label></td>
                        <td><input 
                            type='number' 
                            value={deduction} 
                            onChange={(e) => setDeduction(e.target.value)}>
                            </input>
                        </td>
                    </tr>
                    <tr>
                        <td><label>If your state has a flat tax rate, include it here</label></td>
                        <td><input 
                            type='number' 
                            value={stateTax} 
                            onChange={(e) => setStateTax(e.target.value)}/>
                        </td>
                    </tr>
                    <tr>
                        <td><label>Does your employer offer a 401k match?</label></td>
                        <td>
                            <input 
                                id='check' 
                                type='checkbox' 
                                checked={isChecked} 
                                onChange={handleChange}/>
                        </td>
                    </tr>
                    {isChecked && 
                    <>
                    <tr>
                        <td><label>Does your employee cap retirement contributions at a certain dollar amount?</label></td>
                        <td><input 
                            id='check'
                            type='checkbox'
                            checked={isChecked2}
                            onChange={handleChange2}/>
                        </td>
                    </tr>
                    {isChecked2 &&
                    <tr>
                        <td><label>Employer contribution dollar amount cap:</label></td>
                        <td><input
                            type='number'
                            value={employerCap}
                            onChange={(e) => setEmployerCap(e.target.value)}/>
                        </td>
                    </tr>
                    }
                    <tr>
                        <td><label>Current salary:</label></td>
                        <td>
                            <input
                                type='number'
                                value={salary}
                                onChange={(e) => setSalary(e.target.value)} />
                        </td>
                    </tr>
                    <tr>
                        <td><label>Annual salary percentage increase:</label></td>
                        <td>
                            <input
                                type='number'
                                value={salaryInc}
                                onChange={(e) => setSalaryInc(e.target.value)} />
                        </td>
                    </tr>
                    <tr>
                        <td><label>Percentage employer match:</label></td>
                        <td>
                            <input
                                type='number'
                                value={employerMatch}
                                onChange={(e) => setEmployerMatch(e.target.value)} />
                        </td>
                    </tr>
                    <tr>
                        <td><label>Select if your employer match is Roth.</label></td>
                        <td>
                            <input 
                                id='check' 
                                type='checkbox' 
                                checked={isRoth} 
                                onChange={handleRothChange}/>
                        </td>
                    </tr></>
                    }
                </tbody>
            </table>
            <p>If you have a current balance in any of the following accounts, add the balance to the corresponding account.</p>
            <table className='accounts'>
                <tbody>
                    <tr>
                        <td><label>Traditional 401k</label></td>
                        <td><input 
                            type='number' 
                            value={startingTrad401k} 
                            onChange={(e) => setStartingTrad401k(e.target.value)}>
                            </input>
                        </td>
                    </tr>
                    <tr>
                        <td><label>Roth 401k</label></td>
                        <td><input 
                            type='number' 
                            value={startingRoth401k} 
                            onChange={(e) => setStartingRoth401k(e.target.value)}>
                            </input>
                        </td>
                    </tr>
                    <tr>
                        <td><label>Traditional IRA</label></td>
                        <td><input 
                            type='number' 
                            value={startingTradIra} 
                            onChange={(e) => setStartingTradIra(e.target.value)}>
                            </input>
                        </td>
                    </tr>
                    <tr>
                        <td><label>Roth IRA</label></td>
                        <td><input 
                            type='number' 
                            value={startingRothIra} 
                            onChange={(e) => setStartingRothIra(e.target.value)}>
                            </input>
                        </td>
                    </tr>
                </tbody>
            </table>
            <br />
            <p>How much do you plan on contributing to each account each year?</p>
            <table className='accounts'>
                <tbody>
                    <tr>
                        <td><label>Traditional 401k</label></td>
                        <td><input 
                            type='number' 
                            value={contTrad401k} 
                            onChange={(e) => setContTrad401k(e.target.value)}>
                            </input>
                        </td>
                    </tr>
                    <tr>
                        <td><label>Roth 401k</label></td>
                        <td><input 
                            type='number' 
                            value={contRoth401k} 
                            onChange={(e) => setContRoth401k(e.target.value)}>
                            </input>
                        </td>
                    </tr>
                    <tr>
                        <td><label>Traditional IRA</label></td>
                        <td><input 
                            type='number'
                            value={contTradIra} 
                            onChange={(e) => setcontTradIra(e.target.value)}>
                            </input>
                        </td>
                    </tr>
                    <tr>
                        <td><label>Roth IRA</label></td>
                        <td><input 
                            type='number' 
                            value={contRothIra} 
                            onChange={(e) => setContRothIra(e.target.value)}>
                            </input>
                        </td>
                    </tr>
                </tbody>
            </table>
            <button type='submit'>Calculate</button>
        </form>
        {retirementValue && 
            <div className='retireValue'>
                <h2>Account valuation:</h2>
                    <table>
                        <tbody>
                            <tr>
                                <td><p>Total value of accounts at retirement:</p></td>
                                <td className='dollarAmounts'><p>{formatter.format(retirementValue)}</p></td>
                            </tr>
                            <tr>
                                <td><p>Value after inflation (2% per year for {years} years):</p></td>
                                <td className='dollarAmounts'><p>{formatter.format(inflAdjRetValue)}</p></td>
                            </tr>
                            <tr>
                                <td><p>Total value of Traditional accounts:</p></td>
                                <td className='dollarAmounts'><p>{formatter.format(tradRetirementValue)}</p></td>
                            </tr>
                            <tr>
                                <td><p>Total value of Roth accounts:</p></td>
                                <td className='dollarAmounts'><p>{formatter.format(rothRetirementValue)}</p></td>
                            </tr>
                        </tbody>
                    </table>
                <h2>Annual withdrawals:</h2>
                    <table>
                        <tbody>
                            <tr>
                                <td><p>Annual withdrawal amount:</p></td>
                                <td className='dollarAmounts'><p>{formatter.format(retirementValue * (withdrawalRate/100))}</p></td>
                            </tr>
                            <tr>
                                <td><p>Taxable Amount:</p></td>
                                <td className='dollarAmounts'><p>{formatter.format(tradRetirementValue * (withdrawalRate/100))}</p></td>
                            </tr>
                            <tr>
                                <td><p>Nontaxable amount:</p></td>
                                <td className='dollarAmounts'><p>{formatter.format(rothRetirementValue * (withdrawalRate/100))}</p></td>
                            </tr>
                            <tr>
                                <td><p>Taxes paid:</p></td>
                                <td className='dollarAmounts'><p>{formatter.format(taxes)}</p></td>
                            </tr>
                            <tr>
                                <td><p>Amount after taxes:</p></td>
                                <td className='dollarAmounts'><p>{formatter.format((retirementValue * (withdrawalRate/100))-taxes)}</p></td>
                            </tr>
                            <tr>
                                <td><p>Adjusted for Inflation:</p></td>
                                <td className='dollarAmounts'><p>{formatter.format(afterTaxInflAdj)}</p></td>
                            </tr>
                        </tbody>
                    </table>
            </div>
        }
    </div>
  )
}

export default Calculator