from pysovryn import RSKNode, LiquidityPool

n = RSKNode()
print(n.current_block())

# rbtc_lp = LiquidityPool(contract_address='0x6E2fb26a60dA535732F8149b25018C9c0823a715')
# rbtc_lp.print()
# rbtc_lp.chart()


sov_lp = LiquidityPool('SOV')
sov_lp.balances()
sov_lp.history()
sov_lp.chart_history()


'''from pysovryn import RSKNode, LiquidityPools

n = RSKNode()
n.current_block()

rbtc_lp = LiquidityPools(contract_address='0x6E2fb26a60dA535732F8149b25018C9c0823a715')
rbtc_lp.print()
rbtc_lp.chart()'''
