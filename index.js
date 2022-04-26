const express = require('express')
const {Pool, Client} = require('pg')
const fs =require('fs')
var cors = require('cors')
const pool = new Pool(
{host: 'dev.viaviedge.net',
user: 'postgres',
password:'VIAVI',
database:'pni',
max: 20,
idleTimeoutMillis: 30000,
connectionTimeoutMillis: 2000})


const app = express()

const port = 3200
app.use(cors())
app.use(express.json())


app.get('/kpi/getstattype', async (req,res,next)=>{
	const client = await pool.connect()

       await client.query("SELECT DISTINCT(STAT_TYPE_NAME) FROM KPI_MASTER ORDER BY STAT_TYPE_NAME", (err, result)=>{
            if(err){next(err) }
           res.send(result["rows"]) 
		   client.release()
		   
        }
    )})


app.get('/kpi/getAll/', async (req,res,next)=>{
	const client = await pool.connect()

       await client.query("SELECT NAME,STAT_TYPE_NAME FROM KPI_MASTER ORDER BY STAT_TYPE_NAME", (err, result)=>{
            if(err){next(err) }
           res.send(result["rows"]) 
		   client.release()
		   
        }
    )})
	
	
app.get('/kpi/getperstat/', async (req,res,next)=>{
	const client = await pool.connect()

    const sqlText = "SELECT NAME FROM KPI_MASTER WHERE STAT_TYPE_NAME = $1"
	const values =[req.query.stat_type]
	console.log(values)
       await client.query(sqlText,values, (err, result)=>{
            if(err){next(err) }
           res.send(result["rows"]) 
		   client.release()
		   
        }
    )})	
	
	
let assetlst=[{"assetId":1,"id":"MICROSOFT NG CORE 1001","type":"Core","ipAddress":"192.168.17.23","activatedDate":"2021-04-12 11:00:00","networkFunction":"CU","versionNo":1.0},
{"assetId":2,"id":"COREIP-2","type":"Core","ipAddress":"192.168.134.23","activatedDate":"2021-04-12 11:05:00","networkFunction":"DU","versionNo":1.1},
{"assetId":3,"id":"COREIP-3","type":"Core","ipAddress":"192.168.134.23","activatedDate":"2021-04-12 11:05:00","networkFunction":"DU","versionNo":"1.1.1"},
{"assetId":4,"id":"Airspan-2200-1","type":"gNB","ipAddress":"192.168.5.23","activatedDate":"2021-04-12 11:10:00","networkFunction":"CU","versionNo":"1.2"},
{"assetId":5,"id":"Airspan-2201-2","type":"gNB","ipAddress":"192.168.1.23","activatedDate":"2021-04-12 11:15:00","networkFunction":"CU","versionNo":"1.3"},
{"assetId":6,"id":"Airspan-2201-3","type":"gNB","ipAddress":"192.168.15.23","activatedDate":"2021-04-12 11:15:00","networkFunction":"CU","versionNo":"1.4"},
{"assetId":7,"id":"IoA-3248-1","type":"IoA","ipAddress":"192.168.17.37","activatedDate":"2021-04-12 11:45:00","networkFunction":"DU","versionNo":"1.4"},
{"assetId":8,"id":"IoA-3248-2","type":"IoA","ipAddress":"192.168.14.23","activatedDate":"2021-04-12 11:57:00","networkFunction":"CP","versionNo":"1.5"},
{"assetId":9,"id":"IoA-3248-3","type":"IoA","ipAddress":"192.168.17.37","activatedDate":"2021-04-12 11:45:00","networkFunction":"DU","versionNo":"1.4"},
{"assetId":10,"id":"IoA-3248-4","type":"IoA","ipAddress":"192.168.14.23","activatedDate":"2021-04-12 11:57:00","networkFunction":"CP","versionNo":"1.5"},
{"assetId":11,"id":"X-edge-3216-1","type":"X-edge","ipAddress":"192.168.1.37","activatedDate":"2021-04-12 11:45:00","networkFunction":"DU","versionNo":"1.4"},
{"assetId":12,"id":"X-edge-3216-2","type":"X-edge","ipAddress":"192.168.1.23","activatedDate":"2021-04-12 11:57:00","networkFunction":"CP","versionNo":"1.5"},
{"assetId":13,"id":"X-edge-3216-3","type":"X-edge","ipAddress":"192.168.1.37","activatedDate":"2021-04-12 11:45:00","networkFunction":"DU","versionNo":"1.4"}]
function getDataFromJson(path) {
	let rawdata = fs.readFileSync(path);
	let punishments= JSON.parse(rawdata);
	console.log(punishments);
}

app.get('/getassetlist/', async (req,res,next)=>{
	// let data=this.getDataFromJson('assetList.json');
	let rawdata = fs.readFileSync('assetList.json');
	let punishments= JSON.parse(rawdata);
	res.send(punishments ? punishments :[]) 
	})	
	
app.post('/saveasset/',async (req,res,next)=>{
	
	let data ={"id": req.body.id,
	           "type":req.body.type,
			   "ipAddress":req.body.ipAddress,
	"activatedDate":req.body.activatedDate}
	
	console.log(data);
	assetlst.push(data)
	console.log(assetlst)
	
	res.send("success") 
	})		
	
	


app.listen(port, ()=>console.log(`listening to ${port}`))







//   const fs = require('fs');

// let rawdata = fs.readFileSync('punishmenthistory.json');
// let punishments= JSON.parse(rawdata);
// console.log(punishments);

// let data = JSON.stringify(punishments);
// fs.writeFileSync('punishmenthistory.json', data);