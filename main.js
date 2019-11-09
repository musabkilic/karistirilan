word = document.getElementById("word");

a = document.getElementById("a");
b = document.getElementById("b");

loop_started = false;

function moveProgTo(new_width) {
    progress = document.getElementById("true_prog");
    width = progress.style.width.slice(0,-1)*1;
    if(loop_started)clearInterval(loop);
    if(new_width==0){
        progress.style.width = "0%";
        progress.innerHTML = "0%";
    }else{
        loop_started = true;
        loop = setInterval(frame, 1);
        width_bigger = width>new_width;
        function frame() {
            if ((width==new_width) || (width_bigger && width <= new_width) || (!width_bigger && width > new_width)) {
                progress.style.width = new_width + "%";
                progress.innerHTML = ((new_width*1)|0) + "%";
                clearInterval(loop);
            } else {
                width += width_bigger ? -0.1 : 0.1;
                progress.style.width = width + "%";
                progress.innerHTML = ((width*1)|0) + "%";
            }
        }
    }
}

function range(x){
    R = [];
    for(i=0;i<x;i++){
        R.push(i);
    }
    return R
}
function capitalize(x){
    capitalized = "";
    for(i of Array.from(x.split(" "))){
        upper = i[0].toUpperCase()
        if(i[0]=="i")upper="İ";
        capitalized+=upper+i.slice(1)+" ";
    }
    return capitalized;
}
function setAnswers(l){
    a.innerHTML=capitalize(l[0]).slice(0,l[0].length);
    b.innerHTML=capitalize(l[1]).slice(0,l[1].length);
}
function moveProg(){
    moveProgTo(true_answers/question_index*100);
}
function setQuestion(true_answer,false_answer){
    solved = false;
    document.getElementById("continue_true").style.display="none";
    document.getElementById("continue_false").style.display="none";
    document.getElementById("continue").style.display="";

    for(button of Array.from(document.getElementsByTagName("button"))){
        if(button.className.startsWith("custom_button") && !button.className.endsWith("custom_button")){
            button.className = "custom_button not_selected";
        }
    }

    rand = Math.random();
    if(rand>0.5){
        l = [false_answer,true_answer];
    }else{
        l = [true_answer,false_answer];
    }
    index = (rand>0.5)*1;

    setAnswers(l);
    for(button of Array.from(document.getElementsByTagName("button"))){
        if(button.className.startsWith("custom_button") && !button.className.endsWith("custom_button"))
            button.onclick = function control(){
                id = "ab".indexOf(this.getAttribute("id"));
                if(!solved){
                    if(id == index){
                        this.className = "custom_button true";
                        document.getElementById("continue_true").style.display="";
                        document.getElementById("continue").style.display="none";
                        true_answers+=1;
                    }else{
                        this.className = "custom_button false";
                        document.getElementById("continue_false").style.display="";
                        document.getElementById("continue").style.display="none";
                    }
                    moveProg();
                }
                solved = true;
            }
    }
}
function changeQuestion(){
    question_id = questions[question_index];
    false_answer = Object.keys(words)[question_id];
    true_answer = words[false_answer];
    document.getElementById("question_id").innerHTML = "Soru "+(question_index+1)+"/50";
    setQuestion(true_answer,false_answer);
    question_index++;
    if(question_index>=Object.keys(questions).length){
        end();
    }
}

function shuffle(a) {
    let l = new Array(a.length);
    for(let i=0; i<a.length; i++){
      n = Math.floor(Math.random()*(a.length-i));
      l[i] = a[n];
      a = a.slice(0, n).concat(a.slice(n+1, a.length));
    }
    return l;
}
function end(){
    document.getElementById("questions").style.display = "none";
    document.getElementById("show_results").style.display = "";
    end_time = (new Date()).getTime()/1000;
    time_passed = end_time-start_time;
    time_passed_minute = (time_passed/60) | 0;
    time_passed_seconds = (time_passed%60) | 0;

    document.getElementById("result_text").innerHTML=
    Object.keys(questions).length+" Kelimeden</br>"+
    true_answers+" Tanesini,</br>"+
    time_passed_minute+" Dakika</br>"+
    time_passed_seconds+" Saniyede</br>"+
    "Doğru Yaptın!"
}
function start(){
    document.getElementById("start").style.display = "none";
    document.getElementById("show_results").style.display = "none";
    document.getElementById("questions").style.display = "";
    document.getElementById("false_prog").style.display = "";
    start_time = (new Date()).getTime()/1000;
    questions = range(Object.keys(words).length);
    questions = shuffle(questions);
    questions = questions.slice(0,50);
    question_index = 0;
    true_answers = 0;
    moveProgTo(0);
    changeQuestion();
}
document.getElementById("start_text").innerHTML=Object.keys(words).length+" Kelimenin Kaçının Yazımını Doğru Biliyorsun?";
document.getElementById("start_button").onclick=start;
document.getElementById("start_again").onclick=start;
document.getElementById("continue_true").onclick = changeQuestion;
document.getElementById("continue_false").onclick = changeQuestion;
document.getElementById("continue").onclick = function(){moveProg();changeQuestion();};
