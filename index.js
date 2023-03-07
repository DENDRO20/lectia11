const http = require('http');
const path = require('path');
const fs = require('fs');
const url = require('url');

const data = path.join(__dirname, 'data');
const server = http.createServer((request, response)=>{
    if(request.url == '/joc' && request.method == 'GET'){
        getAll(request, response);
    }
    if(request.url == '/joc' && request.method == 'POST'){
        addJoke(request, response);
    }
    if(request.url.startsWith('/like')){
        like(request, response);
    }
    if(request.url.startsWith('/dislike')){
        dislike(request, response);
    }
});

server.listen(3000);

function getAll(request, response){
    let dir = fs.readdirSync(data);
    let all = [];
    for(let i = 0;i<dir.length;i++){
        let file = fs.readFileSync(path.join(data, i+'.json'));
        let file_gluma = Buffer.from(file).toString();
        let glume = JSON.parse(file_gluma);
        glume.id = i;
        all.push(glume);
    }
    response.end(JSON.stringify(all));
}

function addJoke(request, response){
    let date = '';
    request.on('data', function(c){
        date += c;
    })
    request.on('end', function(){
        let joke = JSON.parse(date);
        joke.likes = 0;
        joke.dislike = 0;
        let dir = fs.readdirSync(data);
        let fileName = dir.length+'.json';
        let filePath = path.join(data,fileName);
        fs.writeFileSync(filePath, JSON.stringify(joke));

        response.end();
    })
}

function like(request, response){
    const url = require('url');
    const params = url.parse(request.url, true).query;
    let id = params.id;
    console.log(id);

    if(id){
        let filePath = path.join(data, id+'.json');
        let file = fs.readFileSync(filePath);
        let jokeJSON = Buffer.from(file).toString();
        let joke = JSON.parse(jokeJSON);

        joke.like++;
        fs.writeFileSync(filePath,JSON.stringify(joke));
    }
    response.end();
}

function dislike(request, response){
    const url = require('url');
    const params = url.parse(request.url, true).query;
    let id = params.id;
    console.log(id);

    if(id){
        let filePath = path.join(data, id+'.json');
        let file = fs.readFileSync(filePath);
        let jokeJSON = Buffer.from(file).toString();
        let joke = JSON.parse(jokeJSON);

        joke.dislike++;
        fs.writeFileSync(filePath,JSON.stringify(joke));
    }
    response.end();
}