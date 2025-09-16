def read_float_from_console(message: str, is_loop = True):
    while True:
        try:
            user_enter = input(message)
            result = float(user_enter)
            return result
        except ValueError:
            print(f"Аргумент неправильного типа. Невозможно привести {user_enter} к типу float.")
            if not is_loop:
                return None

def read_int_from_console(message: str, is_loop = True):
    while True:
        try:
            user_enter = input(message)
            result = int(user_enter)
            return result
        except ValueError:
            print(f"Аргумент неправильного типа. Невозможно привести {user_enter} к типу int.")
            if not is_loop:
                return None

def read_str_from_console(message: str, is_loop=True):
    while True:
        user_enter = input(message)
        if user_enter.strip() != "":
            return user_enter
        else:
            print("Введена пустая строка. Пожалуйста, введите непустое значение.")
            if not is_loop:
                return None

def read_YN_from_console(message: str, after_messages_dict = []):
    if len(after_messages_dict) > 2:
        raise IndexError("Параметр after_messages_dict функции read_YN_from_console не может иметь больше 2-х значений.")
    while True:
        user_enter = input(message)
        if user_enter.lower() == 'y':
            if len(after_messages_dict) > 0:
                print(after_messages_dict[0])
            return True
        elif user_enter.lower() == 'n':
            if len(after_messages_dict) == 2:
                print(after_messages_dict[1])
            elif len(after_messages_dict) == 1:
                print(after_messages_dict[0])
            return False
        else:
            print(f"Не удалось распознать команду.")
