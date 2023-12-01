function populateEndLetters() {//作為下拉式選單的內容
    var startLetter = document.getElementById("startLetter").value;
    var endLetterSelect = document.getElementById("endLetter");

    var alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var startIndex = alphabet.indexOf(startLetter);
    var endIndex = alphabet.indexOf(endLetterSelect.value);
    endLetterSelect.innerHTML = "<option value='' disabled selected></option>";  
    for (var i = startIndex; i < alphabet.length; i++) {
        var letter = alphabet.charAt(i);
        var option = document.createElement("option");
        option.value = letter;
        option.innerText = letter;
        endLetterSelect.appendChild(option);
    }
    if(endIndex < startIndex) {
        endLetterSelect.selectedIndex = 1;
    }
    else
    {
        endLetterSelect.selectedIndex = endIndex - startIndex +1;
    }
}

function pickWords() {
    var startLetter = document.getElementById("startLetter").value.trim().toUpperCase();
    var endLetter = document.getElementById("endLetter").value.trim().toUpperCase();
    var numToPick = parseInt(document.getElementById("numToPick").value);
    var outputDiv = document.getElementById("outputDiv");
    //console.log(numToPick);
    if (startLetter !== '' && endLetter !== '' && numToPick >0) {
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
        content += "<tr><td>"+(i+1)+"</td>";
        content += "<td>" + words[i][0] + "</td>";
        content += "<td><input type=\"button\" onclick=\"high_light(this) \" value=\"我不會\"></td>"
        content += "<td><input type=\"button\" onclick=\"showChinese(this,\'"+ words[i][1] + "\' ) \" value=\"顯示中文\"></td></tr>";
    }
    content += "</table>";
    content += "<input type=\"button\" onclick=\"toggleRowVisibility(this)\" value=\"只出現不會的字\"></input>";
    outputDiv.innerHTML = content;
}
function high_light(button) {

  var row = button.parentNode.parentNode;
  var cells = row.getElementsByTagName('td');
  var currentColor = window.getComputedStyle(cells[1]).color; 
  if(currentColor == 'rgb(255, 0, 255)') {
    // 取消高亮
    for(var i = 0; i < cells.length; i++) {
      cells[i].style.color = '#00FF00';
    }
    button.value = "我不會";
  } else {  
    // 设置高亮
    button.value = "我會了";
    for(var i = 0; i < cells.length; i++) {
      cells[i].style.color = '#FF00FF';
    }
  }


}

// Usage:
// <button onclick="high_light(this)">Highlight Row</button>
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


// 高亮颜色
var highlightColor = '#FF00FF';

// 高亮行变量
var highlightRow=false;  
function toggleRowVisibility(button) {
  
  // 获取表格所有行
  //var table = document.getElementsByTagName('table');
  var rows = document.getElementsByTagName('tr');
  // 检查是否有隐藏行
  var hasHiddenRows = false;
  var rowStyle
  for(var i = 0; i < rows.length; i++) {
    if(rows[i].style.display == 'none') {
      hasHiddenRows = true;
      break;
    }
  }

  // 切换高亮行显示状态
  if(hasHiddenRows) {//復原
    highlightRow = false;
    button.value = "只出現不會的字";
    // 遍历行
      for(i = 0; i < rows.length; i++) {
    
        // 获取行的样式
        rowStyle = window.getComputedStyle(rows[i]).display;

        if(rowStyle == 'none')//隱藏
        {
          rows[i].style.display = '';//復原
        } 
      }
  } 
  else {//隱藏
    hasHiddenRows = true;
    button.value = "顯示所有單字";
    // 遍历行
      for(i = 0; i < rows.length; i++) {
        ele=rows[i].getElementsByTagName('td');
        // 获取行的样式
        rowStyle = window.getComputedStyle(ele[1]).color;
        
        //console.log(rowStyle);
        
        
        if(rowStyle == 'rgb(255, 0, 255)')//已變色
        {
          //rows[i].style.display = '';//不用理他
        } 
        else {
          rows[i].style.display = 'none'; 
        }
      }
  }
}