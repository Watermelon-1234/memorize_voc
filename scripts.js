function populateEndLetters() {//作為下拉式選單的內容
    var startLetter = document.getElementById("startLetter").value;
    var endLetterSelect = document.getElementById("endLetter");
    endLetterSelect.innerHTML = "<option value='' disabled selected></option>";

    var alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var startIndex = alphabet.indexOf(startLetter);
    for (var i = startIndex; i < alphabet.length; i++) {
        var letter = alphabet.charAt(i);
        var option = document.createElement("option");
        option.value = letter;
        option.innerText = letter;
        endLetterSelect.appendChild(option);
    }
}

function pickWords() {
    var startLetter = document.getElementById("startLetter").value.trim().toUpperCase();
    var endLetter = document.getElementById("endLetter").value.trim().toUpperCase();
    var numToPick = parseInt(document.getElementById("numToPick").value);
    var outputDiv = document.getElementById("outputDiv");
    //console.log(numToPick);
    if (startLetter !== '' && endLetter !== '' && numToPick ) {
        outputDiv.innerHTML = "<h2>請等等...</h2><ul>";

        pickAndOutputWords(startLetter, endLetter, numToPick)
        .then(words => {
            displayWords(words);
        })
        .catch(error => {
            console.error('Error:', error);
        });
    } else {
        outputDiv.innerHTML = "<h2>你好像漏了些甚麼沒有填喔</h2><ul>";
    }
}

function pickAllWords() {
    var startLetter = document.getElementById("startLetter").value.trim().toUpperCase();
    var endLetter = document.getElementById("endLetter").value.trim().toUpperCase();
    var outputDiv = document.getElementById("outputDiv");

    if (startLetter !== '' && endLetter !== '') {
        outputDiv.innerHTML = "<h2>請等等...</h2><ul>";
        pickall(startLetter, endLetter)
        .then(words => {
            displayWords(words);
        })
        .catch(error => {
            console.error('Error:', error);
        });
    } else {
        outputDiv.innerHTML = "<h2>你好像漏了些甚麼沒有填喔</h2><ul>";
    }
}

var api_url = 'https://script.google.com/macros/s/AKfycbxN6TKYrCfvVvxDVhM3V61TH62vj0BAUW9l05XYzWCyjYNeYDIea2MBLQhetqpePAK9/exec';

function pickAndOutputWords(startLetter, endLetter, numToPick) {
    return fetch(api_url + '?action=pickAndOutputWords&startLetter=' + startLetter + '&endLetter=' + endLetter + '&numToPick=' + numToPick)
        .then(response => response.json())
        .then(data => {
            var resultArray = data.result;
            //console.log(resultArray);
            return resultArray;
        })
        .catch(error => {
        console.error('Error:', error);
        });
}

function pickall(startLetter, endLetter) {
    return fetch(api_url + '?action=pickall&startLetter=' + startLetter + '&endLetter=' + endLetter)
        .then(response => response.json())
        .then(data => {
        var resultArray = data.result;
        //console.log(resultArray);
        return resultArray;
        })
        .catch(error => {
        console.error('Error:', error);
        });
}

function displayWords(words) {
    var outputDiv = document.getElementById("outputDiv");
    //console.log(words);
    var content = "<h2>抽到的單字：</h2><table>";
    for (var i = 0; i < words.length; i++) {
        content += "<tr><td>" + words[i][0] + "</td><td><input type=\"button\" onclick=\"showChinese(this,\'"+ words[i][1] + "\' ) \" value=\"顯示中文\"></td></tr>";
    }
    content += "</table>";
    outputDiv.innerHTML = content;
}

function showChinese(button,ch) {
    if(button.value=="顯示中文")
    {
        button.value =ch;
    }    
    else
    {
        button.value ="顯示中文";
    }
  }
  
document.addEventListener("DOMContentLoaded", function () {
    // 在这里放置你的 JavaScript 代码
    // 例如，添加事件监听器等
    document.getElementById("startLetter").addEventListener("change", populateEndLetters);
    document.getElementById("startLetter").dispatchEvent(new Event("change"));
});
