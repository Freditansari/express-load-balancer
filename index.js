const express = require('express');
const request = require('request');

//todo add form to add and remove server
const servers = ['http://localhost:9090', 'http://localhost:9091', 'http://localhost:9092', 'http://localhost:9093' ];

let accessLogs = [];

let cur = 0;

const handler = (req, res) => {
  // Pipe the vanilla node HTTP request (a readable stream) into `request`
  // to the next server URL. Then, since `res` implements the writable stream
  // interface, you can just `pipe()` into `res`.

  const _request = request({ url: servers[cur] + req.url })
  .on('response', res =>{
    //todo tried to open an access to the stat but i think there's a problem with the express. 
    // instead i will reroute everything to a stat server project

    let timeStamp = new Date();


    // console.log(timeStamp.getHours())

    let accessLog = {
      link: res.request.href,
      timeStamp : timeStamp,
      hour: timeStamp.getHours()
    }
    accessLogs.push(accessLog);
    // console.log(accessLogs)

  })
  .on('error', error=>{
    
    res.status(500).send(error.message);
  })

  req.pipe(_request).pipe(res)
  cur = (cur + 1) % servers.length;
};
const server = express().get('*', handler).post('*', handler);





server.listen(8080);