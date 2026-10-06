data = "яблоко,банан,вишня,груша" 
fruits = data.split(",")
print(fruits)

fruit_list = ", ".join(fruits)
print(fruit_list)

path = "home/user/documents/python/lesson1"
directories = path.split("/")
print(directories)
windows_path = "\\".join(directories)
print(windows_path)