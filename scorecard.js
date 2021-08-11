// const url="https://www.espncricinfo.com/series/ipl-2020-21-1210595/mumbai-indians-vs-chennai-super-kings-1st-match-1216492/full-scorecard";
const request=require('request');
const cheerio=require('cheerio');
const xlsx=require("xlsx");

const path=require("path");
const fs=require("fs");

function processScorecard(url){
    request(url,cb);
}


function cb(error,response,html){
    if(error){
        console.log(error);
    }
    else{
        extractMatchDetails(html);
    }
}

function extractMatchDetails(html){
    
    //venue and date= .event .description
    //result = .event .status-text

    const $=cheerio.load(html);
    const matchDescriptionElem=$(".event .description");
    const resultElem=$(".event .status-text");
    const stringArr=matchDescriptionElem.text().split(",");
    const venue=stringArr[1].trim();
    const date=stringArr[2].trim();
    const matchResult=resultElem.text();
    
  
    let htmlString="";
    const inningsDetail=$(".card.content-block.match-scorecard-table>.Collapsible");
    for(let i=0;i<inningsDetail.length;i++){
        // htmlString+=$(inningsDetail[i]).html();
        let teamName=$(inningsDetail[i]).find("h5").text();
        teamName=teamName.split("INNINGS")[0].trim();

        const opponentTeamIndex=i==0?1:0;
        let opponentTeamName=$(inningsDetail[opponentTeamIndex]).find("h5").text();
        opponentTeamName=opponentTeamName.split("INNINGS")[0].trim();
        // console.log(`${venue} ${date} ${teamName} ${opponentTeamName}`);

        const currInning=$(inningsDetail[i]);
        const inningTableArr=$(currInning).find(".table.batsman tbody tr");
        for(let j=0;j<inningTableArr.length;j++){
            let allRows=$(inningTableArr[j]).find("td");
            let isWorthy=$(allRows).hasClass("batsman-cell");
            if(isWorthy){
                let playerName=$(allRows[0]).text().trim();
                let score=$(allRows[2]).text().trim();
                let balls=$(allRows[3]).text().trim();
                let fours=$(allRows[5]).text().trim();
                let sixes=$(allRows[6]).text().trim();
                let strikeRate=$(allRows[7]).text().trim();
                console.log(`${playerName} | ${score} | ${balls} | ${fours} | ${sixes} |${strikeRate} |${matchResult}`)

                processPlayer(teamName,playerName,score,balls,fours,sixes,strikeRate,opponentTeamName,date,venue,matchResult)
            }
        }
    }
    // console.log(htmlString);

}

function processPlayer(teamName,playerName,score,balls,fours,sixes,strikeRate,opponentTeamName,date,venue,matchResult){
    let teamPath=path.join(__dirname,"ipl",teamName);
    directoryCreator(teamPath);
    let filePath=path.join(teamPath,playerName+".xlsx");
    let content=excelReader(filePath,playerName);
    let playerObj = {
        teamName,
        playerName,
        score,
        balls,
        fours,
        sixes,
        strikeRate,
        opponentTeamName,
        date,
        venue,
        matchResult
    }

    content.push(playerObj);
    excelWriter(filePath,content,playerName);

}

function directoryCreator(filePath){
    if(fs.existsSync(filePath)==false){
        fs.mkdirSync(filePath);
    }
}

function excelReader(filePath,sheetName){
    if(fs.existsSync(filePath)==false){
        return [];
    }
    let wb=xlsx.readFile(filePath);
    let excelData=wb.Sheets[sheetName];
    let ans=xlsx.utils.sheet_to_json(excelData);
    return ans;
}

function excelWriter(filePath,json,sheetName){
    let newWB=xlsx.utils.book_new();
    let newWS=xlsx.utils.json_to_sheet(json);
    xlsx.utils.book_append_sheet(newWB,newWS,sheetName);
    xlsx.writeFile(newWB,filePath);

}

module.exports={
    ps:processScorecard
}