phrase = "The quick brown fox jumps over the lazy dog" 
contains_fox = "fox" in phrase
print(contains_fox)

greeting = "Hello, world!"
starts_with_hello = greeting.startswith("Hello")
ends_with_world = greeting.endswith("world!")
print(ends_with_world)

text = "abc123"
is_digits = text.isdigit()
print(is_digits)

mixed_text = "Hello123"
is_alphanumeric = mixed_text.isalnum()
print(is_alphanumeric)

whitespace_text = " "
is_space = whitespace_text.isspace
print(is_space)