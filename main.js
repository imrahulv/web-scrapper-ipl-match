const url="https://www.espncricinfo.com/series/ipl-2020-21-1210595";

const fs=require("fs");
const path=require("path");


const request=require('request');
const cheerio=require('cheerio');


const getAllMatchesScoreCardLink =require('./allMatches');

const iplPath=path.join(__dirname,"ipl");
directoryCreator(iplPath);

request(url,cb);

function cb(error,response,html){
    if(error){
        console.log(error);
    }
    else{
        extractLink(html);
    }
}

function extractLink(html){
    const $=cheerio.load(html);
    const anchorElem=$("a[data-hover='View All Results']");
    const link=$(anchorElem).attr("href");
    const fullLink="https://www.espncricinfo.com"+link;
    // console.log(fullLink);

    getAllMatchesScoreCardLink.getAllMatchesScoreCardLink(fullLink);

}

function directoryCreator(filePath){
 if(fs.existsSync(filePath)==false){
     fs.mkdirSync(filePath);
 }
}


