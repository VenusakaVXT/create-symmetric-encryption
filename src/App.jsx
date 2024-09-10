import { useState } from "react"

const App = () => {
    const noResult = "XXX"
    const alphapet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    const [eOrD, setEOrD] = useState(true)
    const [inputStr, setInputStr] = useState("")
    const [key, setKey] = useState("")
    const [outputStr, setOutputStr] = useState(noResult)
    const [selectedCipher, setSelectedCipher] = useState("")
    const [keyInputType, setKeyInputType] = useState("text")
    const [isKeyDisabled, setIsKeyDisabled] = useState(false)

    // caesar cipher
    const caesarEncrypt = (txt, key) => {
        return txt.split("").map(char => {
            if (char.match(/[a-z]/i)) {
                const charCode = char.charCodeAt(0)
                const base = charCode >= 65 && charCode <= 90 ? 65 : 97
                return String.fromCharCode(((charCode - base + key) % 26) + base)
            }
            return char
        }).join("")
    }

    const caesarDecrypt = (txt, key) => {
        return caesarEncrypt(txt, 26 - key)
    }

    // monoalphabetic cipher
    const generateMonoalphabeticKey = () => {
        const shuffled = alphapet.split("").sort(() => Math.random() - 0.5).join("")
        return shuffled
    }

    const monoalphabeticEncrypt = (txt, key) => {
        return txt.toUpperCase().split("").map(char => {
            const index = alphapet.indexOf(char)
            return index !== -1 ? key[index] : char
        }).join("")
    }

    const monoalphabeticDecrypt = (txt, key) => {
        return txt.toUpperCase().split("").map(char => {
            const index = key.indexOf(char)
            return index !== -1 ? alphapet[index] : char
        }).join("")
    }

    // playfair cipher
    const createPlayfairTable = (key) => {
        key = key.toUpperCase().replace(/J/g, "I").replace(/[^A-Z]/g, "")
        let table = ""
        const seen = new Set()

        for (const char of key) {
            if (!seen.has(char)) {
                seen.add(char)
                table += char
            }
        }

        for (let i = 65; i <= 90; i++) {
            const char = String.fromCharCode(i)
            if (!seen.has(char) && char !== "J") {
                seen.add(char)
                table += char
            }
        }

        return table.match(/.{1,5}/g)
    }

    const findPosition = (table, char) => {
        for (let row = 0; row < 5; row++) {
            const col = table[row].indexOf(char)
            if (col !== -1) return [row, col]
        }
        return null
    }

    const playfairEncrypt = (txt, key) => {
        const table = createPlayfairTable(key)
        txt = txt.toUpperCase().replace(/J/g, "I").replace(/[^A-Z]/g, "")
        let output = ""

        for (let i = 0; i < txt.length; i += 2) {
            let char1 = txt[i]
            let char2 = i + 1 < txt.length ? txt[i + 1] : "X"
            if (char1 === char2) {
                char2 = "X"
                i--
            }

            const [row1, col1] = findPosition(table, char1)
            const [row2, col2] = findPosition(table, char2)

            if (row1 === row2) {
                output += table[row1][(col1 + 1) % 5] + table[row2][(col2 + 1) % 5]
            } else if (col1 === col2) {
                output += table[(row1 + 1) % 5][col1] + table[(row2 + 1) % 5][col2]
            } else {
                output += table[row1][col2] + table[row2][col1]
            }
        }

        return output
    }

    const playfairDecrypt = (txt, key) => {
        const table = createPlayfairTable(key)
        let output = ""

        for (let i = 0; i < txt.length; i += 2) {
            const char1 = txt[i]
            const char2 = txt[i + 1]

            const [row1, col1] = findPosition(table, char1)
            const [row2, col2] = findPosition(table, char2)

            if (row1 === row2) {
                output += table[row1][(col1 - 1 + 5) % 5] + table[row2][(col2 - 1 + 5) % 5]
            } else if (col1 === col2) {
                output += table[(row1 - 1 + 5) % 5][col1] + table[(row2 - 1 + 5) % 5][col2]
            } else {
                output += table[row1][col2] + table[row2][col1]
            }
        }

        // output = output.replace(/(?<=.)X(?=.)/g, "")
        output = output.replace(/X$/, "")
        return output
    }

    const handleExecute = (e) => {
        e.preventDefault()
        let result = noResult
        try {
            if (selectedCipher === "") {
                alert("Please select a cipher!!!")
            } else if (selectedCipher === "caesar") {
                const numKey = parseInt(key)
                if (isNaN(numKey)) {
                    throw new Error("Caesar cipher requires a numeric key")
                }
                result = eOrD ? caesarEncrypt(inputStr, numKey) : caesarDecrypt(inputStr, numKey)
            } else if (selectedCipher === "monoalphabetic") {
                if (eOrD) {
                    const monoKey = generateMonoalphabeticKey()
                    result = monoalphabeticEncrypt(inputStr, monoKey)
                    setKey(monoKey)
                } else {
                    result = monoalphabeticDecrypt(inputStr, key)
                }
            } else if (selectedCipher === "playfair") {
                result = eOrD ? playfairEncrypt(inputStr, key) : playfairDecrypt(inputStr, key)
            }
            setOutputStr(result)
        } catch (err) {
            console.error(`Error decrypt: ${err.message}`)
            alert("Decrypting failed...")
        }
    }

    const handleReset = () => {
        setInputStr("")
        setKey("")
        setOutputStr(noResult)
        setSelectedCipher("")
        setKeyInputType("text")
        setIsKeyDisabled(false)
    }

    const handleCipherChange = (val) => {
        setSelectedCipher(val)
        switch (val) {
            case "monoalphabetic":
                setIsKeyDisabled(true)
                setKeyInputType("text")
                break
            case "caesar":
                setIsKeyDisabled(false)
                setKeyInputType("number")
                break
            case "playfair":
                setIsKeyDisabled(false)
                setKeyInputType("text")
                break
        }
    }

    return (
        <>
            <div className="container" style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                height: "85vh"
            }}>
                <h1 style={{ color: "#ff0000", fontWeight: 400, fontSize: "2.5em" }}>
                    Create Symmetric Encryption - CSE
                </h1>
                <div className="content-wrapper" style={{ width: 840 }}>
                    <div className="cipher-selection" style={{ width: 720, marginBottom: "12px", display: "flex" }}>
                        <span style={{ marginRight: "10px" }}>
                            Select {eOrD ? "encryption" : "decryption"}
                            <span style={{ marginLeft: "2px", cursor: "pointer" }} onClick={() => setEOrD(!eOrD)}>
                                🔁
                            </span>:
                        </span>
                        <div className="radio-group" style={{ width: "50%", display: "flex", justifyContent: "space-between" }}>
                            {["caesar", "monoalphabetic", "playfair"].map((cipher) => (
                                <div key={cipher}>
                                    <input
                                        type="radio"
                                        id={cipher}
                                        name="select-item"
                                        value={cipher}
                                        checked={selectedCipher === cipher}
                                        onChange={(e) => handleCipherChange(e.target.value)}
                                    />
                                    <label style={{ cursor: "pointer" }} htmlFor={cipher}>
                                        {cipher.charAt(0).toUpperCase() + cipher.slice(1)}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>
                    <form onSubmit={handleExecute}>
                        <div className="input-group" style={{ display: "flex", marginBottom: "24px" }}>
                            <div className="label-wrapper">
                                <label htmlFor="inputStr">Input String ({eOrD ? "P" : "C"}):</label>
                            </div>
                            <input
                                value={inputStr}
                                type="text"
                                id="inputStr"
                                name="input-string"
                                onChange={(e) => setInputStr(e.target.value)}
                                required
                                placeholder="Please enter input string here..."
                            />
                        </div>
                        <div className="input-group input-key" style={{ display: "flex" }}>
                            <div className="label-wrapper">
                                <label htmlFor="key">Key (k):</label>
                            </div>
                            <input
                                value={key}
                                type={keyInputType}
                                id="key"
                                name="key"
                                onChange={(e) => setKey(e.target.value)}
                                required
                                placeholder="Enter key 'k' here ('k' can be a number or string)..."
                                disabled={isKeyDisabled}
                            />
                        </div>
                        <span className="note-txt" style={{ fontStyle: "italic", fontSize: "16px", marginLeft: "190px" }}>
                            (This key k isn't entered for Monoalphabetic Cipher)
                        </span>
                        <div className="input-group" style={{ display: "flex", marginTop: "12px" }}>
                            <div className="label-wrapper"><label htmlFor="">Output String ({eOrD ? "C" : "P"}):</label></div>
                            <span>{outputStr}</span>
                        </div>
                        <div className="btn-group" style={{ display: "flex", justifyContent: "center", marginTop: "12px" }}>
                            <button className="btn" onClick={handleReset} type="button">Reset</button>
                            <button className="btn excute-btn" type="submit">Execute</button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}

export default App