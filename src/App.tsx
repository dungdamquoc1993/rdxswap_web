import React, { useEffect, useMemo, useState } from 'react';
import './App.css';
import { useWeb3React } from '@web3-react/core'
import { Injected } from './connectors'
import { getContract } from './utils/getContract'
import { PoolPair, RedDotToken, WojakToken } from './utils/constant';
const { parseUnits } = require("ethers/lib/utils");


function App() {
  const [leftSwapValue, setLeftSwapValue] = useState<any>(0)
  const [leftEqualRDX, setLeftEqualRDX] = useState<Boolean>(true)
  const addLiquidityInput = ['rdxExpect', 'wjkExpect', 'rdxMin', 'wjkMin']
  const listInputAddLiquidity = addLiquidityInput.map((name, index) => {
    let labelName = name === 'rdxExpect' ? 'RDX expect' : name === 'wjkExpect' ? 'WJK expect' :
      name === 'rdxMin' ? 'RDX min' : name === 'wjkMin' ? 'WJK Min' : ''
    return (
      <div key={index} style={{ display: 'flex', flexDirection: 'column' }}>
        <p>{labelName}</p>
        <input style={{ marginRight: 10, width: 100 }} type='number'
          onChange={(e) => {
            if (name === 'rdxExpect') {
              setRdxExpect(e.target.value)
            } else if (name === 'wjkExpect') {
              setWjkExpect(e.target.value)
            } else if (name === 'rdxMin') {
              setRdxMin(e.target.value)
            } else if (name === 'wjkMin') {
              setWjkMin(e.target.value)
            }
          }} />
      </div>
    )
  })
  const removeLiquidityInput = ['lpBurn', 'rdxOutMin', 'wjkOutMin']
  const listInputRemoveLiquidity = removeLiquidityInput.map((name, index) => {
    let labelName = name === 'lpBurn' ? 'LP amount' : name === 'rdxOutMin' ? 'RDX min back' : name === 'wjkOutMin' ? 'WJK min back' : ''
    return (
      <div key={index} style={{ display: 'flex', flexDirection: 'column' }}>
        <p>{labelName}</p>
        <input style={{ marginRight: 10, width: 100 }} type='number' onChange={(e) => {
          if (name === 'lpBurn') {
            setLpToBurn(e.target.value)
          } else if (name === 'rdxOutMin') {
            setRdxMinBack(e.target.value)
          } else if (name === 'wjkOutMin') {
            setWjkMinBack(e.target.value)
          }
        }} />
      </div>
    )
  })
  let [userAccount, setUserAccount] = useState<any>('')
  let [userRDXBal, setUserRDXBal] = useState<any>(0)
  let [userWJKBal, setUserWJKBal] = useState<any>(0)
  let [userRDLPBal, setRDLPBal] = useState<any>(0)
  let [reserveRdx, setReserveRdx] = useState<any>(0)
  let [reserveWjk, setReserveWjk] = useState<any>(0)

  const { activate, account } = useWeb3React();
  const connectWallet = async () => {
    await activate(Injected)
  }
  const update = async () => {
    await getRDXBal()
    await getWJKBal()
    await getRDLPBal()
    await getReserves()
  }


  const mintRDX = async () => {
    const contract = await getContract('RDX')
    if (contract != null) {
      try {
        const mint = await contract.mint()
        alert('mint RDX successs wait for 30 second to see balance update')
        await mint.wait()
        await getRDXBal()
      } catch (error) {
        alert('mint RDX cause crash by system')
      }
    } else alert('get RDX contract failed')
  }

  const mintWJK = async () => {
    const contract = await getContract('WJK')
    if (contract != null) {
      try {
        const mint = await contract.mint()
        alert('mint WJK success wait for 30 second to see balance update')
        await mint.wait()
        await getWJKBal()
      } catch (error) {
        alert('mint WJK cause crash by system')
      }
    } else alert('get WJK contract failed')

  }

  const getRDXBal = async () => {
    const contract = await getContract('RDX')
    if (contract != null) {
      try {
        const bal = parseInt((await contract.balanceOf(userAccount))) / 10 ** 12
        setUserRDXBal(bal)
      } catch (error) {
        console.log('get RDX balance cause crash by system')
      }
    } else alert('get RDX contract failed')
  }
  const getWJKBal = async () => {
    const contract = await getContract('WJK')
    if (contract != null) {
      try {
        const bal = parseInt((await contract.balanceOf(userAccount))) / 10 ** 12
        setUserWJKBal(bal)
      } catch (error) {
        console.log('get WJK balance cause crash by system')
      }
    } else alert('get WJK contract failed')
  }
  const getRDLPBal = async () => {
    const contract = await getContract('POO')
    if (contract != null) {
      try {
        const bal = parseInt((await contract.balanceOf(userAccount))) / 10 ** 12
        setRDLPBal(bal)
      } catch (error) {
        console.log('get RDLP Balance cause crash by system')
      }
    } else alert('get PoolPair contract failed')
  }

  const getRDXAllowance = async () => {
    const contract = await getContract('RDX')
    if (contract != null) {
      try {
        const bal = parseInt(await contract.allowance(userAccount, PoolPair.contractAddress)) / 10 ** 12
        return bal
        // setRdxAllowance(bal)
      } catch (error) {
        alert('get RDX allowance cause crash by systems')
      }
    } alert('get RDX contract faied')
  }
  const getWJKAllowance = async () => {
    const contract = await getContract('WJK')
    if (contract != null) {
      try {
        const bal = parseInt(await contract.allowance(userAccount, PoolPair.contractAddress)) / 10 ** 12
        return bal
        // setWjkAllowance(bal)
      } catch (error) {
        alert('get RDX allowance cause crash by systems')
      }
    } alert('get RDX contract faied')
  }
  const getReserves = async () => {
    const contract = await getContract('POO')
    if (contract != null) {
      try {
        const rdxReserve = parseInt((await contract.getReserves())[0]) / 10 ** 12
        const wjkReserve = parseInt((await contract.getReserves())[1]) / 10 ** 12
        setReserveRdx(rdxReserve)
        setReserveWjk(wjkReserve)
      } catch (error) {
        console.log('get reserves cause cash by system')
      }
    } else alert('get Poolpair contract failed')
  }


  const [rdxExpect, setRdxExpect] = useState<any>(0)
  const [wjkExpect, setWjkExpect] = useState<any>(0)
  const [rdxMin, setRdxMin] = useState<any>(0)
  const [wjkMin, setWjkMin] = useState<any>(0)

  const addLiquidity = async () => {
    const pooContract = await getContract('POO')
    const rdxContract = await getContract('RDX')
    const wjkContract = await getContract('WJK')
    if (pooContract != null && rdxContract != null && wjkContract != null) {
      try {
        let rdxAllowance = await getRDXAllowance()
        let wkjAllowance = await getWJKAllowance()
        rdxAllowance = typeof (rdxAllowance) === 'number' ? rdxAllowance : 0
        wkjAllowance = typeof (wkjAllowance) === 'number' ? wkjAllowance : 0
        if (rdxAllowance - rdxExpect >= 0 && wkjAllowance - wjkExpect >= 0) {
          const tx = await pooContract.addLiquidity(
            parseUnits(`${rdxExpect}`, 12), parseUnits(`${wjkExpect}`, 12),
            parseUnits(`${rdxMin}`, 12), parseUnits(`${wjkMin}`, 12),
            userAccount)
          await tx.wait()
          alert('add liquidity success')
          await update()
        } else {
          let txApproveRdx, txApproveWjk, txAddLiquidity
          if (rdxAllowance - rdxExpect < 0) {
            txApproveRdx = await rdxContract.approve(PoolPair.contractAddress, parseUnits(`${rdxExpect}`, 12))
          }
          if (wkjAllowance - wjkExpect < 0) {
            txApproveWjk = await wjkContract.approve(PoolPair.contractAddress, parseUnits(`${wjkExpect}`, 12))
          }
          await txApproveRdx.wait()
          await txApproveWjk.wait()
          rdxAllowance = await getRDXAllowance()
          wkjAllowance = await getWJKAllowance()
          rdxAllowance = typeof (rdxAllowance) === 'number' ? rdxAllowance : 0
          wkjAllowance = typeof (wkjAllowance) === 'number' ? wkjAllowance : 0
          if (rdxAllowance - rdxExpect >= 0 && wkjAllowance - wjkExpect >= 0) {
            txAddLiquidity = await pooContract.addLiquidity(
              parseUnits(`${rdxExpect}`, 12), parseUnits(`${wjkExpect}`, 12),
              parseUnits(`${rdxMin}`, 12), parseUnits(`${wjkMin}`, 12),
              userAccount)
            alert('add liquidity success wait 30 seconds to see change')
            await txAddLiquidity.wait()
            await update()
          }
        }
      } catch (error) {
        alert('add liquidity cause crash by system')
      }
    } else alert('get PoolPair contract failed')
  }
  const [lpToBurn, setLpToBurn] = useState<any>(0)
  const [rdxMinBack, setRdxMinBack] = useState<any>(0)
  const [wjkMinBack, setWjkMinBack] = useState<any>(0)

  const removeLiquidity = async () => {
    const contract = await getContract('POO')
    if (contract != null) {
      try {
        let txApprovePoolPair, txRemoveLiquidity, rdlpAllowance
        rdlpAllowance = (await contract.allowance(userAccount, PoolPair.contractAddress)) / 10 ** 12
        if (rdlpAllowance - lpToBurn >= 0) {
          txRemoveLiquidity = await contract.removeLiquidity(parseUnits(`${lpToBurn}`, 12),
            parseUnits(`${rdxMinBack}`, 12), parseUnits(`${wjkMinBack}`, 12),
            userAccount)
          alert('remove liquidity success')
          await txRemoveLiquidity.wait()
          await update()
        } else {
          if (rdlpAllowance - lpToBurn < 0) {
            txApprovePoolPair = await contract.approve(PoolPair.contractAddress, parseUnits(`${lpToBurn}`, 12))
            await txApprovePoolPair.wait()
          }
          rdlpAllowance = (await contract.allowance(userAccount, PoolPair.contractAddress)) / 10 ** 12
          if (rdlpAllowance - lpToBurn >= 0) {
            txRemoveLiquidity = await contract.removeLiquidity(parseUnits(`${lpToBurn}`, 12),
              parseUnits(`${rdxMinBack}`, 12), parseUnits(`${wjkMinBack}`, 12),
              userAccount)
            alert('remove liquidity success wait 30 seconds to see change')
            await txRemoveLiquidity.wait()
            await update()
          }
        }
      } catch (error) {
        alert('remove liquidity cause crash by system')
      }
    } else alert('get PoolPair contract failed')
  }

  const rightSwapValue = useMemo(() => {
    if (reserveRdx <= 0 || reserveWjk <= 0 || leftSwapValue <= 0) {
      return 0
    }
    let tokenOutAmount
    if (leftEqualRDX) {
      tokenOutAmount = (reserveWjk * parseInt(leftSwapValue)) / (reserveRdx + parseInt(leftSwapValue))
    } else {
      tokenOutAmount = (reserveRdx * parseInt(leftSwapValue)) / (reserveWjk + parseInt(leftSwapValue))
    }
    return tokenOutAmount
  }, [leftEqualRDX, leftSwapValue, reserveRdx, reserveWjk])


  const swap = async () => {
    const rdxContract = await getContract('RDX')
    const wjkContract = await getContract('WJK')
    const pooContract = await getContract('POO')
    if (pooContract != null && rdxContract != null && wjkContract != null) {
      try {
        if (leftEqualRDX) {
          console.log('rdx')
          let rdxAllowance = await getRDXAllowance()
          if (leftSwapValue <= 0) return alert('please submit an valid amount to swap')
          if (rdxAllowance && rdxAllowance - leftSwapValue >= 0) {
            const swapTX = await pooContract.swap(RedDotToken.contractAddress,
              parseUnits(`${leftSwapValue}`, 12),
              parseUnits('0', 12))
            await swapTX.wait()
            alert('swap success')
            await update()
          } else {
            let tx = await rdxContract.approve(PoolPair.contractAddress, parseUnits(`${leftSwapValue}`, 12))
            await tx.wait()
            const swapTX = await pooContract.swap(RedDotToken.contractAddress,
              parseUnits(`${leftSwapValue}`, 12),
              parseUnits('0', 12))
            await swapTX.wait()
            alert('swap success')
            await update()
          }
        } else {
          console.log('wjk')
          let wjkAllowance = await getWJKAllowance()
          if (leftSwapValue <= 0) return alert('please submit an valid amount to swap')
          if (wjkAllowance && wjkAllowance - leftSwapValue >= 0) {
            const swapTX = await pooContract.swap(WojakToken.contractAddress,
              parseUnits(`${leftSwapValue}`, 12),
              parseUnits('0', 12))
            alert('swap success')
            await swapTX.wait()
            await update()
          } else {
            let tx = await wjkContract.approve(PoolPair.contractAddress, parseUnits(`${leftSwapValue}`, 12))
            await tx.wait()
            const swapTX = await pooContract.swap(WojakToken.contractAddress,
              parseUnits(`${leftSwapValue}`, 12),
              parseUnits('0', 12))
            alert('swap success')
            await swapTX.wait()
            await update()
          }
        }
      } catch (error) {
        alert('swap cause crash by system')
      }
    } else alert('get poolpair contract failed')

  }


  useEffect(() => {
    if (userAccount) {
      update()
    }
  }, [userAccount, update])
  useEffect(() => {
    if (account) {
      setUserAccount(account)
      if (window.localStorage.getItem('userAccount') !== account) {
        window.localStorage.setItem('userAccount', account)
      }
    }
  }, [account])
  useEffect(() => {
    if (window.localStorage.getItem('userAccount')) {
      connectWallet()
    }
  }, [connectWallet])

  return (
    <div style={{ padding: 20, flexDirection: 'row', display: 'flex' }}>
      <div style={{ minHeight: 200, padding: 50, flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column' }} >
          <h1 style={{ color: 'blue', marginRight: 25 }} >Swap</h1>
          <div style={{ display: 'flex', flexDirection: 'row' }}>
            <div style={{ display: 'flex', flexDirection: 'column', marginRight: 40 }} >
              <p>RDX available in pool:</p>
              <p style={{ fontSize: 20 }}>{reserveRdx}</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', marginLeft: 40 }} >
              <p>WJK available in pool:</p>
              <p style={{ fontSize: 20 }}>{reserveWjk}</p>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'row' }}>
            <div style={{ display: 'flex', flexDirection: 'column', marginRight: 20 }}>
              <p>{leftEqualRDX ? 'RDX' : 'WJK'}</p>
              <input style={{ marginRight: 10, width: 120 }} type='number' onChange={(e) => {
                setLeftSwapValue(e.target.value)

              }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <p>{leftEqualRDX ? 'WJK' : 'RDX'}</p>
              <input style={{ marginRight: 10, width: 120 }} type='number' disabled={true} value={rightSwapValue} />
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
            <p style={{ marginRight: 20 }}>{leftEqualRDX ? 'RDX TO WJK' : 'WJK TO RDX'}</p>
            <button style={{ alignItems: 'center', justifyContent: 'center', display: 'flex', height: 30, width: 60, marginRight: 20 }}
              type="button" onClick={() => setLeftEqualRDX(!leftEqualRDX)}>
              <p>Revert</p>
            </button>
            <button style={{ alignItems: 'center', justifyContent: 'center', display: 'flex', height: 30, width: 60, }}
              type="button" onClick={swap}>
              <p>Swap</p>
            </button>
          </div>

        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }} >
          <h1 style={{ color: 'blue', marginRight: 25 }} >Add Liquidity</h1>
          <div style={{ display: 'flex', flexDirection: 'row' }}>
            {listInputAddLiquidity}
          </div>
          <button style={{ alignItems: 'center', justifyContent: 'center', display: 'flex', height: 30, width: 60, marginTop: 20 }} type="button" onClick={addLiquidity}>
            <p>Add</p>
          </button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }} >
          <h1 style={{ color: 'blue', marginRight: 25 }} >Recall Liquidity</h1>
          <p>Your RDLP Token: {userRDLPBal}</p>
          <div style={{ display: 'flex', flexDirection: 'row' }}>
            {listInputRemoveLiquidity}
          </div>
          <button style={{ alignItems: 'center', justifyContent: 'center', display: 'flex', height: 30, width: 60, marginTop: 20 }} type="button" onClick={removeLiquidity}>
            <p>Recall</p>
          </button>
        </div>
      </div>
      <div style={{ minHeight: 200, padding: 50, flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ flexDirection: 'row', display: 'flex', alignItems: 'center' }} >
          <h1 style={{ color: 'blue', marginRight: 20 }}>
            Mint 1000 RDX for test
          </h1>
          <button style={{ alignItems: 'center', justifyContent: 'center', display: 'flex', height: 25, width: 60 }} type="button" onClick={mintRDX} >
            <p>mint </p>
          </button>
        </div>
        <p>Your RDX Balance: {userRDXBal} RDX</p>
        <div style={{ flexDirection: 'row', display: 'flex', alignItems: 'center' }} >
          <h1 style={{ color: 'blue', marginRight: 20 }}>
            Mint 1000 WJK for test
          </h1>
          <button style={{ alignItems: 'center', justifyContent: 'center', display: 'flex', height: 25, width: 60 }} type="button" onClick={mintWJK} >
            <p>mint </p>
          </button>
        </div>
        <p>Your WJK Balance: {userWJKBal} WJK</p>
      </div>
    </div>
  );
}

export default App;
