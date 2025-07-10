//const { use } = require("react");

document.addEventListener("DOMContentLoaded", function(){
    const searchButton= document.getElementById("search-btn");
    const usernameInput = document.getElementById("user-input");
    const statsContainer = document.querySelector(".status-container");
    const easyProgressCircle = document.querySelector(".easy-progress");
    const mediumProgressCircle= document.querySelector(".medium-progress");
    const hardProgressCircle= document.querySelector(".hard-progress");
    const easyLabel= document.getElementById("easy-label");
    const mediumLabel= document.getElementById("medium-label");
    const hardLabel= document.getElementById("hard-label");
    const cardStatsContainer= document.querySelector(".status-cards");
    
    //returnn true or false based on a regx
    function validateUsername(username){
        if(username.trim()===""){
            alert("Username should not be empty");
            return false;
        }
        const regex= /^[a-zA-Z0-9_-]{1,15}$/;
        const isMatching= regex.test(username);
        if(!isMatching){
            alert("Invalid Username");
        }
        return isMatching;
    }

    async function fetchUserDetalis(username) {
        console.log("username in fetch ",username);
        const url=`https://leetcode-stats-api.herokuapp.com/${username}`
         try{

            searchButton.textContent="searching...";
            searchButton.disabled =true;
            const response = await fetch(url);
            if(!response.ok){
                throw new Error("Unable to fetch User details");
            }
            const parsedData=await response.json();
            console.log("Logging data: ", parsedData);

            displayUserData(parsedData);
        }

        catch(error){
            statsContainer.innerHTML= `<p>${error.message}</p>`
        }
        finally{

        }
    }


    function updateProgress(solved, total, label, circle){
        const progressDegree = (solved/total)*100;
      circle.style.setProperty("--progress-degree",`${progressDegree}%`);
      label.textContent= `${solved}/${total}`;
    
    }


    function displayUserData(parsedData){
         statsContainer.hidden = false; 
         
        const totalQues = parsedData.totalQuestions;
        const totalEasyQues = parsedData.totalEasy;
        const totalMediumQues = parsedData.totalMedium;
        const totalHardQues = parsedData.totalHard;

        const solvedTotalQues = parsedData.totalSolved;
        const solvedTotalEasyQues = parsedData.easySolved;
        const solvedTotalMediumQues = parsedData.mediumSolved;
        const solvedTotalHardQues = parsedData.hardSolved;
        

        updateProgress(solvedTotalEasyQues, totalEasyQues, easyLabel,easyProgressCircle);
        updateProgress(solvedTotalMediumQues, totalMediumQues, mediumLabel,mediumProgressCircle);
        updateProgress(solvedTotalHardQues, totalHardQues, hardLabel,hardProgressCircle);

        const cardsData=[
            {
                label: "Accaptance Rate", value:parsedData.acceptanceRate
            },
            {
                label: "Ranking", value:parsedData.ranking
            },
            {
                label: "Contribution Points", value:parsedData.contributionPoints
            },
            {
                label: "Reputation", value:parsedData.reputation
            }
        ];
        console.log(cardsData);

        cardStatsContainer.innerHTML=cardsData.map(
            data => {
                return `
                <div class="card">
                <h3>${data.label}</h3> &nbsp:&nbsp 
                </br>
                <p style="color:black">${data.value}</p>
                </div>`
            }
        ).join("")

    }

    searchButton.addEventListener('click', function(){
        const username=usernameInput.value;
        console.log("logging username: ", username);
        if(validateUsername(username)){
            fetchUserDetalis(username);
        }
    })
})