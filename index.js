
const express = require('express')
const mysql = require('mysql');
const cors = require("cors");

const port = 3002
const app = express()

app.use(express.json());
app.use(express.urlencoded({extended: true,}));
app.use(
  cors()
);

app.use(function(req,res,next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Content-Type", "application/json; charset=utf-8");
  next();
});

app.get('/:date', async (req, res) => {
    console.log("actual passed date parameter [ " + req.params.date + " ]")
    let obj = [];
    let date = req.params.date;
    const connection = await mysql.createConnection({
      host: 'test-deployment.live',
      user: 'u206225039_peter',
      password: 'Re343bnm',
      database: 'u206225039_database'
    });
    connection.connect((err) => {
      if (err) throw err;
    })
    let query_string = 
      `SELECT 
      login_info.Day, 
      login_info.login, 
      login_info.logout, 
      employees.Name 
      FROM login_info 
      INNER JOIN employees 
      ON login_info.ID=employees.ID
      WHERE login_info.Day=\"${date}\"`
    console.log("QUERY STRING : ", query_string);
    connection.query(
      query_string
      , (err,rows) => {
      if(err) throw err;//error
      for (let i = 0; i < rows.length; i++ ) {
        console.log(rows[i]);
        obj.push(
          {
            name: '', 
            date: "", 
            log: [
            ] 
          }
        )
        let login_string = rows[i].login;
        let login_num = parseInt(login_string);
        let logout_string = rows[i].logout;
        let logout_num = parseInt(logout_string);

        obj[i].name = rows[i].Name;
        obj[i].date = rows[i].Day;
        obj[i].log.push(login_num);
        obj[i].log.push(logout_num);
      }
      console.log(JSON.stringify(obj))
      res.json(obj)//else
      });
    connection.end((err) => {
      if (err) throw err;
    });
});

app.listen(port, () => {
  console.log(`app listening on port ${port}`);
});
