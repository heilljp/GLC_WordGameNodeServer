

// 1. 서버 사용을 위해서 http 모듈을 http 변수에 담는다. (모듈과 변수의 이름은 달라도 된다.) 
var http = require('http');  


// 2. http 모듈로 서버를 생성한다.
//    아래와 같이 작성하면 서버를 생성한 후, 사용자로 부터 http 요청이 들어오면 function 블럭내부의 코드를 실행해서 응답한다.
var server = http.createServer(function(request,response){ 

   // response.writeHead(200,{'Content-Type':'text/html'});
   // response.end('Hello node.js!!');
 
    response.writeHead(200,{'Content-Type':'application/json', 
                            'Access-Control-Allow-Origin':'*', 
                            "Access-Control-Allow-Headers" : "Origin, X-Requested-With, Content-Type, Accept"
                        });
    
                        

    request.on('data', function(data){
        console.log(data);
    });
         
 
    var Connection = require('tedious').Connection;  
    var config = {  
        server: 'localhost',  //update me
        authentication: {
            type: 'default',
            options: {
                userName: 'sa', //update me
                password: 'kds'  //update me
            }
        },
        options: {
            // If you are on Microsoft Azure, you need encryption:
            trustServerCertificate: false,
            encrypt: false,
            database: 'BKKDS',   //update me
            port:1433,
            enableArithAbort: true,
            //connectionIsolationLevel: ISOLATION_LEVEL.READ_UNCOMMITTED
        }
    };  
 

    //console.log("dddddd",  request.url.split('&')[1]);

    try{
        var connection = new Connection(config);  
        connection.on('connect', function(err) {  

            //console.log(err);

        // If no error, then good to proceed.
        //console.log("Connected");  
//console.log('1');
        if (err) {
            console.error(err.message);
          } else {
            // 쿼리 실행
            executeStatement();
          }
        
        //executeStatement();  

        });
    
//        console.log('2');
        connection.connect();
        //console.log('3');

    }catch(err){

        console.log("errr");  
    }
    
    var Request = require('tedious').Request;  
    var TYPES = require('tedious').TYPES;  
     
    var returndata=[]; 

    function executeStatement() {  
        var request = new Request("SELECT [wordEng], [wordKor], [sound], [img] FROM GLC.dbo.[WORD];", function(err) {  
        if (err) {  
            console.log(err);}  
        });  
//console.log(request);

            request.on('row', function(columns) {  
//console.log('--------------------------------------------------');
            columns.forEach(function(column) {  
              if (column.value === null) {  
                console.log('NULL');  
              } else {  
                //result+= column.value + " ";  

                //console.log("%s\t%s", column.metadata.colName, column.value);
                    //var colnm = column.metadata.colname;
                    //var colvalue = column.value;
               // response.write(JSON.stringify())

              }  
            });  
            //console.log(result);  
            //result ="";  
 
            //response.write(JSON.stringify({mstdata : columns}, null, 2));

            var objt={}; 
            columns.forEach(column =>{
                objt[column.metadata.colName]=column.value;
            });

            returndata.push(objt);

            //console.log(returndata);
            //console.log("data:",JSON.stringify(returndata));
 
        });  
   
        //response.write(JSON.stringify({returnDATA : returndata}, null, 2));
        // response.end(returndata);
 

        request.on('done', function(rowCount, more) {  
            conso.log(rowCount + ' rows returned');  

        });  
        
        // Close the connection after the final event emitted by the request, after the callback passes
        request.on("requestCompleted", function (rowCount, more) {
            
            //console.log("mstData:",JSON.stringify(returndata));
            //response.write(JSON.stringify({mstData : returndata}, null, 3)); 
            //response.statusCode = 201;
            response.end(JSON.stringify(returndata)); 
            
            
            //response.write(returndata); 
            
            //response.end;
            

            connection.close();

            console.log('---------------------------------------------------------------------------------------------------------');

        });


        connection.execSql(request);  
    }  

});

// 3. listen 함수로 8080 포트를 가진 서버를 실행한다. 서버가 실행된 것을 콘솔창에서 확인하기 위해 'Server is running...' 로그를 출력한다
server.listen(8080, function(){ 
    console.log('Server is running...');
});






 