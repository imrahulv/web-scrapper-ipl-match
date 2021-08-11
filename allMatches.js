const request=require('request');
const cheerio=require('cheerio');

const scorecardObj = require('./scorecard');

function getAllMatches(url){
    request(url,function(error,response,html){
        if(error){
            console.log(error);
        }
        else{
           getMatchesResult(html);
        }
    })
}

function getMatchesResult(html){
    const $=cheerio.load(html);
    const anchorElem=$("a[data-hover='Scorecard']");

    for(let i=0;i<anchorElem.length;i++){
        const scoreCardLink=$(anchorElem[i]).attr("href");
        const fullScoreCardLink="https://www.espncricinfo.com"+scoreCardLink;
        console.log(fullScoreCardLink);
        scorecardObj.ps(fullScoreCardLink);

    }
    
    
}

module.exports={
    getAllMatchesScoreCardLink:getAllMatches
}