import math 
x = 1.000001
y = 1.000002
print(math.isclose(x,y))

price1 = 19.999
price2 = 20.0
print(math.isclose(price1,price2, rel_tol=1e-3))

distance1 = 150.002
distance2 = 150.003
print(math.isclose(distance1,distance2,abs_tol=0.001))