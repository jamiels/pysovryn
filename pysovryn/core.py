from web3 import Web3
import requests as requests
import matplotlib.pyplot as plt
from dateutil import parser
from prettytable import PrettyTable

class LiquidityPool:
    def __init__(self,asset,contract_address='0x6E2fb26a60dA535732F8149b25018C9c0823a715'):
        self.__asset=asset
        self.__address = contract_address
    def lp_get(self):
        headers = {'Content-type': 'application/json', 'Accept': 'text/plain'}
        result = requests.post('https://backend.sovryn.app/rpc',json={"method":"custom_getLoanTokenHistory","params":[{"address":self.__address}]},headers=headers)
        return result.json()
    def history(self):
        result = self.lp_get()
        rates_table = PrettyTable(['Supply','Lend APR','Borrow APR','Timestamp'])
        for r in result:
            rates_table.add_row([r['supply'],r['supply_apr'],r['borrow_apr'],r['timestamp']])
        print(rates_table)
    def chart_history(self):
        result = self.lp_get()
        supply = []
        supply_apr = []
        borrow_apr = []
        timestamp = []
        for r in result:
            supply.append(int(r['supply']) / 100000000)
            supply_apr.append(int(r['supply_apr']) / 10000000000)
            borrow_apr.append(int(r['borrow_apr']) / 10000000000)
            timestamp.append(parser.isoparse(r['timestamp']))
        fig, ax1 = plt.subplots()
        ax2 = ax1.twinx()
        ax1.plot(timestamp,supply_apr,'b-')
        ax1.plot(timestamp,borrow_apr,'b-')
        ax2.plot(timestamp,supply,'r')
        ax1.set_xlabel('Time')
        ax1.set_ylabel('APRs', color='b')
        ax2.set_ylabel('Supply', color='r')
        plt.title('Liquidity Metrics for: ' + self.__address)
        plt.show()
    def balances(self,asset='SOV'):
        url = 'https://backend.sovryn.app/amm/pool-balance/' + asset
        r = requests.get(url).json()
        print('Contract Balance',r['contractBalanceToken'])
        print('Staked Balance',r['stakedBalanceToken'])
        print('rBTC Contract Balance',r['contractBalanceBtc'])
        print('rBTC Staked Balance',r['stakedBalanceBtc'])
        print()
 
class RSKNode:
    def __init__(self,url='https://public-node.rsk.co'):
        self.__w3 = Web3(Web3.HTTPProvider('https://public-node.rsk.co'))
    def current_block(self):
        return self.__w3.eth.block_number

