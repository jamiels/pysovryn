from setuptools import setup

setup(
	name='pysovryn',
	version='0.02',
	author='Jamiel Sheikh',
	packages=['pysovryn'],
	install_requires=[
		'matplotlib',
		'web3',
		'pandas',
		'datetime',
		'requests',
        'prettytable'
	],
	include_package_data=True,
)