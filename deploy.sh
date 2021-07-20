python -m pip install setuptools wheel
python setup.py sdist bdist_wheel
python -m twine upload dist/*