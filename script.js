document.addEventListener("DOMContentLoaded", function () {
    let testarray = [];
    let wordcount = 0;
    let loadword = 100;
    let falsenote = [];
    let reviewmode = false;
    let show_mean_mode = false;
    const reviewbtn = document.getElementById("review");
    const countdiv = document.getElementById("count");
    const worddiv = document.getElementById("word");
    const meandiv = document.getElementById("mean");
    const nextbtn = document.getElementById("next");
    const wrong_answer_btn = document.getElementById("wrong_answer");
    const show_mean_btn = document.getElementById("show_mean");
    const wrong_answer_show_div = document.getElementById("wrong_answer_show");
    const totnumberbtn = document.getElementById("totnumberbtn");
    const totnumberline = document.getElementById("totnumberline");
    const totnumberzome = document.getElementById("totnumberzone");
    const prevbtn = document.getElementById("prev");
    loadwords(loadword);
    nextbtn.addEventListener("click", function (event) {
        wordcount++;
        if (!reviewmode && wordcount == testarray.length) {
            if (window.confirm("학습으로 바로 들어가시겠습니까??")) {
                setreviewmode()
            }
            else {
                wordcount = 0;
                displayword();
            }
        } else {
            displayword();
        }
    });
    wrong_answer_btn.addEventListener("click", function (event) {
        if (!reviewmode) {
            falsenote.push(testarray[wordcount].rowdata);
            falsenote = [...new Set(falsenote)];
            let template = falsenote.map(words => `<li>${words[0]}<br>${words[1]}</li>`).join('')
            wrong_answer_show_div.style.display = "block";
            wrong_answer_show_div.innerHTML = template;
        } else if (window.confirm("정말 삭제하시겠습니까?")) {
            wordcount = wordcount % falsenote.length
            console.log(wordcount)
            falsenote.splice(wordcount, 1)
            console.log(falsenote.length)
            if (falsenote.length == 0) {
                window.alert("학습완료")
                setreviewmode()
            } else {
                if (wordcount == falsenote.length - 1) {
                    wordcount = falsenote.length - 2
                }
                displayword()
            }
        }
    });
    reviewbtn.addEventListener("click", function (event) {
        if (falsenote.length == 0) {
            window.alert("학습 단어가 없습니다.")
        } else {
            setreviewmode()
        }
    });
    show_mean_btn.addEventListener("click", function (event) {
        // if(!reviewmode){
        show_mean_mode = !show_mean_mode;
        meandiv.innerHTML = show_mean_mode ? (reviewmode ? falsenote[wordcount % falsenote.length][1] : testarray[wordcount % testarray.length].rowdata[1]) : '';
        show_mean_btn.innerText = show_mean_mode ? "뜻 닫기" : "정답 보기";
        // }
    });
    totnumberbtn.addEventListener("click", function (event) {
        loadword = totnumberline.value;
        setreviewmode()
    });
    prevbtn.addEventListener("click", function (event) {
        wordcount = wordcount == 0 ? 0 : wordcount - 1;
        displayword()
    });
    function loadwords(cnt) {
        feturl = "http://bbasung.iptime.org:9500/shuffle?cnt=" + cnt;
        fetch(feturl, { method: "GET" }).then((rowdata) => { return rowdata.json() }).then((shuffle) => {
            testarray = shuffle
            // console.log(shuffle)
            let template = testarray[0].rowdata[0];
            worddiv.style.display = "block";
            worddiv.innerHTML = template;
            displayword()
            meandiv.innerHTML = ''
            wrong_answer_show_div.innerHTML = '';
            falsenote = [];
        })
    }
    function displayword() {
        curidx = wordcount % (reviewmode ? falsenote.length : testarray.length);
        curdata = reviewmode ? falsenote[curidx] : testarray[curidx].rowdata;
        worddiv.innerHTML = curdata[0]
        if (!reviewmode) {
            show_mean_mode = false
        }
        meandiv.innerHTML = show_mean_mode ? curdata[1] : '';
        countdiv.innerHTML = (curidx + 1) + "/" + (reviewmode ? falsenote.length : testarray.length);
        // show_mean_mode=false;
        show_mean_btn.innerText = "정답 보기";
    }
    function setreviewmode() {
        wordcount = 0;
        reviewmode = !reviewmode;
        if (reviewmode) {
            testarray = falsenote
            displayword();
            wrong_answer_show_div.innerHTML = '';
        }
        else {
            loadwords(loadword);
        }
        reviewbtn.innerText = reviewmode ? "wordnote" : "오답노트";
    }
});