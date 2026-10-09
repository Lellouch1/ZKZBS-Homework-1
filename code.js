//data z excelu cviceni_01
const CZ_FREQUENCIES = {
    a: 0.09589269, b: 0.01776120, c: 0.02999077, d: 0.03774841, e: 0.10904081,
    f: 0.00175060, g: 0.00219812, h: 0.02497482, i: 0.06686138, j: 0.02305759,
    k: 0.03528082, l: 0.05720782, m: 0.03605450, n: 0.05917244, o: 0.08029999,
    p: 0.03114961, q: 0.00005933, r: 0.04396827, s: 0.05585970, t: 0.05385289,
    u: 0.03579031, v: 0.03952464, w: 0.00054266, x: 0.00035910, y: 0.02857512,
    z: 0.03302643
};
//tlačítka
window.addEventListener("DOMContentLoaded", () => {
    document.getElementById("runBtn").addEventListener("click", runFrequencyAnalysis);
});
//posun 025
function solveStreamShift(streamChars) {
    const n = streamChars.length;
    const counts = new Array(26).fill(0);
    for (let i = 0; i < n; i++) {
        counts[streamChars.charCodeAt(i) - 97]++;
    }

    let bestShift = 0;
    let minChi2 = Infinity;

    for (let shift = 0; shift < 26; shift++) {
        let chi2 = 0;
        for (let c = 0; c < 26; c++) {
            const letter = String.fromCharCode(97 + c);
            const expected = n * CZ_FREQUENCIES[letter];
            const cipherCode = (c + shift) % 26;
            const observed = counts[cipherCode];
            chi2 += ((observed - expected) ** 2) / expected;
        }

        if (chi2 < minChi2) {
            minChi2 = chi2;
            bestShift = shift;
        }
    }

    return {
        shift: bestShift,
        char: String.fromCharCode(97 + bestShift)
    };
}

function runFrequencyAnalysis() {
    const rawText = document.getElementById("cipherInput").value;
    const clean = rawText.toLowerCase().replace(/[^a-z]/g, "");

    if (clean.length < 3) {
        alert("Zadejte prosím šifrový text obsahující alespoň 3 písmena.");
        return;
    }
    //3 proudy
    const streams = ["", "", ""];
    for (let i = 0; i < clean.length; i++) {
        streams[i % 3] += clean[i];
    }

    const keyChars = [];
    for (let s = 0; s < 3; s++) {
        const res = solveStreamShift(streams[s]);
        keyChars.push(res.char);

        document.getElementById(`s${s}-count`).textContent = streams[s].length;
        document.getElementById(`s${s}-shift`).textContent = `posun o ${res.shift}`;
        document.getElementById(`s${s}-char`).textContent = res.char.toUpperCase();
    }

    const finalKey = keyChars.join("");
    document.getElementById("finalKey").textContent = finalKey.toUpperCase();

    const decrypted = [];
    for (let i = 0; i < clean.length; i++) {
        const cCode = clean.charCodeAt(i) - 97;
        const shift = finalKey.charCodeAt(i % 3) - 97;
        const pCode = ((cCode - shift + 26) % 26) + 97;
        decrypted.push(String.fromCharCode(pCode));
    }

    document.getElementById("plainOutput").value = decrypted.join("");
    document.getElementById("resultsSection").style.display = "block";
    document.getElementById("resultsSection").scrollIntoView({ behavior: "smooth" });


    navigator.clipboard.writeText(plainText).then(() => {
        const btn = document.getElementById("copyBtn");
        btn.textContent = "Zkopírováno!";
        setTimeout(() => { btn.textContent = "Kopírovat text"; }, 1500);
    });
}