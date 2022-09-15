String.prototype.replaceAll = (search, replacement) => this.split(search).join(replacement);
const getRandomColor = () => '#' + Math.floor(Math.random()*16777215).toString(16);

let ansDiv = document.createElement('div');
ansDiv.id = 'ansDiv';
document.body.appendChild(ansDiv);

let div = document.createElement('div');
div.id= 'buttonContainer'
ansDiv.appendChild(div);


let ul = document.createElement('ul');
ul.id = 'buttonList';
div.appendChild(ul);

// ansDiv.style.marginTop = '800px'
// ansDiv.style.marginLeft = '400px'
// ansDiv.style.marginRight = '400px'
ansDiv.style.padding = '20px'
ansDiv.style.border = `8px solid ${getRandomColor()}`


// center ansdiv realtive to whole page
ansDiv.style.position = 'fixed';
ansDiv.style.top = '50%';
ansDiv.style.left = '50%';
ansDiv.style.transform = 'translateX(-50%)';
ansDiv.style.marginTop = '400px'




let next = document.createElement('button')
let ans = document.createElement('button')
let ansUp = document.createElement('button')
let ansDown = document.createElement('button')
let ansFontUp = document.createElement('button')
let ansFontDown = document.createElement('button')
let getAllAnswers = document.createElement('button')
let anz = document.createElement("p")

let buttons = [next, ans, ansUp, ansDown, ansFontUp, ansFontDown, getAllAnswers]
buttons.forEach((button) => {
    // create list items with buttons and no dots
    let li = document.createElement('li');
    li.style.listStyleType = 'none';
    li.style.display = 'inline';

    li.appendChild(button);
    ul.appendChild(li);



    // tranparent background black board
    button.style.backgroundColor = 'transparent';
    button.style.borderColor = getRandomColor();
    button.style.borderWidth = '5px'
    button.style.textAlign = 'center';

    // create space between each button
    button.style.margin = '5px';
    button.style.padding = '5px';


})

next.innerText = 'Next Question'
ans.innerText = 'Reveal Answer'
ansUp.innerText = 'Move Answer Up'
ansDown.innerText = 'Move Answer Down'
ansFontUp.innerText = 'Font Size Increase'
ansFontDown.innerText = 'Font Size Decrease'
getAllAnswers.innerText = 'Get All Answers'


ansFontUp.addEventListener('click', () => {
    ansDiv.style.fontSize =  ansDiv.style.fontSize === "" ?  '22px' : `${parseInt(ansDiv.style.fontSize.split('px')[0]) + 1}px`
})

ansDiv.addEventListener('keypress', (e) => {
    switch (e.key) {
        case "ArrowUp":
        case "Up":
            ansDiv.style.marginTop = `${parseInt(ansDiv.style.marginTop.split('px')[0]) - 15}px`
            break;
        case "Right":
        case "ArrowRight":
            ansDiv.style.marginTop = `${parseInt(ansDiv.style.marginRight.split('px')[0]) - 15}px`
            break;
        case "Left":
        case "ArrowLeft":
            ansDiv.style.marginTop = `${parseInt(ansDiv.style.marginLeft.split('px')[0]) - 15}px`
            break;
        case "ArrowDown":
        case "Down":
            ansDiv.style.marginTop = `${parseInt(ansDiv.style.marginTop.split('px')[0]) - 15}px`
            break;
    }
})

ansFontDown.addEventListener('click', () => {
    ansDiv.style.fontSize = ansDiv.style.fontSize === "" ?  '22px' : `${parseInt(ansDiv.style.fontSize.split('px')[0]) - 1}px`
})

ansUp.addEventListener('click', () => {
    ansDiv.style.marginTop = `${parseInt(ansDiv.style.marginTop.split('px')[0]) - 15}px`
})

ansDown.addEventListener('click', () => {
    ansDiv.style.marginTop = `${parseInt(ansDiv.style.marginTop.split('px')[0]) + 15}px`
})

next.addEventListener('click', () => {
    FAQ.next_question()
})

ans.addEventListener('click', () => {
    anz.innerText = ""
    const answer = getAnswer(FAQ.current_question)
    anz.innerText = answer.join('\n\n')
    ansDiv.appendChild(anz)
});

getAllAnswers.addEventListener('click', () => {
    const questions = FAQ.questions
    const map = new Map()
    questions.forEach((question) => {
        let questionText = question.original_atts.question_text
        let ans = `Failure getting answer for ${JSON.stringify(question.original_atts)}`
        try { ans = getAnswer(question) } catch (e) {  }
        map.set(questionText, ans)
    })

    // copy map to clipboard
    let text = ''
    map.forEach((value, key) => text += `${key}\n\n${value}\n\n\n\n`)
    text.replaceAll(",", "")
    navigator.clipboard.writeText(text).then(_ => console.log('copied to clipboard'))
});




const getAnswer = (question) => {
    let answer = []

    if (!question) {
        answer.push("You arent on a question page")
        return
    }

    switch (question.type)
    {
        case "multiselect":
            let choices = document.getElementsByClassName("mc_choice ui-draggable ui-draggable-handle")
            let choicess = question.choices.map(i => i.text)
            for (let j = 0 ; j < choices.length; j++)
            {
                let dragableBox = choices[j]
                let text = dragableBox.children[1].firstChild.textContent
                let index = choicess.indexOf(text)
                let ans = question.correct_answer[index]
                dragableBox.style.border = `8px solid ${ans == 'true' ? 'green' : 'red'}`
            }

            for (let i = 0; i < question.choices.length; i++)
            {
                let ans = question.correct_answer[i]
                let choice = question.choices[i].text
                let correct_ans_field = question.correct_answer_area_label
                let incorrect_ans_field = question.incorrect_answer_area_label
                let field = ans === 'true' ? correct_ans_field : incorrect_ans_field
                answer.push(`${choice} -> ${field}\n\n`)
            }
            break;
        case "matching":
            for (let i = 0; i < question.correct_answer.length; i++)
            {
                let ans = question.correct_answer[i]
                let target = question.targets[ans].text ? question.targets[ans].text : question.targets[ans]
                let label = question.labels[i].text ? question.labels[i].text : question.labels[i]
                answer.push(`${label.substring(0, 15)}... -> ${target}\n\n`)
            }
            break;
        case "dragdrop":
        case "dragblanks":
            let ex = question.labels ? question.labels : question.targets
            answer.push(JSON.stringify(ex))
            let correct_ans = question.correct_answer;
            for (let i = 0; i < correct_ans.length; i++)
            {
                let ans = correct_ans[i]
                let ansLength = ans.length

                if (ansLength === 1)
                {
                    let target = ex[ans].text ? ex[ans].text : ex[ans]
                    answer.push(`${i + 1} -> ${target} \n\n`)
                }
                else
                {
                    for (let j = 0; j < correct_ans[i].length; j++)
                    {
                        let index = correct_ans[i][j]
                        //  let target = ex[index].text ? ex[index].text : ex[index]

                        answer.push(`{${i + 1}} -> ${JSON.stringify(ex[index])}`)
                    }
                }
            }
            break;
        case "imageclick":
            let index = question.correct_answer.indexOf('true')
            let option = question.choices[index]
            let choice = option.choice
            let text = option.text
            answer.push(`Label -> ${choice} | Text -> ${text}`)
            break;
        case "truefalse":
            answer.push(`ANSWER -> ${question.correct_answer}`)
            break;
        case "ordering":
            let str = ""
            let anzers = question.correct_answer
            anzers.map((anzzz, index) => str += `${index} | ${anzzz} \n\n`)
            answer.push(str)
            break;
        case "multichoice":
            let ans = question.correct_answer;
            let answers = question.choices
            let final_ans = answers[ans].text ? answers[ans].text : answers[ans]
            answer.push(`ANSWER -> ${final_ans}`)
            break;
        default:
            answer.push(`No answer for type ${question.type} | Possible answer -> ${question.correct_answer}`)
    }
    return answer
}

