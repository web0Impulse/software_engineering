from math import tan, sqrt, cos, radians
from common_lib import read_float_from_console, read_YN_from_console

def is_cos_null(degrees: float):
    return (degrees - 90) % 180 == 0.0

while True:
    try:
        x_degree = read_float_from_console("Введите x в градусах: ")
        y_degree = read_float_from_console("Введите y в градусах: ")
        sum_degree = x_degree + y_degree
        dif_degree = x_degree - y_degree
        if is_cos_null(sum_degree):
            raise Exception(f"Не существует значения тангенса для угла {sum_degree}")
        if is_cos_null(dif_degree):
            raise Exception(f"Не существует значения тангенса для угла {dif_degree}")
        if dif_degree % 180 == 0.0:
            raise Exception("Знаменатель (tan(x - y)) не может быть равен 0")
        numenator_rad = tan(radians(sum_degree))
        denominator_rad = tan(radians(dif_degree))
        quotient_rad = numenator_rad / denominator_rad
        if (quotient_rad < 0.0):
            raise Exception("Подкоренное выражение tan(x+y)/tan(x-y) не может быть отрицательным")
        print("sqrt(tan(x+y)/tan(x-y)) = ", sqrt(quotient_rad))
        if not read_YN_from_console("Запустить заново?(Y/N): ", ["Перезапуск", "До свидания"]):
            break
    except Exception as e:
        print(f"{e}. Уравнение не имеет решений.")
        if not read_YN_from_console("Запустить заново?(Y/N): ", ["Перезапуск", "До свидания"]):
            break
