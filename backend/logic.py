from validation import Authorization, ChangePass



def sign_in(data: Authorization) -> bool:
    if data.login != "admin" and data.password != "pass":
        return False
    else:
        return True

def change_pass(data: ChangePass):
    if data.new != data.old:
        return None