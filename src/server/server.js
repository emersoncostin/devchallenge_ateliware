const express = require('express');
const mysql = require('mysql');
var bodyParser = require('body-parser');

const app = express();
const port = 8000;
const table ='search_results';

app.use(bodyParser.json({limit: '50mb'})); 
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' })); 
app.use(bodyParser({limit: '50mb'}));

let config = {
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PWD,
  database: process.env.MYSQL_DB,
};



app.listen(port, () => {
  console.log(`App server now listening to port ${port}`);
});

app.post('/api/save_results', (req, res) => {

    let connection = mysql.createConnection(config);
    
    let todos = [];
    let max_search_id;

    let select_query = `SELECT MAX(search_id) as Search_id FROM ${table}`

    connection.query(select_query, (error, results, fields) => {
        if(error){
            return console.error(error.message);
        }
        max_search_id = results[0].Search_id + 1;
        console.log(max_search_id)
        
        for(let i = 0; i < req.body.length; i++){

            todos.push([
                req.body[i].id, 
                max_search_id,
                req.body[i].node_id,
                req.body[i].name, 
                req.body[i].full_name,  
                req.body[i].private,
                req.body[i].html_url, 
                req.body[i].url, 
                req.body[i].stargazers_count, 
                req.body[i].language
            ])
        
        }
        let query = `insert into ${table} 
        (repository_id, search_id, node_id, name, full_name, private, html_url, url, stargazers_count, language)
        values ? `

        connection.query(query, [todos], (err, results, fields) => {
            if (err) {
                return console.error(err.message);
            }
            console.log("Linhas inseridas:" + results.affectedRows);
            connection.end();
        });

    });

    
    
    
   

  });

/* app.get('/api/results', (req, res) => {
  pool.query(`select * from ${table}`, (err, rows) => {
    if (err) {
      res.send(err);
    } else {
      res.send(rows);
    }
  });
}); */