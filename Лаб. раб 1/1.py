from math import sin, cos, radians
from common_lib import read_float_from_console

x = read_float_from_console("Введите x в градусах: ")
y = read_float_from_console("Введите y в градусах: ")


result = cos(radians(x))**2 - sin(radians(y))**2
print("cos(x)^2 - sin(y)^2 = ", result)
