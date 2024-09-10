# Create Symmetric Encryption - CSE
**Create Symmetric Encryption - CSE** is an application used to encode/decode based on 3 encryption methods: **Caesar**, **Monoalphabetic** and **Playfair Cipher**.

I did this project after studying a lecture at school on the subject "Network Information System Safety and Security". After teaching about symmetric encryption methods, the lecturer gave the homework assignment to reprogram the algorithm of those methods.

And here is the project I did for that homework. Below is a summary of the knowledge of 3 encryption methods that I have applied to the project.

## Caesar Cipher
**Caesar Cipher** is a simple form of substitution encoding in which each character in the original text is replaced by another letter in the alphabet, shifted by a fixed number of steps. For example, with a shift of 3, "A" will become "D", "B" will become "E".

### Recipe
- Encrypt: ```C = (P + k) mod26```
- Decrypt: ```P = (C - k) mod26```
- In which, C is the encoded character, P is the plaintext character and k is the number of displacement steps.

![image](https://github.com/user-attachments/assets/1b8831e6-a18d-4f7a-93be-89f3eb469ec9)

## Monoalphabetic Cipher
**Monoalphabetic Cipher** is a type of substitution cipher, but differs from Caesar cipher in that each letter of the alphabet is replaced by another letter at random. This substitution has no fixed displacement rules.

**Example**: If the substitution table is {A -> X, B -> M, C -> O, ...}, then the text "ABC" will be encoded as "XMO".

![image](https://github.com/user-attachments/assets/b4c238e7-9cb8-412f-81b2-c92f07c7f3a6)

## Playfair Cipher
**Playfair Cipher** is a type digraph substitution cipher in which a pair of characters (digraph) in the original text is encoded into another pair of characters based on a 5x5 table containing a keyword.

### Procedure
**1. Create a 5x5 table**: Contains letters from A-Z (remove the letter "J", or combine "I" and "J" into one cell).

**2. Text processing**: Original text is divided into pairs of characters. If there are two identical characters in a pair, an "X" is inserted in between.

**3. Encoding**: Depending on the position of the character pair in the table, different encoding rules are applied:
- **If two characters are in the same row**: Replace with the characters immediately to the right.
- **If two characters are in the same column**: Replace with the characters immediately below.
- **If not in the same row or column**: Replace with characters located in opposite corners in the rectangle created by the two original characters.

![image](https://github.com/user-attachments/assets/bb73c01b-299d-4c32-8aaf-f7c6bc65f77e)
