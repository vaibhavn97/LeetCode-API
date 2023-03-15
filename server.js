// Importing Modules
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const _ = require('lodash');
const e = require('express');



// Configuring Application
const PORT = process.env || 8000;
app.use(bodyParser.urlencoded({extended:true}));


// Configuration of DB
mongoose.connect('mongodb://127.0.0.1:27017/leetcode');
const leetCodeSchema = mongoose.Schema({
    stat: Object,
    paid_only : Boolean,
    difficulty : Object,
})

const leetCodeModel = mongoose.model('questions', leetCodeSchema);



// Problem Route
let level = ['easy', "medium", "hard"];
app.get('/problems/:name', (req, res)=>{
    let query = req.params.name;
    // All Questions
    if(query=="all"){
        leetCodeModel.find({}, (err, result)=>{
            if(err){
                res.send(err);
            }
            else{
                res.send(result);
            }

        })
    }
    else{
        leetCodeModel.findOne({'stat.question__title' : req.params.name}, (err, result)=>{
            if(err){
                res.send(err);
            }
            else{
                if(result==null || result.stat==undefined){
                    res.send("Not Found")
                }
                else{
                    let response = {
                        id : result.stat.question_id,
                        question_name : result.stat.question__title,
                        total_submitted : result.stat.total_submitted,
                        total_accepted : result.stat.total_acs,
                        difficulty : level[result.difficulty.level-1],
                        is_paid : result.paid_only
                    }
                    res.send(response);
                }
            }
        });
    }
});


app.get('/problems/level/:name', (req, res)=>{
    let query = req.params.name;
    if(query == "all"){
        leetCodeModel.find({}, (err, result)=>{
            if(err){
                res.send(err);
            }
            else{
                res.send(result);
            }

        })
    }
    else{
        leetCodeModel.find({'difficulty.level' : Number(level.indexOf(query)+1)}, (err, result)=>{
            if(err){
                res.send(err);
            }
            else{
                // console.log(result);
                if(result==null || result.length==0){
                    res.send("Not Found");
                }
                else{
                    let question_name = [];
                    result.forEach(element => {
                        question_name.push(element.stat.question__title);
                    });
                    res.send({question_name : question_name});
                }
            }
        });
    }
})





// Server Starting
app.listen(PORT, ()=>{
    console.log(`The Server Running at ${PORT}`);
});
