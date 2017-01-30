var express = require("express");
var router = express.Router();

var pg = require("pg");

var config = { database: "upsilon" };

// initialize connection Pool
// think of as 'how I connect to DB'
var pool = new pg.Pool(config);

router.get("/", function(req, res) {
  // err - an error object, will be non-null if there was some error
  //       connecting to the DB. ex. DB not running, config is incorrect
  // client - used to make actual queries against DB
  // done - function to call when we are finished
  //        returns the connection back to the pool
  pool.connect(function(err, client, done) {
    if (err) {
      console.log("Error connecting to DB", err);
      res.sendStatus(500);
      done();
    } else {
      // no error occurred, time to query
      // 1. sql string - the actual SQL query we want to running
      // 2. callback - function to run after the database gives us our result
      //               takes an error object and the result object as it's args
      client.query("SELECT * FROM tasks;", function(err, result) {
        done();
        if (err) {
          console.log("Error querying DB", err);
          res.sendStatus(500);
        } else {
          console.log("Got info from DB", result.rows);
          res.send(result.rows);
        }
      });
    }
  });
});
router.post("/", function(req, res) {
  // err - an error object, will be non-null if there was some error
  //       connecting to the DB. ex. DB not running, config is incorrect
  // client - used to make actual queries against DB
  // done - function to call when we are finished
  //        returns the connection back to the pool
  pool.connect(function(err, client, done) {
    if (err) {
      console.log("Error connecting to DB", err);
      res.sendStatus(500);
      done();
    } else {
      // no error occurred, time to query
      // 1. sql string - the actual SQL query we want to running
      // 2. array of data - any data we want to pass to a parameterized statement
      // 3. callback - function to run after the database gives us our result
      //               takes an error object and the result object as it's args
      client.query(
        "INSERT INTO tasks (task) VALUES ($1) RETURNING *;",
        [ req.body.task ],
        function(err, result) {
          done();
          if (err) {
            console.log("Error querying DB", err);
            res.sendStatus(500);
          } else {
            console.log("Got info from DB", result.rows);
            res.send(result.rows);
          }
        }
      );
    }
  });
});
router.put("/:id", function (req, res) {
  console.log("it worked");
  pool.connect(function(err, client, done) {
    //make sure there are no errors
    if (err) {
      console.log('Error connecting to DB', err);
      res.sendStatus(500);
      done();
    } else {
      //no errors, making our queryies - lives on client data
      //books is our DB $1 is a placeholder
      //always have the same # of placeholders and spots in the array
      client.query('UPDATE tasks SET task=$2, done=$3 WHERE id = $1 RETURNING *',
                  [req.params.id, req.body.task, req.body.done ],
                  function(err, result){
                    //done will be called for both so we can put it before the if statement
                    done();
                    if (err) {
                      console.log('Error updating task', err);
                      res.sendStatus(500);
                    } else {
                        //have to send a confirmtation that the data was deleted
                        res.send(result.rows);
                        console.log("result.rows", result.rows);
                    }
                  });
    }
  });
});
router.delete("/:id", function (req, res) {
  //first connect to the DB
  pool.connect(function(err, client, done) {
    //make sure there are no errors
    if (err) {
      console.log('Error connecting to DB', err);
      res.sendStatus(500);
      done();
    } else {
      //no errors, making our queryies - lives on client data
      //books is our DB $1 is a placeholder
      //always have the same # of placeholders and spots in the array
      client.query('DELETE FROM tasks WHERE id = $1',
                  [req.params.id],
                  function(err, result){
                    //done will be called for both so we can put it before the if statement
                    done();
                    if (err) {
                      console.log('Error deleting task', err);
                      res.sendStatus(500);
                    } else {
                        //have to send a confirmtation that the data was deleted
                        res.sendStatus(204);
                    }
                  });
    }
  });
});

module.exports = router;
